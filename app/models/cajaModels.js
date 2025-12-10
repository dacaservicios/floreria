const pool = require('../config/connections');

const crearCaja = async (body)=>{
    const query = `CALL USP_UPD_INS_CAJA(?, ?, ?,?, ?, ?,?, ?, ?,?, ?, ?,?, ?)`;
    const row= await pool.query(query,
    [
        0,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        'crea',
        body.sesId
    ]);
    
    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarCaja = async (id,body)=>{

    const query = `CALL USP_UPD_INS_CAJA(?, ?, ?,?, ?, ?,?, ?, ?,?, ?, ?,?, ?)`;
    const row = await pool.query(query,
    [
        id,
        (body.billete200=='')?0:body.billete200,
        (body.billete100=='')?0:body.billete100,
        (body.billete50=='')?0:body.billete50,
        (body.billete20=='')?0:body.billete20,
        (body.billete10=='')?0:body.billete10,
        (body.moneda5=='')?0:body.moneda5,
        (body.moneda2=='')?0:body.moneda2,
        (body.moneda1=='')?0:body.moneda1,
        (body.moneda05=='')?0:body.moneda05,
        (body.moneda02=='')?0:body.moneda02,
        (body.moneda01=='')?0:body.moneda01,  
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarCaja = async(id,tabla,sesId)=>{
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

const listarCaja = async (id, tabla,sesId)=>{
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


const eliminarCaja = async(id,tabla)=>{
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

const estadoCaja = async(id,tabla)=>{
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
    crearCaja,
    editarCaja,
    buscarCaja,
    listarCaja,
    estadoCaja,
    eliminarCaja
}

