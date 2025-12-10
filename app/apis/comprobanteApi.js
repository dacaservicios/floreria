const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar,listarPago} = require('../controllers/comprobanteControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaComprobante} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/comprobante/listar/:id/:sesId', verificarToken, listar);
router.get('/api/comprobante/listar/pago/:id/:sesId', verificarToken, listarPago);
router.get('/api/comprobante/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/comprobante/crear', caracter, validaSchema(schemaComprobante), verificarToken, crear);
router.put('/api/comprobante/editar/:id', caracter, validaSchema(schemaComprobante), verificarToken, editar);
router.put('/api/comprobante/estado/:id', verificarToken, estado);
router.delete('/api/comprobante/eliminar/:id', verificarToken, eliminar);

module.exports = router;