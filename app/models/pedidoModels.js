const pool = require('../config/connections');
const moment = require('moment');

const crearPedido = async (body)=>{
    const query = `CALL USP_UPD_TRS_PEDIDO(?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        null,
        null,
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

const crearPedidoDetalle = async (body)=>{
    query = `CALL USP_UPD_TRS_PEDIDO_DETALLE(?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        body.idProducto,
        body.idPedido,
        body.cantidad,
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

const editarPedido = async (id,body)=>{
    const query = `CALL USP_UPD_TRS_PEDIDO(?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.comentario,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        1,
        'cierre',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const editarPedidoDetalle = async (id,body)=>{
    query = `CALL USP_UPD_TRS_PEDIDO_DETALLE(?, ?, ?, ?, ?, ?, ?)`;
    
    const row= await pool.query(query,
    [
        id,
        0,
        0,
        body.cantidad,
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

const corrigePedido = async (body)=>{
    const query = `CALL USP_UPD_TRS_PEDIDO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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

const filtrarPedido = async (body)=>{
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
        'reportePedidosPorFecha',",", 
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
        'reportePedidosPorFecha',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Listado correcto!'
    }; 
}

const filtrarPedido2 = async (body)=>{
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
        'reportePedidosPorFechaDesagregado',",", 
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
        'reportePedidosPorFechaDesagregado',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Listado correcto!'
    }; 
}

const listarPedidoInicio = async (sesId,tipo)=>{
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
        'reportePedidosPorFecha',",", 
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

const estadoPedido = async(id,body)=>{
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

const estadoPedido2 = async(id,body)=>{
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
    crearPedido,
    crearPedidoDetalle,
    editarPedido,
    editarPedidoDetalle,
    corrigePedido,
    filtrarPedido,
    filtrarPedido2,
    listarPedidoInicio,
    buscarPedido,
    listarPedido,
    estadoPedido,
    estadoPedido2,
    eliminarPedido
}

