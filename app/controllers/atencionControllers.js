const {crearAtencion,editarAtencion,buscarAtencion,listarAtencion,enviarCorreo,enviarWhatsapp,listarAtencionInicio,crearAtencionDetalle,editarAtencionDetalle,eliminarAtencion} = require('../models/atencionModels');

const listar=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarAtencion(id,'atencion',sesId)
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

const listar10=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarAtencion(id,'top10',sesId)
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
    listarAtencion(id,'atencionDetalle',sesId)
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
    listarAtencionInicio(sesId,tipo)
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
    buscarAtencion(id,'atencion',sesId)
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
    buscarAtencion(id,'detalleAtencion',sesId)
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
    buscarAtencion(id,'buscarAtencion',sesId)
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

const cortegratis=(req, res)=>{
    const sesId =  req.params.sesId;
    const id =  req.params.id;
    buscarAtencion(id,'cortegratis',sesId)
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
    crearAtencion(req.body)
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
    editarAtencion(id,req.body)
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
    crearAtencionDetalle(req.body)
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
    editarAtencionDetalle(id,req.body)
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
    eliminarAtencion(id,'atencion')
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
    eliminarAtencion(id,'detalleAtencion')
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

const documento=(req, res)=>{
    const sesId =  req.params.sesId;
    const id =  req.params.id;
    buscarAtencion(id,'documentoAtencion',sesId)
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
    listar10,
    buscar,
    crear,
    editar,
    correo,
    whatsapp,
    cortegratis,
    listarDetalle,
    listarInicio,
    buscarTotales,
    crearDetalle,
    buscarDetalle,
    editarDetalle,
    eliminarDetalle,
    eliminar,
    documento
}