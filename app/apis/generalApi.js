const express = require('express');
const router = express.Router();
const {verificarToken} = require('../middlewares/jwt');
const {dashboardInicio, atencion, ventas} = require('../controllers/generalControllers');
const {caracter} = require('../middlewares/auth');

router.post('/api/general/dashboard', caracter,verificarToken, dashboardInicio);
router.post('/api/general/atencion', caracter,verificarToken, atencion);
router.post('/api/general/ventas', caracter,verificarToken, ventas);

module.exports = router;