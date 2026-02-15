const {buscarPedido,listarPedido,crearPedido,editarPedido,estadoPedido2,estadoPedido, crearPedidoDetalle, editarPedidoDetalle,crearPedidoDetallePago, editarPedidoPedido, eliminarPedido, listarPedidoInicio} = require('../models/pedidoModels');

const buscar=(req, res)=>{
    const sesId =  req.params.sesId;
    const id =  req.params.id;
    buscarPedido(id,'pedido',sesId)
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
    buscarPedido(id,'buscarPedido',sesId)
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
    listarPedido(id,'pedido',sesId)
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
    listarPedido(id,'pedidoDetalle',sesId)
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

const listarHistorial=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarPedido(id,'pedidoHistorial',sesId)
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
    listarPedidoInicio(sesId,tipo)
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
    listarPedido(id,'pagosPedido',sesId)
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
    buscarPedido(id,'pagosPedido',sesId)
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
    crearPedido(req.body)
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
    editarPedido(id,req.body)
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
    buscarPedido(id,'detallePedido',sesId)
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
    crearPedidoDetalle(req.body)
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
    editarPedidoDetalle(id,req.body)
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
    eliminarPedido(id,'detallePedido')
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
    eliminarPedidoDetalle(id,'pagoPedido')
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
    crearPedidoDetallePago(req.body)
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
    editarPedidoPedido(id,req.body)
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
    eliminarPedido(id,'pedido')
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
    buscarPedido(id,'documentoPedido',sesId)
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
    estadoPedido(id,req.body)
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

const estado2=(req, res)=>{
    const id =  req.params.id;
    estadoPedido2(id,req.body)
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
    listarHistorial,
    listarInicio,
    buscarDetalle,
    crear,
    crearDetalle,
    editar,
    estado,
    estado2,
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