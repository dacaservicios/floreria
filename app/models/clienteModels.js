const pool = require('../config/connections');
const moment = require('moment');


const crearCliente = async (body)=>{
    const query = `CALL USP_UPD_INS_CLIENTE(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        body.nombre,
        (body.apellidoPaterno=='')?null:body.apellidoPaterno,
        (body.apellidoMaterno=='')?null:body.apellidoMaterno,
        (body.tipoDocumento=='')?null:body.tipoDocumento,
        (body.documento=='')?null:body.documento,
        (body.direccion=='')?null:body.direccion,
        (body.fechaNacimiento=='')?null:moment(body.fechaNacimiento,'DD-MM-YYYY').format('YYYY-MM-DD'),
        (body.celular=='')?null:body.celular, 
        (body.email=='')?null:body.email,
        (body.comentario=='')?null:body.comentario,
        (body.imagen=='')?null:body.imagen,
        'crea',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarCliente = async (id,body)=>{

    const query = `CALL USP_UPD_INS_CLIENTE(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.nombre,
        (body.apellidoPaterno=='')?null:body.apellidoPaterno,
        (body.apellidoMaterno=='')?null:body.apellidoMaterno,
        (body.tipoDocumento=='')?null:body.tipoDocumento,
        (body.documento=='')?null:body.documento,
        (body.direccion=='')?null:body.direccion,
        (body.fechaNacimiento=='')?null:moment(body.fechaNacimiento,'DD-MM-YYYY').format('YYYY-MM-DD'),
        (body.celular=='')?null:body.celular, 
        (body.email=='')?null:body.email,
        (body.comentario=='')?null:body.comentario,
        (body.imagen=='')?null:body.imagen,
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarCliente = async(id,tabla,sesId)=>{
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

const listarCliente = async (id, tabla,sesId)=>{
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


const eliminarCliente = async(id,tabla)=>{
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

const estadoCliente = async(id,tabla)=>{
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
    crearCliente,
    editarCliente,
    buscarCliente,
    listarCliente,
    estadoCliente,
    eliminarCliente
}

