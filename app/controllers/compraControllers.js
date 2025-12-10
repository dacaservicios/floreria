const {buscarCompra,listarCompra,crearCompra,editarCompra, crearCompraDetalle, editarCompraDetalle,crearCompraDetallePago, editarPedidoCompra, eliminarCompra, listarCompraInicio} = require('../models/compraModels');

const buscar=(req, res)=>{
    const sesId =  req.params.sesId;
    const id =  req.params.id;
    buscarCompra(id,'compra',sesId)
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

const buscarTotales=(req, res)=>{
    const sesId =  req.params.sesId;
    const id =  req.params.id;
    buscarCompra(id,'buscarCompra',sesId)
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

const listar=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarCompra(id,'compra',sesId)
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
    const sesId=req.params.sesId;
    listarCompra(id,'compraDetalle',sesId)
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

const listarInicio=(req, res)=>{
    const sesId =  req.params.sesId;
    const tipo =  req.params.tipo;
    listarCompraInicio(sesId,tipo)
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

const listarPago=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarCompra(id,'pagosCompra',sesId)
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

const buscarPago=(req, res)=>{
    const sesId =  req.params.sesId;
    const id =  req.params.id;
    buscarCompra(id,'pagosCompra',sesId)
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
    crearCompra(req.body)
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
    editarCompra(id,req.body)
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

const buscarDetalle=(req, res)=>{
    const sesId =  req.params.sesId;
    const id =  req.params.id;
    buscarCompra(id,'detalleCompra',sesId)
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

const crearDetalle=(req, res)=>{
    crearCompraDetalle(req.body)
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

const editarDetalle=(req, res)=>{
    const id=req.params.id;
    editarCompraDetalle(id,req.body)
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

const eliminarDetalle=(req, res)=>{
    const id =  req.params.id;
    eliminarCompra(id,'detalleCompra')
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

const eliminarPago=(req, res)=>{
    const id =  req.params.id;
    eliminarCompraDetalle(id,'pagoCompra')
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

const pagar=(req, res)=>{
    crearCompraDetallePago(req.body)
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


const cierre=(req, res)=>{
    const id=req.params.id;
    editarPedidoCompra(id,req.body)
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
    eliminarCompra(id,'compra')
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

const documento=(req, res)=>{
    const sesId =  req.params.sesId;
    const id =  req.params.id;
    buscarCompra(id,'documentoCompra',sesId)
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
    cierre,
    buscar,
    buscarTotales,
    listar,
    listarDetalle,
    listarInicio,
    buscarDetalle,
    crear,
    crearDetalle,
    editar,
    eliminar,
    crearDetalle,
    editarDetalle,
    eliminarDetalle,
    eliminarPago,
    listarPago,
    buscarPago,
    pagar,
    documento
}