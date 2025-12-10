let opcionesToast = {
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "10000",
    "extendedTimeOut": "0",
}

/*const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });*/

var socket = io.connect();

socket.on('connection', function (data) {
    console.log(data);
});

//--------------MODULO------------
socket.on('actualizaModulo',function (data){
	menu();
});

socket.on('actualizaFechaPedido',function (data){
	$('#fechaPedido'+data.idVenta).text(moment(data.fechaVenta).locale('es').fromNow());
});

socket.on('actualizaFechaServicio',function (data){
	$('#fechaServicio'+data.idVenta).text(moment(data.fechaVenta).locale('es').fromNow());
});

socket.on('actualizaNombreSucursal',function (data){
    $("#sucursalVentas").text(data.sucursal);
    $("#userSucursal").val(data.id_sucursal);
});

socket.on('actualizaLogoSucursal',function (data){
    $("img.imagenSucursalInicio").attr('src','/imagenes/sucursal/LOGO_'+data.id_sucursal+'_'+data.imagen);
});

socket.on('creaPedido',function (data){
    if(data.esDelivery==1 || data.esDelivery==2){
        let colorBg=(data.esDelivery==1)?'success':'dark';
        $("#listaTodoDelivery ul").prepend(`
        <li class="list-group-item border border-`+colorBg+`" id="delivery`+data.ID_VENTA+`">
            <div class="row">
                <span class="id2 oculto">`+data.ID_VENTA+`</span>
                <div class="col d-flex justify-content-center align-items-center mb-0">
                    <i class="las la-utensils"></i>
                    <h6 class="comensal2" id="cliente`+data.ID_VENTA+`">`+data.CLIENTE+`</h6>
                </div>
                <div class="col d-flex justify-content-center align-items-center mb-0">
                    <i class="las la-id-badge"></i>
                    <h6 class="usuario2" id="usuario2`+data.ID_VENTA+`">`+data.USUARIO+`</h6>
                </div>
                <div class="col d-flex justify-content-center align-items-center mb-0">
                    <i  class="las la-hourglass-half"></i>
                    <h6 class="fecha2" id="fechaPedido`+data.ID_VENTA+`">`+moment(data.FECHA_VENTA).locale('es').fromNow()+`</h6>
                </div>
            </div>
            <div class="row opcionesDelivery">
                <div id="estado`+data.ID_VENTA+`" class="col d-flex justify-content-center align-items-center">
                    <span class="badge badge-`+data.DETALLE_ESTADO_VENTA+`">`+data.ESTADO_VENTA+`</span>
                </div>
                <div class="col d-flex justify-content-center align-items-center">
                    <i class="cursor las la-exchange-alt la-2x pt-1 edita"></i>
                </div>
                <div class="col d-flex justify-content-center align-items-center">
                    <i class="cursor las la-eye la-2x pt-1 detalle"></i>
                </div>
                <div class="col d-flex justify-content-center align-items-center">
                    <i class="cursor las la-cash-register la-2x pt-1 paga"></i>
                </div>
                <div class="col d-flex justify-content-center align-items-center">
                    <i class="cursor cursor las la-trash la-2x pt-1 elimina"></i>
                </div>
                <input type="hidden" name="deliveryId" value="`+data.ID_VENTA+`">
                <input id="estadoVentaId`+data.ID_VENTA+`" type="hidden" name="estadoVentaId" value="2504">
                <input id="esEliminable`+data.ID_VENTA+`" type="hidden" name="esEliminable" value="0">
                <input type="hidden" name="fechaVenta" value="`+data.ID_VENTA+'@'+data.FECHA_VENTA+`">
            </div>
        </li>
        `);

        var options = {
            valueNames: [ 'id2','comensal2', 'usuario2','fecha2' ]
        };

        deliveryList = new List('listaTodoDelivery', options);

        /*Toast.fire({
            icon: 'success',
            title: 'Pedido para: '+data.CLIENTE+', PEDIDO REGISTRADO'
        });*/

        toastr.success('Pedido para: '+data.CLIENTE,'PEDIDO REGISTRADO',opcionesToast);
    }else if(data.esDelivery==0){
        $("#listaTodoMesa ul").prepend(`
        <li class="list-group-item border border-primary" id="mesa`+data.ID_VENTA+`">
            <div class="row">
                <span class="id1 oculto">`+data.ID_VENTA+`</span>
                <div class="col d-flex justify-content-center align-items-center mb-0">
                    <i class="las la-utensils"></i>
                    <h6 class="comensal1" id="zonaMesa`+data.ID_VENTA+`">`+data.MESA+`</h6>
                </div>
                <div class="col d-flex justify-content-center align-items-center mb-0">
                    <i class="las la-id-badge"></i>
                    <h6 class="usuario1">`+data.USUARIO+`</h6>
                </div>
                <div class="col d-flex justify-content-center align-items-center mb-0">
                    <i  class="las la-hourglass-half"></i>
                    <h6 class="fecha1" id="fechaPedido`+data.ID_VENTA+`">`+moment(data.FECHA_VENTA).locale('es').fromNow()+`</h6>
                </div>
            </div>
            <div class="row opcionesMesa">
                <div id="estado`+data.ID_VENTA+`" class="col d-flex justify-content-center align-items-center">
                    <span class="badge badge-`+data.DETALLE_ESTADO_VENTA+`">`+data.ESTADO_VENTA+`</span>
                </div>
                <div class="col d-flex justify-content-center align-items-center">
                    <i class="cursor las la-exchange-alt la-2x pt-1 edita"></i>
                </div>
                <div class="col d-flex justify-content-center align-items-center">
                    <i class="cursor las la-eye la-2x pt-1 detalle"></i>
                </div>
                <div class="col d-flex justify-content-center align-items-center">
                    <i class="cursor las la-cash-register la-2x pt-1 paga"></i>
                </div>
                <div class="col d-flex justify-content-center align-items-center">
                    <i class="cursor cursor las la-trash la-2x pt-1 elimina"></i>
                </div>
                <input type="hidden" name="mesaId" value="`+data.ID_VENTA+`">
                <input id="estadoVentaId`+data.ID_VENTA+`" type="hidden" name="estadoVentaId" value="2504">
                <input id="esEliminable`+data.ID_VENTA+`" type="hidden" name="esEliminable" value="0">
                <input type="hidden" name="fechaVenta" value="`+data.ID_VENTA+'@'+data.FECHA_VENTA+`">
            </div>
        </li>
        `);

        var options = {
            valueNames: [ 'id1', 'comensal1', 'usuario1','fecha1' ]
        };

        mesaList = new List('listaTodoMesa', options);

        /*Toast.fire({
            icon: 'success',
            title: 'Pedido para: '+data.MESA+', PEDIDO REGISTRADO'
        });*/

        toastr.success('Pedido para: '+data.MESA,'PEDIDO REGISTRADO',opcionesToast);
    }else{
        $("#atencionInicio div.botonPedido").addClass('oculto');
    }
    vibracion();
});


