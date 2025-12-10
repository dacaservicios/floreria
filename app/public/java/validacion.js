// JavaScript Document
/*INICIA VALIDACIONES*/


$(function() {
	$('[data-toggle="tooltip"]').tooltip();
	nobackbutton();
});

function focusInput(){
    $("input.focus").on('click',function(){
        $(this).select();
    });
}

function verToken(){
    if(localStorage.getItem("token")){
        let token=localStorage.getItem("token");
        return token;
    }else{
        cerrarSesion();
    }
}

function verSesion(){
    let sesion=$("#userSesion").val();
    return sesion;
}

function verSucursal(){
    let sesion=$("#userSucursal").val();
    return sesion;
}

function verNivel(){
    let sesion=$("#userNivel").val();
    return sesion;
}

async function cerrarSesion() {
    bloquea();
    let body={

    }
    try{
        const salir = await axios.put("/api/acceso/logout/"+verSesion(),body,{ 
            headers:{
                authorization: `Bearer ${verToken() }`
            } 
        });
        const resp=salir.data.valor;
        desbloquea();
        mensajeSistema(3);
        location.reload();  
    }catch (err) {
        desbloquea();	
        message=err.response.data.error.message;
        errno=err.response.data.error.errno;
        mensajeSistema(message);
    }
}
// JavaScript Document
//*****************INICIA VALIDACIONES

function nobackbutton(){
	window.location.hash="no-back-button";
	window.location.hash="Again-No-back-button" //chrome
	window.onhashchange=function(){
			window.location.hash="no-back-button";
	}
 }

 function bloquea(texto=''){
	$.blockUI({ 
		  message: `<div class="spinner-border text-white" role="status"></div>
					<div class="text-white">${texto}</div>`,
		  overlayCSS: {
			opacity: 0.8,
			backgroundColor: '#000'
		  }
	});
}
function desbloquea(){
	$.unblockUI();
}


var verificaSesion = async function(tipo, idSubmenu,callback ){
	let body={
		idSubmenu:idSubmenu,
		tipo:tipo,
		sesId:verSesion()
	}
	try {
        const sesion= await axios.post('/api/acceso/sesion',body,{
            headers: 
            { 
                authorization: `Bearer ${verToken()}`
            } 
        });

        let resp=sesion.data.valor;
		if(resp.resultado===false){
			if(resp.sesion=='A'){
				mensajeSistema(resp.mensaje);
			}else{
				Swal.fire({
					title: "Info!",
					text: resp.mensaje,
					icon: "info",
					customClass: {
						confirmButton: 'btn btn-info'
					},
					confirmButtonText: 'OK',
					buttonsStyling: false,
					allowOutsideClick: false,
				}).then(function (result) {
					if (result.isConfirmed) {
						cerrarSesionAutomatico();
					}
				});
			}
		}else{
			if(resp.resultado){
            	callback();
			}else{
				mensajeSistema(resp.mensaje);
			}
		}
    }catch (err) {
        mensajeSistema(err.response.data.error.message);
    }
}

async function cerrarSesionAutomatico() {
    bloquea();
    let body={

    }
    try{
        const salir = await axios.put("/api/acceso/logout/"+verSesion(),body,{ 
            headers:{
                authorization: `Bearer ${verToken() }`
            } 
        });
        const resp=salir.data.valor;
        desbloquea();
        location.reload();  
    }catch (err) {
        desbloquea();	
        message=err.response.data.error.message;
        errno=err.response.data.error.errno;
        mensajeSistema(message);
    }
}

/*VALIDACION CSS */
function noCoincide(elemento){
	elemento.removeClass('borrarErrores');	
	elemento.addClass('errores');
	elemento.siblings('div.formato').addClass('oculto');
	elemento.siblings('div.vacio').addClass('oculto');
	elemento.siblings('div.mensaje').removeClass('oculto');
}

function coincide(elemento){
	elemento.addClass('borrarErrores');	
	elemento.removeClass('errores');
	elemento.siblings('div.formato').addClass('oculto');
	elemento.siblings('div.vacio').addClass('oculto');
	elemento.siblings('div.mensaje').addClass('oculto');
}

function noformato(elemento){
	elemento.removeClass('borrarErrores');	
	elemento.addClass('errores');
	elemento.siblings('div.formato').removeClass('oculto');
	elemento.siblings('div.vacio').addClass('oculto');
}

