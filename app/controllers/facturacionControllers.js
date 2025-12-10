const {buscarFacturacion,listarFacturacion } = require('../models/facturacionModels');
const axios = require('axios');
const config = require('../config/config');
const moment = require("moment");
const numeroLetras = require('../middlewares/numeroLetras');
const fs = require('fs');
const path = require('path');

const listar=(req, res)=>{
    const id =  req.params.id;
    const sesId=req.params.sesId;
    listarFacturacion(id,'facturacion',sesId)
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
    buscarFacturacion(id,'facturacion',sesId)
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

const cierre=async (req, res)=>{
    const facturacionDetalle =  await axios.get(config.URL_SISTEMA+"/api/facturacion/listar/"+req.body.id+"/"+req.body.sesId,{ 
        headers:{
            authorization: `Bearer ${req.body.token}`
        } 
    });
    const facturacionCabecera =  await axios.get(config.URL_SISTEMA+"/api/facturacion/buscar/"+req.body.id+"/"+req.body.sesId,{ 
        headers:{
            authorization: `Bearer ${req.body.token}`
        } 
    });
    let cabecera=facturacionCabecera.data.valor.info;
    let detalle=facturacionDetalle.data.valor.info;
    let bodyFac={};

    if(cabecera.ABREVIATURA=='BV' || cabecera.ABREVIATURA=='FT'){
        bodyFac={
            "ublVersion": cabecera.ublVersion,
            "fecVencimiento": moment(cabecera.fechaEmision).format('YYYY-MM-DD')+"T00:00:00-05:00",
            "tipoOperacion": cabecera.tipoOperacion,
            "tipoDoc": cabecera.tipoDoc,
            "serie": cabecera.serie,
            "correlativo": parseInt(cabecera.correlativo),
            "fechaEmision": moment(cabecera.fechaEmision).format('YYYY-MM-DD')+"T00:00:00-05:00",
            "formaPago": {
                "moneda": cabecera.moneda,
                "tipo": cabecera.tipo
            },
            "tipoMoneda": cabecera.tipoMoneda,
            "client": {
                "tipoDoc": cabecera.tipoDocCli,
                "numDoc": cabecera.numDoc,
                "rznSocial": cabecera.rznSocial,
                "address": {
                    "direccion": (cabecera.direccionCli===null)?'Sin direccion':cabecera.direccionCli,
                    "provincia": cabecera.provinciaCli,
                    "departamento": cabecera.departamentoCli,
                    "distrito": cabecera.distritoCli,
                    "ubigueo": cabecera.ubigeoCli
                }
            },
            "company": {
                "ruc": cabecera.ruc,
                "razonSocial": cabecera.razonSocial,
                "nombreComercial": cabecera.nombreComercial,
                "address": {
                    "direccion": cabecera.direccion,
                    "provincia": cabecera.provincia,
                    "departamento": cabecera.departamento,
                    "distrito": cabecera.distrito,
                    "ubigueo": cabecera.ubigeo
                }
            },
            "mtoOperGravadas": cabecera.mtoOperGravadas,
            "mtoOperExoneradas": cabecera.mtoOperExoneradas,
            "mtoIGV": cabecera.mtoIGV,
            "valorVenta": cabecera.valorVenta,
            "totalImpuestos": cabecera.totalImpuestos,
            "subTotal": cabecera.subTotal,
            "mtoImpVenta": cabecera.mtoImpVenta,
            "details": detalle,
            "legends": [
                {
                "code": cabecera.code,
                "value": "SON "+numeroLetras.NumerosaLetras(parseFloat(cabecera.mtoImpVenta).toFixed(2))+" SOLES"
                }
            ]
        }
    }else if(cabecera.ABREVIATURA=='FTD'){
        bodyFac={
            "ublVersion": cabecera.ublVersion,
            "fecVencimiento": moment(cabecera.fechaEmision).format('YYYY-MM-DD')+"T00:00:00-05:00",
            "tipoOperacion": cabecera.tipoOperacion2,
            "tipoDoc": cabecera.tipoDoc,
            "serie": cabecera.serie,
            "correlativo": parseInt(cabecera.correlativo),
            "fechaEmision": moment(cabecera.fechaEmision).format('YYYY-MM-DD')+"T00:00:00-05:00",
            "formaPago": {
                "moneda": cabecera.moneda,
                "tipo": cabecera.tipo
            },
            "tipoMoneda": cabecera.tipoMoneda,
            "client": {
                "tipoDoc": cabecera.tipoDocCli,
                "numDoc": cabecera.numDoc,
                "rznSocial": cabecera.rznSocial,
                "address": {
                    "direccion": (cabecera.direccionCli===null)?'Sin direccion':cabecera.direccionCli,
                    "provincia": cabecera.provinciaCli,
                    "departamento": cabecera.departamentoCli,
                    "distrito": cabecera.distritoCli,
                    "ubigueo": cabecera.ubigeoCli
                }
            },
            "company": {
                "ruc": cabecera.ruc,
                "razonSocial": cabecera.razonSocial,
                "nombreComercial": cabecera.nombreComercial,
                "address": {
                    "direccion": cabecera.direccion,
                    "provincia": cabecera.provincia,
                    "departamento": cabecera.departamento,
                    "distrito": cabecera.distrito,
                    "ubigueo": cabecera.ubigeo
                }
            },
            "mtoOperGravadas": cabecera.mtoOperGravadas,
            "mtoOperExoneradas": cabecera.mtoOperExoneradas,
            "mtoIGV": cabecera.mtoIGV,
            "valorVenta": cabecera.valorVenta,
            "totalImpuestos": cabecera.totalImpuestos,
            "subTotal": cabecera.subTotal,
            "mtoImpVenta": cabecera.mtoImpVenta,
            "detraccion": {
                "codBienDetraccion": cabecera.codBienDetraccion,
                "codMedioPago": cabecera.codMedioPago,
                "ctaBanco": cabecera.ctaBanco,
                "percent": cabecera.percent,
                "mount": parseFloat(cabecera.mount).toFixed(2)
            },
            "details": detalle,
            "legends": [
                {
                    "code": cabecera.code,
                    "value": "SON "+numeroLetras.NumerosaLetras(parseFloat(cabecera.mtoImpVenta).toFixed(2))+" SOLES"
                },
                {
                    "code": cabecera.code2,
                    "value": "Operación sujeta a detracción"
                }
            ]
        }
    }
    
    
    let respSunat=await axios.post(config.URL_FACTURACION+"/invoice/send",bodyFac,{ 
        headers:{authorization: `Bearer ${config.TOKEN_FACTURACION}`} 
    });

    let respPdf=await axios.post(config.URL_FACTURACION+"/invoice/pdf",bodyFac,{ 
        responseType:'arraybuffer',
        responseEncoding: 'binary',
        headers:{
            'Content-type': 'application/pdf',
            authorization: `Bearer ${config.TOKEN_FACTURACION}`
        } 
    });

    let respXml=await axios.post(config.URL_FACTURACION+"/invoice/xml",bodyFac,{ 
        responseType:'arraybuffer',
        responseEncoding: 'binary',
        headers:{
            'Content-type': 'application/xml',
            authorization: `Bearer ${config.TOKEN_FACTURACION}`
        } 
    });

    let documento=(cabecera.ABREVIATURA=='BV')?'boleta':'factura';

    fs.writeFile(path.join(__dirname,'../public/pdf/'+documento+'/'+cabecera.serie+'-'+cabecera.correlativo+'.pdf'), respPdf.data, 'binary', error => {
        if (error) {
            throw error;
        } else {
            console.log('buffer saved!');
        }
    });

    fs.writeFile(path.join(__dirname,'../public/xml/'+documento+'/'+cabecera.serie+'-'+cabecera.correlativo+'.xml'), respXml.data, 'binary', error => {
        if (error) {
            throw error;
        } else {
            console.log('buffer saved!');
        }
    });


   res.json({
        valor : respSunat.data
    });
}


module.exports = {
    listar,
    buscar,
    cierre
}