const {crearUsuario,editarUsuario,buscarUsuario,listarUsuario,estadoUsuario, eliminarUsuario,desbloqueaUsuario, passwordUsuario,claveUsuario,estadoUsuarioSucursal,asignaUsuarioSucursal} = require('../models/usuarioModels');
const path = require('path');
const listar=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarUsuario(id,'usuario',sesId)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}

const listarAviso=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarUsuario(id,'usuario',sesId)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}

const buscar=(req, res)=>{
    const sesId =  req.params.sesId;
    const id =  req.params.id;
    buscarUsuario(id,'usuario',sesId)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}

const crear=(req, res)=>{
    crearUsuario(req.body)
    .then(valor => {
        if(req.archivo!=0){
            uploadedFile = req.files.imagen;
            ruta='../public/imagenes/usuario/USU_'+valor.info.ID_USUARIO+"_"+uploadedFile.name;
            uploadedFile.mv(path.join(__dirname,ruta));
        }
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    });
}


const editar=(req, res)=>{
    const id=req.params.id;
    editarUsuario(id,req.body)
    .then(valor => {
        if(req.archivo!=0){
            uploadedFile = req.files.imagen;
            ruta='../public/imagenes/usuario/USU_'+valor.info.ID_USUARIO+"_"+uploadedFile.name;
            uploadedFile.mv(path.join(__dirname,ruta));
        }
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    });
}

const eliminar=(req, res)=>{
    const id =  req.params.id;
    eliminarUsuario(id,'usuario')
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}

const estado=(req, res)=>{
    const id =  req.params.id;
    estadoUsuario(id,'usuario')
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}

const estadoDetalle=(req, res)=>{
    estadoUsuarioSucursal(req.body)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}

const asignaDetalle=(req, res)=>{
    asignaUsuarioSucursal(req.body)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}

const desbloquea=(req, res)=>{
    const ip =  req.ip;
    const server =  req.hostname;
    const id =  req.params.id;
    desbloqueaUsuario(id,ip,server)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}

const contrasena=(req, res)=>{

    const ip =  req.ip;
    const server =  req.hostname;
    const id =  req.params.id;
    passwordUsuario(id,req.body,ip,server)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}

const clave=(req, res)=>{

    const ip =  req.ip;
    const server =  req.hostname;
    const id =  req.params.id;
    claveUsuario(id,req.body,ip,server)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}



module.exports = {
    listar,
    listarAviso,
    buscar,
    crear,
    editar,
    eliminar,
    estado,
    estadoDetalle,
    asignaDetalle,
    desbloquea,
    contrasena,
    clave
}