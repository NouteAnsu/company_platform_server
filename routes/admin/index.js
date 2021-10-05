const router = require('express').Router()

var user = require('./user')
var dayoff = require('./dayoff')

router.use('/user',user)
router.use('/dayoff',dayoff)


module.exports = router