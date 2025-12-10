const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar,listarId} = require('../controllers/mesaControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaMesa} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/mesa/listar/:id/:sesId', verificarToken, listar);
router.get('/api/mesa/detalle/listar/:id/:sesId', caracter, verificarToken, listarId);
router.get('/api/mesa/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/mesa/crear', caracter, validaSchema(schemaMesa), verificarToken, crear);
router.put('/api/mesa/editar/:id', caracter, validaSchema(schemaMesa), verificarToken, editar);
router.put('/api/mesa/estado/:id', verificarToken, estado);
router.delete('/api/mesa/eliminar/:id', verificarToken, eliminar);

module.exports = router;