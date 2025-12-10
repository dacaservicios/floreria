const pool = require('../config/connections');
const moment = require('moment');

const crearPedido = async (body)=>{
    const query = `CALL USP_UPD_TRS_VENTA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        (body.idCliente==0)?null:parseInt(body.idCliente),
        (body.idMesa==0)?null:parseInt(body.idMesa),
        (body.idMozo==0)?null:parseInt(body.idMozo),
        null,
        null,
        body.estadoVenta,
        null,
        null,
        parseInt(body.esDelivery),
        0,
        null,
        null,
        null,
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

const editarPedido = async (id,body)=>{
    const query = `CALL USP_UPD_TRS_VENTA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)`;
    const row = await pool.query(query,
    [
        id,
        (body.idCliente==0)?null:parseInt(body.idCliente),
        (body.idMesa==0)?null:parseInt(body.idMesa),
        (body.idMozo=='')?null:parseInt(body.idMozo),
        null,
        null,
        body.estadoVenta,
        null,
        null,
        parseInt(body.esDelivery),
        0,
        null,
        null,
        null,
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

const descuentoPedido = async (id,body)=>{
    const query = `CALL USP_UPD_TRS_VENTA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        (body.descuento=='')?0:body.descuento,
        null,
        null,
        'descuento',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}


const editarPedidoVenta = async (id,body)=>{

const query = `CALL USP_UPD_TRS_VENTA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.idCliente,
        null,
        body.sunat,
        body.tipoDocumento,
        null,
        body.idEstado,
        null,
        null,
        null,
        1,
        null,
        null,
        null,
        null,
        body.comentario,
        moment(body.fechaVenta,'YYYY-MM-DD').format('YYYY-MM-DD'), 
        'cierre',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarPedido = async(id,tabla,sesId)=>{
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

const listarPedido = async (id, tabla,sesId)=>{
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


const eliminarPedido = async(id,tabla)=>{
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

const estadoPedido = async(id,tabla)=>{
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
    crearPedido,
    editarPedido,
    descuentoPedido,
    editarPedidoVenta,
    buscarPedido,
    listarPedido,
    estadoPedido,
    eliminarPedido
}

