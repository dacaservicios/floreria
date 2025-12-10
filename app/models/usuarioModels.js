const pool = require('../config/connections');
const {encryptPassword, randomPassword} = require('../libs/helpers');
const moment = require('moment');
const path = require('path');
const config = require('../config/config');
const {enviaEmail} = require('../config/email');
//const {requestEmail} = require('../config/mailjet');
const {mensajeCreaUsuario,mensajeReseteaPassword,mensajeReseteaClave} = require('../html/inicioMensaje');
const { passwordAleatorio,claveAleatorio } = require('../middlewares/auth');

const crearUsuario = async (body)=>{
    const nuevaPass=await passwordAleatorio();
    const nuevaClave=await claveAleatorio();
    //const nuevaPass = randomPassword(10);
    //const nuevaPass = body.documento;
    const contrasena = encryptPassword(nuevaPass);
    //const clave = encryptPassword(nuevaClave);

   /*console.log('CALL USP_UPD_INS_USUARIO(',0,",",
        `'${body.apellidoPaterno}'`,",",
        `'${body.apellidoMaterno}'`,",",
        `'${body.nombre1}'`,",",
        (body.nombre2=='')?null:`'${body.nombre2}'`,",",
        body.tipoDocumento,",",
        `'${body.documento}'`,",",
        (body.fechaNacimiento=='')?null:`'${moment(body.fechaNacimiento,'YYYY-MM-DD').format('YYYY-MM-DD')}'`,",",
        `'${body.email}'`,",",
        (body.fijo=='')?null:`'${body.fijo}'`,",",
        `'${body.celular}'`,",",
        body.nivel,",",
        `'crea'`,",",
        `'${body.email}'`,",",
        `'${contrasena}'`,",",
        body.sesId,')')
        return*/

    const query = `CALL USP_UPD_INS_USUARIO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        0,
        body.apellidoPaterno,
        body.apellidoMaterno,
        body.nombre,
        body.tipoDocumento,
        body.documento,
        (body.fijo=='')?null:body.fijo,
        body.celular,
        body.email,
        (body.fechaNacimiento=='')?null:moment(body.fechaNacimiento,'DD-MM-YYYY').format('YYYY-MM-DD'),
        body.nivel,
        (body.imagen=='')?null:body.imagen,
        'crea',
        body.email,
        contrasena,
        (body.nivel!=5)?nuevaClave:0,
        body.sesId
    ]);

    //let laClave=(body.nivel!=5)?nuevaClave:'-';
    let laClave='-'
    const mensaje =mensajeCreaUsuario({usuario:body.CORREOUSUARIO,sucursal:row[0][0].NOMBRE_SUCURSAL,contrasena:nuevaPass,clave:laClave});
    enviaEmail(body.email,'Bienvenido nuevo usuario', mensaje,'','');
    //requestEmail(body.email,'Bienvenido nuevo usuario', mensaje);


    return { 
        resultado : true,
        url: config.URL_SISTEMA,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    };  
}

const editarUsuario = async (id,body)=>{

    /*console.log('CALL USP_UPD_INS_USUARIO(',id,",",
        `'${body.apellidoPaterno}'`,",",
        `'${body.apellidoMaterno}'`,",",
        `'${body.nombre1}'`,",",
        (body.nombre2=='')?null:`'${body.nombre2}'`,",",
        body.tipoDocumento,",",
        `'${body.documento}'`,",",
        (body.fechaNacimiento=='')?null:`'${moment(body.fechaNacimiento,'YYYY-MM-DD').format('YYYY-MM-DD')}'`,",",
        `'${body.email}'`,",",
        (body.fijo=='')?null:`'${body.fijo}'`,",",
        `'${body.celular}'`,",",
        body.nivel,",",
        `'edita'`,",",
        `'${body.email}'`,",",
        null,",",
        body.sesId,')')
        return*/


    const query = `CALL USP_UPD_INS_USUARIO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.apellidoPaterno,
        body.apellidoMaterno,
        body.nombre,
        body.tipoDocumento,
        body.documento,
        (body.fijo=='')?null:body.fijo,
        body.celular,
        body.email,
        (body.fechaNacimiento=='')?null:moment(body.fechaNacimiento,'DD-MM-YYYY').format('YYYY-MM-DD'),
        body.nivel,
        (body.imagen=='')?null:body.imagen,
        'edita',
        body.email,
        null,
        null,
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    };  
    
}

