const pool = require('../config/connections');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const {encryptPassword,randomPassword} = require('../libs/helpers');
const moment = require('moment');
const {enviaEmail} = require('../config/email');
const {mensajeOlvidaPassword} = require('../html/inicioMensaje');
const { passwordAleatorio } = require('../middlewares/auth');
 
const login = async (ip,server,body)=>{  
    const query = `CALL USP_UPD_INS_REGISTRO(?, ?, ?, ?, ?, ?, ?)`;
    
    const row1 = await pool.query(query,
    [
        0,
        body.txtCorreo,
        0, 
        0,  
        1,
        ip,
        server
    ]);

    if(row1[0][0].MENSAJE=='0'){
        const datos = row1[0][0];
        const token=jwt.sign({
            data:{
                id : datos.ID_USUARIO,
                idNivel : datos.ID_NIVEL,
                idSucursal : datos.ID_SUCURSAL,
                clave: datos.CLAVE
            }
        },
        config.SEED,
        {expiresIn: config.EXPIRATION}
        );

        await pool.query(query,
        [
            datos.ID_USUARIO,
            0,
            0,
            datos.CLAVE,
            3,
            ip,
            server
        ]);

        return { 
            resultado : true,
            id : datos.ID_USUARIO,
            idNivel : datos.ID_NIVEL,
            idSucursal : datos.ID_SUCURSAL,
            clave : datos.CLAVE,
            token:token,
            mensaje : 'Ingreso exitoso'
        };
       

    }else{
        return { 
            resultado : false,
            mensaje : row1[0][0].MENSAJE,
            url: config.URL_SISTEMA,
        }; 
    }           
}


const menuInicio = async (id,tabla,tabla2)=>{

    let componente;
    let i, s;
    let idMenu,paginaMenu,iconoMenu;
    let paginaSubMenu,idSubMenu;

    const query = `CALL USP_SEL_VERLISTAIDMENU(?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        0,
        tabla,
        0,
        0,
        id
    ]);
    let recuperaListaId=row[0];

    componente=
    `<ul id="menuSubMenu" class="side-menu">
        <li class="side-item side-item-category">INICIO</li>
        <li class="slide inicioServicio">
            <a class="side-menu__item" href="#"><svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 24 24" ><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 5h4v6H5zm10 8h4v6h-4zM5 17h4v2H5zM15 5h4v2h-4z" opacity=".3"/><path d="M3 13h8V3H3v10zm2-8h4v6H5V5zm8 16h8V11h-8v10zm2-8h4v6h-4v-6zM13 3v6h8V3h-8zm6 4h-4V5h4v2zM3 21h8v-6H3v6zm2-4h4v2H5v-2z"/></svg><span class="side-menu__label">Dashboard servicio</span></a>
        </li>
        <li class="slide inicioProducto">
            <a class="side-menu__item" href="#"><svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 24 24" ><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 5h4v6H5zm10 8h4v6h-4zM5 17h4v2H5zM15 5h4v2h-4z" opacity=".3"/><path d="M3 13h8V3H3v10zm2-8h4v6H5V5zm8 16h8V11h-8v10zm2-8h4v6h-4v-6zM13 3v6h8V3h-8zm6 4h-4V5h4v2zM3 21h8v-6H3v6zm2-4h4v2H5v-2z"/></svg><span class="side-menu__label">Dashboard producto</span></a>
        </li>
        <li class="side-item side-item-category">MENÚ PRINCIPAL</li>
    `;

    for(i=0; i< recuperaListaId.length; i++){
        idMenu=recuperaListaId[i]['id_menu'];
        paginaMenu=recuperaListaId[i]['nomb_menu'];
        iconoMenu=recuperaListaId[i]['icon_menu'];

    componente+= 
        `<li class="slide">
            <a class="side-menu__item cursor" data-bs-toggle="slide">
                ${iconoMenu}
                <span class="side-menu__label">${paginaMenu}</span>
                <i class="angle fe fe-chevron-down"></i>
            </a>
            <ul class="slide-menu">
                <li class="panel sidetab-menu">
                    <div class="panel-body tabs-menu-body p-0 border-0">
                        <div class="tab-content">
                            <div class="tab-pane tab-content-show active">
                                <ul class="sidemenu-list">
        `;
        const row2 = await pool.query(query,
        [
            idMenu,
            tabla2,
            0,
            0,
            id
        ]);
        let recuperaListaId2=row2[0];

        for(s=0; s< recuperaListaId2.length; s++){  
            paginaSubMenu=recuperaListaId2[s]['nomb_sume'];
            rutaSubMenu=recuperaListaId2[s]['ruta_sume'];
            idSubMenu=recuperaListaId2[s]['id_sume'];

                        componente+= `<li class="eventoSubmenu">
                                            <a id="${idSubMenu}" ruta="${rutaSubMenu}" class="slide-item" href="#">${paginaSubMenu}</a>
                                    </li>`;
        }
                    componente+=`</ul>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </li>`;
    }
    componente+=`</ul>`;
    

    return { 
        resultado : true,
        info:componente,
        mensaje : '¡exito!'
    };
}

const datosUsuario = async (id)=>{
    const query1 = `CALL USP_SEL_VERLISTAID(?, ?, ?)`;
    const row1 = await pool.query(query1,
    [
        id,
        'usuario',
        id
    ]);

    return { 
        resultado : true,
        info:row1[0][0],
        mensaje : '¡exito!'
    }; 
  
}

/*const registro = async (body)=>{  
    const nuevaPass = randomPassword(10);
    const contrasena = encryptPassword(nuevaPass);

    const query = `CALL USP_UPD_INS_USUARIO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row=await pool.query(query,
    [
        0,
        1,
        body.txtPaterno,
        0,   
        body.txtNombre,
        '',
        35,
        0,
        0,
        0,
        body.txtCorreo,
        moment().format('YYYY-MM-DD'),
        3,
        '',
        moment().format('YYYY-MM-DD'),
        'register',
        body.txtCorreo,
        contrasena,
        1
    ]);


    const mensaje =mensajeRegister(body,nuevaPass);
    requestEmail(body.txtCorreo,'Bienvenido a AyniSystem', mensaje);
    

    return { 
        resultado : true,
        info:row[0][0],
        mensaje : '¡Se ha enviado sus credenciales a su correo electrónico!'
    };  
}*/
/*
const contrasena = async (body)=>{ 
    const nuevaPass = randomPassword(10);
    const contrasena = encryptPassword(nuevaPass);

    const query = `CALL USP_UPD_INS_REGISTRO(?, ?, ?, ?, ?, ?, ?)`;
    
    const row = await pool.query(query,
    [
        0,
        body.txtCorreo,
        contrasena, 
        0,  
        10,
        0,
        0
    ]);

    if(row[0][0].USUARIO==1){ 
        const mensaje =mensajeOlvidaPassword(body.txtCorreo,nuevaPass);
        requestEmail(body.txtCorreo,'Recupera contraseña', mensaje);

        return { 
            resultado : true,
            mensaje : '¡Se ha enviado su nuevo password a su correo electrónico!'
        };  
    }else{
        return { 
            resultado : false,
            mensaje : '¡Su correo no esta registrado en el sistema!'
        }; 
    }      
}*/

