const express = require('express');
const router = express.Router();
const {verificarToken} = require('../middlewares/jwt');
const {schemaLogin/*, schemaRegister, schemaOlvidaPassword*/, schemaRecupera} = require('../middlewares/schema');
const {notLogin, verificaLogeo,verificarLogin,caracter, validaSchema} = require('../middlewares/auth');
const {logeo, menu, datos, /*register, olvidaPassword*/recupera,dashboard,dashboardProd } = require('../controllers/inicioControllers');

router.post('/api/inicio/verifica/login', notLogin, caracter,validaSchema(schemaLogin), verificarLogin, (req, res) => {
    
});

router.post('/api/inicio/logeo', caracter,validaSchema(schemaLogin),verificaLogeo,verificarToken, logeo);
//router.post('/api/inicio/register', caracter,validaSchema(schemaRegister),verificarToken, register);
//router.post('/api/inicio/password', caracter,validaSchema(schemaOlvidaPassword),verificarToken, olvidaPassword);
router.get('/api/inicio/menu/:sesId/:tabla/:tabla2', verificarToken, menu);
router.get('/api/inicio/datos/:sesId',verificarToken, datos);
router.put('/api/inicio/recupera/:id', caracter, validaSchema(schemaRecupera),recupera);

router.get('/api/inicio/dashboard/:sesId/:tipo', caracter, dashboard);
router.get('/api/inicio/dashboardProd/:sesId/:tipo', caracter, dashboardProd);

module.exports = router;