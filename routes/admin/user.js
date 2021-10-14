const router = require('express').Router()

var user = require('../../controllers/admin/user')

router.post('/user/list', user.userList)
router.post('/user/info',user.userInfo)
router.post('/user/update')

module.exports = router