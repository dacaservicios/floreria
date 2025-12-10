const pool = require('../config/connections');
const {encryptPassword, matchPassword} = require('../libs/helpers');
//const {enviaEmail} = require('../config/email');
const {requestEmail} = require('../config/mailjet');
const {mensajeCambiaPassword} = require('../html/inicioMensaje');
const config = require('../config/config');

const cambiaPassword = async (id,body)=>{
    const contrasenaNueva = encryptPassword(body.contrasenaNueva);
    const query = `CALL USP_UPD_INS_REGISTRO(?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        0,
        contrasenaNueva,
        0,
        8,
        0,
        0
    ]);

    const mensaje =mensajeCambiaPassword({usuario:row[0][0].NUM_DOCUMENTO,contrasena:body.contrasenaNueva});
    //enviaEmail(row[0][0].EMAIL,'Cambio de contrasena', mensaje,'','');
    requestEmail(row[0][0].EMAIL,'Cambio de contrasena', mensaje);
    
    return { 
        resultado : true,
        info : row[0][0],
        url: config.URL_SISTEMA,
        mensaje : '¡Se cambio la contraseña!'
    };       
}

const salirLogin = async (id,ip,server)=>{  
    const query = `CALL USP_UPD_INS_REGISTRO(?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
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
        mensaje : '¡Se termino la sesión!'
    };         
}

const accesoGuarda = async (id,body)=>{  

    const query = `CALL USP_UPD_CAMBIA_ACCESO(?, ?, ?, ?, ?)`;
    await pool.query(query,
    [
        id,
        body.activo,
        body.inactivo,
        body.tipo,
        body.sesId
    ]);

    return { 
        resultado : true,
        mensaje : '¡Se actualizó el acceso!'    
    };       
}

const cambiaDatos = async (id,img, body,sesId)=>{
    const query = `CALL USP_UPD_INS_USUARIO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.apellidoPaterno,
        body.apellidoMaterno,
        body.nombre1,
        body.nombre2,
        body.dni,
        body.fijo,
        body.celular,
        body.correo,
        body.fechaNacimiento,
        0,
        0,
        img,
        0,
        'cambia',
        0,
        sesId
    ]);

    return{ 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Datos actualizados!'
    };  
    
}

const verificaPassword = async (id,body)=>{  
    const query = `CALL USP_UPD_INS_REGISTRO(?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        0,
        0,
        0,
        7,
        0,
        0
    ]);
    if(row[0].length>0){
        const validPassword = matchPassword(body.contrasenaActual,row[0][0].CONTRASENA);
        if(validPassword){
            return { 
                resultado : true,
                mensaje : '¡Contrasena correcta!',
            };
        }else{
            return { 
                resultado : false,
                mensaje : '¡La contrasena actual no es correcta!',
            };
        }
    }else{
        return { 
            resultado : false,
            mensaje : '¡No existe el usuario!'
        }; 
    }           
}

const listaIdMenu  = async (id,tabla,nivel,sesId)=>{
    const query = `CALL USP_SEL_VERLISTAIDMENU(?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        tabla,
        0,
        nivel,
        sesId
    ]);

    return { 
        resultado : true,
        info:row[0],
        mensaje : '!Se ejecutó correctamente¡'
    };      
}

const accesoImpresion = async (sesId,body)=>{
    /*console.log('CALL USP_UPD_INS_DETALLE (',body.idSucursal,",",
        body.impresion,",",
        0,",",
        `'impresora'`,",",
        body.sesId,')')
        return*/
        
    const query = `CALL USP_UPD_INS_DETALLE(?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        body.idSucursal,
        body.impresion, 
        0,  
        'impresora',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Impresora actualizada!'
    }; 
}

const accesoPrivilegio = async (idSubMenu,sesId)=>{
    const query2 = `CALL USP_SEL_VERLISTAIDMENU(?, ?, ?, ?, ?)`;
    const row2 = await pool.query(query2,
    [
        idSubMenu,
        'opcionNivel',
        0,
        0,
        sesId
    ]);

    var arr_botones=[];
    for(var i=0;i<row2[0].length;i++){
        arr_botones.push(row2[0][i].nomb_opci);
    }

    return data={ 
        botones : arr_botones
    };
    
}

const accesoSesion = async (body)=>{
    const query = `CALL USP_SEL_VERLISTAIDMENU(?, ?, ?, ?, ?)`;
    if(body.sesId){
        const row = await pool.query(query,
        [
            body.idSubmenu,
            'sesion',
            body.tipo,
            0,
            body.sesId
        ]);
        if(row[0][0].sesion=='I'){
            return {
                sesion:row[0][0].sesion,
                resultado : false,
                mensaje : '¡Su sesión ha caducado!'
            }; 
        }else if(row[0][0].sesion=='A'){
            if(body.tipo=='M' ||  body.tipo=='S' || (body.tipo=='O' && row[0][0].eliminado==0 && row[0][0].vigente==1)){
                return {
                    resultado : true,
                    mensaje : '¡exito!'
                }; 
            }else{
                return {
                    sesion:row[0][0].sesion,
                    resultado : false,
                    mensaje : '¡No tiene acceso a esta opción!'
                }; 
            }
        }
    }else{
        return { 
            resultado : false,
            mensaje : '¡Su sesión ha caducado!'
        }
    }
}

module.exports = {
    cambiaPassword,
    salirLogin,
    accesoGuarda,
    cambiaDatos,
    verificaPassword,
    listaIdMenu,
    accesoImpresion,
    accesoPrivilegio,
    accesoSesion
};

