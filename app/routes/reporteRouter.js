const express = require('express');
const router = express.Router();
const path = require('path');
const {isLogin} = require('../middlewares/auth');
const axios = require('axios');
const config = require('../config/config');
const moment = require('moment');
const xl = require('excel4node');
const {flujocaja} = require('../pdf/flujocaja');

/*==================VISTAS MOVIMIENTO===================*/

let wb = new xl.Workbook({
    dateFormat: 'd/m/yyyy hh:mm:ss',
    author: 'AyniSystem',
    defaultFont: {
        name: 'Calibri',
    },
});

let styleCabecera = wb.createStyle({
    alignment: {
        horizontal: 'center',
        vertical: 'center',
        justifyLastLine: true,
        wrapText: true,
        shrinkToFit: true,
    },
    font: {
        color: '#000000',
        size: 12,
        bold: true,
    },
    border: {
        left: {
            style: 'dashed', //['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
            color: '#000000' // HTML style hex value
        },
        right: {
            style: 'dashed',
            color: '#000000'
        },
        top: {
            style: 'dashed',
            color: '#000000'
        },
        bottom: {
            style: 'dashed',
            color: '#000000'
        }
    },
});

let styleTexto = wb.createStyle({
    alignment: {
        horizontal: 'centerContinuous',
        vertical: 'center',
        justifyLastLine: true,
        wrapText: true,
        shrinkToFit: true,
    },
    font: {
        color: '#000000',
        size: 11,
    },
    //numberFormat: '#.##0,0000; (#.##0,0000); -',
    border: {
        left: {
            style: 'dashed', //['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
            color: '#000000' // HTML style hex value
        },
        right: {
            style: 'dashed',
            color: '#000000'
        },
        top: {
            style: 'dashed',
            color: '#000000'
        },
        bottom: {
            style: 'dashed',
            color: '#000000'
        }
    },
});

const moneyStyle = wb.createStyle({
    numberFormat: '#,##0.00; -#,##0.00', // Formato de dinero
    font: {
        size: 11,
    },
  });


const dateStyle = wb.createStyle({
    numberFormat: 'mm/dd/yyyy',
    font: {
        size: 11,
    },
  });


router.post('/reporte/onomastico', isLogin, async (req, res) => {
    wb = new xl.Workbook();
    let ws = wb.addWorksheet('reporte_onomastico');

    let onomastico=['#','CLIENTE','ONOMASTICO','DIAS'];
    const sesId=req.session.passport.user.id;

    let ruta=path.join(__dirname,'../public/documentos/onomastico/reporte_onomastico.xlsx');

    let datos='';
    ws.row(1).freeze();
    ws.column(1).setWidth(10);
    ws.column(2).setWidth(50);
    ws.column(3).setWidth(20);
    ws.column(4).setWidth(30);
    for(var i=0;i<onomastico.length;i++){
        //ws.column((i+1)).setWidth(30)
        ws.cell(1, (i+1))
        .string(onomastico[i])
        .style(styleCabecera);
    }
    
    const lista2 =  await axios.get(config.URL_SISTEMA+"/api/reporte/filtroInicio/onomastico/"+sesId,{ 
		headers:{
			authorization: `Bearer ${req.body.token}`
		} 
	});

    datos=lista2.data.valor.info;
    let n=0;
    for(var i=0;i<datos.length;i++){
        if(datos[i].DIAS>=0 && datos[i].DIAS!==null && datos[i].ES_VIGENTE==1){
            ws.cell((n+2), 1).number(n+1).style(styleTexto);
            ws.cell((n+2), 2).string(datos[i].CLIENTE).style(styleTexto);
            ws.cell((n+2), 3).string(moment(datos[i].FECHA_NACIMIENTO).format('DD/MM')).style(styleTexto);
            ws.cell((n+2), 4).string((datos[i].DIAS==0)?'Hoy es su cumpleaños':'falta '+datos[i].DIAS+((datos[i].DIAS==1)?' día':' días')).style(styleTexto);
            n++;
        }
    }

    wb.write(ruta);

    res.json({
        valor : true
    }); 
});

