const { User, Logs, Dayoff } = require('../../models')
const models = require('../../models/index');
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const secret = require('../../config/jwt').KEY.secret;
const { useDayoffList } = require('../admin/dayoff');


exports.signIn = async (req, res) => {
    try {
        var isAutoLogin = req.body.isAutoLogin
        var accountId = 0
        var accessToken = ''
        var refreshToekn = ''
        var id_inToken = 0
        var username = ''
        var password = ''


        var login_result = 1
        if (isAutoLogin) {
            console.log('자동 로그인')
            accountId = req.body.accountId
            accessToken = req.body.accessToken
            refreshToekn = req.body.refreshToekn
            //토큰 검증
            jwt.verify(accessToken, secret, (err, user) => {
                if (err) {
                    console.log('액세스토큰 실패, 리프레쉬 검증')
                    jwt.verify(refreshToekn, secret, (err, user) => {
                        if (err) {
                            login_result = -1
                            console.log('리프레쉬토큰 실패')
                            res.status(403).json({ "resultCode": -30, "data": null })
                        } else {
                            console.log('리프레쉬 토큰 검증 성공')
                            id_inToken = user.accountId
                        }
                    })
                } else {
                    console.log('액세스 토큰 검증 성공')
                    id_inToken = user.accessToken
                }
            })
            //토큰검증이 성공후
            var user = await User.findOne({
                where: { id: accountId }
            })
            username = user.username

            if (accountId === id_inToken) {
                console.log('토큰값 일치')
                accessToken = jwt.sign({ accountId }, secret, { expiresIn: "24h" })
                refreshToekn = jwt.sign({ accountId }, secret, { expiresIn: "30d" })

                console.log('자동 로그인 성공')
                res.status(200).json({ "resultCode": 1, "data": { accountId, accessToken, refreshToekn } })
            } else {
                login_result = -1
                console.log('토큰값 불일치, 자동로그인 실패')
                res.status(400).json({ "resultCode": -20, "data": null })
            }
        } else {
            //아이디,패스워드 입력 로그인
            console.log('아이디,패스워드 입력 로그인')
            username = req.body.username
            password = crypto.createHash('sha512').update(req.body.password).digest('hex')
            var user = await User.findOne({
                where: { username }
            })
            if (user != null) {
                if (user.password === password) {
                    accountId = user.id
                    accessToken = jwt.sign({ accountId }, secret, { expiresIn: "24h" })
                    refreshToekn = jwt.sign({ accountId }, secret, { expiresIn: "30d" })
                    console.log('로그인 성공')
                    res.status(200).json({ "resultCode": 1, "data": { accountId, accessToken, refreshToekn } })
                } else {
                    login_result = -1
                    console.log('비밀번호 불일치 로그인 실패')
                    res.status(400).json({ "resultCode": -20, "data": null })
                }
            } else {
                login_result = -1
                console.log('유저 없음 로그인 실패')
                res.status(400).json({ "resultCode": -20, "data": null })
            }
        }

        await Logs.create({
            user_id: accountId,
            username,
            login_result
        })
        console.log('로그인 logs생성')
    } catch (error) {
        console.log('로그인 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}

//파일 업로드도 넣어야함 formData
exports.signUp = async (req, res) => {
    try {
        var username = req.body.username
        var password = crypto.createHash('sha512').update(req.body.password).digest('hex')
        var name = req.body.name
        var phone = req.body.phone
        var nickname = req.body.nickname
        var auth = req.body.auth
        var dept = req.body.dept
        var join_date = new Date(req.body.join_date)
        var join_cnt = 0
        var current_cnt = new Date().getTime()
        join_cnt = Math.ceil((current_cnt - join_date.getTime()) / (1000 * 3600 * 24))
        var user = await User.findOne({
            where: { username }
        })
        if (user != null) {
            console.log('이미 가입된 회원')
            res.status(400).json({ "resultCode": -10, "data": null })
        } else {
            await models.sequelize.transaction(async (t) => {
                var user = await User.create({
                    username,
                    password,
                    nickname,
                    name,
                    phone,
                    dept,
                    auth,
                    state: 1,
                    join_cnt,
                    join_date
                }, { transaction: t })
                var user_id = user.id
                var total_cnt = 0
                var rest_cnt = 0
                var use_cnt = 0
                var expire_day = new Date(join_date.getTime() + (8784 * 60 * 60 * 1000) - (1000))
                if (user.join_cnt > 365) {
                    expire_day = ''
                }
                await Dayoff.create({
                    user_id,
                    total_cnt,
                    rest_cnt,
                    use_cnt,
                    expire_day
                }, { transaction: t })
            })
            console.log('회원가입 성공')
            res.status(200).json({ "resultCode": 1, "data": null })
        }
    } catch (error) {
        console.log('회원 가입 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}

exports.userList = async (_, res) => {
    try {
        var items = []
        var name = ''
        var nickname = ''
        var phone = ''
        var email = ''
        var dept = ''
        var profile_img = ''
        var userList = await User.findAll()
        for (var i = 0; i < userList.length; i++) {
            name = userList[i].name
            nickname = userList[i].nickname
            phone = userList[i].phone
            email = userList[i].email
            profile_img = userList[i].profile_img
            dept = userList[i].dept
            items[i] = { name, nickname, phone, email, profile_img, dept }
        }
        console.log('직원 리스트 출력 성공')
        res.status(200).json({ "resultCode": 1, "data": { "items": items } })
    } catch (error) {
        console.log('직원 리스트 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}

exports.userInfo = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var user = await User.findOne({
            where: { id: accountId }
        })
        var username = ''
        var name = ''
        var nickname = ''
        var phone = ''
        var join_date = ''
        var join_cnt = 0
        var join_date_i = ''
        var current_date = ''
        var dept = ''
        if (user != null) {
            username = user.username
            name = user.name
            phone = user.phone
            nickname = user.nickname
            join_date = user.join_date

            //입사 일수 계산
            join_date_i = new Date(join_date).getTime()
            current_date = new Date().getTime()
            join_cnt = Math.ceil((current_date - join_date_i) / (1000 * 3600 * 24))
            dept = user.dept
            console.log('유저 정보 조회 성공')
            res.status(200).json({ "resultCode": 1, "data": { username, name, nickname, phone, email, join_date, dept, join_cnt } })
        } else {
            console.log('유저 정보 없음')
            res.status(400).json({ "resultCode": -20, "data": null })
        }
    } catch (error) {
        console.log('유저 정보 조회 실패' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}


//파일 업로드 부분 빼고
exports.userUpdate = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var name = req.body.name
        var nickname = req.body.nickname
        var phone = req.body.phone
        await User.update({
            name,
            nickname,
            phone,
            where: { id: accountId }
        })
        console.log('유저 정보 수정 성공')
        res.status(200).json({ "resultCode": 1, "data": null })
    } catch (error) {
        console.log('유저 정보 수정 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}