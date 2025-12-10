const PDF  = require('pdfkit');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');


const flujocaja = async (objeto)=>{
    let subtotalIngreso=parseFloat(objeto.servicio[0].SUBTOTAL+objeto.producto[0].SUBTOTAL+objeto.ingreso[0].SUBTOTAL).toFixed(2);
    let igvIngreso=parseFloat(objeto.servicio[0].IGV+objeto.producto[0].IGV+objeto.ingreso[0].IGV).toFixed(2);
    let totalIngreso=parseFloat(objeto.servicio[0].TOTAL+objeto.producto[0].TOTAL+objeto.ingreso[0].TOTAL).toFixed(2);

    let subtotalEgreso=parseFloat(objeto.compra[0].SUBTOTAL+objeto.egreso[0].SUBTOTAL).toFixed(2);
    let igvEgreso=parseFloat(objeto.compra[0].IGV+objeto.egreso[0].IGV).toFixed(2);
    let totalEgreso=parseFloat(objeto.compra[0].TOTAL+objeto.egreso[0].TOTAL).toFixed(2);

    let subtotal=parseFloat(subtotalIngreso-subtotalEgreso).toFixed(2);
    let igv=parseFloat(igvIngreso-igvEgreso).toFixed(2);
    let total=parseFloat(totalIngreso-totalEgreso).toFixed(2);

    // Create a document
    const doc = new PDF({
        size: 'A4',
        layout: 'portrait',
        /*margins: {
            top: 30,
            bottom: 10,
            left: 10,
            right: 10
          }*/
    });
    let logo;

    const ruta=path.join(__dirname,'../public/pdf/flujocaja/FC_'+objeto.usuario.ID_SUCURSAL+'_flujocaja.pdf');

    if(objeto.usuario.ID_EMPRESA===null || objeto.usuario.ID_EMPRESA==''){
        logo=path.join(__dirname,'../public/imagenes/vacio.jpg');
    }else{
        logo=path.join(__dirname,'../public/imagenes/sucursal/LOGO_'+objeto.usuario.ID_EMPRESA+'_'+objeto.usuario.IMAGEN_EMPRESA);
    }

    doc.pipe(fs.createWriteStream(ruta));

    doc.image(logo, 50,10, { 
        fit: [100, 100], 
        align: 'center', 
        valign: 'center' 
    });
    altura=doc.y+100;   
   doc
   .font(path.join(__dirname,'../public/fuentes/Quicksand-Bold.ttf'))
   .fontSize(14)
   .fillColor('#00000');
   
    doc.text('REPORTE DE FLUJO DE CAJA',0,altura,{
        width:595.28,
        align: 'center'
    });
    altura=doc.y;

    doc
    .fontSize(10)
    .text(objeto.usuario.NOMB_SUCURSAL,0,altura,{
        width:595.28,
        align: 'center'
    });

    altura=doc.y;
    doc
    .text('Del '+objeto.body.fechaInicio+' al '+objeto.body.fechaFin,0,altura,{
        width:595.28,
        align: 'center'
    });

    doc.moveDown(3);
    altura=doc.y;

    doc.text('FLUJO',50,altura,{
        width:150
    });
    doc.text('SUBTOTAL',200,altura,{
        width:115.09,
        align: 'center'
    });
    doc.text('IGV',200+115.09,altura,{
        width:115.09,
        align: 'center'
    });
    doc.text('TOTAL',200+115.09*2,altura,{
        width:115.09,
        align: 'center'
    });

    doc.moveDown(1)
    altura=doc.y;
    doc.font(path.join(__dirname,'../public/fuentes/Quicksand-Regular.ttf'));
    doc.text('Servicios',50,altura,{
        width:150
    });

    doc.text(parseFloat(objeto.servicio[0].SUBTOTAL).toFixed(2),200,altura,{
        width:115.09,
        align: 'center'
    });

    doc.text(parseFloat(objeto.servicio[0].IGV).toFixed(2),200+115.09,altura,{
        width:115.09,
        align: 'center'
    });

    doc.text(parseFloat(objeto.servicio[0].TOTAL).toFixed(2),200+115.09*2,altura,{
        width:115.09,
        align: 'center'
    });

    doc.moveDown(1)
    altura=doc.y;

    doc.text('Productos',50,altura,{
        width:150
    });

    doc.text(parseFloat(objeto.producto[0].SUBTOTAL).toFixed(2),200,altura,{
        width:115.09,
        align: 'center'
    });

    doc.text(parseFloat(objeto.producto[0].IGV).toFixed(2),200+115.09,altura,{
        width:115.09,
        align: 'center'
    });

    doc.text(parseFloat(objeto.producto[0].TOTAL).toFixed(2),200+115.09*2,altura,{
        width:115.09,
        align: 'center'
    });

    doc.moveDown(1)
    altura=doc.y;

    doc.text('Ingresos exonerados de IGV',50,altura,{
        width:150
    });

    doc.text(parseFloat(objeto.ingreso[0].SUBTOTAL).toFixed(2),200,altura,{
        width:115.09,
        align: 'center'
    });

    doc.text(parseFloat(objeto.ingreso[0].IGV).toFixed(2),200+115.09,altura,{
        width:115.09,
        align: 'center'
    });

    doc.text(parseFloat(objeto.ingreso[0].TOTAL).toFixed(2),200+115.09*2,altura,{
        width:115.09,
        align: 'center'
    });

    doc.moveDown(1)
    altura=doc.y;

    doc.font(path.join(__dirname,'../public/fuentes/Quicksand-Bold.ttf'));
    doc.text('(+) Ingresos',50,altura,{
        width:150
    });

    doc.text(subtotalIngreso,200,altura,{
        width:115.09,
        align: 'center'
    });

    doc.text(igvIngreso,200+115.09,altura,{
        width:115.09,
        align: 'center'
    });

    doc.text(totalIngreso,200+115.09*2,altura,{
        width:115.09,
        align: 'center'
    });

    doc.moveDown(1)
    altura=doc.y;

    doc.font(path.join(__dirname,'../public/fuentes/Quicksand-Regular.ttf'));
    doc.text('Compras',50,altura,{
        width:150
    });

    doc.text(parseFloat(objeto.compra[0].SUBTOTAL).toFixed(2),200,altura,{
        width:115.09,
        align: 'center'
    });

    doc.text(parseFloat(objeto.compra[0].IGV).toFixed(2),200+115.09,altura,{
        width:115.09,
        align: 'center'
    });

    doc.text(parseFloat(objeto.compra[0].TOTAL).toFixed(2),200+115.09*2,altura,{
        width:115.09,
        align: 'center'
    });

    doc.moveDown(1)
    altura=doc.y;

    doc.text('Egresos exonerados de IGV',50,altura,{
        width:150
    });

    doc.text(parseFloat(objeto.egreso[0].SUBTOTAL).toFixed(2),200,altura,{
        width:115.09,
        align: 'center'
    });

    doc.text(parseFloat(objeto.egreso[0].IGV).toFixed(2),200+115.09,altura,{
        width:115.09,
        align: 'center'
    });

    doc.text(parseFloat(objeto.egreso[0].TOTAL).toFixed(2),200+115.09*2,altura,{
        width:115.09,
        align: 'center'
    });

    doc.moveDown(1)
    altura=doc.y;

    doc.font(path.join(__dirname,'../public/fuentes/Quicksand-Bold.ttf'));
    doc.text('(-) Egresos',50,altura,{
        width:150
    });

    doc.text(subtotalEgreso,200,altura,{
        width:115.09,
        align: 'center'
    });

    doc.text(igvEgreso,200+115.09,altura,{
        width:115.09,
        align: 'center'
    });

    doc.text(totalEgreso,200+115.09*2,altura,{
        width:115.09,
        align: 'center'
    });

    doc.moveDown(1)
    altura=doc.y;

    doc.text('Saldo Final Acumulado',50,altura,{
        width:150
    });

    doc.text(subtotal,200,altura,{
        width:115.09,
        align: 'center'
    });

    doc.text(igv,200+115.09,altura,{
        width:115.09,
        align: 'center'
    });

    doc.text(total,200+115.09*2,altura,{
        width:115.09,
        align: 'center'
    });
   

    // Finalizar el PDF
    doc.end();

}

module.exports = {
    flujocaja
}