router.post('/reporte/servicio', isLogin, async (req, res) => {
    wb = new xl.Workbook();
    let ws = wb.addWorksheet('reporte_servicio');

    let servicio=['#','SERVICIO','FECHA','CLIENTE','COLABORADOR','PRECIO','TIPO PAGO','GRATIS'];
    const sesId=req.session.passport.user.id;

    let ruta=path.join(__dirname,'../public/documentos/servicio/reporte_servicio.xlsx');

    let datos='';
    ws.row(1).freeze();
    ws.column(1).setWidth(10);
    ws.column(2).setWidth(50);
    ws.column(3).setWidth(20);
    ws.column(4).setWidth(50);
    ws.column(5).setWidth(50);
    ws.column(6).setWidth(10);
    ws.column(7).setWidth(20);
    ws.column(8).setWidth(10);
    for(var i=0;i<servicio.length;i++){
        //ws.column((i+1)).setWidth(30)
        ws.cell(1, (i+1))
        .string(servicio[i])
        .style(styleCabecera);
    }
    
    const lista2 =  await axios.post(config.URL_SISTEMA+"/api/reporte/filtro",req.body,{ 
		headers:{
			authorization: `Bearer ${req.body.token}`
		} 
	});
    let n=0;
    datos=lista2.data.valor.info;
    for(var i=0;i<datos.length;i++){
        if(datos[i].ES_VIGENTE==1){
            ws.cell((n+2), 1).number(n+1).style(styleTexto);
            ws.cell((n+2), 2).string(datos[i].NOMBRE_SERVICIO).style(styleTexto);
            ws.cell((n+2), 3).string(moment(datos[i].FECHA_ATENCION).format('DD/MM/YYYY')).style(styleTexto).style(dateStyle);
            ws.cell((n+2), 4).string(datos[i].CLIENTE).style(styleTexto);
            ws.cell((n+2), 5).string(datos[i].EMPLEADO).style(styleTexto);
            ws.cell((n+2), 6).number(datos[i].PRECIO).style(styleTexto).style(moneyStyle);
            ws.cell((n+2), 7).string(datos[i].TIPO_PAGO).style(styleTexto);
            ws.cell((n+2), 8).string(datos[i].ES_GRATIS).style(styleTexto);
            n++;
        }
    }

    wb.write(ruta);

    res.json({
        valor : true
    }); 
});

router.post('/reporte/venta', isLogin, async (req, res) => {
    wb = new xl.Workbook();
    let ws = wb.addWorksheet('reporte_venta');

    let venta=['#','CODIGO','PRODUCTO','F. VENTA','CANTIDAD','P. VENTA','TOTAL','SERIE','DOCUMENTO','CLIENTE'];
    const sesId=req.session.passport.user.id;

    let ruta=path.join(__dirname,'../public/documentos/venta/reporte_venta.xlsx');

    let datos='';
    ws.row(1).freeze();
    ws.column(1).setWidth(10);
    ws.column(2).setWidth(15);
    ws.column(3).setWidth(50);
    ws.column(4).setWidth(20);
    ws.column(5).setWidth(10);
    ws.column(6).setWidth(20);
    ws.column(7).setWidth(20);
    ws.column(8).setWidth(30);
    ws.column(9).setWidth(30);
    ws.column(10).setWidth(50);
    for(var i=0;i<venta.length;i++){
        //ws.column((i+1)).setWidth(30)
        ws.cell(1, (i+1))
        .string(venta[i])
        .style(styleCabecera);
    }
    
    const lista2 =  await axios.post(config.URL_SISTEMA+"/api/reporte/filtro",req.body,{ 
		headers:{
			authorization: `Bearer ${req.body.token}`
		} 
	});
    let n=0;
    datos=lista2.data.valor.info;
    for(var i=0;i<datos.length;i++){
        if(datos[i].ES_VIGENTE==1){
            ws.cell((n+2), 1).number(n+1).style(styleTexto);
            ws.cell((n+2), 2).string(datos[i].CODIGO_PRODUCTO).style(styleTexto);
            ws.cell((n+2), 3).string(datos[i].NOMBRE).style(styleTexto);
            ws.cell((n+2), 4).string(moment(datos[i].FECHA_VENTA).format('DD/MM/YYYY')).style(styleTexto).style(dateStyle);
            ws.cell((n+2), 5).string(datos[i].CANTIDAD).style(styleTexto);
            ws.cell((n+2), 6).number(datos[i].PRECIO_VENTA).style(styleTexto).style(moneyStyle);
            ws.cell((n+2), 7).number(datos[i].MONTO_TOTAL).style(styleTexto).style(moneyStyle);
            ws.cell((n+2), 8).string(datos[i].SERIE_DOCUMENTO).style(styleTexto);
            ws.cell((n+2), 9).string(datos[i].NRO_DOCUMENTO).style(styleTexto);
            ws.cell((n+2), 10).string(datos[i].CLIENTE).style(styleTexto);
            n++;
        }
    }

    wb.write(ruta);

    res.json({
        valor : true
    }); 
});


