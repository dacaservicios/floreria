const {crearMensajeria,editarMensajeria,buscarMensajeria,listarMensajeria,estadoMensajeria,eliminarMensajeria, enviarCorreo, enviarWhatsapp} = require('../models/mensajeriaModels');
const path = require('path');

const listar=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarMensajeria(id,'mensajeria',sesId)
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
    buscarMensajeria(id,'mensajeria',sesId)
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

const buscarSucursal=(req, res)=>{
    const sesId =  req.params.sesId;
    const id =  req.params.id;
    buscarMensajeria(id,'mensajeriaSucursal',sesId)
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
    crearMensajeria(req.body)
    .then(valor => {
        if(req.archivo!=0){
            uploadedFile = req.files.imagen;
            ruta='../public/imagenes/mensajeria/MEN_'+valor.info.ID_MENSAJERIA+"_"+uploadedFile.name;
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
    editarMensajeria(id,req.body)
    .then(valor => {
        if(req.archivo!=0){
            uploadedFile = req.files.imagen;
            ruta='../public/imagenes/mensajeria/MEN_'+valor.info.ID_MENSAJERIA+"_"+uploadedFile.name;
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
    eliminarMensajeria(id,'mensajeria')
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
    estadoMensajeria(id,'mensajeria')
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

const correo=(req, res)=>{
    enviarCorreo(req.body)
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

const whatsapp=(req, res)=>{
    enviarWhatsapp(req.body)
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
    buscar,
    buscarSucursal,
    crear,
    editar,
    estado,
    eliminar,
    correo,
    whatsapp
}