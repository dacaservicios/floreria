const {buscarVenta,listarVenta,crearVenta,editarVenta, crearVentaDetalle, editarVentaDetalle,crearVentaDetallePago, editarPedidoVenta, eliminarVenta, listarVentaInicio,claveSupervisor} = require('../models/ventaModels');

const buscar=(req, res)=>{
    const sesId =  req.params.sesId;
    const id =  req.params.id;
    buscarVenta(id,'venta',sesId)
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
    buscarVenta(id,'buscarVenta',sesId)
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
    listarVenta(id,'venta',sesId)
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
    listarVenta(id,'ventaDetalle',sesId)
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
    listarVentaInicio(sesId,tipo)
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
    listarVenta(id,'pagosVenta',sesId)
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
    buscarVenta(id,'pagosVenta',sesId)
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
    crearVenta(req.body)
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
    editarVenta(id,req.body)
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
    buscarVenta(id,'detalleVenta',sesId)
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
    crearVentaDetalle(req.body)
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
    editarVentaDetalle(id,req.body)
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
    eliminarVenta(id,'detalleVenta')
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
    eliminarVentaDetalle(id,'pagoVenta')
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
    crearVentaDetallePago(req.body)
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
    editarPedidoVenta(id,req.body)
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
    eliminarVenta(id,'venta')
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
    buscarVenta(id,'documentoVenta',sesId)
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
    const sesId =  req.params.sesId;
    const codigo =  req.params.codigo;
    claveSupervisor(codigo,sesId)
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
    documento,
    clave
}