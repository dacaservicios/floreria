const axios = require('axios');
const config = require('../config/config');
const moment = require("moment");
const numeroLetras = require('../middlewares/numeroLetras');
const fs = require('fs');
const path = require('path');
const {login,menuInicio,datosUsuario,/*registro, contrasena,*/ recuperaPassword, dataDashboard,dataDashboardProd} = require('../models/inicioModels');

/*const login=(req, res, next)=>{
    passport.authenticate('local.login',{
        successRedirect : "/sistema",
        failureRedirect : "/"
    })(req, res, next);
}
*/

const logeo=(req, res)=>{
    const ip =  req.ip;  
    const server =  req.hostname;

    login(ip,server,req.body)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}

const datos=(req, res)=>{
    const sesId=req.params.sesId

    datosUsuario(sesId)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}


const menu=(req, res)=>{

    const sesId=req.params.sesId;
    const tabla= req.params.tabla;
    const tabla2= req.params.tabla2;

    menuInicio(sesId,tabla,tabla2)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}

/*const register=(req, res)=>{
    registro(req.body)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}*/

/*const olvidaPassword=(req, res)=>{
    contrasena(req.body)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}*/

const recupera=(req, res)=>{

    const ip =  req.ip;
    const server =  req.hostname;
    const id =  req.params.id;
    recuperaPassword(id,req.body,ip,server)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}

const dashboard=(req, res)=>{
    const sesId=req.params.sesId
    const tipo=req.params.tipo

    dataDashboard(sesId,tipo)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}

const dashboardProd=(req, res)=>{
    const sesId=req.params.sesId
    const tipo=req.params.tipo

    dataDashboardProd(sesId,tipo)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}

module.exports = {
    logeo,
    menu,
    datos,
    //register,
    //olvidaPassword,
    recupera,
    dashboard,
    dashboardProd
}