const buscarUsuario = async(id,tabla,sesId)=>{
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

const listarUsuario = async (id,tabla,sesId)=>{
    const query = `CALL USP_SEL_VERLISTA(?, ?, ?)`;
    const row = await pool.query(query,
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


const eliminarUsuario = async(id,tabla)=>{
    const query = `CALL USP_DEL_ELIMINA(?, ?)`;
    const row=await pool.query(query,
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

const estadoUsuario = async(id,tabla)=>{
    const query = `CALL USP_UPD_ESTADO(?, ?)`;
    const row=await pool.query(query,
    [
        id,
        tabla
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro Actualizado!'
    }; 
    
}

const passwordUsuario = async (id,body,ip,server)=>{
    const nuevaPass=await passwordAleatorio();

    //const nuevaPass = randomPassword(10);
    //const nuevaPass = body.documento;
    const contrasenaNueva = encryptPassword(nuevaPass);
    const query = `CALL USP_UPD_INS_REGISTRO(?, ?, ?, ?, ?, ?, ?)`;
    const row=await pool.query(query,
    [
        id,
        0,
        contrasenaNueva,
        0,
        8,
        ip,
        server
    ]);

    const mensaje =mensajeReseteaPassword({usuario:row[0][0].EMAIL,sucursal:row[0][0].NOMBRE_SUCURSAL,contrasena:nuevaPass});
    enviaEmail(row[0][0].EMAIL,'Cambio de contrasena', mensaje,'','');
    //requestEmail(row[0][0].EMAIL,'Cambio de contrasena', mensaje);
    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Se cambio la contraseña!'
    };       
}

const claveUsuario = async (id,body,ip,server)=>{
    const nuevaClave=await claveAleatorio();

    //const nuevaPass = randomPassword(10);
    //const nuevaPass = body.documento;
    //const claveNueva = encryptPassword(nuevaClave);
    const query = `CALL USP_UPD_INS_REGISTRO(?, ?, ?, ?, ?, ?, ?)`;
    const row=await pool.query(query,
    [
        id,
        0,
        0,
        nuevaClave,
        12,
        0,
        0
    ]);

    const mensaje =mensajeReseteaClave({usuario:row[0][0].EMAIL,sucursal:row[0][0].NOMBRE_SUCURSAL,clave:nuevaClave});
    enviaEmail(row[0][0].EMAIL,'Cambio de clave', mensaje,'','');
    //requestEmail(row[0][0].EMAIL,'Cambio de contrasena', mensaje);
    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Se cambio la contraseña!'
    };       
}

const desbloqueaUsuario = async (id,ip,server)=>{
    const query = `CALL USP_UPD_INS_REGISTRO(?, ?, ?, ?, ?, ?, ?)`;
    const row=await pool.query(query,
    [
        id,
        0,
        0,
        0,
        6,
        ip,
        server
    ]);
    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Se desbloqueo al usuario!'
    };       
}


const estadoUsuarioSucursal = async (body)=>{
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
        body.idDetalle, 
        0,  
        'sucursal',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const asignaUsuarioSucursal = async (body)=>{
        
    const query = `CALL USP_UPD_INS_DETALLE(?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        body.id,
        body.idDetalle, 
        0,  
        'asignaSucursal',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

module.exports = {
    crearUsuario,
    editarUsuario,
    buscarUsuario,
    listarUsuario,
    eliminarUsuario,
    estadoUsuario,
    passwordUsuario,
    desbloqueaUsuario,
    estadoUsuarioSucursal,
    asignaUsuarioSucursal,
    claveUsuario
}

