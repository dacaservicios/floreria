const express = require('express');
const router = express.Router();
const {guardar,moduloMenu} = require('../controllers/moduloControllers');
const {verificarToken} = require('../middlewares/jwt');
const {caracter} = require('../middlewares/auth');

router.get('/api/modulo/menu/:tabla/:id/:sesId', caracter, verificarToken, moduloMenu);
router.get('/api/modulo/submenu/:tabla/:id/:sesId', caracter, verificarToken, moduloMenu);
router.get('/api/modulo/opcion/:tabla/:id/:sesId', caracter, verificarToken, moduloMenu);
router.put('/api/modulo/guarda/:id', verificarToken, guardar);

module.exports = router;