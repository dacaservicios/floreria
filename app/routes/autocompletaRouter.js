const express = require('express');
const router = express.Router();
const {isLogin} = require('../middlewares/auth');
const axios = require('axios');
const config = require('../config/config');

router.post('/autocompleta/producto', isLogin  , async(req, res) => {
    const sesId=req.session.passport.user.id;
    try {
        let autocompleta = await axios.get(config.URL_SISTEMA+"/api/productosucursal/autocompleta/"+req.body.producto+"/"+req.body.idProveedor+"/"+req.body.tipo+"/"+req.body.sesId,{ 
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });

        res.json({
            valor : autocompleta.data.valor
        });
    }catch (err) {
        res.status(400).json({
            error : {
                message:err.response.data.error.message,
                errno: err.response.data.error.errno,
                code :err.response.data.error.code
            }
        });
    }
    
});

router.post('/autocompleta/servicio', isLogin  , async(req, res) => {
    const sesId=req.session.passport.user.id;
    try {
        let autocompleta = await axios.get(config.URL_SISTEMA+"/api/serviciosucursal/autocompleta/"+req.body.servicio+"/"+req.body.tipo+"/"+req.body.sesId,{ 
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });

        res.json({
            valor : autocompleta.data.valor
        });
    }catch (err) {
        res.status(400).json({
            error : {
                message:err.response.data.error.message,
                errno: err.response.data.error.errno,
                code :err.response.data.error.code
            }
        });
    }
    
});

router.post('/consulta/documento', isLogin, async(req, res) => {
    let tipo=req.body.tipo;
    let documento=req.body.documento;
    try {
        const datos = await axios.get(config.URL_DOCUMENTO+"/"+tipo+"/"+documento,{ 
            headers:{authorization: `Bearer ${config.TOKEN_DOCUMENTO}`} 
        });
        res.json({
            valor : datos.data
        }); 
    }catch (err) {
        res.status(400).json({
            error : {
                message:err.response.data.error.message,
                errno: err.response.data.error.errno,
                code :err.response.data.error.code
            }
        });
    }
    
});

module.exports = router;