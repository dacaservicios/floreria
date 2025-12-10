const pool = require('../config/connections');
const moment = require('moment');

const crearCompra = async (body)=>{
    const query = `CALL USP_UPD_TRS_COMPRA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        (body.idCliente==0)?null:parseInt(body.idCliente),
        (body.idMesa==0)?null:parseInt(body.idMesa),
        null,
        null,
        null,
        body.estadoCompra,
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

const editarCompra = async (id,body)=>{

    const query = `CALL USP_UPD_TRS_COMPRA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        (body.idCliente==0)?null:parseInt(body.idCliente),
        (body.idMesa==0)?null:parseInt(body.idMesa),
        null,
        null,
        null,
        body.estadoCompra,
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

const corrigeCompra = async (body)=>{
    const query = `CALL USP_UPD_TRS_COMPRA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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

const filtrarCompra = async (body)=>{
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
        'reporteComprasPorFecha',",", 
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
        'reporteComprasPorFecha',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Listado correcto!'
    }; 
}

const filtrarCompra2 = async (body)=>{
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
        'reporteComprasPorFechaDesagregado',",", 
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
        'reporteComprasPorFechaDesagregado',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Listado correcto!'
    }; 
}

const filtrarCompraInicio = async (sesId,tipo)=>{
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
        'reporteComprasPorFecha',",", 
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

const buscarCompra = async(id,tabla,sesId)=>{
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

const listarCompra = async (id, tabla,sesId)=>{
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


const eliminarCompra = async(id,tabla)=>{
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

const estadoCompra = async(id,body)=>{
    const query = `CALL USP_UPD_INS_DETALLE(?, ?, ?, ? ,?)`;
    const row =  await pool.query(query,
    [
        id,
        0,
        body.motivo,
        'compra',
        body. sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro eliminado!'
    }; 
    
}

module.exports = {
    crearCompra,
    editarCompra,
    corrigeCompra,
    filtrarCompra,
    filtrarCompra2,
    filtrarCompraInicio,
    buscarCompra,
    listarCompra,
    estadoCompra,
    eliminarCompra
}

