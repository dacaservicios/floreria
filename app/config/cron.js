const path = require('path');
const fs = require('fs');
const axios = require('axios');
const config = require('./config');
const {enviaEmail} = require('./email');
const {mensajeOnosmastico} = require('../html/inicioMensaje');
const moment = require('moment');
const { exec } = require('child_process');

const cronNode = ()=>{
    const cron = require('node-cron');

    //cron.schedule('*/5 * * * * *', async () => {//cada 5 segundos
    //cron.schedule('30 08,13 * * *', async () => {
    cron.schedule('00 */1 * * *', async () => {//cada hora
        let resultado=await axios.get(config.URL_SISTEMA+"/api/inicio/dashboard/10/"+'cron');
        console.log(resultado.data.valor, 'servicio');
        return true;
    });

    cron.schedule('15 */1 * * *', async () => {//cada hora y 15 minutos
        let resultado=await axios.get(config.URL_SISTEMA+"/api/inicio/dashboardProd/10/"+'cron');
        console.log(resultado.data.valor,'producto');
        return true;
    });

    //cron.schedule('59 10 * * *', async () => {
        //try{
            //exec('/usr/local/bin/pm2 start whatsapp', (error, stdout, stderr) => {
                //if (error) {
                    //console.error(`Error al reiniciar PM2: ${error.message}`);
                    //return;
                //}
                //if (stderr) {
                    //console.error(`PM2 stderr: ${stderr}`);
                    //return;
                //}
                //console.log(`PM2 reiniciado con éxito: ${stdout}`);
            //});
        //}catch (error) {
            //console.error('Error en la petición:', error);
        //}
    //});

    cron.schedule('00 10 * * *', async () => {
        if(config.TELEFONO_SENDER!='0'){
            const estados= await axios.get(config.URL_SISTEMA+"/api/pagos/verificarWatsapp/0/10");
            let mensaje=estados.data.valida.mensaje;
            let periodo=estados.data.valida.periodo;
            let telefono=config.TELEFONO_WHATSAPP;
            let sender=config.TELEFONO_SENDER;
            let body={
                phone:telefono,
                sender:sender,
                message:mensaje+" "+periodo
            }
            if(mensaje!=''){
                let resultado=await axios.post(config.URL_WHATSAPP,body);
                console.log(resultado.data);
            }
        }
    });

    //cron.schedule('01 11 * * *', async () => {
        //try{
            //exec('/usr/local/bin/pm2 stop whatsapp', (error, stdout, stderr) => {
                //if (error) {
                    //console.error(`Error al detener PM2: ${error.message}`);
                    //return;
                //}
                //if (stderr) {
                    //console.error(`PM2 stderr: ${stderr}`);
                    //return;
                //}
                //console.log(`PM2 detenido con éxito: ${stdout}`);
            //});
        //}catch (error) {
            //console.error('Error en la petición:', error);
        //}
    // });
    
    //envia reporte de flujo de caja por sucursal
    cron.schedule('00 08 * * *', async () => {
        if(config.TELEFONO_SENDER!='0'){
            const lista= await axios.get(config.URL_SISTEMA+"/api/sucursal/listado/1/10");
            let sucursales=lista.data.valor.info;
            let fecha=moment().subtract(1, 'days').format('DD-MM-YYYY');
            let fechaPDF=moment().subtract(1, 'days').format('YYYYMMDD');
            
            const resultados = await Promise.allSettled(
                sucursales.map(async (sucursal) => {
                    try {
                        let body={
                            dato1:sucursal.ID_SUCURSAL,
                            dato2:'',
                            fechaInicio:fecha,
                            fechaFin:fecha,
                            sesId:10,
                            sucursalId:sucursal.ID_SUCURSAL
                        }
                        await axios.post(config.URL_SISTEMA+"/api/reporte/flujocajadiario",body);
                        const url=config.URL_SISTEMA+'/pdf/flujocaja/FC_'+sucursal.ID_SUCURSAL+'_flujocaja.pdf';

                        let body2={
                            phone: config.TELEFONO_WHATSAPP,
                            url:url,
                            caption:`👋 Hola `+sucursal.NOMB_SUCURSAL+`. buen día 🌞, Te comparto el 📄 Flujo de Caja correspondiente al día 📅 `+ fecha,
                            sender: config.TELEFONO_SENDER,
                            formato:sucursal.NOMB_SUCURSAL+'_FlujoCaja_'+fechaPDF+'.pdf'
                        }
                    
                        let resultado=await axios.post(config.URL_WHATSAPP3,body2);
                        console.log(`Enviado a ${sucursal.NOMB_SUCURSAL}:`, resultado.data);
                    } catch (error) {
                        if (error.response) {
                            console.error(`Error con ${sucursal.NOMB_SUCURSAL}:`, error.response.data);
                        } else {
                            console.error(`Error con ${sucursal.NOMB_SUCURSAL}:`, error.message);
                        }
                    }
                })
            );
        }
    });

    //MENSAJES MASIVOS
    cron.schedule('00 12 * * *', async () => {
        if(config.TELEFONO_SENDER!='0'){
            const lista= await axios.get(config.URL_SISTEMA+"/api/sucursal/listado/1/10");
            let sucursales=lista.data.valor.info;
            const resultados = await Promise.allSettled(
                sucursales.map(async (sucursal) => {
                    try {
                        if(sucursal.NRO_WHATSAPP!==null && sucursal.NRO_WHATSAPP!=''){
                            const lista2= await axios.get(config.URL_SISTEMA+"/api/mensajeria/buscarSucursal/"+sucursal.ID_SUCURSAL+"/10");
                            let datos=lista2.data.valor.info;
                            if(datos.CUENTA>0){
                                let body={
                                    sucursal:sucursal.ID_SUCURSAL,
                                    asunto:datos.ASUNTO,
                                    descripcion:datos.DESCRIPCION,
                                    sesId:10
                                }

                                await axios.post(config.URL_SISTEMA+'/api/mensajeria/whatsapp', body);
                                console.log('Inicia envio de mensajes');
                            }else{
                                console.log('No hay registros para enviar');
                            }
                        }
                    } catch (error) {
                        if (error.response) {
                            console.error(`Error :`, error.response.data);
                        } else {
                            console.error(`Error :`, error.message);
                        }
                    }
                })
            )
        }
    });
}


module.exports = {
    cronNode
};
