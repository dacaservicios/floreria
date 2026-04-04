const pool = require('../config/connections');

const crearProductoCompuesto = async (body)=>{
    const query = `CALL USP_UPD_INS_PRODUCTO_COMPUESTO(?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        body.idPadre,
        body.producto,
        body.cantidad,
        'crea',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarProductoCompuesto = async (id,body)=>{

    const query = `CALL USP_UPD_INS_PRODUCTO_COMPUESTO(?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.idPadre,
        body.producto,
        body.cantidad,
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarProductoCompuesto = async(id,tabla,sesId)=>{
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

const listarProductoCompuesto = async (id, tabla,sesId)=>{
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


const eliminarProductoCompuesto = async(id,tabla)=>{
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

const estadoProductoCompuesto = async(id,tabla)=>{
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
    crearProductoCompuesto,
    editarProductoCompuesto,
    buscarProductoCompuesto,
    listarProductoCompuesto,
    estadoProductoCompuesto,
    eliminarProductoCompuesto
}

