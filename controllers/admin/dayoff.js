var { User, Dayoff, UseDayoff } = require('../../models')
const models = require('../../models/index');


exports.userDayoffList = async (req, res) => {
    try {
        var items = []
        var accountId = req.body.accountId
        var auth = await User.findOne({
            where: { id: accountId }
        })
        if (auth.auth === 1) {
            items = await findAll()
            console.log('모든 직원 휴가 리스트 성공');
            res.status(200).json({"resultCode":1, "data":{"items":items}})
        } else {
            console.log('관리자 권한 없음')
            res.status(400).json({ "resultCode": -40, "data": null })
        }
    } catch (error) {
        console.log('직원 휴가 리스트 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}

exports.userDayoffInfo = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}

exports.submitDayoff = async (req, res) => {
    try {
        var accountId = req.body.accountId//기능을 사용하려는 사용자
        var user_id = req.body.user_id //부여하려는 직원
        var total_cnt = req.body.total_cnt
        var rest_cnt = req.body.rest_cnt
        var use_cnt = req.body.use_cnt
        var expire_day = req.body.expire_day//유닉스 타임으로
        var auth = await User.findOne({
            where: { id: accountId }
        })
        if (auth.auth === 1) {
            await Dayoff.create({
                user_id,
                total_cnt,
                rest_cnt,
                use_cnt,
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
        var auth = await User.findOne({
            where: { id: accountId },
            attribues: ['auth']
        })
        if (auth === 1) {
            await Dayoff.update({
                total_cnt,
                rest_cnt,
                use_cnt,
                where: { user_id }
            })
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
            where: { id: accountId },
            attribues: ['auth']
        })
        if (auth === 1) {
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