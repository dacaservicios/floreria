const pool = require('../config/connections');

const crearProductosucursal = async (body)=>{
    const query = `CALL USP_UPD_TRS_PRODUCTO_SUCURSAL(?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        body.producto,
        body.stockMin,
        body.stockMax,
        body.precioVenta,
        (body.descuento=='')?0:body.descuento,
        'crea',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarProductosucursal = async (id,body)=>{

    const query = `CALL USP_UPD_TRS_PRODUCTO_SUCURSAL(?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.producto,
        body.stockMin,
        body.stockMax,
        body.precioVenta,
        (body.descuento=='')?0:body.descuento,
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarProductosucursal = async(id,tabla,sesId)=>{
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

const listarProductosucursal = async (id, tabla,sesId)=>{
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

const autocompletaProductosucursal = async (producto,tabla,sesId)=>{
    const query = `CALL USP_UPD_INS_DETALLE(?, ?, ?, ?, ?, ?)`;
    const row =  await pool.query(query,
    [
        0,
        0,
        producto,
        0,
        tabla,
        sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Exito!'
    }; 
}

const buscarCodigoBarra = async (producto,tabla,sesId)=>{
    const query = `CALL USP_UPD_INS_DETALLE(?, ?, ?, ?, ?, ?)`;
    const row =  await pool.query(query,
    [
        0,
        0,
        producto,
        0,
        tabla,
        sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Exito!'
    }; 
}

const eliminarProductosucursal = async(id,tabla)=>{
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

const estadoProductosucursal = async(id,tabla)=>{
    const query = `CALL USP_UPD_ESTADO(?, ?)`;
    const row =  await pool.query(query,
    [
        id,
        tabla
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro actualizado!'
    }; 
    
}

module.exports = {
    crearProductosucursal,
    editarProductosucursal,
    buscarProductosucursal,
    listarProductosucursal,
    autocompletaProductosucursal,
    estadoProductosucursal,
    eliminarProductosucursal,
    buscarCodigoBarra
}

