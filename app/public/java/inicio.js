$(document).ready(function() {
	let root='principal';
	
	$('#'+root).off( 'click');
	$('#'+root).on( 'click', 'button.registrate', function () {
		principal({ruta:'/vista/inicio/register'});
	});

	$('#'+root).on( 'click', 'button.olvidaste', function () {
		principal({ruta:'/vista/inicio/olvidaPassword'});
	});

	$('#'+root).on( 'click', 'button.sesion', function () {
		principal({ruta:'/vista/inicio/login'});
	});
	
});


function principal(objeto){
	bloquea();
	$.ajax({
		type: "post",
		url: objeto.ruta,
		data:{
			
		},
		success: function(msg) {
			desbloquea();
			$("#principal").html(msg)
		},
		error: function(msg) {
			desbloquea();
            resp=msg.responseJSON.error;
			mensajeError(resp);
		}
	});
}
