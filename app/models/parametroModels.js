const pool = require('../config/connections');

const crearParametro = async (body)=>{
    const query = `CALL USP_UPD_INS_PARAMETRO(?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        body.descripcion,
        body.abreviatura,   
        'crea',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const crearParametroDetalle = async (body)=>{
    const query = `CALL USP_UPD_INS_PARAMETRO_DETALLE(?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        body.id,
        body.descripcionDetalle,
        body.valorDetalle,
        body.abreviaturaDetalle,
        'crea',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarParametro = async (id,body)=>{
    const query = `CALL USP_UPD_INS_PARAMETRO(?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.descripcion,
        body.abreviatura,  
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const editarParametroDetalle = async (body)=>{
    const query = `CALL USP_UPD_INS_PARAMETRO_DETALLE(?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        body.id,
        body.descripcionDetalle,
        body.valorDetalle,
        body.abreviaturaDetalle,
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
}

const editarMiParametroDetalle = async (body)=>{
    const query = `CALL USP_UPD_INS_PARAMETRO_DETALLE(?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        body.id,
        body.descripcionDetalle,
        body.valorDetalle,
        body.abreviaturaDetalle,
        'editaMiParametro',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
}

const buscarParametro = async(id,tabla,sesId)=>{
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

const listarParametro = async (id, tabla,sesId)=>{
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


const eliminarParametro = async(id,tabla)=>{
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

const estadoParametro = async(id,tabla)=>{
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
    crearParametro,
    crearParametroDetalle,
    editarParametro,
    editarParametroDetalle,
    editarMiParametroDetalle,
    buscarParametro,
    listarParametro,
    eliminarParametro,
    estadoParametro
}

