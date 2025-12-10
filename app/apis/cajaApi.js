const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar,cuadre} = require('../controllers/cajaControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaCaja} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/caja/listar/:id/:sesId', verificarToken, listar);
router.get('/api/caja/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/caja/crear', caracter, validaSchema(schemaCaja), verificarToken, crear);
router.put('/api/caja/editar/:id', caracter, validaSchema(schemaCaja), verificarToken, editar);
router.put('/api/caja/estado/:id', verificarToken, estado);
router.delete('/api/caja/eliminar/:id', verificarToken, eliminar);


module.exports = router;