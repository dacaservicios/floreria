const pool = require('../config/connections');

const crearTipoempleado = async (body)=>{
    const query = `CALL USP_UPD_INS_TIPO_EMPLEADO(?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        body.nombre,
        (body.descripcion=='')?null:body.descripcion,  
        'crea',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarTipoempleado = async (id,body)=>{

    const query = `CALL USP_UPD_INS_TIPO_EMPLEADO(?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.nombre,
        (body.descripcion=='')?null:body.descripcion, 
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarTipoempleado = async(id,tabla,sesId)=>{
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

const listarTipoempleado = async (id, tabla,sesId)=>{
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


const eliminarTipoempleado = async(id,tabla)=>{
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

const estadoTipoempleado = async(id,tabla)=>{
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
    crearTipoempleado,
    editarTipoempleado,
    buscarTipoempleado,
    listarTipoempleado,
    estadoTipoempleado,
    eliminarTipoempleado
}

