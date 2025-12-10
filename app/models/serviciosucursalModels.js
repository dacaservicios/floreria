const pool = require('../config/connections');

const crearServiciosucursal = async (body)=>{
    const query = `CALL USP_UPD_TRS_SERVICIO_SUCURSAL(?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        body.servicio,
        body.precio,
        'crea',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarServiciosucursal = async (id,body)=>{

    const query = `CALL USP_UPD_TRS_SERVICIO_SUCURSAL(?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.servicio,
        body.precio,
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarServiciosucursal = async(id,tabla,sesId)=>{
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

const listarServiciosucursal = async (id, tabla,sesId)=>{
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

const autocompletaServiciosucursal = async (servicio, tabla,sesId)=>{
    const query = `CALL USP_UPD_INS_DETALLE(?, ?, ?, ?, ?)`;
    const row =  await pool.query(query,
    [
        0,
        0,
        servicio,
        tabla,
        sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Exito!'
    }; 
}

const eliminarServiciosucursal = async(id,tabla)=>{
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

const estadoServiciosucursal = async(id,tabla)=>{
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
    crearServiciosucursal,
    editarServiciosucursal,
    buscarServiciosucursal,
    listarServiciosucursal,
    autocompletaServiciosucursal,
    estadoServiciosucursal,
    eliminarServiciosucursal
}

