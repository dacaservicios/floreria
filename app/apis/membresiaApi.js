const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar} = require('../controllers/membresiaControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaMembresia} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/membresia/listar/:id/:sesId', verificarToken, listar);
router.get('/api/membresia/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/membresia/crear', caracter, validaSchema(schemaMembresia), verificarToken, crear);
router.put('/api/membresia/editar/:id', caracter, validaSchema(schemaMembresia), verificarToken, editar);
router.put('/api/membresia/estado/:id', verificarToken, estado);
router.delete('/api/membresia/eliminar/:id', verificarToken, eliminar);

module.exports = router;