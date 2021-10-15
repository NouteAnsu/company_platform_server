const { User, Dayoff, UseDayoff } = require('../../models')
const models = require('../../models/index');

exports.dayoffInfo = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var dayoff = await Dayoff.findOne({
            where: { id: accountId }
        })
        var total_cnt = dayoff.total_cnt
        var rest_cnt = dayoff.rest_cnt
        var use_cnt = dayoff.use_cnt
        var expire_day = dayoff.expire_day
        //만약 연차 만료 유닉스타임이 현재 시간보다 작아지면 갱신로직을 돌린다.
        if ((expire_day.getTime()) - (new Date().getTime() + (9 * 60 * 60 * 1000)) < 0) {
            expire_day = new Date(expire_day.getTime() + (8784 * 60 * 60 * 1000) - (1000))//현재 만료 년도에서 365일 유닉스 타임을 더함
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
            res.status(200).json({ "resultCode": 1, "data": { total_cnt, rest_cnt, use_cnt, expire_day } })
        }
    } catch (error) {
        console.log('연차 정보 조회 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}

exports.useDayoffList = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var state = req.body.state
        var items = []
        var useDayoffs = await UseDayoff.findAll({
            where: { id: accountId, state }
        })
        var off_type = ''
        var off_start = ''
        var off_end = ''
        var off_cnt = 0
        for (var i = 0; i < useDayoffs.length; i++) {
            if (useDayoffs[i].off_type == 1) off_type = '승인'
            else if (useDayoffs[i].off_type == 0) off_type = '승인 전'
            else off_type = '반려'
            off_start = useDayoffs[i].off_start
            off_end = useDayoffs[i].off_end
            off_cnt = useDayoffs[i].off_cnt
            items[i] = { off_type, off_start, off_end, off_cnt }
        }
        console.log('사용 연차 리스트 출력 성공')
        res.status(200).json({ "resultCode": 1, "data": { "items": items } })
    } catch (error) {
        console.log('사용 연차 리스트 출력 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}

exports.useDayoffInfo = async (req, res) => {
    try {
        var id = req.body.useDayoffId
        var useDayoff = await UseDayoff.findOne({
            where : {id}
        })
        var off_type = useDayoff.off_type
        var off_start = useDayoff.off_start
        var off_end = useDayoff.off_end
        var off_cnt = useDayoff.off_cnt
        var off_comment= useDayoff.off_comment
        var state = useDayoff.state
        if(state==1)state='승인'
        else if(state==-99) state='취소'
    } catch (error) {

    }
}

exports.useDayoffInsert = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var off_cnt = req.body.off_cnt
        var off_type = req.body.off_type
        var off_start = req.body.off_start
        var off_end = req.body.off_end
        var off_comment = req.body.off_comment
        var dayoffInfo = await Dayoff.findOne({
            where: { user_id: accountId }
        })
        if (dayoffInfo.rest_cnt < off_cnt) {
            console.log('잔여 연차 부족')
            res.status(400).json({ "resultCode": -1, "data": null })
        } else {
            var rest_cnt = dayoffInfo.rest_cnt - off_cnt
            var use_cnt = dayoffInfo.use_cnt + off_cnt
            await models.sequelize.transaction(async (t) => {
                await Dayoff.update({
                    rest_cnt,
                    use_cnt
                }, { where: { user_id: accountId } }, { transaction: t })
                await UseDayoff.create({
                    off_type,
                    off_start,
                    off_end,
                    off_cnt,
                    off_comment,
                    user_id: accountId
                }, { transaction: t })
            })
            console.log('연차 사용 성공')
            res.status(200).json({ "resultCode": 1, "data": null })
        }
    } catch (error) {
        console.log('연차 사용 실패' + error)
        res.status(400).json({ "resultCode": 1, "data": null })
    }
}


exports.useDayoffUpdate = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var off_cnt = req.body.off_cnt
        var off_type = req.body.off_type
        var off_start = req.body.off_start
        var off_end = req.body.off_end
        var off_comment = req.body.off_comment
        var dayoffInfo = await Dayoff.findOne({
            where: { user_id: accountId }
        })
        if (dayoffInfo.rest_cnt < off_cnt) {
            console.log('잔여 연차 부족')
            res.status(400).json({ "resultCode": -1, "data": null })
        } else {
            if (dayoffInfo.state == 1 || dayoffInfo.state == -99) {
                console.log('이미 승인되거나 취소된 연차, 관리자 문의')
                res.status(400).json({ "resultCode": -1, "data": null })
            } else {
                var rest_cnt = dayoffInfo.rest_cnt - off_cnt
                var use_cnt = dayoffInfo.use_cnt + off_cnt
                await models.sequelize.transaction(async (t) => {
                    await Dayoff.update({
                        rest_cnt,
                        use_cnt
                    }, { where: { user_id: accountId } }, { transaction: t })
                    await UseDayoff.create({
                        off_type,
                        off_start,
                        off_end,
                        off_cnt,
                        off_comment,
                        user_id: accountId
                    }, { transaction: t })
                })
                console.log('연차 수정 성공')
                res.status(200).json({ "resultCode": 1, "data": null })
            }
        }
    } catch (error) {
        console.log('연차 수정 실패' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}

exports.useDayoffCancel = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var id = req.body.useDayoffId
        var state = -99
        var useDayoff = await UseDayoff.findOne({
            where: { id }
        })
        if (useDayoff.state == 1 || useDayoff.state == -99) {
            console.log('연차 취소 불가, 관리자에게 문의')
            res.status(400).json({ "resultCode": -1, "data": null })
        } else {
            var off_cnt = useDayoff.off_cnt
            var dayoff = await Dayoff.findOne({
                where: { id: accountId }
            })
            await models.sequelize.transaction(async (t) => {
                await UseDayoff.update({
                    state
                }, { where: { id } }, { transaction: t })
                var rest_cnt = (dayoff.rest_cnt) + off_cnt
                var use_cnt = (dayoff.use_cnt) - off_cnt
                await Dayoff.update({
                    rest_cnt,
                    use_cnt
                }, { where: { id: accountId } }, { transaction: t })
            })
            console.log('연차 사용 취소 완료')
            res.status(200).json({ "resultCode": 1, "data": null })
        }
    } catch (error) {
        console.log('연차 사용 취소 실패' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}