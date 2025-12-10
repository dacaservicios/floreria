const express = require('express');
const router = express.Router();

const {isLogin} = require('../middlewares/auth');



/*==================SOCKETS===================*/


router.post('/socket/jugador/sala', isLogin, async(req, res) => {
    /*const sesId=req.session.passport.user.id;   
    const jugadorSala = await axios.get(config.URL_SISTEMA+"/api/sala/buscar/"+req.body.id+"/"+sesId);
    
    res.json({
        jugadores: jugadorSala.data.valor.info.CANTIDAD_JUGADOR,
    });*/
});
/*=============================================*/


module.exports = router;