const pool = require('../config/connections');
const moment = require('moment');

const crearVenta = async (body)=>{
    const query = `CALL USP_UPD_TRS_VENTA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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

const crearVentaDetalle = async (body)=>{
    query = `CALL USP_UPD_TRS_VENTA_DETALLE(?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const row= await pool.query(query,
    [
        0,
        body.idVenta,
        body.idProductoSucursal,
        body.cantidad,
        body.precioVenta,
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

const editarVenta = async (id,body)=>{
    const query = `CALL USP_UPD_TRS_VENTA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.cliente,
        body.comprobante,
        body.tipoPago,
        1,
        0,
        0,
        0,
        body.descuento,
        body.comentario,
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

const editarVentaDetalle = async (id,body)=>{
    query = `CALL USP_UPD_TRS_VENTA_DETALLE(?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const row= await pool.query(query,
    [
        id,
        0,
        0,
        body.cantidad,
        body.descuento,
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

const corrigeVenta = async (body)=>{
    const query = `CALL USP_UPD_TRS_VENTA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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

const filtrarVenta = async (body)=>{
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
        moment(body.fechaInicio,'DD-MM-YYYY').format('YYYY-MM-DD'),
        moment(body.fechaFin,'DD-MM-YYYY').format('YYYY-MM-DD'),
        null,
        null,
        'reporteVentasPorFecha',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Listado correcto!'
    }; 
}

const filtrarVenta2 = async (body)=>{
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
        'reporteVentasPorFechaDesagregado',",", 
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
        'reporteVentasPorFechaDesagregado',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Listado correcto!'
    }; 
}

const listarVentaInicio = async (sesId,tipo)=>{
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

const buscarVenta = async(id,tabla,sesId)=>{
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

const listarVenta = async (id, tabla,sesId)=>{
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


const eliminarVenta = async(id,tabla)=>{
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

const estadoVenta = async(id,body)=>{
    const query = `CALL USP_UPD_INS_DETALLE(?, ?, ?, ? ,?)`;
    const row =  await pool.query(query,
    [
        id,
        0,
        body.motivo,
        'venta',
        body. sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro eliminado!'
    }; 
    
}


const claveSupervisor = async (codigo,sesId)=>{ 
    const query = `CALL USP_UPD_INS_REGISTRO(?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        0,
        0,
        0,
        codigo,
        13,
        0,
        0
    ]);
    
    if(row[0][0]=== undefined){
       return { 
            resultado : false,
            mensaje : '¡La clave es incorrecta!',
            autorizado: false
        }; 
    }else{
        return{
            resultado : true,
            mensaje : '¡La clave es correcta!',
            autorizado: true
        };  
    }

}

module.exports = {
    crearVenta,
    crearVentaDetalle,
    editarVenta,
    editarVentaDetalle,
    corrigeVenta,
    filtrarVenta,
    filtrarVenta2,
    listarVentaInicio,
    buscarVenta,
    listarVenta,
    estadoVenta,
    eliminarVenta,
    claveSupervisor
}

