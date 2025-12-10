const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar} = require('../controllers/nivelControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaNivel} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/nivel/listar/:id/:sesId', verificarToken, listar);
router.get('/api/nivel/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/nivel/crear', caracter, validaSchema(schemaNivel), verificarToken, crear);
router.put('/api/nivel/editar/:id', caracter, validaSchema(schemaNivel), verificarToken, editar);
router.put('/api/nivel/estado/:id', verificarToken, estado);
router.delete('/api/nivel/eliminar/:id', verificarToken, eliminar);

module.exports = router;