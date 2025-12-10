const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar,listarId,autocompleta,codigoBarra} = require('../controllers/productosucursalControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaProductosucursal} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/productosucursal/listar/:id/:sesId', verificarToken, listar);
router.get('/api/productosucursal/autocompleta/:producto/:idProveedor/:tipo/:sesId', verificarToken, autocompleta);
router.get('/api/productosucursal/detalle/listar/:id/:sesId', verificarToken, listarId);
router.get('/api/productosucursal/buscar/codigo/:codigobarra/:sesId', verificarToken, codigoBarra);
router.get('/api/productosucursal/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/productosucursal/crear', caracter, validaSchema(schemaProductosucursal), verificarToken, crear);
router.put('/api/productosucursal/editar/:id', caracter, validaSchema(schemaProductosucursal), verificarToken, editar);
router.put('/api/productosucursal/estado/:id', verificarToken, estado);
router.delete('/api/productosucursal/eliminar/:id', verificarToken, eliminar);

module.exports = router;