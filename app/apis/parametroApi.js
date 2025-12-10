const express = require('express');
const router = express.Router();
const {crear,crearDetalle,editar,buscar,listar,listarId,estado,visible,estadoDetalle, eliminar,eliminarDetalle,buscarId,editarDetalle,visibleDetalle,
    listarIdMi,buscarIdMi,editarDetalleMi} = require('../controllers/parametroControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaParametro,schemaParametroDetalle} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/parametro/listar/:id/:sesId', caracter, verificarToken, listar);
router.get('/api/parametro/buscar/:id/:sesId', caracter, verificarToken, buscar);
router.post('/api/parametro/crear', caracter, validaSchema(schemaParametro), verificarToken, crear);
router.put('/api/parametro/editar/:id', caracter,validaSchema(schemaParametro), verificarToken, editar);
router.put('/api/parametro/estado/:id', caracter, verificarToken, estado);
router.delete('/api/parametro/eliminar/:id', caracter, verificarToken, eliminar);
router.put('/api/parametro/visible/:id', caracter, verificarToken, visible);


router.get('/api/parametro/detalle/listar/:id/:sesId', caracter, verificarToken, listarId);
router.get('/api/parametro/detalle/buscar/:id/:sesId', caracter, verificarToken, buscarId);
router.post('/api/parametro/detalle/crear', caracter, validaSchema(schemaParametroDetalle), verificarToken, crearDetalle);
router.put('/api/parametro/detalle/editar/:id', caracter, validaSchema(schemaParametroDetalle), verificarToken, editarDetalle);
router.delete('/api/parametro/detalle/eliminar/:id', caracter, verificarToken, eliminarDetalle);
router.put('/api/parametro/detalle/estado/:id', caracter, verificarToken, estadoDetalle);
router.put('/api/parametro/detalle/visible/:id', caracter, verificarToken, visibleDetalle);

router.get('/api/miparametro/detalle/listar/:id/:sesId', caracter, verificarToken, listarIdMi);
router.get('/api/miparametro/detalle/buscar/:id/:sesId', caracter, verificarToken, buscarIdMi);
router.put('/api/miparametro/detalle/editar/:id', caracter, validaSchema(schemaParametroDetalle), verificarToken, editarDetalleMi);

module.exports = router;