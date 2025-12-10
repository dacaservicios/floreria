const {crearMesa,editarMesa,buscarMesa,listarMesa,estadoMesa,eliminarMesa} = require('../models/mesaModels');

const listar=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarMesa(id,'mesa',sesId)
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

const listarId=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarMesa(id,'mesaZona',sesId)
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
    buscarMesa(id,'mesa',sesId)
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
    crearMesa(req.body)
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

const editar=(req, res)=>{
    const id=req.params.id;
    editarMesa(id,req.body)
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

const eliminar=(req, res)=>{
    const id =  req.params.id;
    eliminarMesa(id,'mesa')
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
    estadoMesa(id,'mesa')
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
    listarId,
    buscar,
    crear,
    editar,
    estado,
    eliminar
}