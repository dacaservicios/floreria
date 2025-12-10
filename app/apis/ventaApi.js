const express = require('express');
const router = express.Router();
const {buscar,listar,listarDetalle,listarInicio, crear, editar, buscarDetalle, crearDetalle,editarDetalle, eliminarDetalle, listarPago, pagar, buscarPago,eliminarPago, eliminar, documento, buscarTotales,clave} = require('../controllers/ventaControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaVenta,schemaVentaDetalle/*, schemaVentaPagar*/} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/venta/buscar/:id/:sesId', verificarToken, buscar);
router.get('/api/venta/buscar/totales/:id/:sesId', verificarToken, buscarTotales);
router.get('/api/venta/listar/:id/:sesId', verificarToken, listar);
router.get('/api/venta/inicio/listar/:sesId/:tipo', verificarToken, listarInicio);
router.post('/api/venta/crear', caracter, verificarToken, crear);
router.put('/api/venta/editar/:id', caracter, validaSchema(schemaVenta), verificarToken, editar);
router.delete('/api/venta/eliminar/:id', verificarToken, eliminar);
router.get('/api/venta/detalle/listar/:id/:sesId', verificarToken, listarDetalle);
router.get('/api/venta/detalle/buscar/:id/:sesId', caracter, verificarToken, buscarDetalle);
router.post('/api/venta/detalle/crear', /*caracter,*/ verificarToken, crearDetalle);
router.put('/api/venta/detalle/editar/:id', caracter, validaSchema(schemaVentaDetalle), verificarToken, editarDetalle);
router.delete('/api/venta/detalle/eliminar/:id', verificarToken, eliminarDetalle);
router.get('/api/venta/detalle/listar/pago/:id/:sesId', verificarToken, listarPago);
router.get('/api/venta/detalle/buscar/pago/:id/:sesId', verificarToken, buscarPago);
router.delete('/api/venta/detalle/eliminar/pago/:id', verificarToken, eliminarPago);
router.post('/api/venta/detalle/pagar', caracter, /*validaSchema(schemaVentaPagar),*/ verificarToken, pagar);
//router.put('/api/venta/cierre/:id', caracter, /*validaSchema(schemaVentaPagar)*/ verificarToken, cierre);

router.get('/api/venta/muestra/documento/:id/:sesId', verificarToken, documento);
router.get('/api/venta/clave/:codigo/:sesId', verificarToken, clave);

module.exports = router;