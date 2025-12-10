const express = require('express');
const router = express.Router();
const {guardar,password,logout,accesoMenu,verificaPass,impresion,privilegio, sesion} = require('../controllers/accesoControllers');
const {verificarToken} = require('../middlewares/jwt');
const {caracter, isLogin} = require('../middlewares/auth');

router.get('/api/acceso/menu/:tabla/:id/:nivel/:sesId',isLogin, caracter, verificarToken, accesoMenu);
router.get('/api/acceso/submenu/:tabla/:id/:nivel/:sesId',isLogin, caracter, verificarToken, accesoMenu);
router.get('/api/acceso/opcion/:tabla/:id/:nivel/:sesId',isLogin, caracter, verificarToken, accesoMenu);
router.get('/api/acceso/privilegio/:idSubMenu/:sesId',isLogin, caracter, verificarToken, privilegio);
router.post('/api/acceso/sesion',isLogin, caracter, verificarToken, sesion);
router.put('/api/acceso/guarda/:id',isLogin, verificarToken, guardar);
router.put('/api/acceso/password/:sesId',isLogin, verificarToken, password);
router.put('/api/acceso/verificaPass/:sesId',isLogin, verificarToken, verificaPass);
router.put('/api/acceso/logout/:sesId',isLogin, caracter, verificarToken, logout);
router.put('/api/acceso/terminaToken/:sesId',isLogin, caracter, logout);
router.put('/api/acceso/impresion/:id',isLogin, verificarToken, impresion);
module.exports = router;