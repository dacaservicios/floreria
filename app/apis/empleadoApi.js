const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar, documento} = require('../controllers/empleadoControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaEmpleado} = require('../middlewares/schema');
const {caracter, validaSchema, verificaAdjunto} = require('../middlewares/auth');


router.get('/api/empleado/listar/:id/:sesId', verificarToken, listar);
router.get('/api/empleado/buscar/:id/:sesId', verificarToken, buscar);
router.get('/api/empleado/documento/:tipo/:documento', verificarToken, documento);
router.post('/api/empleado/crear', caracter, validaSchema(schemaEmpleado),verificaAdjunto, verificarToken, crear);
router.put('/api/empleado/editar/:id', caracter, validaSchema(schemaEmpleado),verificaAdjunto, verificarToken, editar);
router.put('/api/empleado/estado/:id', verificarToken, estado);
router.delete('/api/empleado/eliminar/:id', verificarToken, eliminar);

module.exports = router;