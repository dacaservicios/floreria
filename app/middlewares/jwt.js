const jwt = require('jsonwebtoken');
const config = require('../config/config');
const moment = require("moment");

/*const verificarToken = (req, res, next)=>{
    next();
}*/
const verificarToken = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(401).json({
            error : {
                message:'No tiene autorización para consumir los recursos',
                errno: 'SA',
                code : 0
            }
        });
    }else{
        const token = req.headers.authorization.split(" ")[1];
        try{
            jwt.verify(token,config.SEED,(error, data)=>{
                if(error){
                    return res.status(401).json({
                        error : {
                            message:'Existe un problema con su autenticación',
                            errno: 'TC',
                            code : 0
                        }
                    });
                }else{
                    req.usuario = data;
                    next();
                }
            }); 
        }catch (err) {
            console.log(err)
        }
    }
}


module.exports = {
    verificarToken
}