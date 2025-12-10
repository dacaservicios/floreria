const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar,verificar} = require('../controllers/pagosControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaPagos} = require('../middlewares/schema');
const {caracter, validaSchema,verificaAdjunto} = require('../middlewares/auth');


router.get('/api/pagos/listar/:id/:sesId', verificarToken, listar);
router.get('/api/pagos/buscar/:id/:sesId', verificarToken, buscar);
router.get('/api/pagos/verificar/:id/:sesId', verificarToken, verificar);
router.get('/api/pagos/verificarWatsapp/:id/:sesId', verificar);
router.get('/api/pagos/verificarCron/:id/:sesId', verificar);
router.post('/api/pagos/crear', caracter, validaSchema(schemaPagos), verificaAdjunto,verificarToken, crear);
router.put('/api/pagos/editar/:id', caracter, validaSchema(schemaPagos), verificarToken, editar);
router.put('/api/pagos/estado/:id', verificarToken, estado);
router.delete('/api/pagos/eliminar/:id', verificarToken, eliminar);

module.exports = router;