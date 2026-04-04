const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar} = require('../controllers/productocompuestoControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaProductocompuesto} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/producto/compuesto/listar/:id/:sesId', verificarToken, listar);
router.get('/api/producto/compuesto/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/producto/compuesto/crear', caracter, validaSchema(schemaProductocompuesto), verificarToken, crear);
router.put('/api/producto/compuesto/editar/:id', caracter, validaSchema(schemaProductocompuesto), verificarToken, editar);
router.put('/api/producto/compuesto/estado/:id', verificarToken, estado);
router.delete('/api/producto/compuesto/eliminar/:id', verificarToken, eliminar);

module.exports = router;