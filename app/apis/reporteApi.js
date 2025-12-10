const express = require('express');
const router = express.Router();
const {filtrar,filtrarInicio,flujoCajaDiario} = require('../controllers/reporteControllers');
const {verificarToken} = require('../middlewares/jwt');
//const {schemaReporte} = require('../middlewares/schema');
const {caracter} = require('../middlewares/auth');

router.post('/api/reporte/filtro', caracter, verificarToken, filtrar);
router.get('/api/reporte/filtroInicio/:tipo/:sesId', caracter, verificarToken, filtrarInicio);
router.post('/api/reporte/flujocajadiario', flujoCajaDiario);
router.post('/api/reporte/flujocaja', filtrar);

module.exports = router;