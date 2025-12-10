const axios = require('axios');
const config = require('../config/config');

const dashboardInicio=async (req, res)=>{
    try{
        const bloque1 = await axios.get(config.URL_SISTEMA+"/api/inicio/dashboard/"+req.body.sesId+"/"+'data1',{
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
        const bloque2 = await axios.get(config.URL_SISTEMA+"/api/inicio/dashboard/"+req.body.sesId+"/"+'data2',{
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
        const bloque3 = await axios.get(config.URL_SISTEMA+"/api/inicio/dashboard/"+req.body.sesId+"/"+'data3',{
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
        const bloque4 = await axios.get(config.URL_SISTEMA+"/api/inicio/dashboard/"+req.body.sesId+"/"+'data4',{
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
        const bloque5 = await axios.get(config.URL_SISTEMA+"/api/inicio/dashboard/"+req.body.sesId+"/"+'data5',{
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
        const bloque6 = await axios.get(config.URL_SISTEMA+"/api/inicio/dashboard/"+req.body.sesId+"/"+'data6',{
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });

        const bloque7 = await axios.get(config.URL_SISTEMA+"/api/inicio/dashboard/"+req.body.sesId+"/"+'data7',{
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });

    res.json({
            resp1 : bloque1.data.valor.info,
            resp2 : bloque2.data.valor.info,
            resp3 : bloque3.data.valor.info,
            resp4 : bloque4.data.valor.info,
            resp5 : bloque5.data.valor.info,
            resp6 : bloque6.data.valor.info,
            resp7 : bloque7.data.valor.info
        });
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

const atencion=async (req, res)=>{
    try{
        const cliente= await axios.get(config.URL_SISTEMA+"/api/cliente/listar/0/"+req.body.sesId,{
            headers: 
            { 
                authorization: `Bearer ${req.body.token}`
            } 
        });

        const servicio = await axios.get(config.URL_SISTEMA+"/api/serviciosucursal/listar/0/"+req.body.sesId,{ 
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
        const empleado = await axios.get(config.URL_SISTEMA+"/api/empleado/listar/0/"+req.body.sesId,{ 
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
        const venta = await axios.get(config.URL_SISTEMA+"/api/atencion/listar/0/"+req.body.sesId,{ 
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
        const tipoPago =  await axios.get(config.URL_SISTEMA+"/api/parametro/detalle/listar/47/"+req.body.sesId,{ 
			headers:{
				authorization: `Bearer ${req.body.token}`
		    } 
		});


    res.json({
            resp : cliente.data.valor.info,
            resp2 : servicio.data.valor.info,
            resp3 : empleado.data.valor.info,
            resp4 : venta.data.valor.info,
            resp5 : tipoPago.data.valor.info
        });
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

const ventas=async (req, res)=>{
    try{
        const bloque1 = await axios.get(config.URL_SISTEMA+"/api/inicio/dashboardProd/"+req.body.sesId+"/"+'data1',{
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
        const bloque2 = await axios.get(config.URL_SISTEMA+"/api/inicio/dashboardProd/"+req.body.sesId+"/"+'data2',{
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
        const bloque3 = await axios.get(config.URL_SISTEMA+"/api/inicio/dashboardProd/"+req.body.sesId+"/"+'data3',{
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
        const bloque4 = await axios.get(config.URL_SISTEMA+"/api/inicio/dashboardProd/"+req.body.sesId+"/"+'data4',{
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
        const bloque5 = await axios.get(config.URL_SISTEMA+"/api/inicio/dashboardProd/"+req.body.sesId+"/"+'data5',{
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });


    res.json({
            resp1 : bloque1.data.valor.info,
            resp2 : bloque2.data.valor.info,
            resp3 : bloque3.data.valor.info,
            resp4 : bloque4.data.valor.info,
            resp5 : bloque5.data.valor.info,
        });
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


module.exports = {
    dashboardInicio,
    atencion,
    ventas
}