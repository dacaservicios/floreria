const pool = require('../config/connections');
const moment = require('moment');

const crearKardex = async (body)=>{
    const query = `CALL USP_UPD_TRS_KARDEX(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        (body.idCliente==0)?null:parseInt(body.idCliente),
        (body.idMesa==0)?null:parseInt(body.idMesa),
        null,
        null,
        null,
        body.estadoKardex,
        null,
        null,
        parseInt(body.esDelivery),
        0,
        null,
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

const editarKardex = async (id,body)=>{

    const query = `CALL USP_UPD_TRS_KARDEX(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        (body.idCliente==0)?null:parseInt(body.idCliente),
        (body.idMesa==0)?null:parseInt(body.idMesa),
        null,
        null,
        null,
        body.estadoKardex,
        null,
        null,
        parseInt(body.esDelivery),
        0,
        null,
        null,
        null, 
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const corrigeKardex = async (body)=>{
    const query = `CALL USP_UPD_TRS_KARDEX(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        body.id,
        body.idCliente,
        0,
        0,
        body.tipoDocumento,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        'corrige',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const filtrarKardex = async (body)=>{
    /*onsole.log('CALL USP_UPD_INS_TABLA_DINAMICA (',null,",",
        body.producto,",",
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
        'reporteKardexsPorFecha',",", 
        body.sesId,')')
        return*/

    const query = `CALL USP_UPD_INS_TABLA_DINAMICA (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        body.producto,
        null,
        null,
        null,
        null, 
        null,
        null, 
        null, 
        moment(body.fechaInicio,'DD-MM-YYYY').format('YYYY-MM-DD'),
        moment(body.fechaFin,'DD-MM-YYYY').format('YYYY-MM-DD'),
        null,
        null,
        'reporteKardexPorFecha',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Listado correcto!'
    }; 
}

const filtrarKardex2 = async (body)=>{
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
        'reporteKardexsPorFechaDesagregado',",", 
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
        moment(body.fechaInicio,'DD-MM-YYYY').format('YYYY-MM-DD'),
        moment(body.fechaFin,'DD-MM-YYYY').format('YYYY-MM-DD'),
        null,
        null,
        'reporteKardexsPorFechaDesagregado',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Listado correcto!'
    }; 
}

const filtrarKardexInicio = async (sesId,tipo)=>{
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
        'reporteKardexsPorFecha',",", 
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

const buscarKardex = async(id,tabla,sesId)=>{
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

const listarKardex = async (id, tabla,sesId)=>{
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


const eliminarKardex = async(id,tabla)=>{
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

const estadoKardex = async(id,body)=>{
    const query = `CALL USP_UPD_INS_DETALLE(?, ?, ?, ? ,?)`;
    const row =  await pool.query(query,
    [
        id,
        0,
        body.motivo,
        'kardex',
        body. sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro eliminado!'
    }; 
    
}

module.exports = {
    crearKardex,
    editarKardex,
    corrigeKardex,
    filtrarKardex,
    filtrarKardex2,
    filtrarKardexInicio,
    buscarKardex,
    listarKardex,
    estadoKardex,
    eliminarKardex
}

