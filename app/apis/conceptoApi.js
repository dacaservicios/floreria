const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar} = require('../controllers/conceptoControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaConcepto} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/concepto/listar/:id/:sesId', verificarToken, listar);
router.get('/api/concepto/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/concepto/crear', caracter, validaSchema(schemaConcepto), verificarToken, crear);
router.put('/api/concepto/editar/:id', caracter, validaSchema(schemaConcepto), verificarToken, editar);
router.put('/api/concepto/estado/:id', verificarToken, estado);
router.delete('/api/concepto/eliminar/:id', verificarToken, eliminar);

module.exports = router;