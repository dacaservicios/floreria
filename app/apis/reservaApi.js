const express = require('express');
const router = express.Router();
const {crear,editar,buscar,listar,estado, eliminar,editarDD, whatsapp} = require('../controllers/reservaControllers');
const {verificarToken} = require('../middlewares/jwt');
const {schemaReserva} = require('../middlewares/schema');
const {caracter, validaSchema} = require('../middlewares/auth');


router.get('/api/reserva/listar/:id/:sesId', verificarToken, listar);
router.get('/api/reserva/buscar/:id/:sesId', verificarToken, buscar);
router.post('/api/reserva/crear', caracter, validaSchema(schemaReserva), verificarToken, crear);
router.put('/api/reserva/editar/:id', caracter, validaSchema(schemaReserva), verificarToken, editar);
router.put('/api/reserva/editarDD/:id', caracter, verificarToken, editarDD);
router.put('/api/reserva/estado/:id', verificarToken, estado);
router.delete('/api/reserva/eliminar/:id', verificarToken, eliminar);

module.exports = router;