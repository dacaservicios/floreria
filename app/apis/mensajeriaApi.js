const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar, correo, whatsapp,buscarSucursal} = require('../controllers/mensajeriaControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaMensajeria} = require('../middlewares/schema');
const {caracter, validaSchema, verificaAdjunto} = require('../middlewares/auth');


router.get('/api/mensajeria/listar/:id/:sesId', verificarToken, listar);
router.get('/api/mensajeria/buscar/:id/:sesId', verificarToken, buscar);
router.get('/api/mensajeria/buscarSucursal/:id/:sesId', buscarSucursal);
router.post('/api/mensajeria/crear', validaSchema(schemaMensajeria),verificaAdjunto, verificarToken, crear);
router.put('/api/mensajeria/editar/:id', validaSchema(schemaMensajeria),verificaAdjunto, verificarToken, editar);
router.put('/api/mensajeria/estado/:id', verificarToken, estado);
router.delete('/api/mensajeria/eliminar/:id', verificarToken, eliminar);
router.post('/api/mensajeria/correo', caracter, verificarToken, correo);
router.post('/api/mensajeria/whatsapp', whatsapp);

module.exports = router;