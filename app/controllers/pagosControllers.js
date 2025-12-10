const {crearPagos,editarPagos,buscarPagos,listarPagos,estadoPagos,eliminarPagos} = require('../models/pagosModels');
const path = require('path');
const moment = require('moment');

const listar=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarPagos(id,'pagosMembresia',sesId)
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
    buscarPagos(id,'pagosMembresia',sesId)
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

const verificar=(req, res)=>{
    const sesId =  req.params.sesId;
    const id =  req.params.id;
    buscarPagos(id,'verificaMembresia',sesId)
    .then(valor => {
        const verifica=valor.info;

        let periodo='';
        let fechaF='';
        let fechaFinal='';
        let mensaje='';
        let color='';
        let mostrar='oculto';
        if(verifica.ABREVIATURA===null){
            fechaInicio=moment(verifica.FECHA_INICIAL).format('DD/MM/YYYY');
            fechaF=moment(verifica.FECHA_INICIAL).add(1, 'months');
            fechaFinal=moment(fechaF).format('DD/MM/YYYY');
            periodo=fechaInicio+" - "+fechaFinal;
            mensaje='¡No olvide cancelar su membresía! Su pago está pendiente. Periodo:';
            mostrar='';
        }else if(verifica.ABREVIATURA=='RECH'){
            fechaInicio=moment(verifica.FECHA_INICIO).format('DD/MM/YYYY');
            fechaFinal=moment(verifica.FECHA_FIN).format('DD/MM/YYYY');
            periodo=fechaInicio+" - "+fechaFinal;
            mensaje='¡No olvide renovar su membresía! Su pago está pendiente. Periodo:';
            mostrar='';
        }else if(verifica.ABREVIATURA=='CONF'){
            let hoy=moment();
            let fin=moment(verifica.FECHA_FIN);
            let diferencia=moment(fin).diff(moment(hoy), 'days');
            if(diferencia<=5 && diferencia>0){
                fechaInicio=moment(verifica.FECHA_INICIO).format('DD/MM/YYYY');
                fechaFinal=moment(verifica.FECHA_FIN).format('DD/MM/YYYY');
                periodo=fechaInicio+" - "+fechaFinal;
                let dias=(diferencia==1)?'día':'días';
                mensaje='En '+diferencia+' '+dias+', terminará su membresía del periodo:';
                color='danger';
                mostrar='';
            }else if(diferencia<=0){
                fechaInicio=moment(verifica.FECHA_FIN).format('DD/MM/YYYY');
                fechaF=moment(verifica.FECHA_FIN).add(1, 'months');
                fechaFinal=moment(fechaF).format('DD/MM/YYYY');
                periodo=fechaInicio+" - "+fechaFinal;
                let dias=(diferencia==1)?'día':'días';
                if(diferencia==0){
                    fechaInicio=moment(verifica.FECHA_INICIO).format('DD/MM/YYYY');
                    fechaFinal=moment(verifica.FECHA_FIN).format('DD/MM/YYYY');
                    periodo=fechaInicio+" - "+fechaFinal;
                    mensaje='Ha culminado su membresía del periodo:';
                }else{
                    mensaje='Tiene '+(-diferencia)+' '+dias+' de retraso en el pago de su membresía del periodo:';
                }
                color='danger';
                mostrar='';
            }
        }else{
            mostrar='oculto';
        }
        
        res.json({
            valor : valor,
            valida:{
                color:color,
                mostrar:mostrar,
                mensaje:mensaje,
                periodo:periodo
            }
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
    crearPagos(req.body)
    .then(valor => {
        if(req.archivo!=0){
            uploadedFile = req.files.imagen;
            ruta='../public/imagenes/pagos/MB_'+valor.info.ID_PAGOS+"_"+uploadedFile.name;
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
    editarPagos(id,req.body)
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
    eliminarPagos(id,'pagosMembresia')
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
    estadoPagos(id,'pagosMembresia')
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
    verificar,
    crear,
    editar,
    estado,
    eliminar
}