socket.on('editaPedido',function (data){
    if(data.esDelivery==1 || data.esDelivery==2){
        $("#listaTodoDelivery #cliente"+data.ID_VENTA).text(data.CLIENTE);
        $("#listaTodoDelivery #usuario2"+data.ID_VENTA).text(data.MOZO);

        /*Toast.fire({
            icon: 'success',
            title: 'Pedido para: '+data.CLIENTE+', PEDIDO ACTUALIZADO'
        });*/

        toastr.success('Pedido para: '+data.CLIENTE,'PEDIDO ACTUALIZADO',opcionesToast);
    }else{
        $("#listaTodoMesa #zonaMesa"+data.ID_VENTA).text(data.MESA);
        $("#listaTodoMesa #usuario1"+data.ID_VENTA).text(data.MOZO);

        /*Toast.fire({
            icon: 'success',
            title: 'Pedido para: '+data.MESA+', PEDIDO ACTUALIZADO'
        });*/
        toastr.success('Pedido para: '+data.MESA,'PEDIDO ACTUALIZADO',opcionesToast);
    }
    vibracion();
});

socket.on('actualizaEstadoPedido',function (data){
    let esDelivery=(data.ES_DELIVERY==1)?'opcionesDelivery':'opcionesMesa'
    $('#pedidoInicio .'+esDelivery+' #estado'+data.ID_VENTA).html(`<span class="badge badge-`+data.DETALLE_ESTADO_VENTA+`">`+data.ESTADO_VENTA+`</span>`);
    /*$('#pedidoDetalle #iconoEstado').removeClass('oculto');
    $("#idEstadoVenta").text(2505);
    $("#esAtendidoVenta").text(1);
    $('#pedidoDetalle #listaDetalle .opcionesDetalle .agrupa0').val(1);
    $('#pedidoDetalle #listaDetalle .opcionesDetalle .agrupa0').removeClass('agrupa0').addClass('agrupa1');*/

	$('#pedidoInicio .'+esDelivery+' #estadoVentaId'+data.ID_VENTA).val(data.ID_ESTADO_VENTA);
	$('#pedidoInicio .'+esDelivery+' #esEliminable'+data.ID_VENTA).val(data.ES_ELIMINABLE);
    
    /*Toast.fire({
        icon: 'success',
        title: 'Se envió pedido a las áreas, PEDIDO ORDENADO'
    });*/

    
    toastr.success('Se envió pedido a las áreas','PEDIDO ORDENADO',opcionesToast);
    vibracion();
});