router.post('/reporte/ingresoegreso', isLogin, async (req, res) => {
    wb = new xl.Workbook();
    let ws = wb.addWorksheet('reporte_ingreso_egreso');

    let ingresoegreso=['#','MOVIMIENTO','CONCEPTO','FECHA','MONTO','COLABORADOR','DESCRIPCION'];
    const sesId=req.session.passport.user.id;

    let ruta=path.join(__dirname,'../public/documentos/ingresoegreso/reporte_ingreso_egreso.xlsx');

    let datos='';
    ws.row(1).freeze();
    ws.column(1).setWidth(10);
    ws.column(2).setWidth(20);
    ws.column(3).setWidth(20);
    ws.column(4).setWidth(20);
    ws.column(5).setWidth(20);
    ws.column(6).setWidth(40);
    ws.column(7).setWidth(80);
    for(var i=0;i<ingresoegreso.length;i++){
        //ws.column((i+1)).setWidth(30)
        ws.cell(1, (i+1))
        .string(ingresoegreso[i])
        .style(styleCabecera);
    }
    
    const lista2 =  await axios.post(config.URL_SISTEMA+"/api/reporte/filtro",req.body,{ 
		headers:{
			authorization: `Bearer ${req.body.token}`
		} 
	});
    let n=0;
    datos=lista2.data.valor.info;
    for(var i=0;i<datos.length;i++){
        if(datos[i].ES_VIGENTE==1){
            ws.cell((n+2), 1).number(n+1).style(styleTexto);
            ws.cell((n+2), 2).string(datos[i].TIPO_MOVIMIENTO).style(styleTexto);
            ws.cell((n+2), 3).string(datos[i].CONCEPTO).style(styleTexto);
            ws.cell((n+2), 4).string(moment(datos[i].FECHA).format('DD/MM/YYYY')).style(styleTexto).style(dateStyle);
            ws.cell((n+2), 5).number(datos[i].MONTO).style(styleTexto).style(moneyStyle);
            ws.cell((n+2), 6).string((datos[i].ID_EMPLEADO===null)?'':datos[i].EMPLEADO).style(styleTexto);
            ws.cell((n+2), 7).string((datos[i].DESCRIPCION===null)?'':datos[i].DESCRIPCION).style(styleTexto);
            n++;
        }
    }

    wb.write(ruta);

    res.json({
        valor : true
    }); 
});


