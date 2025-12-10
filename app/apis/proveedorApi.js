const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar} = require('../controllers/proveedorControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaProveedor} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/proveedor/listar/:id/:sesId', verificarToken, listar);
router.get('/api/proveedor/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/proveedor/crear', caracter, validaSchema(schemaProveedor), verificarToken, crear);
router.put('/api/proveedor/editar/:id', caracter, validaSchema(schemaProveedor), verificarToken, editar);
router.put('/api/proveedor/estado/:id', verificarToken, estado);
router.delete('/api/proveedor/eliminar/:id', verificarToken, eliminar);

module.exports = router;