const pool = require('../config/connections');
const {enviaEmail} = require('../config/email');
const {mensajeStock} = require('../html/inicioMensaje');
const config = require('../config/config');

const crearPedidodetalle = async (body)=>{
    /*console.log('CALL USP_UPD_TRS_VENTA_DETALLE (',0,",",
        body.idVenta,",",
        body.idProductoSucursal,",",
        null,",",
        body.monto,",", 
        null,",",
        'crea',",", 
        body.sesId,')')
        return*/
  
    query = `CALL USP_UPD_TRS_VENTA_DETALLE(?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const row= await pool.query(query,
    [
        0,
        body.idVenta,
        body.idProductoSucursal,
        body.cantidad,
        body.monto,
        (body.comentario=='')?null:body.comentario,
        'crea',
        body.sesId
    ]);

    if(row[0][0].STOCK<=5){
        const mensaje =mensajeStock({producto:row[0][0].PRODUCTO,stock:row[0][0].STOCK,abreviatura:row[0][0].ABREVIATURA_UNIDAD});
        enviaEmail(config.EMAIL,'Producto por agotarse', mensaje,'','');
    }

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const crearPedidodetallePago = async (body)=>{
    /*console.log('CALL USP_UPD_TRS_VENTA_DETALLE (',0,",",
        body.idVenta,",",
        body.idProductoSucursal,",",
        null,",",
        body.monto,",", 
        null,",",
        'crea',",", 
        body.sesId,')')
        return*/
    
    const query = `CALL USP_UPD_INS_PAGO(?, ?, ?, ?, ?,?)`;
    const row= await pool.query(query,
    [
        0,
        body.idVenta,
        body.tipoPago,
        body.montoRecibido,
        'crea',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarPedidodetalle = async (id,body)=>{
    /*console.log('CALL USP_UPD_TRS_VENTA_DETALLE (',id,",",
        null,",",
        null,",",
        (body.cantidad==0)?null:body.cantidad,",",
        null,",", 
        (body.comentario==0)?null:body.comentario,",",
        'edita',",", 
        body.sesId,')')
        return*/

    query = `CALL USP_UPD_TRS_VENTA_DETALLE(?, ?, ?, ?, ?, ?, ?, ?)`;

    const row = await pool.query(query,
    [
        id,
        null,
        null,
        (body.cantidad==0)?null:body.cantidad,
        (body.monto==0)?null:body.monto,
        (body.comentario=='')?null:body.comentario,
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}


const buscarPedidodetalle = async(id,tabla,sesId)=>{
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

const listarPedidodetalle = async (id, tabla,sesId)=>{
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


const eliminarPedidodetalle = async(id,tabla)=>{
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

const estadoPedidodetalle = async(id,tabla)=>{
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


const crearPedidoDetalle = async (body)=>{
    /*console.log('CALL USP_UPD_INS_DETALLE (',body.idP,",",
        body.idDet,",",
        0,",",
        `'estadoAtendido'`,",",
        body.sesId,')')
        return*/
        
    const query = `CALL USP_UPD_INS_DETALLE(?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        body.idP,
        body.idDet, 
        0,  
        body.tipo,
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Registro creado!'
    }; 
}

module.exports = {
    crearPedidodetalle,
    crearPedidodetallePago,
    editarPedidodetalle,
    buscarPedidodetalle,
    listarPedidodetalle,
    estadoPedidodetalle,
    eliminarPedidodetalle,
    crearPedidoDetalle
}

