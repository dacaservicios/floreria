const express = require('express');
const router = express.Router();
const {buscar,listar,crear,editar,eliminar,listar10, cortegratis, correo,whatsapp,listarDetalle,listarInicio,buscarTotales,crearDetalle,buscarDetalle,editarDetalle,eliminarDetalle,documento} = require('../controllers/atencionControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaAtencion,schemaAtencionDetalle} = require('../middlewares/schema');
const {caracter,validaSchema} = require('../middlewares/auth');


router.get('/api/atencion/listar/:id/:sesId', verificarToken, listar);
router.get('/api/atencion/listar/top10/:id/:sesId', verificarToken, listar10);
router.get('/api/atencion/inicio/listar/:sesId/:tipo', verificarToken, listarInicio);
router.get('/api/atencion/buscar/:id/:sesId', verificarToken, buscar);
router.get('/api/atencion/buscar/totales/:id/:sesId', verificarToken, buscarTotales);
router.get('/api/atencion/cortegratis/:id/:sesId', verificarToken, cortegratis);
router.post('/api/atencion/crear', caracter, verificarToken, crear);
router.put('/api/atencion/editar/:id', caracter, validaSchema(schemaAtencion), verificarToken, editar);
router.delete('/api/atencion/eliminar/:id', verificarToken, eliminar);
router.post('/api/atencion/correo', caracter, verificarToken, correo);
router.post('/api/atencion/whatsapp', caracter, verificarToken, whatsapp);

router.get('/api/atencion/detalle/listar/:id/:sesId', verificarToken, listarDetalle);
router.post('/api/atencion/detalle/crear', caracter, verificarToken, crearDetalle);
router.get('/api/atencion/detalle/buscar/:id/:sesId', caracter, verificarToken, buscarDetalle);
router.put('/api/atencion/detalle/editar/:id', caracter, validaSchema(schemaAtencionDetalle), verificarToken, editarDetalle);
router.delete('/api/atencion/detalle/eliminar/:id', verificarToken, eliminarDetalle);
router.get('/api/atencion/muestra/documento/:id/:sesId', verificarToken, documento);

module.exports = router;