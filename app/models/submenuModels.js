const pool = require('../config/connections');

const crearSubmenu = async (body)=>{
    const query = `CALL USP_UPD_INS_SUBMENU(?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        (body.descripcion=='')?null:body.descripcion,
        body.nombre,
        body.ruta,
        body.orden,   
        'crea',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarSubmenu = async (id,body)=>{
    const query = `CALL USP_UPD_INS_SUBMENU(?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        (body.descripcion=='')?null:body.descripcion,
        body.nombre,
        body.ruta,
        body.orden,  
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarSubmenu = async(id,tabla,sesId)=>{
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

const listarSubmenu = async (id, tabla,sesId)=>{
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


const eliminarSubmenu = async(id,tabla)=>{
    const query = `CALL USP_DEL_ELIMINA(?, ?)`;
    const row= await pool.query(query,
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

const estadoSubmenu = async(id,tabla)=>{
    const query = `CALL USP_UPD_ESTADO(?, ?)`;
    const row= await pool.query(query,
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

const crearSubmenuDetalle = async (body)=>{
    const query = `CALL USP_UPD_INS_DETALLE(?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        body.idP,
        body.idDet, 
        0,  
        'submenuOpcion',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

module.exports = {
    crearSubmenu,
    editarSubmenu,
    buscarSubmenu,
    listarSubmenu,
    estadoSubmenu,
    eliminarSubmenu,
    crearSubmenuDetalle
}

