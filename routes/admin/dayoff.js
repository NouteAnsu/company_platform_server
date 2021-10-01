const router = require('express').Router()

var adminDayoff = require('../../controllers/admin/dayoff')

router.post('/submitDayoff', adminDayoff.submitDayoff)
router.post('/updateDayoff' , adminDayoff.updateDayoff)
router.post('/deleteDayoff', adminDayoff.deleteDayoff)
router.post('/useDayoffList',adminDayoff.useDayoffList)
router.post('/userDayoffInfo',adminDayoff.userDayoffInfo)

module.exports = router