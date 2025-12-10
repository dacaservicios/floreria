//FUNCIONES
$(document).ready(function() {
	try {
		vistaUsuario();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaUsuario(){
	bloquea();
	let tabla="usuario";

	const busca= await axios.get('/api/'+tabla+'/buscar/'+verSesion()+'/'+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		}
	});

	const nivel = await axios.get("/api/nivel/listar/0/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	const tipoDoc = await axios.get("/api/parametro/detalle/listar/2/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	
	desbloquea();
	const resp=busca.data.valor.info;
	const resp2=tipoDoc.data.valor.info;
	const resp3=nivel.data.valor.info;
	console.log(resp)
	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>${resp.ID_USUARIO}</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-users-cog"></i> USUARIO</div>
						<div class="row pt-3">
							<div class="form-group col-md-4">
								<label>Apellido paterno (*)</label>
								<input name="apellidoPaterno" autocomplete="off" maxlength="50" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese el apellido paterno" value="${resp.APELLIDO_PATERNO}">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-4">
								<label>Apellido materno (*)</label>
								<input name="apellidoMaterno" autocomplete="off" maxlength="50" type="text" class="form-control p-1" placeholder="Ingrese el apellido materno" value="${resp.APELLIDO_MATERNO}">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>  
							<div class="form-group col-md-4">
								<label>Nombres (*)</label>
								<input name="nombre" autocomplete="off" maxlength="50" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese el primer nombre" value="${resp.NOMBRE}">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-8">
								<label>Tipo documento (*)</label>
								<select name="tipoDocumento" class="form-control select2">
									<option value="${resp.ID_TIPO_DOCUMENTO}">${resp.TIPO_DOCUMENTO}</option>`;
									for(var i=0;i<resp2.length;i++){
										if(resp2[i].ES_VIGENTE==1 && resp.ID_TIPO_DOCUMENTO!=resp2[i].ID_PARAMETRO_DETALLE){
									listado+=`<option value="${resp2[i].ID_PARAMETRO_DETALLE}">${resp2[i].DESCRIPCIONDETALLE}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-4">
								<label>Nro documento (*)</label>
								<input name="documento" autocomplete="off" maxlength="15" type="tel" class="form-control p-1" placeholder="Ingrese el documento" value="${resp.NUM_DOCUMENTO}">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-4">
								<label>Fono Fijo</label>
								<input name="fijo" autocomplete="off" maxlength="8" type="tel" class="form-control p-1" placeholder="Ingrese el número fijo" value="${resp.NRO_FIJO}">
							</div>
							<div class="form-group col-md-4">
								<label>Fono Móvil (*)</label>
								<input name="celular" autocomplete="off" maxlength="9" type="tel" class="form-control p-1" placeholder=" Ingrese el número móvil" value="${resp.NRO_CELULAR}">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
							<div class="form-group col-md-4">
								<label>Fecha nacimiento</label>
								<input name="fechaNacimiento" maxlength="10" autocomplete="off" type="fecha" class="datepicker form-control" placeholder="Ingrese la fecha" value="${(resp.FEC_NACIMIENTO===null)?'':moment(resp.FEC_NACIMIENTO).format('DD-MM-YYYY')}">
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-5">
								<label>Email (*)</label>
								<input name="email" autocomplete="off" maxlength="100" type="text" class="form-control p-1" placeholder="Ingrese el email" value="${resp.EMAIL}">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
							<div class="form-group col-md-0 oculto">
								<label>Nivel (*)</label>
								<select name="nivel" class="form-control select2">
									<option value="${resp.ID_NIVEL}">${resp.NOMB_NIVEL}</option>
								</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-7">
								<label>Imagen (*)  (Solo se permite formatos: JPG, JPEG o PNG no mayor a 1Mb)</label>
								<input type="file" class="form-control p-1" name="imagen" id="imagen">
								<span id="imagenUsuario" class="cursor">
									<span class="badge bg-primary">${resp.IMAGEN}</span>
								</span>
							</div>
						</div>
						<div class="pt-3 col-md-12 pl-0 pr-0 text-center">
							${limpia()+guarda()}
						</div>
						<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
					</form>
				</div>
			</div>
		</div>
	</div>`;
	$("#cuerpoPrincipal").html(listado);
	$(".select2").select2({
		placeholder:'Select...',
		dropdownAutoWidth: true,
		width: '100%'
	});
	$('.datepicker').datepicker({
		language: 'es',
		changeMonth: true,
		changeYear: true,
		todayHighlight: true
	}).on('changeDate', function(e){
		$(this).datepicker('hide');
	});
	$('#'+tabla+'Tabla').DataTable(valoresTabla);
	let objeto={
		apellidoPaterno:$('#'+tabla+' input[name=apellidoPaterno]'),
		apellidoMaterno:$('#'+tabla+' input[name=apellidoMaterno]'),
		nombre:$('#'+tabla+' input[name=nombre]'),
		tipoDocumento:$('#'+tabla+' select[name=tipoDocumento]'),
		documento:$('#'+tabla+' input[name=documento]'),
		fijo:$('#'+tabla+' input[name=fijo]'),
		celular:$('#'+tabla+' input[name=celular]'),
		fechaNacimiento:$('#'+tabla+' input[name=fechaNacimiento]'),
		email:$('#'+tabla+' input[name=email]'),
		imagen:$('#'+tabla+' input[name=imagen]'),
		tabla:tabla,
		nombreImagen:resp.IMAGEN
	}
	eventosUsuario(objeto);
}

function eventosUsuario(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='apellidoPaterno' || name=='apellidoMaterno' || name=='nombre'){
			comentarioRegex(elemento);
			validaVacio(elemento);
		}else if(name=='email'){
			validaCorreo(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='fijo'){
			fijoRegex(elemento);
		}else if(name=='celular'){
			validaCelular(elemento);
		}else if(name=='documento'){
			validaDocumento(elemento);
		}
	});

	$('#'+objeto.tabla+' div').off( 'change');
    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioUsuario(objeto)
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		limpiaTodo(objeto.tabla);
		$("#"+objeto.tabla+" span#botonGuardar").text('Guardar');
		$('span#imagenUsuario').html('');
	});

	$('span#imagenUsuario').off( 'click');
	$('span#imagenUsuario').on( 'click',function(){
		let imagen=`<img src="../imagenes/usuario/USU_`+verSesion()+`_`+objeto.nombreImagen+`">`;
		mostrar_general1({titulo:'IMAGEN',nombre:objeto.nombreImagen,msg:imagen,ancho:300});
		$('#contenidoGeneral1').addClass('text-center');
	});
}

function validaFormularioUsuario(objeto){	
	validaVacio(objeto.apellidoPaterno);
	validaVacio(objeto.apellidoMaterno);
	validaVacio(objeto.nombre);
	validaVacioSelect(objeto.tipoDocumento);
	let vdoc=validaDocumento(objeto.documento);
	let vcel=validaCelular(objeto.celular);
	let vemai=validaCorreo(objeto.email);

	if(objeto.apellidoPaterno.val()=="" || objeto.apellidoMaterno.val()=="" || objeto.nombre.val()=="" || objeto.tipoDocumento.val()=="" || vdoc==false || vcel==false || vemai==false ){
		return false;
	}else{
		enviaFormularioUsuario(objeto);
	}
}

function enviaFormularioUsuario(objeto){
	let dato=objeto.apellidoPaterno.val()+" "+objeto.apellidoMaterno.val()+" "+objeto.nombre.val();
	let verbo=(objeto.id==0)?'Creará':'Modificará';
	let imagen=(objeto.imagen.val()=='')?'':objeto.imagen.val().substring(12).trim();
	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	fd.append("imagen", imagen);
	
	confirm("¡"+verbo+" el registro: "+dato+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body=fd;
		try {
			let creaEdita = await axios.put("/api/"+objeto.tabla+"/editar/"+objeto.id,body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
			desbloquea();
			resp=creaEdita.data.valor;
			if(resp.resultado){
				if(objeto.id>0){
					if(resp.info.IMAGEN!==null){
						$('span#imagenUsuario').html('<span class="badge bg-primary">'+resp.info.IMAGEN+'</span>');
						$("img.imagenUsuarioInicio").attr('src','/imagenes/usuario/USU_'+resp.info.ID_USUARIO+'_'+resp.info.IMAGEN);
					}
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}
				limpiaTodo(objeto.tabla);
				$("#"+objeto.tabla+" span#botonGuardar").text('Guardar');
				$('span#imagenUsuario').html('');
			}else{
				mensajeSistema(resp.mensaje);
			}	
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
    });
}

