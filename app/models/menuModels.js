const pool = require('../config/connections');

const crearMenu = async (body)=>{
    const query = `CALL USP_UPD_INS_MENU(?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        body.nombre,
        body.descripcion,
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

const editarMenu = async (id,body)=>{
    const query = `CALL USP_UPD_INS_MENU(?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.nombre,
        body.descripcion,
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

const buscarMenu = async(id,tabla,sesId)=>{
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

const listarMenu = async (id, tabla,sesId)=>{
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


const eliminarMenu = async(id,tabla)=>{
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

const estadoMenu = async(id,tabla)=>{
    const query = `CALL USP_UPD_ESTADO(?, ?)`;
    const row= await pool.query(query,
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

const crearMenuDetalle = async (body)=>{
    /*console.log('CALL USP_UPD_INS_DETALLE (',body.idP,",",
        body.idDet,",",
        0,",",
        `'menuSubmenu'`,",",
        body.sesId,')')
        return*/
        
    const query = `CALL USP_UPD_INS_DETALLE(?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        body.id,
        body.submenu, 
        0,  
        'menuSubmenu',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

module.exports = {
    crearMenu,
    crearMenuDetalle,
    editarMenu,
    buscarMenu,
    listarMenu,
    eliminarMenu,
    estadoMenu
}

