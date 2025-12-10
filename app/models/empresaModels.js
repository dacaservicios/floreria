const pool = require('../config/connections');

const crearEmpresa = async (body)=>{
    const query = `CALL USP_UPD_INS_EMPRESA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        body.nombre,
        body.razon,
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

const editarEmpresa = async (id,body)=>{

    const query = `CALL USP_UPD_INS_EMPRESA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.nombre,
        body.razon,
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

const buscarEmpresa = async(id,tabla,sesId)=>{
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

const listarEmpresa = async (id, tabla,sesId)=>{
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


const eliminarEmpresa = async(id,tabla)=>{
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

const estadoEmpresa = async(id,tabla)=>{
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

const estadoCambiaEmpresa = async (body)=>{       
    const query = `CALL USP_UPD_INS_DETALLE(?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        body.id,
        0, 
        0,  
        'empresa',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

module.exports = {
    crearEmpresa,
    editarEmpresa,
    buscarEmpresa,
    listarEmpresa,
    estadoEmpresa,
    estadoCambiaEmpresa,
    eliminarEmpresa
}

