const express = require('express');
const router = express.Router();
const {buscar,listar,cierre} = require('../controllers/facturacionControllers');
const {verificarToken} = require('../middlewares/jwt');
//const {schemaFacturacion} = require('../middlewares/schema');
//const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/facturacion/listar/:id/:sesId', verificarToken, listar);
router.get('/api/facturacion/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/facturacion/cierre', verificarToken, cierre);

module.exports = router;