socket.on('actualizaEstadoPedidoMozo',function (data){
    let esDelivery=(data.ES_DELIVERY==1 || data.ES_DELIVERY==2)?'opcionesDelivery':'opcionesMesa'
    if(data.ES_DELIVERY==0 || data.ES_DELIVERY==1){
        $('#pedidoInicio .'+esDelivery+' #estado'+data.ID_VENTA).html(`<span class="badge badge-`+data.ESTADO_DETALLE+`">`+data.ESTADO_VENTA+`</span>`);
        /*$('#pedidoDetalle #iconoEstado').addClass('oculto');
        $("#idEstadoVenta").text(2506)
        $("#esAtendidoVenta").text(2);
        $('#pedidoDetalle #listaDetalle .opcionesDetalle .agrupa1').val(2);
        $('#pedidoDetalle #listaDetalle .opcionesDetalle .agrupa1').removeClass('agrupa1').addClass('agrupa2');*/
        $('#pedidoInicio .'+esDelivery+' #estadoVentaId'+data.ID_VENTA).val(2506);
        $('#pedidoInicio .'+esDelivery+' #esEliminable'+data.ID_VENTA).val(2);
    }else{
        $('#servicioInicio .'+esDelivery+' #estado'+data.ID_VENTA).html(`<span class="badge badge-`+data.ESTADO_DETALLE+`">`+data.ESTADO_VENTA+`</span>`);
        /*$('#servicioDetalle #iconoEstado').addClass('oculto');
        $("#idEstadoVenta").text(2506)
        $("#esAtendidoVenta").text(2);
        $('#servicioDetalle #listaDetalle .opcionesDetalle .agrupa1').val(2);
        $('#servicioDetalle #listaDetalle .opcionesDetalle .agrupa1').removeClass('agrupa1').addClass('agrupa2');*/
        $('#servicioInicio .'+esDelivery+' #estadoVentaId'+data.ID_VENTA).val(2506);
        $('#servicioInicio .'+esDelivery+' #esEliminable'+data.ID_VENTA).val(2); 
    }

    /*Toast.fire({
        icon: 'success',
        title: 'Se atendió al comensal, PEDIDO ATENDIDO'
    });*/

    if(data.ES_DELIVERY==2){
        toastr.success('Se atendió el servicio','PEDIDO ATENDIDO',opcionesToast);
    }else{
        toastr.success('Se atendió al comensal','PEDIDO ATENDIDO',opcionesToast);
    }
    
    vibracion();
});

socket.on('actualizaStockCarta',function (data){
    if(data.esDelivery==3){
        $('#'+data.tabla+'ProductoDetalle li#producto'+data.ID_PRODUCTO_SUCURSAL+' h6.stockProducto').text(data.STOCK+" "+data.ABREVIATURA_UNIDAD);
    }else{
        $('#productosTodos div#producto'+data.ID_PRODUCTO_SUCURSAL+' h6.stockProducto').text(data.STOCK+" "+data.ABREVIATURA_UNIDAD);
    }
    
});

socket.on('actualizaStockCartaAbastecer',function (data){
    $('#'+data.tabla+'Producto li#producto'+data.ID_PRODUCTO_SUCURSAL+' h6.stockProducto').text(data.STOCK+" "+data.ABREVIATURA_UNIDAD);
});


socket.on('eliminaPedido',function (data){
    $('#'+data.tabla+' #'+data.lugar+data.id).remove();
                    
    if(data.esDelivery==0){
        mesaList.remove('id1', data.id);
    }else{
        deliveryList.remove('id2', data.id);
    }
    
    /*Toast.fire({
        icon: 'warning',
        title: data.mensaje+', PEDIDO ELIMINADO'
    });*/
    vibracion();
    toastr.warning(data.mensaje,'PEDIDO ELIMINADO',opcionesToast);
});


