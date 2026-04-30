const pool = require('../config/connections');
const moment = require('moment');

const crearEmpleado = async (body)=>{
    const query = `CALL USP_UPD_INS_EMPLEADO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        body.nombre,
        (body.apellidoPaterno=='')?null:body.apellidoPaterno,
        (body.apellidoMaterno=='')?null:body.apellidoMaterno,
        (body.tipoEmpleado=='')?null:body.tipoEmpleado,
        (body.tipoDocumento=='')?null:body.tipoDocumento,
        (body.documento=='')?null:body.documento,
        (body.direccion=='')?null:body.direccion,
        (body.fechaNacimiento=='')?null:moment(body.fechaNacimiento,'DD-MM-YYYY').format('YYYY-MM-DD'),
        moment(body.fechaIngreso,'DD-MM-YYYY').format('YYYY-MM-DD'),
        (body.celular=='')?null:body.celular, 
        (body.email=='')?null:body.email,
        body.color,
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

const editarEmpleado = async (id,body)=>{

    const query = `CALL USP_UPD_INS_EMPLEADO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.nombre,
        (body.apellidoPaterno=='')?null:body.apellidoPaterno,
        (body.apellidoMaterno=='')?null:body.apellidoMaterno,
        (body.tipoEmpleado=='')?null:body.tipoEmpleado,
        (body.tipoDocumento=='')?null:body.tipoDocumento,
        (body.documento=='')?null:body.documento,
        (body.direccion=='')?null:body.direccion,
        (body.fechaNacimiento=='')?null:moment(body.fechaNacimiento,'DD-MM-YYYY').format('YYYY-MM-DD'),
        moment(body.fechaIngreso,'DD-MM-YYYY').format('YYYY-MM-DD'),
        (body.celular=='')?null:body.celular, 
        (body.email=='')?null:body.email,
        body.color,
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

const buscarEmpleado = async(id,tabla,sesId)=>{
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

const listarEmpleado = async (id, tabla,sesId)=>{
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


const eliminarEmpleado = async(id,tabla)=>{
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

const estadoEmpleado = async(id,tabla)=>{
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
    crearEmpleado,
    editarEmpleado,
    buscarEmpleado,
    listarEmpleado,
    estadoEmpleado,
    eliminarEmpleado
}

