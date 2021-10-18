const router = require('express').Router()

var dayoff = require('../../controllers/user/dayoff')

router.post('/info', dayoff.dayoffInfo)
router.post('/use/list', dayoff.useDayoffList)
router.post('/use/info', dayoff.useDayoffInfo)
router.post('/use/insert', dayoff.useDayoffInsert)
router.post('/use/update', dayoff.useDayoffUpdate)
router.post('/use/cancel', dayoff.useDayoffCancel)

module.exports = router