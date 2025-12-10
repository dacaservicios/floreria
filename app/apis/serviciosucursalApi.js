const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar,listarId,autocompleta} = require('../controllers/serviciosucursalControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaServiciosucursal} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/serviciosucursal/listar/:id/:sesId', verificarToken, listar);
router.get('/api/serviciosucursal/autocompleta/:servicio/:tipo/:sesId', verificarToken, autocompleta);
router.get('/api/serviciosucursal/detalle/listar/:id/:sesId', verificarToken, listarId);
router.get('/api/serviciosucursal/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/serviciosucursal/crear', caracter, validaSchema(schemaServiciosucursal), verificarToken, crear);
router.put('/api/serviciosucursal/editar/:id', caracter, validaSchema(schemaServiciosucursal), verificarToken, editar);
router.put('/api/serviciosucursal/estado/:id', verificarToken, estado);
router.delete('/api/serviciosucursal/eliminar/:id', verificarToken, eliminar);

module.exports = router;