//FUNCIONES

$(document).ready(function() {
	let tabla="datos";
	let apellidoPaterno=$("#"+tabla+" input[name=apellidoPaterno]");
	let apellidoMaterno=$("#"+tabla+" input[name=apellidoMaterno]");
	let nombre1=$("#"+tabla+" input[name=nombre1]");
	let nombre2=$("#"+tabla+" input[name=nombre2]");
	let dni=$("#"+tabla+" input[name=dni]");
	let fijo=$("#"+tabla+" input[name=fijo]");
	let celular=$("#"+tabla+" input[name=celular]");
	let email=$("#"+tabla+" input[name=correo]");
	let fechaNacimiento=$("#"+tabla+" input[name=fechaNacimiento]");
	let usuarioFoto=$("#"+tabla+" input[name=usuarioFoto]");
	let elementos={
		apellidoPaterno:apellidoPaterno,
		apellidoMaterno:apellidoMaterno,
		nombre1:nombre1,
		nombre2:nombre2,
		dni:dni,
		fijo:fijo,
		celular:celular,
		email:email,
		fechaNacimiento:fechaNacimiento,
		usuarioFoto:usuarioFoto
	}

	$('button#yes').off( 'click');
	$('button#yes').on( 'click', function () {
		verificaSesion( function( ){
			validaFormulario({tabla:tabla, elementos:elementos});
		})
	});

	$('i.imagenUsuario').on( 'click', function () {
		let imagen=$(this).siblings().val();
		let msg = `
		<div class='text-center contenedorImagen ml-auto mr-auto'>
			<img src='../imagenes/usuario/${imagen}' class='rounded imagenFoto'>
		</div>
		`;
		mostrar_general1({titulo:'IMAGEN USUARIO',msg:msg,nombre:$(this).text(),ancho:300});
	});

	verificaElemento({tabla:tabla, elementos:elementos});
});   

function validaFormulario(objeto){
	validaVacio(objeto.elementos.apellidoPaterno);
	validaVacio(objeto.elementos.apellidoMaterno);
	validaVacio(objeto.elementos.nombre1);
	validaVacio(objeto.elementos.dni);
	validaVacio(objeto.elementos.email);
	validaVacio(objeto.elementos.fechaNacimiento);

	if(objeto.elementos.apellidoPaterno.val()=="" || objeto.elementos.apellidoMaterno.val()=="" || objeto.elementos.nombre1.val()=="" || objeto.elementos.email.val()=="" || objeto.elementos.dni.val()=="" || objeto.elementos.fechaNacimiento.val()==""){
		mensajeSistema(0);
	}else if(validaDni(objeto.elementos.dni)==false){
		mensajeSistema(2);
	}else if(validaFijo(objeto.elementos.fijo)==false){
		mensajeSistema(4);
	}else if(validaCelular(objeto.elementos.celular)==false){
		mensajeSistema(5);
	}else if(validaCorreo(objeto.elementos.email)==false){
		mensajeSistema(1);
	}else{
		enviaFormulario(objeto);

	}
}


function enviaFormulario(objeto){
	
	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("documento", 'usuario');

	mostrar_confirmacion("¿Está seguro de cambiar sus datos?",function(){
		return false;
	},function(){
        bloquea();
        $.ajax({    
			type: "POST",
			url: '/acceso/cambiaDatos',
			data: fd,
			dataType: 'json',
			processData: false,
        	contentType: false,
			success: function(msg) {
				desbloquea();
				resp=msg.valor;
				if(resp.resultado){
					$("#general2").modal("hide");
					if(resp.dato.imagen!=''){
						$("#imagenUsuario").attr('src', `/imagenes/usuario/${resp.dato.imagen}`);
					}
					$("#correoMenu").text(resp.dato.correoUsuario.toLowerCase());
					$("#correoHeader").text(resp.dato.correoUsuario.toLowerCase());
				}else{
					mensajeSistema(resp.mensaje);
				}
					
			},
			error: function(msg) {
				desbloquea();
				resp=msg.responseJSON.error;
				mensajeError(resp);
			}
		});
    });
}


function enviaEvento(objeto){
	if(objeto.tipo=='text'){
		if(objeto.name=='apellidoPaterno' || objeto.name=='apellidoMaterno' || objeto.name=='nombre1'){
			let elementoInput=$("#"+objeto.tabla+" input[name="+objeto.name+"]");
			validaVacio(elementoInput);
		}
	}else if(objeto.tipo=='fecha'){
		validaVacio(objeto.elementos.fechaNacimiento);
	}else if(objeto.tipo=='email'){
		validaCorreo(objeto.elementos.email);
	}else if(objeto.tipo=='tel'){
		if(objeto.name=='fijo'){
			validaFijo(objeto.elementos.fijo);
		}else if(objeto.name=='celular'){
			validaCelular(objeto.elementos.celular);
		}else if(objeto.name=='dni'){
			validaDni(objeto.elementos.dni);
		}
	}

	texto(objeto.elementos.apellidoPaterno);
	texto(objeto.elementos.apellidoMaterno);
	texto(objeto.elementos.nombre1);
	texto(objeto.elementos.nombre2);
	numero(objeto.elementos.dni);
	numero(objeto.elementos.fijo);
	numero(objeto.elementos.celular);
	correo(objeto.elementos.email);

}
