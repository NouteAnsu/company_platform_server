const express = require('express')
const app = express()
const Router = require('./routes/index')
const sequelize = require('./models').sequelize
const session = require('express-session')
const dotenv = require('dotenv')
dotenv.config()


app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//DB + sequelize
const driver = async () => {
    try {
        await sequelize.sync({ force: false })
    } catch (err) {
        console.error('초기화 실패')
        console.error(err)
        return
    }
    console.log('초기화 완료')
}
driver()

//session설정
app.use(session({
    //비밀키 설정
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    //같은 세션 정보 다시 저장할 건지 여부
    resave: true,
    //초기화되지 않은 세션정보 저장
    saveUninitialized: false
}))


app.use('/v1',Router)


app.listen(3000, () => {
    console.log('3000PORT CONNECTED...')
})