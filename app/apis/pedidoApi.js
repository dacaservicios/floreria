const express = require('express');
const router = express.Router();
const {buscar,listar,listarDetalle,listarInicio, crear, editar, buscarDetalle, crearDetalle,editarDetalle, eliminarDetalle, listarPago, pagar, buscarPago,eliminarPago, eliminar, documento,buscarTotales} = require('../controllers/pedidoControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaPedido,schemaPedidoDetalle/*, schemaPedidoPagar*/} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/pedido/buscar/:id/:sesId', verificarToken, buscar);
router.get('/api/pedido/buscar/totales/:id/:sesId', verificarToken, buscarTotales);
router.get('/api/pedido/listar/:id/:sesId', verificarToken, listar);
router.get('/api/pedido/inicio/listar/:sesId/:tipo', verificarToken, listarInicio);
router.post('/api/pedido/crear', caracter, verificarToken, crear);
router.put('/api/pedido/editar/:id', caracter, validaSchema(schemaPedido), verificarToken, editar);
router.delete('/api/pedido/eliminar/:id', verificarToken, eliminar);
router.get('/api/pedido/detalle/listar/:id/:sesId', verificarToken, listarDetalle);
router.get('/api/pedido/detalle/buscar/:id/:sesId', caracter, verificarToken, buscarDetalle);
router.post('/api/pedido/detalle/crear', /*caracter,*/ verificarToken, crearDetalle);
router.put('/api/pedido/detalle/editar/:id', caracter, validaSchema(schemaPedidoDetalle), verificarToken, editarDetalle);
router.delete('/api/pedido/detalle/eliminar/:id', verificarToken, eliminarDetalle);
router.get('/api/pedido/detalle/listar/pago/:id/:sesId', verificarToken, listarPago);
router.get('/api/pedido/detalle/buscar/pago/:id/:sesId', verificarToken, buscarPago);
router.delete('/api/pedido/detalle/eliminar/pago/:id', verificarToken, eliminarPago);
router.post('/api/pedido/detalle/pagar', caracter, /*validaSchema(schemaPedidoPagar),*/ verificarToken, pagar);
//router.put('/api/pedido/cierre/:id', caracter, /*validaSchema(schemaPedidoPagar)*/ verificarToken, cierre);

router.get('/api/pedido/muestra/documento/:id/:sesId', verificarToken, documento);

module.exports = router;