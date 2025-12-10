const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar,cambiaEmpresa,listarMiempresa} = require('../controllers/empresaControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaEmpresa} = require('../middlewares/schema');
const {caracter, validaSchema, verificaAdjunto} = require('../middlewares/auth');


router.get('/api/empresa/listar/:id/:sesId', verificarToken, listar);
router.get('/api/empresa/listar/miempresa/:id/:sesId', verificarToken, listarMiempresa);
router.get('/api/empresa/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/empresa/crear', caracter, validaSchema(schemaEmpresa), verificaAdjunto, verificarToken, crear);
router.put('/api/empresa/editar/:id', caracter, validaSchema(schemaEmpresa), verificaAdjunto, verificarToken, editar);
router.put('/api/empresa/estado/:id', verificarToken, estado);
router.delete('/api/empresa/eliminar/:id', verificarToken, eliminar);
router.post('/api/empresa/cambia', caracter, verificarToken, cambiaEmpresa);

module.exports = router;