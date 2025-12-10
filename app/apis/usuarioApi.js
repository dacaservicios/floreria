const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado,eliminar,desbloquea,contrasena,clave,listarAviso,estadoDetalle,asignaDetalle} = require('../controllers/usuarioControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaUsuario} = require('../middlewares/schema');
const {caracter, validaSchema,verificaAdjunto} = require('../middlewares/auth');


router.get('/api/usuario/listar/:id/:sesId', caracter, verificarToken, listar);
router.get('/api/usuario/listar/aviso/:id/:sesId', caracter, listarAviso);
router.get('/api/usuario/buscar/:id/:sesId', caracter, verificarToken, buscar);
router.post('/api/usuario/crear',caracter,validaSchema(schemaUsuario),verificaAdjunto, verificarToken, crear);
router.post('/api/usuario/registrar',caracter,validaSchema(schemaUsuario),verificarToken, crear);
router.put('/api/usuario/editar/:id', caracter,validaSchema(schemaUsuario),verificaAdjunto, verificarToken, editar);
router.put('/api/usuario/estado/:id', caracter, verificarToken, estado);
router.post('/api/usuario/detalle/estado', caracter, verificarToken, estadoDetalle);
router.post('/api/usuario/detalle/asigna', caracter, verificarToken, asignaDetalle);
router.delete('/api/usuario/eliminar/:id', caracter, verificarToken, eliminar);
router.put('/api/usuario/desbloquea/:id', caracter, verificarToken, desbloquea);
router.put('/api/usuario/contrasena/:id', caracter, verificarToken, contrasena);
router.put('/api/usuario/clave/:id', caracter, verificarToken, clave);

module.exports = router;