function formato(elemento){
	elemento.removeClass('errores');
	elemento.addClass('borrarErrores');
	elemento.siblings('div.formato').addClass('oculto');
	elemento.siblings('div.vacio').addClass('oculto');
}

function novacio(elemento){
	elemento.removeClass('errores');
	elemento.addClass('borrarErrores');
	elemento.siblings('div.vacio').addClass('oculto');
}

function vacio(elemento){
	elemento.removeClass('borrarErrores');
	elemento.addClass('errores');
	elemento.siblings('div.vacio').removeClass('oculto');
	elemento.siblings('div.formato').addClass('oculto');
}

function quitaValidacion(elemento){
	elemento.removeClass('borrarErrores');
	elemento.removeClass('errores');
	elemento.siblings('div.vacio').addClass('oculto');
	elemento.siblings('div.formato').addClass('oculto');
}

function quitaValidacionSelect(elemento){
	elemento.siblings('span.select2').find('span.select2-selection--single').removeClass('errores');
	elemento.siblings('span.select2').find('span.select2-selection--single').removeClass('borrarErrores');
	elemento.siblings('div.vacio').addClass('oculto');
}

function validaVacioSelect(elemento){
	if(elemento.val()==""){
		elemento.siblings('span.select2').find('span.select2-selection--single').addClass('errores');
		elemento.siblings('div.vacio').removeClass('oculto');
	}else{
		elemento.siblings('span.select2').find('span.select2-selection--single').removeClass('errores');
		elemento.siblings('span.select2').find('span.select2-selection--single').addClass('borrarErrores');
		elemento.siblings('div.vacio').addClass('oculto');
	}
}

function quitaValidacionTodo(tabla){
	$("#"+tabla+" input").removeClass('borrarErrores');
	$("#"+tabla+" select").siblings('span.select2').find('span.select2-selection--single').removeClass('borrarErrores');
	$("#"+tabla+" textarea").removeClass('borrarErrores');


	$("#"+tabla+" input").removeClass('errores');
	$("#"+tabla+" select").siblings('span.select2').find('span.select2-selection--single').removeClass('errores');
	$("#"+tabla+" textarea").removeClass('errores');
	
	$("#"+tabla+" input").siblings('div.vacio').addClass('oculto');
	$("#"+tabla+" select").siblings('div.vacio').addClass('oculto');
	$("#"+tabla+" textarea").siblings('div.vacio').addClass('oculto');

	$("#"+tabla+" input").siblings('div.formato').addClass('oculto');
	$("#"+tabla+" select").siblings('div.formato').addClass('oculto');
	$("#"+tabla+" textarea").siblings('div.formato').addClass('oculto');
}

function limpiaElementos(tabla){
	$("#"+tabla+" input").val('');
	$("#"+tabla+" textarea").val('');
	$("#"+tabla+" select").val('').trigger('change.select2');
}

function limpiaTodo(tabla){
	limpiaElementos(tabla);
	quitaValidacionTodo(tabla);
	$("#"+tabla+" span.muestraId").text(0);
	$("#"+tabla+" span.muestraNombre").text('');
	$("#"+tabla+" span#botonGuardar").text('Crear');
}

function limpiaTodoConfiguracion(tabla){
	limpiaElementos(tabla);
	quitaValidacionTodo(tabla);
	$("#"+tabla+" span.muestraId").text(0);
	$("#"+tabla+" span.muestraNombre").text('');
}

function muestraMensaje(objeto){
    let nombre="";
    let separa=" ";
    let dato;
    let tipo;

    if(objeto.evento){
        dato=objeto.evento.find('.muestraMensaje');
        muestra='TEXTO';
    }else{
		dato=$('#'+objeto.tabla).find('.muestraMensaje');
		muestra=''; 
    }
  
    for(let n=0;n<dato.length;n++){
        if(muestra=='TEXTO'){
            nombre=nombre+separa+dato.eq(n).text();
        }else{
			tipo=dato.eq(n).prop('tagName');
            if(tipo=='SELECT'){
                nombre=nombre+separa+dato.eq(n).find('option:selected').text();
            }else if(tipo=='INPUT' || tipo=='TEXTAREA'){
				nombre=nombre+separa+dato.eq(n).val();
            }
        }
        separa=" ";
    }
	return nombre;
}

