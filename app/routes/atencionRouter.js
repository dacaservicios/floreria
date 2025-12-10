const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const config = require('../config/config');
const {isLogin} = require('../middlewares/auth');
const {pdfTicket} = require('../pdf/ticket');


router.post('/atencion/ticket', isLogin, async (req, res) => {
    try {
        const sesId=req.session.passport.user.id;
        const lista =  await axios.get(config.URL_SISTEMA+"/api/atencion/buscar/"+req.body.id+"/"+sesId,{ 
            headers:{authorization: `Bearer ${req.body.token}`} 
        });

        const pdf =  await pdfTicket(lista.data.valor.info);

        res.json({
            resultado : true,
        })
    }catch (err) {    
        res.status(400).json({
            error : {
                message:err.response.data.error.message,
                errno: err.response.data.error.errno,
                code :err.response.data.error.code
            }
        });
    }
});


router.get('/atencion/descarga/ticket/:id', isLogin, (req, res) => {
    let idAtencion=req.params.id;

    res.setHeader('Content-disposition', 'attachment; filename=Ticket_'+idAtencion+'.pdf');
    res.setHeader('Content-type', 'application/pdf');
    res.charset = 'UTF-8';

    res.sendFile(path.join(__dirname,'../public/pdf/ticket/TK_'+idAtencion+'_ticket.pdf'));
    
});

/*===============================================*/


module.exports = router;