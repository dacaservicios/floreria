//FUNCIONES
$(document).ready(function() {
	$('[data-toggle="tooltip"]').tooltip();
	$(".select2").select2({
		//placeholder:'Select cuenta',
		dropdownAutoWidth: true,
		width: '100%'
	});
	let tabla="reporte";
	//$('#'+tabla+'Tabla').DataTable(valoresTabla);

	$('#cuenta').off( 'change');
	$('#cuenta').on('change', function () {
		let idCuenta=$(this).val();
		listarReporteMovimiento({idCuenta:idCuenta,idSubMenu:67, tabla:tabla});
	});


	$('#'+tabla+'Info').off( 'click');
	$('#'+tabla+'Info').on( 'click', 'button[name=btnExcel]', function () {
		let accion=$(this).attr('type');
		let idSubMenu=$(this).siblings('span.muestraSubmenu').text();
		let nombreSubmenu=$(this).siblings('span.muestraModulo').text();
		verificaSesion('O', idSubMenu,17,function( ){//EXCEL
			let idCuenta=$('#cuenta').val();
			descargaResumen({idCuenta:idCuenta, tabla:tabla,idSubMenu:idSubMenu});
		});
	});

	$('#'+tabla+'Tabla tbody').off( 'click');
	$('#'+tabla+'Tabla tbody').on( 'click', rutaElemento, function () {
		let accion=$(this).attr('type');
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td.muestraMensaje").text();
		let nombreSubmenu=$('#'+tabla+'Info span.muestraModulo').text();
		let idSubMenu=$('#'+tabla+'Info span.muestraSubmenu').text();

		if($(this).hasClass('elimina')){
			verificaSesion('O', idSubMenu,3,function( ){//ELIMINA
				eliminaMovimiento({id:id,nombre:nombre,nombreSubmenu:nombreSubmenu,orden:id,tabla:tabla,accion:accion});
			});
		}else if($(this).hasClass('edita')){
			verificaSesion('O', idSubMenu,2,function( ){//EDITA
				modalLinkMovimiento({id:id,nombre:nombre,nombreSubmenu:nombreSubmenu,idSubMenu:idSubMenu,tabla:tabla,accion:accion,orden:id,ancho:600,titulo:'EDITAR MOVIMIENTO'});
			});
		}else if($(this).hasClass('estado')){
			verificaSesion('O', idSubMenu,6,function( ){//ESTADO	
				estadoMovimiento({id:id,nombre:nombre,nombreSubmenu:nombreSubmenu,tabla:tabla,accion:accion,orden:id,ancho:600,titulo:'ESTADO '+tabla.toUpperCase()});
			});
		}else if($(this).hasClass('descarga')){
			verificaSesion('O', idSubMenu,7,function( ){//DESCARGA
				let documento=$("#"+tabla+"Tabla #"+id+" .nombreDocumento").text();
				descargaMovimiento({id:id,documento:documento});
			});
		}
	});
});


function listarReporteMovimiento(objeto){
	bloquea();
	$.ajax({    
		type: "POST",
		url: '/vista/reporte/filtro',
		data: {
			id:objeto.idCuenta,
			idSubMenu:objeto.idSubMenu,
			sesId:verSesion(),
			token :verToken()
		},
		success: function(msg) {
			desbloquea();
			$('#listarMovimiento').html(msg);
		},
		error: function(msg) {
			desbloquea();
			mensajeError(msg.responseJSON.error);
		}
	});
}

function excel(objeto){
    mostrar_confirmacion("¿Está seguro de descargar el archivo excel de "+objeto.nombreSubmenu+"?",function(){
		return false;
	},function(){
        $.ajax({
            type: "POST",
            url: "./excel/xls_"+objeto.tabla+objeto.accion+".php",
            data:{},
            success: function(msg) {
                let url="./documentos/excel/"+objeto.tabla+objeto.accion+".xlsx";
                let a = document.createElement('a');
                a.href = url;
                a.download = objeto.nombre;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: function() {
                console.log("No se ha podido obtener la información");
            }
        });
    });	
}


function descargaResumen(objeto){
	$.ajax({    	
		type: "POST",
		url: '/'+objeto.tabla+'/resumen',
		data: {
			id:objeto.idCuenta,
			token:verToken()
		},
		success: function(msg) {
				let url='/reporte/descarga/resumen/'+objeto.idCuenta;
                let a = document.createElement('a');
                a.href = url;
                a.download = objeto.idCuenta;
                a.click();
                window.URL.revokeObjectURL(url);
		},
		error: function(msg) {
			desbloquea();
			mensajeError(msg.responseJSON.error);
		}
	});
};


function descargaMovimiento(objeto){
    let url='/movimiento/descarga/documento/'+objeto.id+'/'+objeto.documento;
	let a = document.createElement('a');
	a.href = url;
	a.download = 'DOC_'+objeto.id+'_'+objeto.documento;
	a.click();
}