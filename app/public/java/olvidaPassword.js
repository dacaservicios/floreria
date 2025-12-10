$(document).ready(function() {
	let tabla='password';
	let email=$("#"+tabla+" input[name=txtCorreo]");
	let elementos={
		email:email
	}

	correo(email);

	$('button.submit').off( 'click');
	$('button.submit').on( 'click', function (e) {
		e.preventDefault();
		validaFormulario({tabla:tabla, elementos:elementos});
	});

	$('button.sesion').off( 'click');
	$('button.sesion').on( 'click', function (e) {
		e.preventDefault();
		inicioFormularioOlvida('login');
	});

	verificaElemento({tabla:tabla, elementos:elementos});
});

function inicioFormularioOlvida(vista){
	bloquea();
	$.ajax({
		type: "post",
		url: '/vista/inicio/'+vista,
		data:{

		},
		success: function(msg) {
			desbloquea();
			$("#inicioFormulario").html(msg);
		},
		error: function(msg) {
			desbloquea();
			mensajeError(msg.responseJSON.error);
		}
	});
}

function olvidaPassword(objeto){
	bloquea();
	$.ajax({
		type: "post",
		url: '/inicio/password',
		data:{
			txtCorreo:objeto.elementos.email.val()
		},
		success: function(msg) {
			desbloquea();
			resp=msg.valor;
			if(resp.resultado){
				mostrar_alerta(resp.mensaje,function(){
					window.location.replace('/');
					return true;
				});
			}else{
				error(objeto.elementos.email)
				mensajeSistema(resp.mensaje);
			}
		},
		error: function(msg) {
			desbloquea();
			resp=msg.responseJSON.error;
			mensajeError(resp);
		}
	});
}



function validaFormulario(objeto){
	validaVacio(objeto.elementos.email);
	if(objeto.elementos.email.val()==""){
		mensajeSistema(0);
	}else if(validaCorreo(objeto.elementos.email)==false){
		mensajeSistema(1);
	}else{
		olvidaPassword(objeto);
	}
}

function enviaEvento(objeto){
	if(objeto.tipo=='email'){
		let elemento=$("#"+objeto.tabla+" input[name="+objeto.name+"]");
		validaVacio(elemento);
	}
}