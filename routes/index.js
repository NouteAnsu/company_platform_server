const router = require('express').Router()

const user = require('./user/index')
const admin = require('./admin/index')


router.use('/admin',admin)
router.use('/user', user)




module.exports = router