const pool = require('../config/connections');
const moment = require('moment');

const filtrarReporte = async (body)=>{
    const query = `CALL USP_UPD_INS_REPORTE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        (body.dato1=='')?null:body.dato1,
        (body.dato2=='')?null:body.dato2,
        null,
        null,
        null, 
        null,
        null, 
        null, 
        moment(body.fechaInicio,'DD-MM-YYYY').format('YYYY-MM-DD'),
        moment(body.fechaFin,'DD-MM-YYYY').format('YYYY-MM-DD'),
        body.tipo,
        body.sesId
    ]);
    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Listado correcto!'
    }; 
}

const filtrarReporteInicio = async (sesId,tipo)=>{
    const query = `CALL USP_UPD_INS_REPORTE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
        tipo,
        sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Listado correcto!'
    }; 
}

module.exports = {
    filtrarReporte,
    filtrarReporteInicio
}

