const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,listarId,estado,eliminar,eliminarDetalle,estadoDetalle,crearDetalle} = require('../controllers/menuControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaMenu} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/menu/listar/:id/:sesId', caracter, verificarToken, listar);
router.get('/api/menu/detalle/listar/:id/:sesId', caracter, verificarToken, listarId);
router.get('/api/menu/buscar/:id/:sesId', caracter, verificarToken, buscar);
router.post('/api/menu/crear', caracter, validaSchema(schemaMenu), verificarToken, crear);
router.put('/api/menu/editar/:id', caracter,validaSchema(schemaMenu), verificarToken, editar);
router.post('/api/menu/detalle/crear', caracter, verificarToken, crearDetalle);
router.put('/api/menu/estado/:id', caracter, verificarToken, estado);
router.delete('/api/menu/eliminar/:id', caracter, verificarToken, eliminar);
router.delete('/api/menu/detalle/eliminar/:id', caracter, verificarToken, eliminarDetalle);
router.put('/api/menu/detalle/estado/:id', caracter, verificarToken, estadoDetalle);

module.exports = router;