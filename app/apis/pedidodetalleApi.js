const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar,comanda, listarPago, buscarPago,pagar, eliminarPago, precuenta, estadoMozo,esatendido,eliminarActualiza} = require('../controllers/pedidodetalleControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaPedidodetalle, schemaPedidoPagar} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/pedidodetalle/listar/:id/:sesId', verificarToken, listar);
router.get('/api/pedidodetalle/listar/pago/:id/:sesId', verificarToken, listarPago);
router.get('/api/pedidodetalle/buscar/pago/:id/:sesId', verificarToken, buscarPago);
router.get('/api/pedidodetalle/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/pedidodetalle/crear', caracter, validaSchema(schemaPedidodetalle), verificarToken, crear);
router.post('/api/pedidodetalle/pagar', caracter, validaSchema(schemaPedidoPagar), verificarToken, pagar);
router.post('/api/pedidodetalle/comanda', caracter, verificarToken, comanda);
router.post('/api/pedidodetalle/precuenta', caracter, verificarToken, precuenta);
router.post('/api/pedidodetalle/esatendido', caracter, verificarToken, esatendido);
router.put('/api/pedidodetalle/editar/:id', caracter, validaSchema(schemaPedidodetalle), verificarToken, editar);
router.put('/api/pedidodetalle/estado/:id', verificarToken, estado);
router.post('/api/pedidodetalle/estado/mozo', verificarToken, estadoMozo);
router.delete('/api/pedidodetalle/eliminar/:id', verificarToken, eliminar);
router.post('/api/pedidodetalle/eliminar/comanda', verificarToken, comanda);
router.delete('/api/pedidodetalle/eliminar/pago/:id', verificarToken, eliminarPago);

module.exports = router;