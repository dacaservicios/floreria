const express = require('express');
const router = express.Router();
const {isLogin} = require('../middlewares/auth');
const {getUrl} = require('../libs/helpers');//getUrl(req)


/*==================SOCKETS===================*/


router.post('/socket/jugador/sala', isLogin, async(req, res) => {
    /*const sesId=req.session.passport.user.id;   
    const jugadorSala = await axios.get(getUrl(req)+"/api/sala/buscar/"+req.body.id+"/"+sesId);
    
    res.json({
        jugadores: jugadorSala.data.valor.info.CANTIDAD_JUGADOR,
    });*/
});
/*=============================================*/


module.exports = router;