const recuperaPassword = async (id,body,ip,server)=>{
    const nuevaPass = passwordAleatorio(10);
    //const nuevaPass = body.documento;
    const contrasenaNueva = encryptPassword(nuevaPass);

    /*console.log('CALL USP_UPD_INS_REGISTRO(',id,",",
        `'${body.correo}'`,",",
        `'${contrasena}'`,",",
        0,",",
        10,",",
        `'${body.ip}'`,",",
        `'${body.server}'`,')')
        return*/

    const query = `CALL USP_UPD_INS_REGISTRO(?, ?, ?, ?, ?, ?, ?)`;
    const row=await pool.query(query,
    [
        id,
        body.correo,
        contrasenaNueva,
        0,
        10,
        ip,
        server
    ]);

    const mensaje =mensajeOlvidaPassword({usuario:row[0][0].NUM_DOCUMENTO,contrasena:nuevaPass});
    enviaEmail(body.correo,'Recuperación de contrasena', mensaje,'','');

    return { 
        resultado : true,
        info : row[0][0],
        url: config.URL_SISTEMA,
        mensaje : '¡Se recuperó la contraseña!'
    };       
}


const dataDashboard = async (sesId, tipo)=>{
    const query1 = `CALL USP_DASHBOARD(?, ?)`;
    const row1 = await pool.query(query1,
    [
        sesId,
        tipo
    ]);

    return { 
        resultado : true,
        info:row1[0],
        mensaje : '¡exito!'
    }; 
  
}

const dataDashboardProd = async (sesId, tipo)=>{
    const query1 = `CALL USP_DASHBOARD_PROD(?, ?)`;
    const row1 = await pool.query(query1,
    [
        sesId,
        tipo
    ]);

    return { 
        resultado : true,
        info:row1[0],
        mensaje : '¡exito!'
    }; 
  
}


module.exports = {
    login,
    menuInicio,
    datosUsuario,
    //registro,
    //contrasena,
    recuperaPassword,
    dataDashboard,
    dataDashboardProd
};