function validaVacio(elemento){
	if(elemento.val()==''){
		vacio(elemento);
		return true;
	}else{
		novacio(elemento);
		return false;
	}
}

function validaCorreo(correo){
	if(formatoCorreo(correo.val())){
		formato(correo);
		return true;
	}else{
		if(correo.val()==''){
			vacio(correo);
			return false;
		}else{
			noformato(correo);
			return false;
		}
	}
}

function validaCorreoNo(correo){
	if(correo.val()==''){
		quitaValidacion(correo);
		return true;
	}else{
		if(formatoCorreo(correo.val())){
			formato(correo);
			return true;
		}else{
			if(correo.val()==''){
				vacio(correo);
				return false;
			}else{
				noformato(correo);
				return false;
			}
		}
	}
}

function validaPassword(password){
	if(formatoPassword(password.val())){
		formato(password);
		return true;
	}else{
		if(password.val()==''){
			vacio(password);
			return false;
		}else{
			noformato(password);
			return false;
		}
	}
}


function validaAbreviatura(abreviatura){
	abreviaturaRegex(abreviatura);
	if(formatoAbreviatura(abreviatura.val())){
		formato(abreviatura);
		return true;
	}else{
		if(abreviatura.val()==''){
			vacio(abreviatura);
			return false;
		}else{
			noformato(abreviatura);
			return false;
		}
	}
}

function validaRuc(ruc){
	rucRegex(ruc);
	if(formatoRuc(ruc.val())){
		formato(ruc);
		return true;
	}else{
		if(ruc.val()==''){
			vacio(ruc);
			return false;
		}else{
			noformato(ruc);
			return false;
		}
	}
}

function validaCelular(celular){
	movilRegex(celular);
	if(formatoCelular(celular.val())){
		formato(celular);
		return true;
	}else{
		if(celular.val()==''){
			vacio(celular);
			return false;
		}else{
			noformato(celular);
			return false;
		}
	}
}

function validaCelularSolo(celular){
	movilRegex(celular);
	if(formatoCelular(celular.val())){
		formato(celular);
		return true;
	}else{
		if(celular.val()==''){
			return true
		}else{
			noformato(celular);
			return false;
		}
	}
}

function validaFijo(fijo){
	if(formatoFijo(fijo.val())){
		formato(fijo);
		return true;
	}else{
		if(fijo.val()==''){
			vacio(fijo);
			return false;
		}else{
			noformato(fijo);
			return false;
		}
	}
}

function validaDocumento(documento){
	documentoRegex(documento);
	if(formatoDocumento(documento.val())){
		formato(documento);
		return true;
	}else{
		if(documento.val()==''){
			vacio(documento);
			return false;
		}else{
			noformato(documento);
			return false;
		}
	}
}
//***********TERMINA VALIDACIONES



function validaDni(dni){
	if(formatoDni(dni.val())){
		borrarErrores(dni);
		return true;
	}else{
		errores(dni);
		if(dni.val()==''){
			dni.siblings('div.validacion').text('¡Campo obligatorio!');
		}else{
			dni.siblings('div.validacion').text('¡El DNI debe tener 8 dígitos!');
		}
		return false;
		
	}
}

function validaFijo(fijo){
	if(fijo.val()==''){
		quitaValidacion(fijo);
		return true;
	}else{
		if(formatoFijo(fijo.val())){
			borrarErrores(fijo);
			return true;
		}else{
			errores(fijo);
			fijo.siblings('div.validacion').text('¡El teléfono fijo debe tener entre 6 y 8 dígitos!');
			return false;
		}
	}
}


function validaCelularNo(celular){
	if(celular.val()==''){
		quitaValidacion(celular);
		return true;
	}else{
		if(formatoCelular(celular.val())){
			borrarErrores(celular);
			return true;
		}else{
			errores(celular);
			if(celular.val()==''){
				celular.siblings('div.validacion').text('¡Campo obligatorio!');
			}else{
				celular.siblings('div.validacion').text('¡El teléfono móvil debe tener 9 dígitos!');
			}
			return false;
		}
	}
}

function validaFecha(fecha){
	if(formatoFecha(fecha.val())){
		borrarErrores(fecha);
		return true;
	}else{
		errores(fecha);
		return false;
	}
}



function validaNumero(numero){
	if(formatoNumero(numero.val())){
		return true;
	}else{
		numero.val(numero.val().substring(0,2));
	}
}

