const router = require('express').Router()

var auth = require('./auth')
var dayoff = require('./dayoff')


router.use('/auth', auth)
router.use('/dayoff', dayoff)


module.exports = router