$(document).ready(function() {
	let tabla='register';
	let email=$("#"+tabla+" input[name=txtCorreo]");
	let paterno=$("#"+tabla+" input[name=txtPaterno]");
	let nombre=$("#"+tabla+" input[name=txtNombre]");
	let elementos={
		email:email,
		paterno:paterno,
		nombre:nombre
	}

	correo(email);
	textoNumero(paterno);
	textoNumero(nombre);

	$('button.submit').off( 'click');
	$('button.submit').on( 'click', function (e) {
		e.preventDefault();
		validaFormulario({tabla:tabla, elementos:elementos});
	});

	$('button.sesion').off( 'click');
	$('button.sesion').on( 'click', function (e) {
		e.preventDefault();
		inicioFormularioRegister('login');
	});

});

function inicioFormularioRegister(vista){
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

function register(objeto){
	bloquea();
	$.ajax({
		type: "post",
		url: '/inicio/register',
		data:{
			txtCorreo:objeto.elementos.email.val(),
			txtPaterno:objeto.elementos.paterno.val(),
			txtNombre:objeto.elementos.nombre.val()
		},
		success: function(msg) {
			desbloquea();
			resp=msg.valor;
			if(resp.resultado){
				socket.emit('registroUsuarioAdmin',{
					usuario: resp.info,
					titulo: 'USUARIO REGISTRADO',
					cuerpo : 'Un nuevo usuario se ha registrado: '+resp.info.PATERNOUSUARIO+' '+resp.info.NOMBRE1USUARIO,
					tipo : 'success',
					nivelAdmin : "N2"
				});

				socket.emit('registroUsuarioSuper',{
					usuario: resp.info,
					titulo: 'USUARIO REGISTRADO',
					cuerpo : 'Un nuevo usuario se ha registrado: '+resp.info.PATERNOUSUARIO+' '+resp.info.NOMBRE1USUARIO,
					tipo : 'success',
					nivelSuper : "N1"
				});
				mostrar_alerta(resp.mensaje,function(){
					window.location.replace('/');
					return true;
				});
			}else{
				error(objeto.elementos.correo)
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
	validaVacio(objeto.elementos.paterno);
	validaVacio(objeto.elementos.nombre);

	if(objeto.elementos.email.val()=="" || objeto.elementos.paterno.val()=="" || objeto.elementos.nombre.val()==""){
		mensajeSistema(0);
	}else if(validaCorreo(objeto.elementos.email)==false){
		mensajeSistema(1);
	}else{
		register(objeto);
	}
}

function enviaEvento(objeto){
	if(objeto.tipo=='text'){
		let elemento=$("#"+objeto.tabla+" input[name="+objeto.name+"]");
		validaVacio(elemento);
	}
}