const pool = require('../config/connections');

const crearZona = async (body)=>{
    const query = `CALL USP_UPD_INS_ZONA(?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        body.nombre,
        (body.descripcion=='')?null:body.descripcion,  
        body.mesas,
        'crea',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarZona = async (id,body)=>{

    const query = `CALL USP_UPD_INS_ZONA(?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.nombre,
        (body.descripcion=='')?null:body.descripcion, 
        body.mesas,
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarZona = async(id,tabla,sesId)=>{
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

const listarZona = async (id, tabla,sesId)=>{
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


const eliminarZona = async(id,tabla)=>{
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

const estadoZona = async(id,tabla)=>{
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
    crearZona,
    editarZona,
    buscarZona,
    listarZona,
    estadoZona,
    eliminarZona
}

