const PDF  = require('pdfkit');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');


const pdfTicket = async (objeto)=>{
    // Create a document
    let ancho_hoja=250;
    let alto_hoja=600;
    const doc = new PDF({
        size: [ancho_hoja,alto_hoja],//'A4',
        //layout: 'landscape',
        /*margins: {
            top: 100,
            bottom: 0,
            left: 0,
            right: 0
          }*/
    });
    let logo;
    const ruta=path.join(__dirname,'../public/pdf/ticket/TK_'+objeto.ID_ATENCION+'_ticket.pdf');

    if(objeto.IMAGEN===null || objeto.IMAGEN==''){
        logo=path.join(__dirname,'../public/imagenes/vacio.jpg');
    }else{
        logo=path.join(__dirname,'../public/imagenes/sucursal/LOGO_'+objeto.ID_EMPRESA+'_'+objeto.IMAGEN);
    }

    doc.pipe(fs.createWriteStream(ruta));
    
    
     //fondo del bloque superior
     let alto_bloque_superior=50;

     doc.lineJoin('miter')
   .rect(0, 0, ancho_hoja,alto_bloque_superior)
   .fillAndStroke("#222222", "#222222")
   .stroke();
 
    // circulo central blanco del bloque izquierdo
    let diametro1=20;
   doc.lineJoin('miter')
   .circle((ancho_hoja/2),0, diametro1)
   .fillAndStroke("#ffffff", "#ffffff")
   .stroke();
   
   // titulo inferior del bloque izquierdo
   let espacio_arriba=20;
   let espacio_izquierdo=10;
   doc
   .font(path.join(__dirname,'../public/fuentes/Quicksand-Regular.ttf'))
   .fontSize(10)
   .fillColor('#ffffff');
   doc.text('Número de Ticket',espacio_izquierdo,espacio_arriba,{
        width:ancho_hoja/2
   });
   
    // numero de ticket superior del bloque izquierdo
   doc.text(objeto.NRO_TICKET,(ancho_hoja/2)+(ancho_hoja/4),espacio_arriba,{
        width:ancho_hoja/2
    });
    doc.moveDown(2);

//========================================================================================
    let ancho_alto_imagen=60;
    
    // Logo de la barbería (imagen) bloque medio
    doc.image(logo, (ancho_hoja/2)-(ancho_alto_imagen/2),doc.y, { 
        fit: [ancho_alto_imagen, ancho_alto_imagen], 
        align: 'center', 
        valign: 'center' 
    });
//================================================================================

    //titulo de tiket bloque medio
    
    doc
    .font(path.join(__dirname,'../public/fuentes/Quicksand-Bold.ttf'))
    .fontSize(14)
    .fillColor('#2C3E50');
    doc.text('Ticket de Atención',0,doc.y, {
        width: ancho_hoja,
        align: 'center'
    });

    //nombre de sucursal del bloque medio
    doc
    .fontSize(25);
    doc.text(objeto.NOMBRE_SUCURSAL,0,doc.y,{
        width: ancho_hoja,
        align: 'center'
    });
//============================================================================================

    //detalle de servicio del bloque medio
    doc.moveDown(0.2);
    doc
    .fontSize(18)
    .fillColor('#34495E')
    .font(path.join(__dirname,'../public/fuentes/Quicksand-Bold.ttf'));
    doc.text((objeto.NOMBRE_CLIENTE+" "+objeto.PATERNO_CLIENTE).toUpperCase(),{
        width: ancho_hoja,
        align: 'center'
    });
    
    doc
    .fontSize(8);
    doc.text('Cliente',{
        width: ancho_hoja,
        align: 'center'
    });
    doc.moveDown(0.5);
    doc
    .fontSize(15)
    .font(path.join(__dirname,'../public/fuentes/Quicksand-Regular.ttf'));
    doc.text(objeto.NOMBRE_SERVICIO,{
        width: ancho_hoja,
        align: 'center'
    });
    doc
    .font(path.join(__dirname,'../public/fuentes/Quicksand-Bold.ttf'))
    .fontSize(8);
    doc.text('Servicio',{
        width: ancho_hoja,
        align: 'center'
    });
    doc.moveDown(0.5);
    doc
    .fontSize(15)
    .font(path.join(__dirname,'../public/fuentes/Quicksand-Regular.ttf'));
    doc.text(objeto.NOMBRE_EMPLEADO+" "+objeto.PATERNO_EMPLEADO,{
        width: ancho_hoja,
        align: 'center'
    });
    doc
    .fontSize(8)
    .font(path.join(__dirname,'../public/fuentes/Quicksand-Bold.ttf'));
    doc.text('Colaborador',{
        width: ancho_hoja,
        align: 'center'
    });
    doc.moveDown();

    //mensaje de tiket parte inferior del bloque medio  
    doc
    .fontSize(12)
    .font(path.join(__dirname,'../public/fuentes/Quicksand-Regular.ttf'));
    doc.text(objeto.MENSAJE_TICKET,25,doc.y,{
        width: 200,
        align: 'justify'
    });
    
      
//===========================================================================================
    doc.moveDown();
    doc.fontSize(18)
    .font(path.join(__dirname,'../public/fuentes/Quicksand-Bold.ttf'));
    //importe y preco del servicio del bloque medio
    doc.text(`Importe: ${parseFloat(objeto.PRECIO_SERVICIO).toFixed(2)}`,0,doc.y,{
        width: ancho_hoja,
        align: 'center'
    });

    //===========================================================================================
   //bloque inferior desde linea punteada horizontal
    doc.lineJoin('miter')
    .rect(0,doc.y, ancho_hoja, alto_hoja-doc.y)
    .fillAndStroke("#f5f0ea", "#f5f0ea")
    .stroke();

    //circulo derecho, encima de linea punteada
    doc
    .undash()
    .lineCap ('miter')
    .circle(0,doc.y, diametro1)
   .fillAndStroke("#222222", "#222222")
   .stroke();

   //linea punteada del bloque derecho
    doc.lineJoin('miter')
   .rect(0, doc.y, ancho_hoja, 0)
   .dash(3, {space: 5})
   .fillAndStroke("#222222", "#222222")
   .stroke();

   //circulo izquierdo, debajo de linea punteada
   doc
   .undash()
   .lineCap ('miter')
   .circle(ancho_hoja, doc.y, diametro1)
  .fillAndStroke("#222222", "#222222")
  .stroke();
//============================================================================

  //descripcion fecha de la parte inferior
  doc.moveDown();
  let fecha=doc.y;
  doc.text('DÍA',20,fecha,{
    width: ancho_hoja,
    align: 'left'
    });
    doc.text('MES',0,fecha,{
        width: ancho_hoja,
        align: 'center'
    });
    doc.text('AÑO',0,fecha,{
        width: ancho_hoja-20,
        align: 'right'
    });

 //fecha de la parte inferior
  let fecha2=doc.y-5;
  doc.text(moment(objeto.FECHA_ATENCION).format('DD'),20,fecha2,{
      width: ancho_hoja,
      align: 'left'
  });
  doc.text(moment(objeto.FECHA_ATENCION).format('MM'),0,fecha2,{
    width: ancho_hoja,
    align: 'center'
});
    doc.text(moment(objeto.FECHA_ATENCION).format('YYYY'),0,fecha2,{
        width: ancho_hoja-20,
        align: 'right'
    });

  //circulos del bloque inferior
  let diametro2=14;
  let separacion_circulito=42;

  for(let c=0;c<11;c++){
    doc
    .lineCap ('miter')
    .circle((separacion_circulito/2)*(c+1),alto_hoja-40, diametro2/2)
    .fillAndStroke("#222222", "#222222")
    .stroke();
}
  
for(let c=0;c<5;c++){
    doc
    .lineCap ('miter')
    .circle(separacion_circulito*(c+1),alto_hoja, diametro2)
    .fillAndStroke("#222222", "#222222")
    .stroke();
}

    // Finalizar el PDF
    doc.end();

}

module.exports = {
    pdfTicket
}