router.post('/reporte/kardex', isLogin, async (req, res) => {
    wb = new xl.Workbook();
    let ws = wb.addWorksheet('reporte_kardex');

    let karde0=['','ENTRADA','SALIDA','SALDO'];
    let kardex=['#','FECHA','OPERACIÓN','NRO DOC.','CANT.','VALOR','TOTAL','CANT.','VALOR','TOTAL','CANT.','VALOR','TOTAL'];
    const sesId=req.session.passport.user.id;

    let ruta=path.join(__dirname,'../public/documentos/kardex/reporte_kardex.xlsx');

    let datos='';
    ws.cell(1,1,1,4, true).string('DATOS').style(styleCabecera);
    ws.cell(1,5,1,7, true).string('ENTRADA').style(styleCabecera);
    ws.cell(1,8,1,10, true).string('SALIDA').style(styleCabecera);
    ws.cell(1,11,1,13, true).string('SALDO').style(styleCabecera);

    ws.row(2).freeze();
    ws.column(1).setWidth(10);
    ws.column(2).setWidth(10);
    ws.column(3).setWidth(20);
    ws.column(4).setWidth(20);
    ws.column(5).setWidth(15);
    ws.column(6).setWidth(15);
    ws.column(7).setWidth(15);
    ws.column(8).setWidth(15);
    ws.column(9).setWidth(15);
    ws.column(10).setWidth(15);
    ws.column(11).setWidth(15);
    ws.column(12).setWidth(15);
    ws.column(13).setWidth(15);
    for(var i=0;i<kardex.length;i++){
        //ws.column((i+1)).setWidth(30)
        ws.cell(2, (i+1))
        .string(kardex[i])
        .style(styleCabecera);
    }
    
    /*const lista2 =  await axios.post(config.URL_SISTEMA+"/api/reporte/filtro",req.body,{ 
		headers:{
			authorization: `Bearer ${req.body.token}`
		} 
	});*/
    let body=req.body;
    let lista2 =  await axios.post(config.URL_SISTEMA+'/api/kardex/filtro',body,{ 
        headers:{
            authorization: `Bearer ${req.body.token}`
        } 
    });
    let n=0;
    datos=lista2.data.valor.info;

    for(var i=0;i<datos.length;i++){
        if(datos[i].ES_VIGENTE==1){
            ws.cell((n+3), 1).number(n+1).style(styleTexto);
            ws.cell((n+3), 2).string(moment(datos[i].FECHA_CREA).format('DD/MM/YYYY')).style(styleTexto).style(dateStyle);
            ws.cell((n+3), 3).string(datos[i].OPERACION).style(styleTexto);
            ws.cell((n+3), 4).string((datos[i].DOCUMENTO ===null)?'':datos[i].DOCUMENTO).style(styleTexto);
            ws.cell((n+3), 5).number((datos[i].CANT_ENTRA ===null)?0:datos[i].CANT_ENTRA).style(styleTexto);
            ws.cell((n+3), 6).string((datos[i].VUNI_ENTRA===null)?'0.00':parseFloat(datos[i].VUNI_ENTRA).toFixed(2)).style(styleTexto).style(moneyStyle);
            ws.cell((n+3), 7).string((datos[i].VTOT_ENTRA===null)?'0.00':parseFloat(datos[i].VTOT_ENTRA).toFixed(2)).style(styleTexto).style(moneyStyle);
            ws.cell((n+3), 8).number((datos[i].CANT_SALE ===null)?0:datos[i].CANT_SALE).style(styleTexto);
            ws.cell((n+3), 9).string((datos[i].VUNI_SALE===null)?'0.00':parseFloat(datos[i].VUNI_SALE).toFixed(2)).style(styleTexto).style(moneyStyle);
            ws.cell((n+3), 10).string((datos[i].VTOT_SALE===null)?'0.00':parseFloat(datos[i].VTOT_SALE).toFixed(2)).style(styleTexto).style(moneyStyle);
            ws.cell((n+3), 11).number((datos[i].CANT_TOTAL ===null)?0:datos[i].CANT_TOTAL).style(styleTexto);
            ws.cell((n+3), 12).string((datos[i].VUNI_TOTAL===null)?'0.00':parseFloat(datos[i].VUNI_TOTAL).toFixed(2)).style(styleTexto).style(moneyStyle);
            ws.cell((n+3), 13).string((datos[i].VALOR_TOTAL===null)?'0.00':parseFloat(datos[i].VALOR_TOTAL).toFixed(2)).style(styleTexto).style(moneyStyle);
            n++;
        }
    }

    wb.write(ruta);

    res.json({
        valor : true
    }); 
});



