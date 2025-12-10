const express = require('express');
const router = express.Router();
const {buscar,listar,listarDetalle,listarInicio, crear, editar, buscarDetalle, crearDetalle,editarDetalle, eliminarDetalle, listarPago, pagar, buscarPago,eliminarPago, eliminar, documento,buscarTotales} = require('../controllers/compraControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaCompra,schemaCompraDetalle/*, schemaCompraPagar*/} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/compra/buscar/:id/:sesId', verificarToken, buscar);
router.get('/api/compra/buscar/totales/:id/:sesId', verificarToken, buscarTotales);
router.get('/api/compra/listar/:id/:sesId', verificarToken, listar);
router.get('/api/compra/inicio/listar/:sesId/:tipo', verificarToken, listarInicio);
router.post('/api/compra/crear', caracter, verificarToken, crear);
router.put('/api/compra/editar/:id', caracter, validaSchema(schemaCompra), verificarToken, editar);
router.delete('/api/compra/eliminar/:id', verificarToken, eliminar);
router.get('/api/compra/detalle/listar/:id/:sesId', verificarToken, listarDetalle);
router.get('/api/compra/detalle/buscar/:id/:sesId', caracter, verificarToken, buscarDetalle);
router.post('/api/compra/detalle/crear', /*caracter,*/ verificarToken, crearDetalle);
router.put('/api/compra/detalle/editar/:id', caracter, validaSchema(schemaCompraDetalle), verificarToken, editarDetalle);
router.delete('/api/compra/detalle/eliminar/:id', verificarToken, eliminarDetalle);
router.get('/api/compra/detalle/listar/pago/:id/:sesId', verificarToken, listarPago);
router.get('/api/compra/detalle/buscar/pago/:id/:sesId', verificarToken, buscarPago);
router.delete('/api/compra/detalle/eliminar/pago/:id', verificarToken, eliminarPago);
router.post('/api/compra/detalle/pagar', caracter, /*validaSchema(schemaCompraPagar),*/ verificarToken, pagar);
//router.put('/api/compra/cierre/:id', caracter, /*validaSchema(schemaCompraPagar)*/ verificarToken, cierre);

router.get('/api/compra/muestra/documento/:id/:sesId', verificarToken, documento);

module.exports = router;