const pool = require('../config/connections');
//const {enviaEmail} = require('../config/email');
const {requestEmail} = require('../config/mailjet');
const path = require('path');
const {mensajeCorreoMasivo} = require('../html/inicioMensaje');
const axios = require('axios');
const config = require('../config/config');

const crearMensajeria = async (body)=>{
    const query = `CALL USP_UPD_INS_MENSAJERIA(?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        body.asunto,
        body.descripcion,
        'crea',
        body.sesId
    ]);
    
    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarMensajeria = async (id,body)=>{

    const query = `CALL USP_UPD_INS_MENSAJERIA(?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.asunto,
        body.descripcion,
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarMensajeria = async(id,tabla,sesId)=>{
    const query = `CALL USP_SEL_VERLISTAID(?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        tabla,
        sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Exito!'
    }; 
    
}

const listarMensajeria = async (id, tabla,sesId)=>{
    const query = `CALL USP_SEL_VERLISTA(?, ?, ?)`;
    const row =  await pool.query(query,
    [
        id,
        tabla,
        sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Exito!'
    }; 
}


const eliminarMensajeria = async(id,tabla)=>{
    const query = `CALL USP_DEL_ELIMINA(?, ?)`;
    const row =  await pool.query(query,
    [
        id,
        tabla
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro eliminado!'
    }; 
    
}

const estadoMensajeria = async(id,tabla)=>{
    const query = `CALL USP_UPD_ESTADO(?, ?)`;
    const row =  await pool.query(query,
    [
        id,
        tabla
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro eliminado!'
    }; 
    
}

const enviarCorreo = async(body)=>{
    const query = `CALL USP_UPD_INS_DETALLE(?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        body.id,
        0,
        body.asunto,
        0,
        'mensajeria',
        body.sesId
    ]);

    for(var m=0;m<row[0].length;m++){
        rutaImagen='/imagenes/mensajeria/MEN_'+body.id+"_"+body.imagen;
        const mensaje =mensajeCorreoMasivo({cliente:row[0][m].NOMBRE+" "+row[0][m].APELLIDO_PATERNO, asunto:body.asunto,rutaImagen:rutaImagen});
        //enviaEmail(row[0][0].CORREO_CLIENTE,'Ticket de atención', mensaje,ruta,'TK_'+row[0][m].ID_ATENCION+'_ticket.pdf');
        requestEmail(row[0][m].EMAIL,'!Aviso Importante¡', mensaje);
    }
    return { 
        resultado : true,
        //info : row[0][0],
        mensaje : '¡Exito!'
    }; 
    
}


const enviarWhatsapp = async(body)=>{
    const query2 = `CALL USP_SEL_VERLISTAID(?, ?, ?)`;
    const row2 = await pool.query(query2,
    [
        body.sucursal,
        'sucursal',
        body.sesId
    ]);
    info2=row2[0][0];

    const query = `CALL USP_SEL_VERLISTA(?, ?, ?)`;
    const row = await pool.query(query,
    [
        body.sucursal,
        'cliente_wp',
        body.sesId
    ]);
    info=row[0];

    const iconos = [
    '🎁', '🚀', '✨', '🔥', '💡', '🌟', '💎', '🎯', '🏆', '🎉',
    '🎊', '🎈', '🎂', '🍰', '🧁', '🍩', '🍪', '🍫', '🍬', '🍭',
    '🍦', '🍧', '🍨', '🍓', '🍒', '🍑', '🍍', '🥭', '🍇', '🍉',
    '☀️', '🌈', '⚡️', '❄️', '🔮', '🧿', '🎪', '🎭', '🎨', '🎬',
    '🎤', '🎧', '🎸', '🎺', '🎲', '🎮', '🕹️', '🧩', '🧸', '🪄',
    '💌', '💥', '💯', '💪', '👑', '🐱', '🐶', '🦄', '🐲', '🐻',
    '🦋', '🐝', '🦚', '🦜', '🐧', '🐬', '🐳', '🐙', '🐠', '🐡',
    '🌺', '🌻', '🌹', '🌷', '🌸', '🍀', '🌿', '🌱', '🍁', '🍄',
    '🍕', '🍔', '🥪', '🍟', '🌭', '🥙', '🥗', '🍜', '🍣', '🥟',
    '⚽️', '🏀', '🎾', '🏈', '🏐', '🏓', '🥊', '🏹', '🪂', '⛷️'
    ];

    if(info.length>0){
        if(info2.NRO_WHATSAPP!==null || info2.NRO_WHATSAPP!=''){
            let senderGen=info2.NRO_WHATSAPP;
            //let senderGen='51963754038';
            
            for (let i = 0; i < info.length; i++) {
            //for (var i = 0; i < 3; i++) {
                let messageGen=body.asunto+' *'+info[i].CLIENTE+'*\n'+body.descripcion+' '+iconos[i];
                let body2={
                        phone:'51'+info[i].NRO_CELULAR,
                        //phone:'51963754038',
                        message: messageGen,
                        sender: senderGen,
                    }
                try {
                    await axios.post(config.URL_WHATSAPP,body2);
                    await axios.delete(config.URL_SISTEMA+'/api/cliente/eliminar_wp/'+info[i].ID);
                    console.log(`Mensaje enviado a ${info[i].CLIENTE} (${i + 1}/${info.length})`);
                }catch (error) {
                    console.error(`Error enviando mensaje a ${info[i].CLIENTE}:`, error);
                }

                // Esperar 10 segundos antes del siguiente envío (excepto en el último)
                await new Promise(r => setTimeout(r, 180000 ));
            }
        }
    }
    return { 
        resultado : true,
        mensaje : '¡Exito!'
    };   
}

module.exports = {
    crearMensajeria,
    editarMensajeria,
    buscarMensajeria,
    listarMensajeria,
    estadoMensajeria,
    eliminarMensajeria,
    enviarCorreo,
    enviarWhatsapp
}

