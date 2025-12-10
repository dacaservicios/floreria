const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar, venta, atencion,eliminarAtencion,descuento, documento} = require('../controllers/pedidoControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaPedido} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/pedido/listar/:id/:sesId', verificarToken, listar);
router.get('/api/pedido/buscar/:id/:sesId', verificarToken, buscar);
router.get('/api/pedido/atencion/:id/:sesId', verificarToken, atencion);
router.post('/api/pedido/crear', caracter, validaSchema(schemaPedido), verificarToken, crear);
router.put('/api/pedido/editar/:id', caracter, validaSchema(schemaPedido), verificarToken, editar);
router.put('/api/pedido/estado/:id', verificarToken, estado);
router.delete('/api/pedido/eliminar/:id', verificarToken, eliminar);
router.delete('/api/pedido/eliminar/atencion/:id', verificarToken, eliminarAtencion);
router.put('/api/pedido/venta/:id', caracter, verificarToken, venta);

router.get('/api/pedido/muestra/documento/:id/:sesId', verificarToken, documento);
router.put('/api/pedido/descuento/:id', caracter, verificarToken, descuento);

module.exports = router;