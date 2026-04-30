const pool = require('../config/connections');
const moment = require('moment');

const crearCompra = async (body)=>{
    const query = `CALL USP_UPD_TRS_COMPRA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        null,
        null,
        null,
        0,
        0,
        0,
        0,
        0,
        'crea',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const crearCompraDetalle = async (body)=>{
    query = `CALL USP_UPD_TRS_COMPRA_DETALLE(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const row= await pool.query(query,
    [
        0,
        body.idProducto,
        body.idCompra,
        body.cantidad,
        0,
        0,
        0,
        '',
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
    const query = `CALL USP_UPD_TRS_COMPRA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.tipoPago,
        body.comentario,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        1,
        0,
        0,
        0,
        body.proveedor,
        'cierre',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const editarCompra2 = async (id,body)=>{
    const query = `CALL USP_UPD_TRS_COMPRA2(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.tipoPago,
        body.comentario,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        1,
        body.comprobante,
        body.serie,
        body.numero,
        body.proveedor,
        'cierre',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const editarCompraDetalle = async (id,body)=>{
    query = `CALL USP_UPD_TRS_COMPRA_DETALLE(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const row= await pool.query(query,
    [
        id,
        0,
        0,
        body.cantidad,
        body.precioCompra,
        body.precioVenta,
        null,
        body.comentario,
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const corrigeCompra = async (body)=>{
    const query = `CALL USP_UPD_TRS_COMPRA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        body.id,
        body.idCliente,
        null,
        null,
        body.tipoDocumento,
        null,
        null,
        null,
        null,
        null,
        0,
        null,
        null,
        null,
        null,
        null,
        null,
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
        moment(body.fechaInicio,'DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss'),
        moment(body.fechaFin,'DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss'),
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
        moment(body.fechaInicio,'DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss'),
        moment(body.fechaFin,'DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss'),
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

const listarCompraInicio = async (sesId,tipo)=>{
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
        moment().format('YYYY-MM-DD HH:mm:ss'),
        moment().format('YYYY-MM-DD HH:mm:ss'),
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
    const query = `CALL USP_UPD_INS_DETALLE(?, ?, ?, ? ,?, ?)`;
    const row =  await pool.query(query,
    [
        id,
        0,
        body.comentario,
        body.abrevBoton,
        body.tabla,
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro actualizado!'
    }; 
    
}

const estadoCompra2 = async(id,body)=>{
    const query = `CALL USP_UPD_INS_DETALLE2(?, ?, ?, ? ,?, ?,?, ?, ?)`;
    const row =  await pool.query(query,
    [
        id,
        body.idDetalle,
        body.dato1,
        body.dato2,
        body.dato3,
        body.dato4,
        body.dato5,
        body.tabla,
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro actualizado!'
    }; 
    
}

module.exports = {
    crearCompra,
    crearCompraDetalle,
    editarCompra,
    editarCompra2,
    editarCompraDetalle,
    corrigeCompra,
    filtrarCompra,
    filtrarCompra2,
    listarCompraInicio,
    buscarCompra,
    listarCompra,
    estadoCompra,
    estadoCompra2,
    eliminarCompra
}