//MASCARAS
function numeroMask(valor){
	valor.inputmask("[0-9]{1,}",{showMaskOnFocus : false, showMaskOnHover : false });
}

function textoMask(valor){
	valor.inputmask("[A-Za-záéíóúÁÉÍÓÚñÑ ]{1,}",{showMaskOnFocus : false, showMaskOnHover : false });
}

function movilMask(valor){
	valor.inputmask({
		mask : "*{1}9{8}",
		definitions: {
			'*': {
			  validator: "[9]"
			}
		  }
	});
}

function fijoMask(valor){
	valor.inputmask("9{7,9}",{showMaskOnFocus : false, showMaskOnHover : false });
}

function ordenarMask(valor){
	valor.inputmask("9{1,2}[.]9{0,2}",{showMaskOnFocus : false, showMaskOnHover : false });
}

function documentoMask(valor){
	valor.inputmask("9{8,12}",{showMaskOnFocus : false, showMaskOnHover : false });
}

function fechaMask(valor){
	valor.inputmask("99-99-9999",{showMaskOnFocus : false, showMaskOnHover : false });
}

function decimalMask(valor){
	valor.inputmask("9{0,5}[,]9{0,3}[.]9{0,2}",{showMaskOnFocus : false, showMaskOnHover : false });
}

function montoMask(valor){
	valor.inputmask("[-]9{0,5}[,]9{0,3}[.]9{0,2}",{showMaskOnFocus : false, showMaskOnHover : false });
}
function descuentoMask(valor){
	valor.inputmask("9{1,3}[.]9{0,2}",{showMaskOnFocus : false, showMaskOnHover : false });
}

function correoMask(valor){
	valor.inputmask({
		mask : "*{3,20}@{1}a{2,20}.{1}a{2,3}",
		definitions: {
			'*': {
			  validator: "[0-9A-Za-z_\-]",
			  casing: "lower"
			}
		  }
	});
}

//MASCARAS REGEX
function correoRegex(valor){
	valor.inputmask({
		regex: "^[0-9A-Za-z_.\-]{3,30}[@]{1}[A-Za-z]{2,17}[.]{1}[A-Za-z]{2,10}[.]{0,1}[A-Za-z]{0,3}[.]{0,1}[A-Za-z]{0,3}$",showMaskOnFocus : false, showMaskOnHover : false
	});
}

function passRegex(valor){
	valor.inputmask( {
		regex: "[A-Za-z0-9!¡#$%&()*+\\-./:;=¿?@[]{|}]{6,16}",showMaskOnFocus : false, showMaskOnHover : false
	});

}

function fechaRegex(valor){
	valor.inputmask({regex: "(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)[0-9]{2}"});
}

function fijoRegex(valor){
	valor.inputmask({regex: "[0-9]{6,8}"});
}

function movilRegex(valor){
	valor.inputmask({regex: "9[0-9]{8}"});
}

function serieRegex(valor){
	valor.inputmask({regex: "[A-Za-z]{0,3}[-]{0,1}[0-9]{1,4}"});
}

function telefonoRegex(valor){
	valor.inputmask({regex: "[0-9#+\\-]{6,15}"});
}

function ordenaRegex(valor){
	valor.inputmask({regex: "[0-9]{1,2}[.]{1}[0-9]{0,2}"});
}

function rucRegex(valor){
	valor.inputmask({regex: "[1-9]{1}[0-9]{10}"});
}

function documentoRegex(valor){
	valor.inputmask({regex: "[0-9]{8,20}"});
}

function textoRegex(valor){
	valor.inputmask({regex: "[A-Za-záéíóúÁÉÍÓÚñÑ ]{1,}"});
}

function abreviaturaRegex(valor){
	valor.inputmask({regex: "[A-Z]{4}"});
}

function textoNumeroRegex(valor){
	valor.inputmask({regex: "[A-Za-z0-9áéíóúÁÉÍÓÚñÑ ]{1,}"});
}

function textoNumeroEspecialRegex(valor){
	valor.inputmask({regex: "[A-Za-z0-9áéíóúÁÉÍÓÚñÑ/ ]{1,}"});
}

function numeroRegex(valor){
	valor.inputmask({regex: "[0-9]{1,}"});
}

function numeroRegexSinCero(valor){
	valor.inputmask({regex: "[1-9]{1,2}"});
}

function numberRegex(valor){
	valor.inputmask({regex: "[0-9]{1,3}"});
}

