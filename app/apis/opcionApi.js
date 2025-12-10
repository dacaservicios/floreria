const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar} = require('../controllers/opcionControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaOpcion} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/opcion/listar/:id/:sesId', verificarToken, listar);
router.get('/api/opcion/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/opcion/crear', caracter, validaSchema(schemaOpcion), verificarToken, crear);
router.put('/api/opcion/editar/:id', caracter, validaSchema(schemaOpcion), verificarToken, editar);
router.put('/api/opcion/estado/:id', verificarToken, estado);
router.delete('/api/opcion/eliminar/:id', verificarToken, eliminar);

module.exports = router;