const router = require('express').Router()


//로직(컨트롤러)
var user = require('../../controllers/user/auth')

router.post('/signIn', user.signIn)
router.post('/signUp', user.signUp)
router.post('/info', user.userInfo)
router.get('/list',user.userList)
router.post('/update',user.userUpdate)

module.exports = router