function comentarioRegex(valor){
	valor.inputmask({regex: "[0-9A-Za-z,áéíóúÁÉÍÓÚñÑº?¿!¡_\\-.#:/()&\\n ]{1,}"});
}

function expedienteRegex(valor){
	valor.inputmask({regex: "[A-Za-z0-9/\\-]{1,20}"});
}

function userRegex(valor){
	valor.inputmask({regex: "[A-Za-z0-9]{1,}"});	
}

function passRegex(valor){
	valor.inputmask({regex: "[A-Za-z0-9!¡#$%&()*+\\-./:;<=>¿?@[]{|}]{6,16}"});	
}

function notaDebitoRegex(valor){
	valor.inputmask({regex: "[0-9/]{1,}"});
}

function decimalRegex(valor){
	valor.inputmask({regex: "[0-9]{0,5}[.]{0,1}[0-9]{0,2}"});
}

function quitaCaracter(valor,cadena){
	let nuevoValor=valor.replace(new RegExp(cadena,"g") ," ");

	return nuevoValor;
}

function comprobanteRegex(valor){
	valor.inputmask({regex: "[A-Z]{1}[0-9]{3}"});
}


function obtenerExtension(cadena){
	let tipo;
	let path_splitted = cadena.split('.');
	let extension = path_splitted.pop();
	if(extension=='jpg' || extension=='png' || extension=='jpeg'){
		tipo='imagen'
	}else if(extension=='pdf'){
		tipo='documento'
	}
	return tipo;
}

//FORMATOS EXPRESIONES ESPECIALES
function formatoCorreo(correo){
	let formato=/^[a-zA-Z0-9_.\\-]{3,30}[@]{1}[a-zA-Z]{2,17}[.]{1}[a-zA-Z]{2,10}[.]{0,1}[A-Za-z]{0,3}[.]{0,1}[A-Za-z]{0,3}$/
	return formato.test(correo);
}

function formatoPassword(password){
	//let formato=/^[A-Za-z0-9!¡#$%&()*+\-\./:;=¿?@\[\]\{\|\}]{6,16}$/
	let formato=/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!¡#$%&()*+\-\./:;=¿?@\[\]\{\|\}]).{6,16}$/
	return formato.test(password);
}

function formatoAbreviatura(abreviatura){
	let formato=/^[A-Z]{4}$/
	return formato.test(abreviatura);
}

function formatoFecha(fecha){
	let formato=/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)[0-9]{2}$/
	return formato.test(fecha);
}

function formatoCelular(celular){
	let formato=/^9[0-9]{8}$/
	return formato.test(celular);
}

function formatoFijo(fijo){
	let formato=/^[1-9]{6,8}$/
	return formato.test(fijo);
}

