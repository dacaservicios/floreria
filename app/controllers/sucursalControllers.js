const {crearSucursal,editarSucursal,buscarSucursal,listarSucursal,estadoSucursal,eliminarSucursal, listarSucursalDetalle} = require('../models/sucursalModels');
const path = require('path');

const listar=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarSucursal(id,'sucursal',sesId)
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

const listarDetalle=(req, res)=>{
    const id =  req.params.id;
    const empresa =  req.params.empresa;
    const sesId=req.params.sesId;
    listarSucursalDetalle(id,empresa,sesId)
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
    buscarSucursal(id,'sucursal',sesId)
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
    crearSucursal(req.body)
    .then(valor => {
        if(req.archivo!=0){
            uploadedFile = req.files.imagen;
            ruta='../public/imagenes/sucursal/LOGO_'+valor.info.ID_SUCURSAL+'_'+uploadedFile.name;
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
    editarSucursal(id,req.body)
    .then(valor => {
        if(req.archivo!=0){
            uploadedFile = req.files.imagen;
            ruta='../public/imagenes/sucursal/LOGO_'+valor.info.ID_SUCURSAL+'_'+uploadedFile.name;
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
    eliminarSucursal(id,'sucursal')
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
    estadoSucursal(id,'sucursal')
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
    listarDetalle,
    buscar,
    crear,
    editar,
    estado,
    eliminar
}