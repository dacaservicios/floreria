const pool = require('../config/connections');
const moment = require('moment');
const config = require('../config/config');
const axios = require('axios');

const crearReserva = async (body)=>{
    const query = `CALL USP_UPD_INS_RESERVA(?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        body.cliente,
        body.empleado,
        moment(body.fechaReserva+" "+body.horaReserva,'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm'),
        (body.comentario=='')?null:body.comentario,
        'crea',
        body.sesId
    ]);

    if((row[0][0].CEL_CLIENTE!==null || row[0][0].CEL_CLIENTE!='') &&  row[0][0].NRO_WHATSAPP!==null){
    moment.locale('es');

    let body2={
            phone:'51993981761',//+row[0][0].CEL_CLIENTE,
            message:`
🧔‍♂️💈 ¡Hola, ${row[0][0].CLIENTE}!
Tu reserva en nuestra barbería ha sido *registrada con éxito*. ✂️

📅 *Fecha:* ${moment(row[0][0].FECHA_RESERVA).format('dddd, DD [de] MMMM [del] YYYY')}
🕒 *Hora:* ${moment(row[0][0].FECHA_RESERVA).format('hh:mm A')}

📍 Te esperamos puntualmente para darte el mejor servicio.
Si deseas modificar o cancelar tu cita, contáctanos con anticipación. 📲

¡Gracias por elegirnos! 🙌`.trim(),
            sender: '51963754038'//row[0][0].NRO_WHATSAPP,
        }

    await axios.post(config.URL_WHATSAPP,body2);
    }
    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarReserva = async (id,body)=>{

    const query = `CALL USP_UPD_INS_RESERVA(?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.cliente,
        body.empleado,
        moment(body.fechaReserva+" "+body.horaReserva,'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm'),
        (body.comentario=='')?null:body.comentario,
        'edita',
        body.sesId
    ]);

    if((row[0][0].CEL_CLIENTE!==null || row[0][0].CEL_CLIENTE!='') &&  row[0][0].NRO_WHATSAPP!==null){
    moment.locale('es');

    let body2={
            phone:'51'+row[0][0].CEL_CLIENTE,
            message:`
🧔‍♂️💈 ¡Hola, ${row[0][0].CLIENTE}!
Tu reserva en nuestra barbería ha sido *modificada con éxito*. ✂️

📅 *Nueva fecha:* ${moment(row[0][0].FECHA_RESERVA).format('dddd, DD [de] MMMM [del] YYYY')}
🕒 *Nueva hora:* ${moment(row[0][0].FECHA_RESERVA).format('hh:mm A')}

📍 ¡Gracias por avisarnos! Te esperamos con la misma energía de siempre. 💈
Si necesitas volver a cambiar tu cita, contáctanos con anticipación. 📲`.trim(),
            sender: row[0][0].NRO_WHATSAPP,
        }

    await axios.post(config.URL_WHATSAPP,body2);
    }

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const editarReservaDD = async (id,body)=>{
    const query = `CALL USP_UPD_INS_RESERVA(?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        0,
        0,
        moment(body.fecha).format('YYYY-MM-DD HH:mm:00.0000'),
        0,
        'editaDD',
        body.sesId
    ]);

    if((row[0][0].CEL_CLIENTE!==null || row[0][0].CEL_CLIENTE!='') &&  row[0][0].NRO_WHATSAPP!==null){
    moment.locale('es');

    let body2={
            phone:'51'+row[0][0].CEL_CLIENTE,
            message:`
🧔‍♂️💈 ¡Hola, ${row[0][0].CLIENTE}!
Tu reserva en nuestra barbería ha sido *modificada con éxito*. ✂️

📅 *Nueva fecha:* ${moment(row[0][0].FECHA_RESERVA).format('dddd, DD [de] MMMM [del] YYYY')}
🕒 *Nueva hora:* ${moment(row[0][0].FECHA_RESERVA).format('hh:mm A')}

📍 ¡Gracias por avisarnos! Te esperamos con la misma energía de siempre. 💈
Si necesitas volver a cambiar tu cita, contáctanos con anticipación. 📲`.trim(),
            sender: row[0][0].NRO_WHATSAPP,
        }

    await axios.post(config.URL_WHATSAPP,body2);
    }

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarReserva = async(id,tabla,sesId)=>{
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

const listarReserva = async (id, tabla,sesId)=>{
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


const eliminarReserva = async(id,tabla)=>{
    const query = `CALL USP_DEL_ELIMINA(?, ?)`;
    const row =  await pool.query(query,
    [
        id,
        tabla
    ]);

    if((row[0][0].CEL_CLIENTE!==null || row[0][0].CEL_CLIENTE!='') &&  row[0][0].NRO_WHATSAPP!==null){
    moment.locale('es');

    let body2={
            phone:'51'+row[0][0].CEL_CLIENTE,
            message:`
❌ ¡Hola, ${row[0][0].CLIENTE}!
Hemos recibido tu solicitud de *cancelación de reserva*.

📅 *Fecha cancelada:* ${moment(row[0][0].FECHA_RESERVA).format('dddd, DD [de] MMMM [del] YYYY')}
🕒 *hora:* ${moment(row[0][0].FECHA_RESERVA).format('hh:mm A')}

⚠️ Esperamos verte en otra ocasión.
Cuando quieras agendar una nueva cita, estamos a tu disposición. 💈
¡Gracias por avisarnos! 🙏`.trim(),
            sender: row[0][0].NRO_WHATSAPP,
        }

    await axios.post(config.URL_WHATSAPP,body2);
    }

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro eliminado!'
    }; 
    
}

const estadoReserva = async(id,tabla)=>{
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

module.exports = {
    crearReserva,
    editarReserva,
    editarReservaDD,
    buscarReserva,
    listarReserva,
    estadoReserva,
    eliminarReserva
}

