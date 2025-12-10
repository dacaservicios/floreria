const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar} = require('../controllers/ingresosegresosControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaIngresosegresos} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/ingresosegresos/listar/:id/:sesId', verificarToken, listar);
router.get('/api/ingresosegresos/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/ingresosegresos/crear', caracter, validaSchema(schemaIngresosegresos), verificarToken, crear);
router.put('/api/ingresosegresos/editar/:id', caracter, validaSchema(schemaIngresosegresos), verificarToken, editar);
router.put('/api/ingresosegresos/estado/:id', verificarToken, estado);
router.delete('/api/ingresosegresos/eliminar/:id', verificarToken, eliminar);

module.exports = router;