const jwt = require('jsonwebtoken')
const secret = require('../config/jwt').KEY.secret

exports.tokenCheck = (req, res) => {
    try {
        var accessToken = req.headers.authorization || req.body.authorization;
        jwt.verify(accessToken, secret, (err, _) => {
            if (err) {
                console.log("토큰 만료" + err);
                res.status(403).json({ resultCode: -30, data: null });
            } else {
                console.log("토큰 체크 성공");
                res.status(200).json({ resultCode: 1, data: null });
            }
        });
    } catch (error) {
        console.log("토큰체크 실패" + error);
        res.status(400).json({ resultCode: -1, data: null });
    }
}

//accessToken이 만료시 refreshToken으로 검증 갱신
exports.renewToken = (req,res) => {
    try {
        var accessToken = ''
        var refreshToken = req.body.refreshToken
        var accountId = req.body.accountId
        var id_inToken = 0
        jwt.verify(refreshToken, secret, (err,user)=>{
            if(err) {
                console.log('리프레쉬토큰 만료')
                res.status(403).json({"resultCode":-30, "data":null})
            }else{
                id_inToken=user.accountId
                if(accountId===id_inToken){
                    console.log('리프레쉬토큰 인증성공')
                    accessToken=jwt.sign({accountId},secret,{expiresIn:'24h'})
                    refreshToken=jwt.sign({accountId},secret,{expiresIn:'30d'})
                    res.status(200).json({"resultCode":1, "data":{accountId,accessToken,refreshToken}})
                }else{
                    console.log('인증정보 불일치')
                    res.status(400).json({"resultCode":-20, "data":null})
                }
            }
        })
    } catch (error) {
        console.log('토큰갱신 실패:'+err)
        res.status(400).json({"resultCode":-1, "data":null})
    }
}