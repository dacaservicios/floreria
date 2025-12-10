const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar} = require('../controllers/iniciastockControllers');
const {verificarToken} = require('../middlewares/jwt');
//const {schemaIniciastock} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/iniciastock/listar/:id/:sesId', verificarToken, listar);
router.get('/api/iniciastock/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/iniciastock/crear', caracter, verificarToken, crear);
//router.put('/api/iniciastock/editar/:id', caracter, validaSchema(schemaIniciastock), verificarToken, editar);
router.put('/api/iniciastock/estado/:id', verificarToken, estado);
router.delete('/api/iniciastock/eliminar/:id', verificarToken, eliminar);

module.exports = router;