function formatoTelefono(fijo){
	let formato=/^[0-9#+\\-]{6,15}$/
	return formato.test(fijo);
}

function formatoRuc(ruc){
	let formato=/^[0-9]{11}$/
	return formato.test(ruc);
}

function formatoOperacion(operacion){
	let formato=/^[0-9]{11}$/
	return formato.test(operacion);
}

function formatoDni(fijo){
	let formato=/^[0-9]{8}$/
	return formato.test(fijo);
}

function formatoInterbancario(interbancario){
	let formato=/^[0-9]{20}$/
	return formato.test(interbancario);
}

function formatoCuenta(cuenta){
	let formato=/^[0-9]{10,20}$/
	return formato.test(cuenta);
}

function formatoTarjeta(tarjeta){
	let formato=/^[0-9]{15,16}$/
	return formato.test(tarjeta);
}

function formatoDocumento(fijo){
	let formato=/^[0-9]{8,20}$/
	return formato.test(fijo);
}

function formatoNumero(numero){
	let formato=/^([1-9]{1}|[1-9]{1}[0-9]{1}|100)$/
	return formato.test(numero);
}

function formatoNumber(numero){
	if(numero.val()<100 && numero.val()>0){
		return true;
	}else{
		numero.val(numero.val().substring(0,2));
	}
}

/*Swal.fire({
	title: 'Do you want to save the changes?',//texto o html
	icon: 'info',
	width: 600,
	padding: '3em',
  	color: '#716add',
	showCloseButton: true,
	allowOutsideClick: false,
	keydownListenerCapture:true,
	html:
		'You can use <b>bold text</b>, ' +
		'<a href="//sweetalert2.github.io">links</a> ' +
		'and other HTML tags',
	showConfirmButton: true,
	confirmButtonText: 'Save',
	confirmButtonColor: '#3085d6',
	showDenyButton: true,
	denyButtonText: `Don't save`,
	denyButtonColor: '#d33',
	showCancelButton: true,
	cancelButtonText:`Cancel`,
  	cancelButtonColor: '#d33',
	imageUrl: 'https://unsplash.it/400/200',
  	imageWidth: 400,
  	imageHeight: 200,
  }).then((result) => {
	//Read more about isConfirmed, isDenied below
	if (result.isConfirmed) {
	  Swal.fire({
		icon: 'success', //success,error,warning,info,question
		title: 'Saved!',
		text: 'Something went wrong!',
		//footer: '<a href="">Why do I have this issue?</a>'
	  })
	} else if (result.isDenied) {
	  Swal.fire({
		icon: 'info',
		title: 'Changes are not saved...',
		text: 'Something went wrong!',
		//footer: '<a href="">Why do I have this issue?</a>'
	  })
	}
  })*/

function success(texto,titulo){
	Swal.fire({
		title: titulo,
		text: texto,
		icon: "success",
		customClass: {
			confirmButton: 'btn btn-success'
		},
		buttonsStyling: false,
		allowOutsideClick: false
	});
}

function info(texto,titulo='info') {
	Swal.fire({
		title: titulo,
		text: texto,
		icon: "info",
		customClass: {
			confirmButton: 'btn btn-info'
		},
		buttonsStyling: false,
		allowOutsideClick: false,
	});
}

function info2(texto,funcionSi,titulo='info') {
	Swal.fire({
		title: titulo,
		text: texto,
		icon: "info",
		customClass: {
			confirmButton: 'btn btn-info'
		},
		buttonsStyling: false,
		allowOutsideClick: false,
	}).then(function (result) {
		funcionSi();
	})
}

function warning(texto,titulo="Warning") {
	Swal.fire({
		title: titulo,
		text: texto,
		icon: "warning",
		customClass: {
			confirmButton: 'btn btn-warning'
		},
		buttonsStyling: false,
		allowOutsideClick: false,
	});
}

function error(texto,titulo="Error") {
	Swal.fire({
		title: titulo,
		text: texto,
		icon: "error",
		customClass: {
			confirmButton: 'btn btn-danger'
		},
		buttonsStyling: false,
		allowOutsideClick: false,
	});
}

function confirm(texto,funcionNo,funcionSi,titulo="¿Está seguro de continuar?") {
    Swal.fire({
      title: titulo,
      html: texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
	  cancelButtonText:'Cancelar',
      confirmButtonText: 'Si, estoy de acuerdo',
      customClass: {
		confirmButton: 'btn btn-primary',
		cancelButton: 'btn btn-secondary ml-1',
		},
	  allowOutsideClick: false,
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        /*Swal.fire({
          icon: "success",
          title: accion,
      	  text: "¡Se ha "+accion+" con éxito el registro "+dato+'!',
          //confirmButtonClass: 'btn color2',
        });*/
		funcionSi();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
		  funcionNo();
        /*Swal.fire({
		  title: 'Cancelado',
      	  text: '¡No se efectuaron los cambios!',
          icon: 'info',
          customClass: {
			confirmButton: 'btn btn-info'
			},
        });*/
      }
    })
}

