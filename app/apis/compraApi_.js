const express = require('express');
const router = express.Router();
const {buscar,listar,listarId,estado, eliminar, filtrar,filtrar2, filtrarInicio, corrige} = require('../controllers/compraControllers');
const {verificarToken} = require('../middlewares/jwt');
//const {schemaCompra} = require('../middlewares/schema');
const {caracter} = require('../middlewares/auth');


router.get('/api/compra/listar/:id/:sesId', verificarToken, listar);
router.get('/api/compra/detalle/listar/:id/:sesId', caracter, verificarToken, listarId);
router.get('/api/compra/filtro/:sesId/:tipo', caracter, verificarToken, filtrarInicio);
router.post('/api/compra/filtro', caracter, verificarToken, filtrar);
router.post('/api/compra/filtro2', caracter, verificarToken, filtrar2);
router.get('/api/compra/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/compra/corrige', caracter, verificarToken, corrige);
//router.post('/api/compra/crear', caracter, validaSchema(schemaCompra), verificarToken, crear);
//router.put('/api/compra/editar/:id', caracter, validaSchema(schemaCompra), verificarToken, editar);
router.put('/api/compra/estado/:id', verificarToken, estado);
router.delete('/api/compra/eliminar/:id', verificarToken, eliminar);

module.exports = router;