const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar,producto} = require('../controllers/categoriaControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaCategoria} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/categoria/listar/:id/:sesId', verificarToken, listar);
router.get('/api/categoria/listar/producto/:id/:sesId', verificarToken, producto);
router.get('/api/categoria/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/categoria/crear', caracter, validaSchema(schemaCategoria), verificarToken, crear);
router.put('/api/categoria/editar/:id', caracter, validaSchema(schemaCategoria), verificarToken, editar);
router.put('/api/categoria/estado/:id', verificarToken, estado);
router.delete('/api/categoria/eliminar/:id', verificarToken, eliminar);

module.exports = router;