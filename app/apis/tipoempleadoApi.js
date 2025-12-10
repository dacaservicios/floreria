const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar} = require('../controllers/tipoempleadoControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaTipoempleado} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/tipoempleado/listar/:id/:sesId', verificarToken, listar);
router.get('/api/tipoempleado/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/tipoempleado/crear', caracter, validaSchema(schemaTipoempleado), verificarToken, crear);
router.put('/api/tipoempleado/editar/:id', caracter, validaSchema(schemaTipoempleado), verificarToken, editar);
router.put('/api/tipoempleado/estado/:id', verificarToken, estado);
router.delete('/api/tipoempleado/eliminar/:id', verificarToken, eliminar);

module.exports = router;