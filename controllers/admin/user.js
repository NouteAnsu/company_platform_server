var { User } = require('../../models')

exports.userList = async(req, res) => {
    try {
        var accountId = req.body.accountId
        var items = []
        var auth = await User.findOne({
            where:{id:accountId}
        })
        // if(auth.auth === 1){
        //     var userList = await User.findAll()

        // }
    } catch (error) {

    }
}