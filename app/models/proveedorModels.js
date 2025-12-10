const pool = require('../config/connections');

const crearProveedor = async (body)=>{
    const query = `CALL USP_UPD_INS_PROVEEDOR(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        body.nombre,
        body.razon,
        (body.direccion=='')?null:body.direccion,  
        (body.fijo=='')?null:body.fijo, 
        (body.celular=='')?null:body.celular,
        body.ruc, 
        (body.email=='')?null:body.email, 
        'crea',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarProveedor = async (id,body)=>{

    const query = `CALL USP_UPD_INS_PROVEEDOR(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.nombre,
        body.razon,
        (body.direccion=='')?null:body.direccion,  
        (body.fijo=='')?null:body.fijo, 
        (body.celular=='')?null:body.celular,
        body.ruc, 
        (body.email=='')?null:body.email, 
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarProveedor = async(id,tabla,sesId)=>{
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

const listarProveedor = async (id, tabla,sesId)=>{
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


const eliminarProveedor = async(id,tabla)=>{
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

const estadoProveedor = async(id,tabla)=>{
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
    crearProveedor,
    editarProveedor,
    buscarProveedor,
    listarProveedor,
    estadoProveedor,
    eliminarProveedor
}

