const {flujocaja} = require('../pdf/flujocaja');
const config = require('../config/config');
const axios = require('axios');
const {filtrarReporte,filtrarReporteInicio} = require('../models/reporteModels');

const filtrar=(req, res)=>{
    filtrarReporte(req.body)
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

const flujoCajaDiario= async (req, res)=>{
    try {
        req.body.tipo='flujoServicio';
        const lista1 =  await axios.post(config.URL_SISTEMA+"/api/reporte/flujocaja",req.body);
        req.body.tipo='flujoProducto';
        const lista2 =  await axios.post(config.URL_SISTEMA+"/api/reporte/flujocaja",req.body);
        req.body.tipo='flujoIngreso';
        const lista3 =  await axios.post(config.URL_SISTEMA+"/api/reporte/flujocaja",req.body);
        req.body.tipo='flujoCompra';
        const lista4 =  await axios.post(config.URL_SISTEMA+"/api/reporte/flujocaja",req.body);
        req.body.tipo='flujoEgreso';
        const lista5 =  await axios.post(config.URL_SISTEMA+"/api/reporte/flujocaja",req.body);
        const lista6 =  await axios.get(config.URL_SISTEMA+"/api/sucursal/buscarflujocaja/"+req.body.sucursalId+"/0");

        servicio=lista1.data.valor.info;
        producto=lista2.data.valor.info;
        ingreso=lista3.data.valor.info;
        compra=lista4.data.valor.info;
        egreso=lista5.data.valor.info;
        usuario=lista6.data.valor.info;
        
        await flujocaja({servicio,producto,ingreso,compra,egreso,usuario,body:req.body});

        res.json({
            resultado : true,
        })
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

const filtrarInicio=(req, res)=>{
    const sesId =  req.params.sesId;
    const tipo =  req.params.tipo;
    filtrarReporteInicio(sesId,tipo)
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
    filtrar,
    filtrarInicio,
    flujoCajaDiario
}