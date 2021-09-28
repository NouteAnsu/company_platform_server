const router = require('express').Router()


//로직(컨트롤러)
var user = require('../../controllers/user/auth')

router.post('/signIn', user.signIn)
router.post('/signUp', user.signUp)
router.post('/userInfo', user.userInfo)
router.get('/userList',user.userList)

module.exports = router