const {crearEmpleado,editarEmpleado,buscarEmpleado,listarEmpleado,estadoEmpleado,eliminarEmpleado} = require('../models/empleadoModels');
const axios = require('axios');
const config = require('../config/config');
const path = require('path');

const listar=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarEmpleado(id,'empleado',sesId)
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
    buscarEmpleado(id,'empleado',sesId)
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
    crearEmpleado(req.body)
    .then(valor => {
        if(req.archivo!=0){
            uploadedFile = req.files.imagen;
            ruta='../public/imagenes/empleado/EMP_'+valor.info.ID_EMPLEADO+"_"+uploadedFile.name;
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
    editarEmpleado(id,req.body)
    .then(valor => {
        if(req.archivo!=0){
            uploadedFile = req.files.imagen;
            ruta='../public/imagenes/empleado/EMP_'+valor.info.ID_EMPLEADO+"_"+uploadedFile.name;
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
    eliminarEmpleado(id,'empleado')
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
    estadoEmpleado(id,'empleado')
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

const documento=async (req, res)=>{
    const tipo =  req.params.tipo;
    const documento =  req.params.documento;
    try {
        const datos = await axios.get(config.URL_DOCUMENTO+"/"+tipo+"/"+documento,{ 
            headers:{authorization: `Bearer ${config.TOKEN_DOCUMENTO}`} 
        });
        res.json({
            valor : datos.data
        }); 
    }catch (err) {
        res.status(400).json({
            error : {
                message:err.response.data.error.message,
                errno: err.response.data.error.errno,
                code :err.response.data.error.code
            }
        });
    }
}


module.exports = {
    listar,
    buscar,
    crear,
    editar,
    estado,
    eliminar,
    documento
}