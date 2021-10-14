const router = require('express').Router()

var adminDayoff = require('../../controllers/admin/dayoff')

// router.post('/submitDayoff', adminDayoff.submitDayoff)
router.post('/update' , adminDayoff.updateDayoff)
router.post('/delete', adminDayoff.deleteDayoff)
router.post('/info',adminDayoff.userDayoffInfo)

router.post('/use/list',adminDayoff.useDayoffList)
router.post('/use/update', adminDayoff.updateUseDayoff)

module.exports = router