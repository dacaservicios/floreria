const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar} = require('../controllers/zonaControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaZona} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/zona/listar/:id/:sesId', verificarToken, listar);
router.get('/api/zona/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/zona/crear', caracter, validaSchema(schemaZona), verificarToken, crear);
router.put('/api/zona/editar/:id', caracter, validaSchema(schemaZona), verificarToken, editar);
router.put('/api/zona/estado/:id', verificarToken, estado);
router.delete('/api/zona/eliminar/:id', verificarToken, eliminar);

module.exports = router;