function confirmSupervisor(texto,funcionNo,funcionSi,titulo="¿Está seguro de continuar?") {
    Swal.fire({
      title: titulo,
      html: texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
	  cancelButtonText:'Cancelar',
      confirmButtonText: 'Autorizar',
      customClass: {
		confirmButton: 'btn btn-primary',
		cancelButton: 'btn btn-secondary ml-1',
		},
	  allowOutsideClick: false,
      buttonsStyling: false,

	  // 🚀 PROPIEDADES CLAVE PARA SOLICITAR INPUT
		input: 'password', // Usamos 'password' para que el código no se vea
		inputLabel: 'Código de Supervisor',
		inputPlaceholder: '********',

		
		// 🚀 CLAVE: Función que se ejecuta al abrir la alerta
      didOpen: () => {
          // Acceder al campo de input de SweetAlert2
          const $input = $('#swal2-input'); 

          // 1. Restringir a 6 dígitos MIENTRAS se escribe (maxlength)
          $input.attr('maxlength', 6);

          // 2. Restringir a solo números en tiempo real (manejar el evento 'input')
          $input.on('input', function() {
              // Reemplazar cualquier cosa que no sea un dígito (0-9) por una cadena vacía
              this.value = this.value.replace(/[^0-9]/g, '');
          });
      },

      // El 'inputValidator' sigue siendo necesario para validar el resultado final
      inputValidator: (value) => {
        if (!/^\d{6}$/.test(value)) {
            return 'El código debe ser numérico y tener exactamente 6 dígitos.';
        }
        return null;
      },


		// 🚀 CLAVE: Función que se ejecuta antes de confirmar
      preConfirm: (codigoIngresado) => {
			// Llamada AJAX con Axios al servidor para validar
			return (async () => {
				const supervisor = await axios.get("/api/venta/clave/"+codigoIngresado+"/"+verSesion(),{ 
					headers:{authorization: `Bearer ${verToken()}`} 
				});
				var resp=supervisor.data.valor;
				if(resp && resp.autorizado ===true){ 
					// Autorización exitosa: Devolvemos true. La promesa se resuelve.
					return true; 
				} else {
					// Autorización fallida por lógica del negocio (ej. código incorrecto)
					Swal.showValidationMessage(`Error: Código de supervisor incorrecto`);
					$('#swal2-input').val('');
					return false; // Evita que se cierre el modal
				}
			})();
		}

    }).then(function (result) {
      if (result.value) {
        /*Swal.fire({
          icon: "success",
          title: accion,
      	  text: "¡Se ha "+accion+" con éxito el registro "+dato+'!',
          //confirmButtonClass: 'btn color2',
        });*/
		funcionSi();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
		  funcionNo();
        /*Swal.fire({
		  title: 'Cancelado',
      	  text: '¡No se efectuaron los cambios!',
          icon: 'info',
          customClass: {
			confirmButton: 'btn btn-info'
			},
        });*/
      }
    })
}

async function cerrarSesionToken() {
	let body={

	}
	try {
        const exToken= await axios.put('/api/acceso/terminaToken/'+verSesion(),body,{
            headers: 
            { 
                authorization: 'Bearer '+verToken()
            } 
        });
        let resp=exToken.data.valor;
        desbloquea();
        if(resp.resultado){
            location.reload();
        }else{
            mensajeSistema(resp.info.mensaje);
        }
    }catch (err) {
        desbloquea();	message=err.response.data.error.message;
		errno=err.response.data.error.errno;
		mensajeSistema(message);
    }
}

function mensajeSistema(codigo){
	let texto='';
	if(codigo==0){
        texto='¡Los campos indicados no pueden estar vacios, o no cumplen alguna condición!';
    }else if(codigo==1){
        texto='¡El formato de correo electrónico no es correcto!';
    }else if(codigo==2){
        texto='¡El DNI debe tener 8 dígitos!';
    }else if(codigo==3){
        texto='¡Su tiempo de sesión ha expirado!, debe iniciar sesión!';
		window.location.replace('/');
    }else if(codigo==4){
        texto='¡El teléfono fijo debe tener entre 6 y 8 dígitos!';
    }else if(codigo==5){
        texto='¡El teléfono móvil debe tener 9 dígitos!';
    }else if(codigo==6){
        texto='¡El RUC debe tener 11 dígitos!';
    }else if(codigo==7){
        texto='¡Los campos no pueden tener valor cero!';
    }else if(codigo==8){
        texto='¡El PTP debe tener 9 dígitos!';
    }else if(codigo==9){
        texto='¡El carnet de extranjería debe tener 9 dígitos!';
    }else if(codigo==10){
        texto='¡Usted no tiene acceso a esta opción!';
		window.location.replace('/');
    }else if(codigo==11){
        texto='¡El pasaporte debe tener 12 dígitos!';
    }else if(codigo==12){
        texto='¡El número de tarjeta debe tener entre 15 y 16 dígitos!';
    }else if(codigo==13){
        texto='¡El número de cuenta debe tener entre 10 y 20 dígitos!';
    }else if(codigo==14){
        texto='¡El CCI debe tener 20 dígitos!';
    }else{
		texto=codigo;
    }
	info(texto);
	return false;
}

