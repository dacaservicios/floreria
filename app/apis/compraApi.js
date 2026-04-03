const express = require('express');
const router = express.Router();
const {buscar,listar,listarDetalle,listarHistorial,listarInicio, crear, editar,editar2, estado,estado2, buscarDetalle, crearDetalle,editarDetalle, eliminarDetalle, listarPago, pagar, buscarPago,eliminarPago, eliminar, documento,buscarTotales,precio} = require('../controllers/compraControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaCompra,schemaCompra2,schemaCompraDetalle/*, schemaCompraPagar*/} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/compra/buscar/:id/:sesId', verificarToken, buscar);
router.get('/api/compra/buscar/totales/:id/:sesId', verificarToken, buscarTotales);
router.get('/api/compra/listar/:id/:sesId', verificarToken, listar);
router.get('/api/compra/inicio/listar/:sesId/:tipo', verificarToken, listarInicio);
router.post('/api/compra/crear', caracter, verificarToken, crear);
router.put('/api/compra/editar/:id', caracter, validaSchema(schemaCompra), verificarToken, editar);
router.put('/api/compra/editar2/:id', caracter, validaSchema(schemaCompra2), verificarToken, editar2);
router.put('/api/compra/estado/:id', verificarToken, estado);
router.put('/api/compra/estado2/:id', verificarToken, estado2);
router.delete('/api/compra/eliminar/:id', verificarToken, eliminar);
router.get('/api/compra/detalle/listar/:id/:sesId', verificarToken, listarDetalle);
router.get('/api/compra/historial/listar/:id/:sesId', verificarToken, listarHistorial);
router.get('/api/compra/detalle/buscar/:id/:sesId', caracter, verificarToken, buscarDetalle);
router.post('/api/compra/detalle/crear', /*caracter,*/ verificarToken, crearDetalle);
router.put('/api/compra/detalle/editar/:id', caracter, validaSchema(schemaCompraDetalle), verificarToken, editarDetalle);
router.delete('/api/compra/detalle/eliminar/:id', verificarToken, eliminarDetalle);
router.get('/api/compra/detalle/listar/pago/:id/:sesId', verificarToken, listarPago);
router.get('/api/compra/detalle/buscar/pago/:id/:sesId', verificarToken, buscarPago);
router.delete('/api/compra/detalle/eliminar/pago/:id', verificarToken, eliminarPago);
router.post('/api/compra/detalle/pagar', caracter, /*validaSchema(schemaCompraPagar),*/ verificarToken, pagar);
router.put('/api/compra/detalle/precio/:id', verificarToken, precio);
//router.put('/api/compra/cierre/:id', caracter, /*validaSchema(schemaCompraPagar)*/ verificarToken, cierre);

router.get('/api/compra/muestra/documento/:id/:sesId', verificarToken, documento);

module.exports = router;