socket.on('actualizaMesas',function (data){
    $('#'+data.tabla+' #listarMesaZona').html(data.msg);
});

socket.on('cerrarVenta',function (data){
    if(data.tipo==2){
        $('#servicioInicio #'+data.esDelivery+' #'+data.esTipo+data.ID_VENTA).remove();
    }else{
        $('#pedidoInicio #'+data.esDelivery+' #'+data.esTipo+data.ID_VENTA).remove();
    }
});


socket.on('actualizaImpresion',function (data){
    $('#chkImpresion').val(data.impresion);
    /*if(data.impresion==1){
		$('#impresionSucursal input[name=chkImpresion]').trigger('click');
	}*/
});

socket.on('sunatPedido',function (data){
    
});


socket.on('sunatVenta',function (data){
    $("#"+data.tabla+"Tabla #"+data.ID_VENTA+" span.botonSunat").html(`
        <a type='Anular' class="crud anular cursor" data-toggle="tooltip" data-placement="top" title="Anular">
            <i class="las la-minus-circle la-2x"></i>
        </a>`
    );
    $("#"+data.tabla+"Tabla #"+objeto.orden+" span.botonesSunat").html(`
        <a type='Email' class="crud email cursor" data-toggle="tooltip" data-placement="top" title="Email">
            <i class="las la-envelope la-2x"></i>
        </a>
        <a type='Xml' class="crud xml cursor" data-toggle="tooltip" data-placement="top" title="Xml">
            <i class="las la-file-code la-2x"></i>
        </a>
        <a type='Cdr' class="crud cdr cursor" data-toggle="tooltip" data-placement="top" title="Cdr">
            <i class="las la-file-signature la-2x"></i>
        </a>`
    );  
});

socket.on('actualizaCaja',function (data){
    if(data.tipo=='saldo'){
        $("#"+data.tabla+"Tabla #"+data.idCaja+" .saldo").text(parseFloat(Math.abs(data.saldo)).toFixed(2));
        $("#"+data.tabla+"Tabla #"+data.idCaja+" .faltante").text(parseFloat(Math.abs(data.faltante)).toFixed(2));
        $("#"+data.tabla+"Tabla #"+data.idCaja+" .sobrante").text(parseFloat(Math.abs(data.sobrante)).toFixed(2));
    }else if(data.tipo=='cierre'){
        $("#"+data.tabla+"Tabla #"+data.idCaja+" .cierre").text(parseFloat(Math.abs(data.cierre)).toFixed(2));
        $("#"+data.tabla+"Tabla #"+data.idCaja+" .faltante").text(parseFloat(Math.abs(data.faltante)).toFixed(2));
        $("#"+data.tabla+"Tabla #"+data.idCaja+" .sobrante").text(parseFloat(Math.abs(data.sobrante)).toFixed(2));
    }
});

/*
socket.on('actualizaSaldoAdmin',function (data){
    $("#usuarioTabla #"+data.idUsuario+" span.saldoPagado").text(parseFloat(data.saldo).toFixed(2));
    toastr[data.tipo](data.cuerpo,data.titulo,opcionesToast);
    vibracion();
});

socket.on('actualizaSaldoSuper',function (data){
    $("#usuarioTabla #"+data.idUsuario+" span.saldoPagado").text(parseFloat(data.saldo).toFixed(2));
    toastr[data.tipo](data.cuerpo,data.titulo,opcionesToast);
    vibracion();
});


socket.on('loginUsuarioAdmin',function (data){
    loginUsuario(data);
});

socket.on('loginUsuarioSuper',function (data){
    loginUsuario(data);
});*/

/*==================FUNCIONES========================*/
/*function loginUsuario(data){
    let logeado;
    if(data.sesion=='A'){
        logeado="<i class='fas fa-check-circle'></i>";
    }else{
        logeado="";
    }
    $("#"+data.idUsuario+" span.logeado").html(logeado);

    toastr[data.tipo](data.cuerpo,data.titulo,opcionesToast);
    vibracion();
}*/


function vibracion(){
    window.navigator.vibrate([1000,300,1000,300,1000,300]);
}

function notificacion(objeto){
    Push.create(objeto.titulo, {
        body: objeto.cuerpo,
        icon: 'img/message.png',
        timeout: 10000,
        vibrate : [100,100,100],
        onClick: function () {
            window.focus();
            this.close();
        }
    });
}
