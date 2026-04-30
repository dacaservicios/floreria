const pool = require('../config/connections');
const moment = require('moment');

const crearMovimiento = async (body)=>{
    const query = `CALL USP_UPD_INS_MOVIMIENTO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        body.ubicacion,
        body.concepto,
        body.producto,
        moment(body.fecha+' '+body.hora,'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
        body.motivo,
        body.cantidad,
        body.costo,
        'crea',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarMovimiento = async (id,body)=>{

    const query = `CALL USP_UPD_INS_MOVIMIENTO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.ubicacion,
        body.concepto,
        body.producto,
        moment(body.fecha+' '+body.hora,'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
        body.motivo,
        body.cantidad,
        body.costo,
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarMovimiento = async(id,tabla,sesId)=>{
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

const listarMovimiento = async (id, tabla,sesId)=>{
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


const eliminarMovimiento = async(id,tabla)=>{
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

const estadoMovimiento = async(id,tabla)=>{
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


const filtrarMovimiento = async (body)=>{
    /*console.log('CALL USP_UPD_INS_TABLA_DINAMICA (',null,",",
        null,",",
        null,",",
        null,",",
        null,",",
        null,",",
        null,",",
        null,",",
        moment(body.fechaInicio,'YYYY-MM-DD').format('YYYY-MM-DD'),",",
        moment(body.fechaFin,'YYYY-MM-DD').format('YYYY-MM-DD'),",", 
        null,",",
        null,",",
        'reporteVentasPorFecha',",", 
        body.sesId,')')
        return*/

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
        moment(body.fechaInicio,'DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss'),
        moment(body.fechaFin,'DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss'),
        null,
        null,
        'filtroMovimiento',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Listado correcto!'
    }; 
}


const filtrarMovimientoInicio = async (sesId)=>{
    /*console.log('CALL USP_UPD_INS_TABLA_DINAMICA (',null,",",
        null,",",
        null,",",
        null,",",
        null,",",
        null,",",
        null,",",
        null,",",
        moment(body.fechaInicio,'YYYY-MM-DD').format('YYYY-MM-DD'),",",
        moment(body.fechaFin,'YYYY-MM-DD').format('YYYY-MM-DD'),",", 
        null,",",
        null,",",
        'reporteVentasPorFecha',",", 
        body.sesId,')')
        return*/

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
        moment().format('YYYY-MM-DD HH:mm:ss'),
        moment().format('YYYY-MM-DD HH:mm:ss'),
        null,
        null,
        'filtroMovimiento',
        sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Listado correcto!'
    }; 
}

module.exports = {
    crearMovimiento,
    editarMovimiento,
    buscarMovimiento,
    listarMovimiento,
    estadoMovimiento,
    eliminarMovimiento,
    filtrarMovimiento,
    filtrarMovimientoInicio
}