router.get('/reporte/descarga/onomastico', isLogin, (req, res) => {
    res.setHeader('Content-disposition', 'attachment;filename=reporte_onomastico.xlsx'); 
    res.setHeader('Content-type', 'text/plain'); 
    res.charset = 'UTF-8';

    res.sendFile(path.join(__dirname,'../public/documentos/onomastico/reporte_onomastico.xlsx'));
});

router.get('/reporte/descarga/servicio', isLogin, (req, res) => {
    res.setHeader('Content-disposition', 'attachment;filename=reporte_servicio.xlsx'); 
    res.setHeader('Content-type', 'text/plain'); 
    res.charset = 'UTF-8';

    res.sendFile(path.join(__dirname,'../public/documentos/servicio/reporte_servicio.xlsx'));
});

router.get('/reporte/descarga/venta', isLogin, (req, res) => {
    res.setHeader('Content-disposition', 'attachment;filename=reporte_venta.xlsx'); 
    res.setHeader('Content-type', 'text/plain'); 
    res.charset = 'UTF-8';

    res.sendFile(path.join(__dirname,'../public/documentos/venta/reporte_venta.xlsx'));
});

router.get('/reporte/descarga/ingresoegreso', isLogin, (req, res) => {
    res.setHeader('Content-disposition', 'attachment;filename=reporte_ingreso_egreso.xlsx'); 
    res.setHeader('Content-type', 'text/plain'); 
    res.charset = 'UTF-8';

    res.sendFile(path.join(__dirname,'../public/documentos/ingresoegreso/reporte_ingreso_egreso.xlsx'));
});


router.get('/reporte/descarga/kardex', isLogin, (req, res) => {
    res.setHeader('Content-disposition', 'attachment;filename=reporte_kardex.xlsx'); 
    res.setHeader('Content-type', 'text/plain'); 
    res.charset = 'UTF-8';

    res.sendFile(path.join(__dirname,'../public/documentos/kardex/reporte_kardex.xlsx'));
});
/*===============================================*/

router.post('/reporteflujocaja/flujocaja', isLogin, async (req, res) => {
    try {
        const sesId=req.session.passport.user.id;
        const sucursal=req.body.sucursalId;
        req.body.tipo='flujoServicio';
        const lista1 =  await axios.post(config.URL_SISTEMA+"/api/reporte/filtro",req.body,{ 
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
        req.body.tipo='flujoProducto';
        const lista2 =  await axios.post(config.URL_SISTEMA+"/api/reporte/filtro",req.body,{ 
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
        req.body.tipo='flujoIngreso';
        const lista3 =  await axios.post(config.URL_SISTEMA+"/api/reporte/filtro",req.body,{ 
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
        req.body.tipo='flujoCompra';
        const lista4 =  await axios.post(config.URL_SISTEMA+"/api/reporte/filtro",req.body,{ 
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
        req.body.tipo='flujoEgreso';
        const lista5 =  await axios.post(config.URL_SISTEMA+"/api/reporte/filtro",req.body,{ 
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });

        const lista6 =  await axios.get(config.URL_SISTEMA+"/api/usuario/buscar/"+req.body.sesId+"/"+req.body.sesId,{ 
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });

        servicio=lista1.data.valor.info;
        producto=lista2.data.valor.info;
        ingreso=lista3.data.valor.info;
        compra=lista4.data.valor.info;
        egreso=lista5.data.valor.info;
        usuario=lista6.data.valor.info;
        
        const ticket =  await flujocaja({servicio,producto,ingreso,compra,egreso,usuario,body:req.body});

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
});

router.get('/reporteflujocaja/descarga/flujocaja/:id', isLogin, (req, res) => {
    let idSucursal=req.params.id;

    res.setHeader('Content-disposition', 'attachment; filename=FlujoCaja_'+idSucursal+'.pdf');
    res.setHeader('Content-type', 'application/pdf');
    res.charset = 'UTF-8';

    res.sendFile(path.join(__dirname,'../public/pdf/flujocaja/FC_'+idSucursal+'_flujocaja.pdf'));
    
});

module.exports = router;

