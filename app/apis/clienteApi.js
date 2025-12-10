const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar, documento,listar_wp,eliminar_wp} = require('../controllers/clienteControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaCliente} = require('../middlewares/schema');
const {caracter, validaSchema, verificaAdjunto} = require('../middlewares/auth');


router.get('/api/cliente/listar/:id/:sesId', verificarToken, listar);
router.get('/api/cliente/listar_wp/:id/:sesId', verificarToken, listar_wp);
router.get('/api/cliente/buscar/:id/:sesId', verificarToken, buscar);
router.get('/api/cliente/documento/:tipo/:documento', verificarToken, documento);
router.post('/api/cliente/crear', caracter, validaSchema(schemaCliente), verificaAdjunto,verificarToken, crear);
router.put('/api/cliente/editar/:id', caracter, validaSchema(schemaCliente), verificaAdjunto, verificarToken, editar);
router.put('/api/cliente/estado/:id', verificarToken, estado);
router.delete('/api/cliente/eliminar/:id', verificarToken, eliminar);
router.delete('/api/cliente/eliminar_wp/:id', eliminar_wp);

module.exports = router;