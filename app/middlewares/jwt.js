const jwt = require('jsonwebtoken');
const config = require('../config/config');
const moment = require("moment");

/*const verificarToken = (req, res, next)=>{
    next();
}*/
const verificarToken = (req, res, next)=>{
    if(!req.headers.authorization){
        res.status(403).json({
            error : {
                message:'No tiene autorización para consumir los recursos',
                errno: 'SA',
                code : 0
            }
        });
        return;
    }else{
        const token = req.headers.authorization.split(" ")[1];
        try{
            jwt.verify(token,config.SEED,(error, data)=>{
                if(error){
                    res.status(403).json({
                        error : {
                            message:'Existe un problema con su autenticación',
                            errno: 'TC',
                            code : 0
                        }
                    });
                    return;
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