const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar,listarId} = require('../controllers/productoControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaProducto} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/producto/listar/:id/:sesId', verificarToken, listar);
router.get('/api/producto/detalle/listar/:id/:sesId', verificarToken, listarId);
router.get('/api/producto/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/producto/crear', caracter, validaSchema(schemaProducto), verificarToken, crear);
router.put('/api/producto/editar/:id', caracter, validaSchema(schemaProducto), verificarToken, editar);
router.put('/api/producto/estado/:id', verificarToken, estado);
router.delete('/api/producto/eliminar/:id', verificarToken, eliminar);

module.exports = router;