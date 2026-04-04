const {crearProductoCompuesto,editarProductoCompuesto,buscarProductoCompuesto,listarProductoCompuesto,estadoProductoCompuesto,eliminarProductoCompuesto} = require('../models/productocompuestoModels');

const listar=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarProductoCompuesto(id,'productoCompuesto',sesId)
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
    buscarProductoCompuesto(id,'productoCompuesto',sesId)
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
    crearProductoCompuesto(req.body)
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
    editarProductoCompuesto(id,req.body)
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
    eliminarProductoCompuesto(id,'productoCompuesto')
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
    estadoProductoCompuesto(id,'productoCompuesto')
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
    crear,
    editar,
    estado,
    eliminar
}