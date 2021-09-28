const router = require('express').Router()

const auth = require('./user/auth')
const admin = require('./admin/dayoff')



//유저
router.use('/user/auth', auth)

//관리자
router.use('/admin/dayoff',admin)

module.exports = router