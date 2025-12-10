const {crearProductosucursal,editarProductosucursal,buscarProductosucursal,listarProductosucursal,estadoProductosucursal,eliminarProductosucursal,autocompletaProductosucursal,buscarCodigoBarra} = require('../models/productosucursalModels');

const listar=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarProductosucursal(id,'productoSucursal',sesId)
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

const autocompleta=(req, res)=>{
    const producto =  req.params.producto;
    const idProveedor =  req.params.idProveedor;
    const tipo =  req.params.tipo;
    const sesId=req.params.sesId;
    autocompletaProductosucursal(producto,idProveedor,tipo,sesId)
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

const codigoBarra=(req, res)=>{
    const producto =  req.params.codigobarra;
    const sesId=req.params.sesId;
    buscarCodigoBarra(producto,'codigobarra',sesId)
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
    listarProductosucursal(id,'productoSucursal',sesId)
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
    buscarProductosucursal(id,'productoSucursal',sesId)
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
    crearProductosucursal(req.body)
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
    editarProductosucursal(id,req.body)
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
    eliminarProductosucursal(id,'productoSucursal')
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
    estadoProductosucursal(id,'productoSucursal')
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
    autocompleta,
    listarId,
    buscar,
    crear,
    editar,
    estado,
    eliminar,
    codigoBarra
}