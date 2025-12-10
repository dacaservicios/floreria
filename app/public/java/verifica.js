//FUNCIONES
$(document).ready(function() {
	let tabla="verifica";

    $('#'+tabla).off( 'click');
	$('#'+tabla).on( 'click', 'button[name=btnBuscar]', function () {
		let idSubMenu=$(this).siblings('input').val();
		verificaSesion( function( serverResponse ){
			if(serverResponse==100){
				validaBusqueda({idSubMenu:idSubMenu,tabla:tabla});
			}else{
				mensajes(serverResponse);
			}
		});
	});


	$('#'+tabla).off( 'keyup');
    $('#'+tabla).on( 'keyup','input[type=text]',function(){
        let name=$(this).attr("name");
        enviaEventoSalida({tabla:tabla,opcion:'input',name:name});
    });
});


function muestraDato(objeto){
	let dato=$('#'+objeto.tabla+' input[name=selecDato]').val();
	bloquea();
	$.ajax({
		type: "POST",
		url: './vista/'+objeto.tabla+'/v_'+objeto.tabla+'Dato.php',
		data:{
			idSubMenu: objeto.idSubMenu,
			dato: dato,
			tabla: objeto.tabla
		},
		success: function(msg) {
			desbloquea();
			dataTablesBusqueda({msg:msg,tabla:objeto.tabla,tipo:'Tabla'});
		},
		error: function() {
			console.log("No se ha podido obtener la información");
		}
	});
}


function validaBusqueda(objeto){
	let dato=$('#'+objeto.tabla+' input[name=selecDato]');
	validaVacio(dato);

	if(dato.val()==""){
		mensajes(6);
		return false;
	}else{
		muestraDato(objeto)
	}
}


function enviaEventoSalida(objeto){
	let dato=$('#'+objeto.tabla+' input[name=selecDato]');
	if(objeto.opcion=='input'){
		validaVacio(dato);
	}

	documento(dato);

}

