var { User, Dayoff, UseDayoff } = require('../../models')
const models = require('../../models/index');


exports.useDayoffList = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var items = []
        var auth = await User.findOne({
            where: { id: accountId }
        })
        var name = ''
        var off_type = ''
        var off_start = ''
        var off_end = ''
        var off_cnt = 0
        var state = 0
        if (auth.auth === 1) {
            var useDayoff = await UseDayoff.findAll()
            for (var i = 0; i < useDayoff.length; i++) {
                var user = await User.findOne({
                    where: { id: useDayoff[i].user_id }
                })
                name = user.name
                off_type = useDayoff[i].off_type
                off_start = useDayoff[i].off_start
                off_end = useDayoff[i].off_end
                off_cnt = useDayoff[i].off_cnt
                state = useDayoff[i].state
                if (state == 0) state = '승인 전'
                else if (state == -1) state = '반려'
                else state = '승인'
                items[i] = { name, off_start, off_end, off_type, off_cnt, state }
            }
            console.log('사용 연차 리스트 성공');
            res.status(200).json({ "resultCode": 1, "data": { "items": items } })
        } else {
            console.log('관리자 권한 없음')
            res.status(400).json({ "resultCode": -40, "data": null })
        }
    } catch (error) {
        console.log('사용 연차 목록 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}

exports.userDayoffInfo = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var user_id = req.body.user_id
        var auth = await User.findOne({
            where: { id: accountId }
        })
        var total_cnt = 0
        var rest_cnt = 0
        var use_cnt = 0
        var expire_day = ''
        if (auth.auth === 1) {
            var dayoff = await Dayoff.findOne({
                where: { user_id }
            })
            total_cnt = dayoff.total_cnt
            rest_cnt = dayoff.rest_cnt
            use_cnt = dayoff.use_cnt
            expire_day = dayoff.expire_day
            //만약 연차 만료 유닉스타임이 현재 시간보다 작아지면 갱신로직을 돌린다.
            if ((expire_day.getTime()) - (new Date().getTime() + (9 * 60 * 60 * 1000)) < 0) {
                expire_day = new Date(expire_day.getTime() + (8760 * 60 * 60 * 1000))//현재 만료 년도에서 365일 유닉스 타임을 더함
                await models.sequelize.transaction(async (t) => {
                    await Dayoff.update({
                        total_cnt: 15,
                        rest_cnt: 0,
                        use_cnt: 0,
                        expire_day,
                    }, { where: { user_id } }, { transaction: t })
                    var updateInfo = await Dayoff.findOne({
                        where: { user_id }
                    }, { transaction: t })
                    total_cnt = updateInfo.total_cnt
                    rest_cnt = updateInfo.rest_cnt
                    use_cnt = updateInfo.use_cnt
                })
                console.log('연차 만료! 새로운 연차 갱신')
            }
            console.log('관리자 직원 연차 정보')
            res.status(200).json({ "resultCode": 1, "data": { total_cnt, rest_cnt, use_cnt } })
        } else {
            console.log('관리자 권한 없음')
            res.status(400).json({ "resultCode": -40, "data": null })
        }
    } catch (error) {
        console.log('관리자 직원 연차 정보 조회 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}



exports.submitDayoff = async (req, res) => {
    try {
        var accountId = req.body.accountId//기능을 사용하려는 사용자
        var user_id = req.body.user_id //부여하려는 직원
        var total_cnt = req.body.total_cnt
        var rest_cnt = req.body.rest_cnt
        var use_cnt = req.body.use_cnt
        var expire_day = req.body.expire_day
        var auth = await User.findOne({
            where: { id: accountId }
        })
        if (auth.auth === 1) {
            await Dayoff.create({
                user_id,
                total_cnt,
                rest_cnt,
                use_cnt,
                expire_day
            })
            console.log('직원 휴가 부여')
            res.status(200).json({ "resultCode": 1, "data": null })
        } else {
            console.log('관리자 권한 없음')
            res.status(400).json({ "resultCode": -40, "data": null })
        }
    } catch (error) {
        console.log('휴가 등록 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}


exports.updateDayoff = async (req, res) => {
    try {
        var accountId = req.body.accountId//기능을 사용하려는 사용자
        var user_id = req.body.user_id //부여하려는 직원
        var total_cnt = req.body.total_cnt
        var rest_cnt = req.body.rest_cnt
        var use_cnt = req.body.use_cnt
        var expire_day = req.body.expire_day
        var auth = await User.findOne({
            where: { id: accountId },
            attribues: ['auth']
        })
        if (auth === 1) {
            await Dayoff.update({
                total_cnt,
                rest_cnt,
                use_cnt,
                expire_day,
            }, { where: { user_id } })
            console.log('직원 휴가 수정')
            res.status(200).json({ "resultCode": 1, "data": null })
        } else {
            console.log('관리자 권한 없음')
            res.status(400).json({ "resultCode": -40, "data": null })
        }
    } catch (error) {
        console.log('휴가 수정 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}


exports.deleteDayoff = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var user_id = req.body.user_id
        var auth = await User.findOne({
            where: { id: accountId }
        })
        if (auth.auth === 1) {
            await destroy({
                where: { user_id }
            })
            console.log('직원 휴가 삭제')
            res.status(200).json({ "resultCode": 1, "data": null })
        } else {
            console.log('관리자 권한 없음')
            res.status(400).json({ "resultCode": -40, "data": null })
        }
    } catch (error) {
        console.log('휴가 삭제 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}


exports.updateUseDayoff = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var user_id = req.body.user_id
        var auth = await User.findOne({
            where: { id: accountId },
        })
        if (auth.auth === 1) {
            await UseDayoff.update({
                state: req.body.state
            }, { where: { user_id } })
            console.log('연차 사용 수정')
            res.status(200).json({ "resultCode": 1, "data": null })
        } else {
            console.log('관리자 권한 없음')
            res.status(400).json({ "resultCode": -40, "data": null })
        }
    } catch (error) {
        console.log('연차 사용 수정 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}