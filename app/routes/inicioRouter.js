const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');
const {isLogin, notLogin, verificarLogin, verificarCorreo, caracter,validaSchema} = require('../middlewares/auth');
const {schemaLogin, schemaRegister, schemaRecupera, schemaOlvidaPassword} = require('../middlewares/schema');
const axios = require('axios');
const config = require('../config/config');
const pool = require('../config/connections');
const {getUrl} = require('../libs/helpers');//getUrl(req)

/*=================VISTAS INICIO===================*/

router.get('/', notLogin, async(req, res) => {
    const host = req.headers.host; // Ejemplo: "rosas.app.aynisystem.com"
    const partes = host.split('.');
    // Si el host es "rosas.app.aynisystem.com", partes[0] es "rosas"
    const subdominio = partes[0];
    try {
        // Buscamos la florería en tu tabla de MySQL
        const empresa = await pool.query('SELECT * FROM MAE_EMPRESA WHERE SLUG = ?', [subdominio]);

        if (empresa.length > 0) {
            // Si existe la florería, pasamos sus datos a la vista
            res.render('index', { floreria: empresa[0] });
        } else {
            // Si el subdominio no existe en tu BD, podrías mandarlo a tu web de ventas
            res.redirect('https://aynisystem.com');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el sistema");
    }

});

router.post('/vista/inicio/login', notLogin, (req, res) => {
    res.render(path.join(__dirname,'../views/inicio/login'));
});

router.post('/vista/inicio/register', notLogin, (req, res) => {
    res.render(path.join(__dirname,'../views/inicio/register'));
});

router.post('/vista/inicio/olvidaPassword', notLogin, (req, res) => {
    res.render(path.join(__dirname,'../views/inicio/olvidaPassword'));
});


router.get('/sistema', isLogin,(req, res) => {
    res.render(path.join(__dirname,'../views/sistema'),{
        user:req.session.passport.user
    });
});


router.post('/inicio/verificaLogin', notLogin, caracter, validaSchema(schemaLogin), verificarLogin);

router.post('/inicio/verificaLoginOk', notLogin, caracter, validaSchema(schemaLogin), passport.authenticate('local.login'), function(req, res) {
        res.json({
            valor : {
                user: req.user,
                url: getUrl(req)
            }

        });
    }
);

router.post('/inicio/menuNivel', isLogin, async (req, res)=>{
    const sesId=req.session.passport.user.id
    try {
        const menuNivel= await axios.get(getUrl(req)+"/api/inicio/menu/"+sesId+"/"+req.body.tabla+"/"+req.body.tabla2,{ 
        headers: 
        { 
            authorization: `Bearer ${req.body.token}`
        } 
        });
        res.json({
            valor : menuNivel.data.valor
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

router.post('/inicio/register', notLogin, validaSchema(schemaRegister), async(req, res) => {
    try {
        const register = await axios.post(getUrl(req)+"/api/inicio/register",req.body);
        res.json({
            valor : register.data.valor
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


router.post('/inicio/password', notLogin, validaSchema(schemaOlvidaPassword), async (req, res) => {
    try {
        const password = await axios.post(getUrl(req)+"/api/inicio/password",req.body);
        res.json({
            valor : password.data.valor
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

router.post('/inicio/recupera', notLogin, validaSchema(schemaRecupera), verificarCorreo, async(req, res) => {
    try {
        const recupera = await axios.put(getUrl(req)+"/api/inicio/recupera/10",req.body);
        res.json({
            valor : recupera.data.valor
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


router.post('/vista/inicio/submenu', isLogin,  async (req, res) => {
    const sesId=req.session.passport.user.id;
    const idSubMenu=req.body.idSubMenu;
    const tabla=req.body.tabla;
    
    const lista = await axios.get(getUrl(req)+"/api/"+tabla+"/listar/0/"+sesId,{ 
        headers:{authorization: `Bearer ${req.body.token}`} 
    });
    
    res.render(path.join(__dirname,"../views/"+tabla+"/"+tabla),{
        tabla: tabla,
        idSubMenu: idSubMenu,
        lista: lista.data.valor.info,
    });
    
});
/*=============================================*/

module.exports = router;