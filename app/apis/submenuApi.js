const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,listarId,estado,eliminar,eliminarDetalle,estadoDetalle,crearDetalle} = require('../controllers/submenuControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaSubmenu} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/submenu/listar/:id/:sesId', caracter, verificarToken, listar);
router.get('/api/submenu/detalle/listar/:id/:sesId', caracter, verificarToken, listarId);
router.get('/api/submenu/buscar/:id/:sesId', caracter, verificarToken, buscar);
router.post('/api/submenu/crear', caracter, validaSchema(schemaSubmenu), verificarToken, crear);
router.put('/api/submenu/editar/:id', caracter, validaSchema(schemaSubmenu), verificarToken, editar);
router.post('/api/submenu/detalle/crear', caracter, verificarToken, crearDetalle);
router.put('/api/submenu/estado/:id', verificarToken, estado);
router.delete('/api/submenu/eliminar/:id', caracter, verificarToken, eliminar);
router.delete('/api/submenu/detalle/eliminar/:id', caracter, verificarToken, eliminarDetalle);
router.put('/api/submenu/detalle/estado/:id', caracter, verificarToken, estadoDetalle);

module.exports = router;