function mensajeError(objeto){
	let texto='';
	if(objeto.errno==1451){
		texto='¡No se puede eliminar, esta relacionado con otros registros!';
	}else if(objeto.errno==1062){
		texto='¡Ya existe un registro con esos datos!';
	}else if(objeto.errno==1264){
		//texto='¡No puede existir valores negativos!';
		texto='¡No se cuenta con la cantidad solicitada!';
	}else if(objeto.errno==1690){
		texto='¡No se cuenta con la cantidad solicitada!';
	}else{
		if(objeto.errno>0){
			texto=(objeto.errno+" - "+objeto.message+" - "+objeto.code).toUpperCase();
		}else{
			if(objeto.errno=='TC'){
				texto=objeto.message;
				cerrarSesionToken();
			}else{
				texto=objeto.message;
			}
		}
		//texto='Ups! Algo salió mal. Contáctese con el administrador del sistema';
	}
	
	error(texto);
	return false;
}

var lenguaje={
	//"sProcessing":     "Procesando...",
	"sLengthMenu":     "Mostrar _MENU_ registros",
	"sZeroRecords":    "No se encontraron resultados",
	"sEmptyTable":     "Ningún dato disponible",
	"sInfo":         "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
	//"sInfoEmpty":    "Mostrando registros del 0 al 0 de un total de 0 registros",
	//"sInfo":         "",
	"sInfoEmpty":    "no hay registros",
	"sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
	"sInfoPostFix":    "",
	"sSearch":         "Buscar:",
	"sUrl":            "",
	"sInfoThousands":  ",",
	"sLoadingRecords": "Cargando...",
	"oPaginate": {
		"sFirst":    "Inicio",
		"sLast":     "Fin",
		"sNext":     "Sigue",
		"sPrevious": "Atrás"
	},
	"oAria": {
		"sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
		"sSortDescending": ": Activar para ordenar la columna de manera descendente"
	}
}

var valoresTabla={
    "pagingType": "full_numbers",
    "language": {
        //"sProcessing":     "Procesando...",
        "sLengthMenu":     "Mostrar _MENU_ registros",
        "sZeroRecords":    "No se encontraron resultados",
        "sEmptyTable":     "Ningún dato disponible",
        //"sInfo":         "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
		"sInfo":         "_TOTAL_ registros filtrados",
        //"sInfoEmpty":    "Mostrando registros del 0 al 0 de un total de 0 registros",
        //"sInfo":         "",
        "sInfoEmpty":    "no hay registros",
        //"sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
		"sInfoFiltered":   "(_MAX_ registros en total)",
        "sInfoPostFix":    "",
        "sSearch":         "Buscar:",
        "sUrl":            "",
        "sInfoThousands":  ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst":    "Inicio",
            "sLast":     "Fin",
            "sNext":     "Sigue",
            "sPrevious": "Atrás"
        },
        "oAria": {
            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    },
	//"fixedHeader": true,
	//"responsive": true,
   	"pageLength" :  10,
    "lengthMenu":  [5, 10, 20, 30,40,50],
    "order": [],//[[ 0, "asc" ]],[[ 3, 'desc' ], [ 0, 'asc' ]],
    //"scrollY": "300px",
    //"scrollCollapse": true,
     "autoWidth": true,
    "columnDefs": [
        { "orderable": false, "targets": 'nosort' },
        { "searchable": false, "targets": 'nosearch' }
    ],
    "paging":   true,
    "ordering": true,
    "info":     true,
    "searching": true,
    "orderCellsTop": false,
 }


 function verificaElemento(tabla){
	$('#'+tabla+' div').off( 'keyup');
    $('#'+tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+tabla+" input[name="+name+"]");

		let datos={
			name:name,
			elemento:elemento
		}
		return datos;
	});

	$('#'+tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+tabla+" input[name="+name+"]");

		let datos={
			name:name,
			elemento:elemento
		}
		return datos;
	});
}


function getContrastColor(hexColor) {
    // Convertir el color HEX a RGB
    let r = parseInt(hexColor.substring(1, 3), 16) / 255;
    let g = parseInt(hexColor.substring(3, 5), 16) / 255;
    let b = parseInt(hexColor.substring(5, 7), 16) / 255;

    // Ajustar los valores para la fórmula de luminosidad
    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    // Calcular la luminosidad
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Devolver blanco (#FFFFFF) para colores oscuros y negro (#000000) para colores claros
    return luminance > 0.5 ? '#031b4e' : '#FFFFFF';
}