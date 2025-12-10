const express = require('express');
const router = express.Router();
const {buscar,listar,listarId,estado, eliminar, filtrar,filtrar2, filtrarInicio, corrige} = require('../controllers/kardexControllers');
const {verificarToken} = require('../middlewares/jwt');
//const {schemaKardex} = require('../middlewares/schema');
const {caracter} = require('../middlewares/auth');


router.get('/api/kardex/listar/:id/:sesId', verificarToken, listar);
router.get('/api/kardex/detalle/listar/:id/:sesId', caracter, verificarToken, listarId);
router.get('/api/kardex/filtro/:sesId/:tipo', caracter, verificarToken, filtrarInicio);
router.post('/api/kardex/filtro', caracter, verificarToken, filtrar);
router.post('/api/kardex/filtro2', caracter, verificarToken, filtrar2);
router.get('/api/kardex/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/kardex/corrige', caracter, verificarToken, corrige);
//router.post('/api/kardex/crear', caracter, validaSchema(schemaKardex), verificarToken, crear);
//router.put('/api/kardex/editar/:id', caracter, validaSchema(schemaKardex), verificarToken, editar);
router.put('/api/kardex/estado/:id', verificarToken, estado);
router.delete('/api/kardex/eliminar/:id', verificarToken, eliminar);

module.exports = router;