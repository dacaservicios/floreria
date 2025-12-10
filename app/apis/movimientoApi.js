const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar,filtrarInicio,filtrar} = require('../controllers/movimientoControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaMovimiento} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/movimiento/listar/:id/:sesId', verificarToken, listar);
router.get('/api/movimiento/buscar/:id/:sesId', verificarToken, buscar);
router.get('/api/movimiento/filtro/:sesId', caracter, verificarToken, filtrarInicio);
router.post('/api/movimiento/filtro', caracter, verificarToken, filtrar);
router.post('/api/movimiento/crear', caracter, validaSchema(schemaMovimiento), verificarToken, crear);
router.put('/api/movimiento/editar/:id', caracter, validaSchema(schemaMovimiento), verificarToken, editar);
router.put('/api/movimiento/estado/:id', verificarToken, estado);
router.delete('/api/movimiento/eliminar/:id', verificarToken, eliminar);

module.exports = router;