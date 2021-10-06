const router = require('express').Router()

var user = require('../../controllers/admin/user')

router.post('/userList', user.userList)
router.post('/userInfo',user.userInfo)

module.exports = router