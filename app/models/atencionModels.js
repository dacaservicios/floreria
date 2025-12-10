const pool = require('../config/connections');
const moment = require('moment');
const path = require('path');
const {enviaEmail} = require('../config/email');
//const {requestEmail} = require('../config/mailjet');
const {mensajeEnvioCorreoTicket} = require('../html/inicioMensaje');
const axios = require('axios');
const config = require('../config/config');

const crearAtencion = async (body)=>{
    const query = `CALL USP_UPD_TRS_ATENCION(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        null,
        null,
        null,
        null,
        null,
        0,
        0,
        0,
        0,
        0,
        null,
        null,
        'crea',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarAtencion = async (id,body)=>{
    const query = `CALL USP_UPD_TRS_ATENCION(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.cliente,
        body.comprobante,
        body.tipoPago,
        null,
        null,
        1,
        0,
        0,
        0,
        0,
        null,
        null,
        'cierre',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarAtencion = async(id,tabla,sesId)=>{
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

const listarAtencion = async (id, tabla,sesId)=>{
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

const listarAtencionInicio = async (sesId,tipo)=>{
    const query = `CALL USP_UPD_INS_TABLA_DINAMICA (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        null,
        null,
        null,
        null,
        null, 
        null,
        null, 
        null, 
        moment().format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
        null,
        null,
        tipo,
        sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Listado correcto!'
    }; 
}

const enviarCorreo = async(body)=>{
    const query = `CALL USP_SEL_VERLISTAID(?, ?, ?)`;
    const row = await pool.query(query,
    [
        body.id,
        'atencion',
        body.sesId
    ]);

    const ruta=path.join(__dirname,'../public/pdf/ticket/TK_'+row[0][0].ID_ATENCION+'_ticket.pdf');
    
    const mensaje =mensajeEnvioCorreoTicket({cliente:row[0][0].NOMBRE_CLIENTE+" "+row[0][0].PATERNO_CLIENTE});
    enviaEmail(row[0][0].CORREO_CLIENTE,'Ticket de atención', mensaje,ruta,'TK_'+row[0][0].ID_ATENCION+'_ticket.pdf');
    //requestEmail(body.email,'Bienvenido nuevo usuario', mensaje);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Exito!'
    }; 
    
}

const enviarWhatsapp = async(body)=>{
    const query = `CALL USP_SEL_VERLISTAID(?, ?, ?)`;
    const row = await pool.query(query,
    [
        body.id,
        'whatsapp',
        body.sesId
    ]);

    if((row[0][0].NRO_CELULAR!==null || row[0][0].NRO_CELULAR!='') && row[0][0].NRO_WHATSAPP!==null){
        const url=config.URL_SISTEMA+'/pdf/ticket/TK_'+row[0][0].ID_ATENCION+'_ticket.pdf';
        let body2={
                    phone:'51'+row[0][0].NRO_CELULAR,
                    url:url,
                    caption:`⭐Estimado `+row[0][0].NOMBRE_CLIENTE+` 🙂, Se envia su comprobante 📃, gracias por su preferencia ♥.`,
                    sender: row[0][0].NRO_WHATSAPP,
                }
    
        await axios.post(config.URL_WHATSAPP3,body2);
    }
    
    /*return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Exito!'
    }; */
    
}

const crearAtencionDetalle = async (body)=>{
    query = `CALL USP_UPD_TRS_ATENCION_DETALLE(?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const row= await pool.query(query,
    [
        0,
        body.idAtencion,
        body.idServicioSucursal,
        body.cantidad,
        body.precioAtencion,
        null,
        'crea',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarAtencionDetalle = async (id,body)=>{
    query = `CALL USP_UPD_TRS_ATENCION_DETALLE(?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const row= await pool.query(query,
    [
        id,
        0,
        0,
        body.cantidad,
        body.precioAtencion,
        (body.comentario===null)?'':body.comentario,
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const eliminarAtencion = async(id,tabla)=>{
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


module.exports = {
    crearAtencion,
    buscarAtencion,
    enviarCorreo,
    listarAtencion,
    enviarWhatsapp,
    listarAtencionInicio,
    crearAtencionDetalle,
    editarAtencionDetalle,
    eliminarAtencion,
    editarAtencion
}

