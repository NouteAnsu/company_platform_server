var { User, Dayoff, UseDayoff } = require('../../models')


exports.dayoffInfo = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var dayoff = await Dayoff.findOne({
            where: { id: accountId }
        })
        var total_cnt = dayoff.total_cnt
        var rest_cnt = dayoff.rest_cnt
        var use_cnt = dayoff.use_cnt
        var expire_day = dayoff.expire_day
        //만약 연차 만료 유닉스타임이 현재 시간보다 작아지면 갱신로직을 돌린다.
        if ((expire_day.getTime()) - (new Date().getTime() + (9 * 60 * 60 * 1000)) < 0) {
            expire_day = new Date(expire_day.getTime() + (8784 * 60 * 60 * 1000) - (1000))//현재 만료 년도에서 365일 유닉스 타임을 더함
            await models.sequelize.transaction(async (t) => {
                await Dayoff.update({
                    total_cnt: 15,
                    rest_cnt: 0,
                    use_cnt: 0,
                    expire_day,
                }, { where: { user_id } }, { transaction: t })
                var updateInfo = await Dayoff.findOne({
                    where: { user_id }
                }, { transaction: t })
                total_cnt = updateInfo.total_cnt
                rest_cnt = updateInfo.rest_cnt
                use_cnt = updateInfo.use_cnt
            })
            console.log('연차 만료! 새로운 연차 갱신')
        }
    } catch (error) {

    }
}