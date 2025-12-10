const {crearEmpresa,editarEmpresa,buscarEmpresa,listarEmpresa,estadoEmpresa,eliminarEmpresa,estadoCambiaEmpresa} = require('../models/empresaModels');
const path = require('path');

const listar=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarEmpresa(id,'empresa',sesId)
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

const listarMiempresa=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarEmpresa(id,'miempresa',sesId)
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
    buscarEmpresa(id,'empresa',sesId)
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
    crearEmpresa(req.body)
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
    editarEmpresa(id,req.body)
    .then(valor => {
        if(req.archivo!=0){
            uploadedFile = req.files.imagen;
            ruta='../public/imagenes/sucursal/LOGO_'+valor.info.ID_EMPRESA+'_'+uploadedFile.name;
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
    eliminarEmpresa(id,'empresa')
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
    estadoEmpresa(id,'empresa')
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

const cambiaEmpresa=(req, res)=>{
    estadoCambiaEmpresa(req.body)
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
    listarMiempresa,
    buscar,
    cambiaEmpresa,
    crear,
    editar,
    estado,
    eliminar
}