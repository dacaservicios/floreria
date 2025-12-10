const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar,listarId} = require('../controllers/servicioControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaServicio} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/servicio/listar/:id/:sesId', verificarToken, listar);
router.get('/api/servicio/detalle/listar/:id/:sesId', verificarToken, listarId);
router.get('/api/servicio/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/servicio/crear', caracter, validaSchema(schemaServicio), verificarToken, crear);
router.put('/api/servicio/editar/:id', caracter, validaSchema(schemaServicio), verificarToken, editar);
router.put('/api/servicio/estado/:id', verificarToken, estado);
router.delete('/api/servicio/eliminar/:id', verificarToken, eliminar);

module.exports = router;