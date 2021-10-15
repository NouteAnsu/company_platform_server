const { User } = require('../../models')

exports.userList = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var items = []
        var auth = await User.findOne({
            where: { id: accountId }
        })
        var username = ''
        var name = ''
        var nickname = ''
        var phone = ''
        var dept = ''
        if (auth.auth === 1) {
            var userList = await User.findAll()
            for (var i = 0; i < userList.length; i++) {
                username = userList[i].username
                name = userList[i].name
                nickname = userList[i].nickname
                phone = userList[i].phone
                dept = userList[i].dept
                items[i] = { username, name, nickname, phone, dept }
            }
            console.log('관리자 사용자 목록 리스트 성공')
            res.status(200).json({ "resultCode": 1, "data": { 'items': items } })
        } else {
            console.log('관리자 권한 없음')
            res.status(400).json({ "resultCode": -40, "data": null })
        }
    } catch (error) {
        console.log('관리자 사용자 목록 리스트 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}

exports.userInfo = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var user_id = req.body.user_id
        var auth = await User.findOne({
            where: { id: accountId }
        })
        if (auth.auth === 1) {
            var user = await User.findOne({
                where: { id: user_id }
            })
            var username = user.username
            var name = user.name
            var nickname = user.nickname
            var phone = user.phone
            var dept = user.dept
            var profile_img = user.profile_img
            var join_date = user.join_date
            var join_date_i = ''
            var current_date = ''
            //입사 일수 계산
            //입사 일수 계산
            join_date_i = new Date(join_date).getTime()
            current_date = new Date().getTime()
            join_cnt = Math.ceil((current_date - join_date_i) / (1000 * 3600 * 24))
            await User.update({
                join_cnt
            }, { where: { id: user_id } })

            console.log('관리자 사용자 상세정보 조회')
            res.status(200).json({ "resultCode": 1, "data": { username, name, nickname, phone, dept, profile_img, join_date } })
        } else {
            console.log('관리자 권한 없음')
            res.status(400).json({ "resultCode": -40, "data": null })
        }
    } catch (error) {
        console.log('관리자 사용자 정보 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}

exports.userUpdate = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var user_id = req.body.user_id
        var auth = await User.findOne({
            where: { id: accountId }
        })
        var name = req.body.name
        var nickname = req.body.nickname
        var phone = req.body.phone
        var dept = req.body.dept
        var state = req.body.state
        var join_date = req.body.join_date
        var join_cnt = 0
        if (auth.auth === 1) {
            var user = await User.findOne({
                where: { id: user_id }
            })
            if (name == null) {
                name = user.name
            }
            if (nickname == null) {
                nickname = user.nickname
            }
            if (phone == null) {
                phone = user.phone
            }
            if (dept == null) {
                dept = user.dept
            }
            if (state == null) {
                state = user.state
            }
            if (join_date == null) {
                join_date = user.join_date
            } else {
                join_date = new Date(req.body.join_date)
                join_cnt = Math.ceil((new Date().getTime() - join_date.getTime()) / (1000 * 3600 * 24))
            }
            await User.update({
                name,
                nickname,
                phone,
                dept,
                state,
                join_date,
                join_cnt
            }, { where: { id: user_id } })
            console.log('관리자 사용자 정보 수정')
            res.status(200).json({ "resultCode": 1, "data": null })
        } else {
            console.log('관리자 권한 없음')
            res.status(400).json({ "resultCode": -40, "data": null })
        }
    } catch (error) {
        console.log('관리자 사용자 정보 수정 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}

exports.userDelete = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var user_id = req.body.user_id
        var auth = await User.findOne({
            where: { id: accountId }
        })
        if(auth.auth===1) {
            
        }else {
            console.log('관리자 권한 없음')
            res.status(400).json({ "resultCode": -40, "data": null })
        }
    } catch (error) {

    }
}