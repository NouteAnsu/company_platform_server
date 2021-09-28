const dotenv = require('dotenv')
dotenv.config();

exports.KEY = {
    'secret':process.env.JWT_SECRET
}