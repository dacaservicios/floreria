const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar,listarDetalle} = require('../controllers/sucursalControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaSucursal} = require('../middlewares/schema');
const {caracter, validaSchema,verificaAdjunto} = require('../middlewares/auth');


router.get('/api/sucursal/listar/:id/:sesId', verificarToken, listar);
router.get('/api/sucursal/listado/:id/:sesId', listar);
router.get('/api/sucursal/listar/detalle/:id/:empresa/:sesId', verificarToken, listarDetalle);
router.get('/api/sucursal/buscar/:id/:sesId', verificarToken, buscar);
router.get('/api/sucursal/buscarflujocaja/:id/:sesId', buscar);
router.post('/api/sucursal/crear', caracter, validaSchema(schemaSucursal),verificaAdjunto, verificarToken, crear);
router.put('/api/sucursal/editar/:id', caracter, validaSchema(schemaSucursal),verificaAdjunto, verificarToken, editar);
router.put('/api/sucursal/estado/:id', verificarToken, estado);
router.delete('/api/sucursal/eliminar/:id', verificarToken, eliminar);

module.exports = router;