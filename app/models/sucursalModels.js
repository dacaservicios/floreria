const pool = require('../config/connections');

const crearSucursal = async (body)=>{
    const query = `CALL USP_UPD_INS_SUCURSAL(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        body.idEmpresa,
        body.nombre,
        (body.direccion=='')?null:body.direccion,  
        (body.fijo=='')?null:body.fijo, 
        (body.celular=='')?null:body.celular,
        body.ruc,
        (body.imagen=='')?null:body.imagen,
        (body.documentos=='')?null:body.documentos,
        'crea',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarSucursal = async (id,body)=>{
    const query = `CALL USP_UPD_INS_SUCURSAL(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.idEmpresa,
        body.nombre,
        (body.direccion=='')?null:body.direccion,  
        (body.fijo=='')?null:body.fijo, 
        (body.celular=='')?null:body.celular,
        body.ruc,
        (body.imagen=='')?null:body.imagen,
        (body.documentos=='')?null:body.documentos,
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarSucursal = async(id,tabla,sesId)=>{
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

const listarSucursal = async (id, tabla,sesId)=>{
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


const eliminarSucursal = async(id,tabla)=>{
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

const estadoSucursal = async(id,tabla)=>{
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

const listarSucursalDetalle = async (id,empresa,sesId)=>{        
    const query = `CALL USP_UPD_INS_DETALLE(?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        id,
        empresa, 
        0,  
        'sucursalDetalle',
        sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Registro creado!'
    }; 
}


module.exports = {
    crearSucursal,
    editarSucursal,
    buscarSucursal,
    listarSucursal,
    listarSucursalDetalle,
    estadoSucursal,
    eliminarSucursal
}

