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
	const lista= await axios.get('/api/'+tabla+'/listar/0/'+verSesion(),{
		headers: 
		{ 
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
	const resp=lista.data.valor.info;
	const resp2=tipoDoc.data.valor.info;
	const resp3=nivel.data.valor.info;
			
	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-users-cog"></i> USUARIO</div>
						<div class="row pt-3">
							<div class="form-group col-md-4">
								<label>Apellido paterno (*)</label>
								<input name="apellidoPaterno" autocomplete="off" maxlength="50" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese el apellido paterno">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-4">
								<label>Apellido materno (*)</label>
								<input name="apellidoMaterno" autocomplete="off" maxlength="100" type="text" class="form-control p-1" placeholder="Ingrese el apellido materno">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>  
							<div class="form-group col-md-4">
								<label>Nombres (*)</label>
								<input name="nombre" autocomplete="off" maxlength="50" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese el primer nombre">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-8">
								<label>Tipo documento (*)</label>
								<select name="tipoDocumento" class="form-control select2">
									<option value="">Select...</option>`;
									for(var i=0;i<resp2.length;i++){
										if(resp2[i].ES_VIGENTE==1){
									listado+=`<option value="${resp2[i].ID_PARAMETRO_DETALLE}">${resp2[i].DESCRIPCIONDETALLE}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-4">
								<label>Nro documento (*)</label>
								<input name="documento" autocomplete="off" maxlength="15" type="tel" class="form-control p-1" placeholder="Ingrese el documento">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-4">
								<label>Fono Fijo</label>
								<input name="fijo" autocomplete="off" maxlength="8" type="tel" class="form-control p-1" placeholder="Ingrese el número fijo">
							</div>
							<div class="form-group col-md-4">
								<label>Fono Móvil (*)</label>
								<input name="celular" autocomplete="off" maxlength="9" type="tel" class="form-control p-1" placeholder=" Ingrese el número móvil">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
							<div class="form-group col-md-4">
								<label>Fecha nacimiento</label>
								<input name="fechaNacimiento" maxlength="10" autocomplete="off" type="fecha" class="datepicker form-control" placeholder="Ingrese la fecha">
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-7">
								<label>Email (*)</label>
								<input name="email" autocomplete="off" maxlength="100" type="text" class="form-control p-1" placeholder="Ingrese el email">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
							<div class="form-group col-md-5">
								<label>Nivel (*)</label>
								<select name="nivel" class="form-control select2">
									<option value="">Select...</option>`;
									for(var i=0;i<resp3.length;i++){
										if(resp3[i].ES_VIGENTE==1){
									listado+=`<option value="${resp3[i].ID_NIVEL}">${resp3[i].NOMB_NIVEL}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-12">
								<label>Imagen (*)  (Solo se permite formatos: JPG, JPEG o PNG no mayor a 1Mb)</label>
								<input type="file" class="form-control p-1" name="imagen" id="imagen">
								<span id="imagenUsuario" class="cursor"></span>
							</div>
						</div>
						<div class="pt-3 col-md-12 pl-0 pr-0 text-center">
							${limpia()+guarda()}
						</div>
						<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
					</form>
					<hr class="border border-primary">
					<div class="table-responsive">
						<table id="${tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
							<thead>
								<tr>
									<th style="width: 35%;">Apellidos y Nombres</th>
									<th style="width: 10%;">Tipo Doc.</th>
									<th style="width: 10%;">Número Doc.</th>
									<th style="width: 15%;">Email</th>
									<th style="width: 20%;">Tipo</th>
									<th style="width: 10%;" class="nosort nosearch">Acciones</th>
								</tr>
							</thead>
							<tbody>`;
							var mestado;
							for(let i=0;i<resp.length;i++){
								if(resp[i].ES_VIGENTE==1){
									mestado='';
								}else{
									mestado='tachado';
								}
					listado+=`<tr id="${resp[i].ID_USUARIO}">
								<td>
									<div class="estadoTachado nombre muestraMensaje ${mestado}">${resp[i].APELLIDO_PATERNO+" "+resp[i].APELLIDO_MATERNO+" "+resp[i].NOMBRE }</div>
									<div class="oculto empresa">${resp[i].ID_EMPRESA }</div>
								</td>
								<td>
									<div class="estadoTachado tipoDocumento ${mestado}">${resp[i].TIPO_DOCUMENTO }</div>
								</td>
								<td>
									<div class="estadoTachado documento ${mestado}">${resp[i].NUM_DOCUMENTO }</div>
								</td>
								<td>
									<div class="estadoTachado correo ${mestado}">${resp[i].EMAIL}</div>
								</td>
								<td>
									<div class="estadoTachado nivel ${mestado}">${resp[i].NOMB_NIVEL }</div>
								</td>
								<td>
								
								${sucursal()+contrasena()+/*((resp[i].ID_NIVEL!=5)?clave():'')+*/((verSesion()!=resp[i].ID_USUARIO)?estado():'')+modifica()+((resp[i].INTENTO>2)?bloqueo():'')+elimina()}
								</td>
							</tr>`;
							}
					listado+=`</tbody>
						</table>
					</div>
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
	$("#"+tabla+" span#botonGuardar").text('Crear');
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
		nivel:$('#'+tabla+' select[name=nivel]'),
		imagen:$('#'+tabla+' input[name=imagen]'),
		tabla:tabla,
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
		$('span#imagenUsuario').html('');
	});

	$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.edita',function(){//edita
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		objeto.id=id;
		objeto.nombreEdit=nombre;
		usuarioEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		usuarioEstado({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		usuarioElimina({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.bloqueo',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		usuarioBloqueo({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.contrasena',function(){//contraseña
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		let correo=evento.find("td div.correo ").text();
		usuarioContrasena({id:id,nombre:nombre,correo:correo,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.clave',function(){//clave
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		let correo=evento.find("td div.correo ").text();
		usuarioClave({id:id,nombre:nombre,correo:correo,tabla:objeto.tabla});
	});
	
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.sucursal',function(){//sucursal
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		let correo=evento.find("td div.correo ").text();
		let empresa=evento.find("td div.empresa ").text();
		vistaUsuarioSucursal({id:id,nombre:nombre,correo:correo,empresa:empresa,tabla:objeto.tabla});
	});
}

async function usuarioEdita(objeto){
	$("#"+objeto.tabla+" span.muestraId").text(objeto.id);
	$("#"+objeto.tabla+" span.muestraNombre").text(objeto.nombreEdit);
	$("#"+objeto.tabla+" span#botonGuardar").text('Modificar');
	quitaValidacionTodo(objeto.tabla)
	bloquea();
	const busca= await axios.get('/api/'+objeto.tabla+'/buscar/'+objeto.id+'/'+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		}
	});
	desbloquea();
	const resp=busca.data.valor.info;
	objeto.apellidoPaterno.val(resp.APELLIDO_PATERNO);
	objeto.apellidoMaterno.val(resp.APELLIDO_MATERNO);
	objeto.nombre.val(resp.NOMBRE);
	objeto.tipoDocumento.val(resp.ID_TIPO_DOCUMENTO).trigger('change.select2');
	objeto.documento.val(resp.NUM_DOCUMENTO);
	objeto.fijo.val(resp.NRO_FIJO);
	objeto.celular.val(resp.NRO_CELULAR);
	objeto.email.val(resp.EMAIL);
	objeto.nivel.val(resp.ID_NIVEL).trigger('change.select2');
	if(resp.IMAGEN!==null){
		$('span#imagenUsuario').html('<span class="badge bg-primary">'+resp.IMAGEN+'</span>');
		$('span#imagenUsuario').off( 'click');
		$('span#imagenUsuario').on( 'click',function(){
			let imagen=`<img src="../imagenes/usuario/USU_`+objeto.id+`_`+resp.IMAGEN+`">`;
			mostrar_general1({titulo:'IMAGEN',nombre:objeto.nombreEdit,msg:imagen,ancho:300});
			$('#contenidoGeneral1').addClass('text-center');
		});
	}
	if(resp.FEC_NACIMIENTO===null){
		objeto.fechaNacimiento.val('');
	}else{
		objeto.fechaNacimiento.val(moment(resp.FEC_NACIMIENTO).format('DD-MM-YYYY'));
	}
}

function validaFormularioUsuario(objeto){	
	validaVacio(objeto.apellidoPaterno);
	validaVacio(objeto.apellidoMaterno);
	validaVacio(objeto.nombre);
	validaVacioSelect(objeto.tipoDocumento);
	let vdoc=validaDocumento(objeto.documento);
	let vcel=validaCelular(objeto.celular);
	let vemai=validaCorreo(objeto.email);
	validaVacioSelect(objeto.nivel);

	if(objeto.apellidoPaterno.val()=="" || objeto.apellidoMaterno.val()=="" || objeto.nombre.val()=="" || objeto.tipoDocumento.val()=="" || objeto.nivel.val()=="" || vdoc==false || vcel==false || vemai==false ){
		return false;
	}else{
		enviaFormularioUsuario(objeto);
	}
}

function enviaFormularioUsuario(objeto){
	let dato=(objeto.id==0)?muestraMensaje({tabla:objeto.tabla}):objeto.nombreMsg;
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
			let creaEdita;
			if(objeto.id==0){
				creaEdita = await axios.post("/api/"+objeto.tabla+"/crear",body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
			}else{
				creaEdita = await axios.put("/api/"+objeto.tabla+"/editar/"+objeto.id,body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
			}
			desbloquea();
			resp=creaEdita.data.valor;
			if(resp.resultado){
				if(objeto.id>0){
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .nombre").text(resp.info.PATERNOUSUARIO+" "+resp.info.MATERNOUSUARIO+" "+resp.info.NOMBREUSUARIO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .correo").text(resp.info.CORREOUSUARIO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .documento").text(resp.info.DNIUSUARIO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .nivel").text(resp.info.NIVELUSUARIO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .tipoDocumento").text(resp.info.TIPODOCUMENTO);
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
					if(resp.info.IMAGEN!==null){
						$('span#imagenUsuario').html('<span class="badge bg-primary">'+resp.info.IMAGEN+'</span>');
						$("img.imagenUsuarioInicio").attr('src','/imagenes/usuario/USU_'+resp.info.ID_USUARIO+'_'+resp.info.IMAGEN);
					}
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						`<div class="estadoTachado nombre muestraMensaje">${resp.info.PATERNOUSUARIO+" "+resp.info.MATERNOUSUARIO+" "+resp.info.NOMBREUSUARIO}</div>`,
						`<div class="estadoTachado tipoDocumento muestraMensaje">${resp.info.TIPODOCUMENTO}</div>`,
						`<div class="estadoTachado documento">${resp.info.DNIUSUARIO}</div>`,
						`<div class="estadoTachado correo">${resp.info.CORREOUSUARIO}</div>`,
						`<div class="estadoTachado nivel">${resp.info.NIVELUSUARIO}</div>`,
						sucursal()+contrasena()+estado()+modifica()+elimina()
					] ).draw( false ).node();
					$( rowNode ).attr('id',resp.info.ID_USUARIO);
					if(resp.info.IMAGEN!==null){
						$("img.imagenUsuarioInicio").attr('src','/imagenes/usuario/USU_'+resp.info.ID_USUARIO+'_'+resp.info.IMAGEN);
					}
					//success("Creado","¡Se ha creado el registro: "+dato+"!");
				}
				limpiaTodo(objeto.tabla);
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

function usuarioElimina(objeto){
	confirm("¡Eliminará el registro: "+objeto.nombre+"!",function(){
		return false;
	},async function(){
        bloquea();
		try {
			const eliminar = await axios.delete("/api/"+objeto.tabla+"/eliminar/"+objeto.id,{ 
				headers:{authorization: `Bearer ${verToken()}`} 
			});
			
			desbloquea();
			resp=eliminar.data.valor;
			if(resp.resultado){
				let  elimina=$('#'+objeto.tabla+'Tabla').DataTable();
				$('#'+objeto.tabla+'Tabla #'+objeto.id).closest('tr');
				elimina.row($('#'+objeto.tabla+'Tabla #'+objeto.id)).remove().draw(false); 
				//success("Eliminado","¡Se ha eliminado el registro: "+objeto.nombre+"¡");
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

function usuarioEstado(objeto){
	confirm("¡Cambiará el estado del registro: "+objeto.nombre+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body={
		}
		try {
			const estado = await axios.put("/api/"+objeto.tabla+"/estado/"+objeto.id,body,{ 
				headers:{authorization: `Bearer ${verToken()}`} 
			});
			desbloquea();
			resp=estado.data.valor;
			if(resp.resultado){
				let estado=(resp.info.ESTADO==0)?'tachado':'';

				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadoTachado ").removeClass('tachado');

				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadoTachado ").addClass(estado);

				//success("Estado","¡Se ha cambiado el estado del registro: "+objeto.nombre+"!");
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

function usuarioContrasena(objeto){
	confirm("¡Cambiará la contraseña del registro: "+objeto.nombre+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body={
			id : objeto.id,
			correo:objeto.correo
		}
		try {
			const contrasena = await axios.put("/api/"+objeto.tabla+"/contrasena/"+objeto.id,body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			desbloquea();
			resp=contrasena.data.valor;
			if(resp.resultado){
				//success("Contraseña cambiada","¡Se ha cambiado la contraseña del registro: "+objeto.nombre+"¡");
				return true;
			}else{
				mensajeSistema(resp.mensaje);
			}
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
	})
}

function usuarioClave(objeto){
	confirm("¡Cambiará la clave del registro: "+objeto.nombre+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body={
			id : objeto.id,
			correo:objeto.correo
		}
		try {
			const contrasena = await axios.put("/api/"+objeto.tabla+"/clave/"+objeto.id,body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			desbloquea();
			resp=contrasena.data.valor;
			if(resp.resultado){
				//success("Contraseña cambiada","¡Se ha cambiado la contraseña del registro: "+objeto.nombre+"¡");
				return true;
			}else{
			}
			mensajeSistema(resp.mensaje);
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
	})
}


function usuarioBloqueo(objeto){
	confirm("¡Desbloqueará el registro: "+objeto.nombre+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body={
			id : objeto.id
		}
		try {
			const estado = await axios.put("/api/"+objeto.tabla+"/desbloquea/"+objeto.id,body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			desbloquea();
			resp=estado.data.valor;
			if(resp.resultado){
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" a.bloqueo").remove();

				//success("Desbloqueado","¡Se ha desbloqueado el registro: "+objeto.nombre+"¡");
			}else{
				mensajeSistema(resp.mensaje);
			}
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
	})
}

//DETALLE USUARIO SUCURSAL
async function vistaUsuarioSucursal(objeto){
	bloquea();
	const empresaActual =  await axios.get("/api/empresa/buscar/"+objeto.empresa+"/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});

	const empresa =  await axios.get("/api/empresa/listar/0/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});

	desbloquea();
	const resp2=empresa.data.valor.info;
	const resp3=empresaActual.data.valor.info;

	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div id="${objeto.tabla}" class="card-body">
					<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="la la-users"></i> USUARIO SUCURSAL</div>
					<div class="alert alert-primary" role="alert">${objeto.nombre}</div>
					<div>${regresa()}</div>
					<div class="row  d-flex justify-content-center pt-3 pb-3">
						<div class="col-6 mb-1">
							<select class="form-control select2" name="idEmpresa">
								<option value="${resp3.ID_EMPRESA}" selected>${resp3.NOMB_EMPRESA}</option>`;
								for(var i=0; i < resp2.length; i++) {
									if(resp3.ES_VIGENTE==1 && resp2[i].ID_EMPRESA!=resp3.ID_EMPRESA){
						listado+=`<option value="${resp2[i].ID_EMPRESA}">${resp2[i].NOMB_EMPRESA}</option>`;
								}
							}
					listado+=`</select>
						</div>
					</div>
					<div class="table-responsive pt-4" id="filtroEmpresaSucursal">
						${filtroEmpresaSucursal({id:objeto.id,empresa:objeto.empresa,tabla:objeto.tabla})}
					</div>
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
	let objetoDetalle={
		tabla:objeto.tabla,
		idPadre:objeto.id
	}
	eventosUsuarioDetalle(objetoDetalle);
}

async function filtroEmpresaSucursal(objeto){
	const sucursal =  await axios.get("/api/sucursal/listar/detalle/"+objeto.id+"/"+objeto.empresa+"/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	const resp=sucursal.data.valor.info;
	msg=`
	<table id="${objeto.tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
		<thead>
			<tr>
				<th style="width:30%;">Empresa</th>
				<th style="width:30%;">Sucursal</th>
				<th style="width:20%;">Ruc</th>
				<th style="width:10%;">Asignado</th>
				<th style="width:10%;" class="nosort nosearch">Acciones</th>
			</tr>
		</thead>
		<tbody>`;
			var mactual;
			for(var i=0;i<resp.length;i++){
				if(resp[i].ID_SUCURSAL==resp[i].SUCURSAL_ACTUAL){
					mactual="<span class='badge bg-success'>Actual</span>";
				}else{
					mactual='';
				}
				if(resp[i].ES_PRINCIPAL==1){
					mprincipal="<span class='badge bg-primary'>Principal</span>";
				}else{
					mprincipal='';
				}
	msg+=`<tr id="${resp[i].ID_SUCURSAL}">
				<td>
					<div class="estadoTachado empresa">${resp[i].NOMB_EMPRESA }</div>
				</td>
				<td>
					<div class="estadoTachado sucursal muestraMensaje">${resp[i].NOMB_SUCURSAL }</div>
					<span class='principal'>${mprincipal}</span><span class='actual'>${mactual}</span>
				</td>
				<td>
					<div class="estadoTachado ruc">${resp[i].RUC }</div>
				</td>
				<td>
					<div class="estadoTachado asignado">${(resp[i].ASIGNADO==0 || resp[i].ASIGNADO===null)?'NO':'SI'}</div>
				</td>
				<td>
					${cambiar()+asignar()}
				</td>
			</tr>`;
			}
	msg+=`</tbody>
	</table>`;
	$('#filtroEmpresaSucursal').html(msg);
	$('#'+objeto.tabla+'Tabla').DataTable(valoresTabla);

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.cambiar',function(){//cambiar
		let evento=$(this).parents("tr")
    	let idDetalle=evento.attr('id');
		let sucursal=evento.find("td div.sucursal").text();
		let ruc=evento.find("td div.ruc").text();
		usuarioEstadoSucursal({id:objeto.id,idDetalle:idDetalle,descripcionDetalle:sucursal+" - "+ruc,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.asignar',function(){//asignar
		let evento=$(this).parents("tr")
    	let idDetalle=evento.attr('id');
		let sucursal=evento.find("td div.sucursal").text();
		let ruc=evento.find("td div.ruc").text();
		usuarioAsignaSucursal({id:objeto.id,idDetalle:idDetalle,descripcionDetalle:sucursal+" - "+ruc,tabla:objeto.tabla});
	});
}

function eventosUsuarioDetalle(objeto){
	$('#'+objeto.tabla+' div').on( 'click','button[name=btnRegresa]',function(){//regresa
		vistaUsuario();
	});

	$('#'+objeto.tabla+' div').on( 'change','select[name=idEmpresa]',function(){//filtro
		let idEmpresa=$(this).val();
		filtroEmpresaSucursal({id:objeto.idPadre,empresa:idEmpresa,tabla:objeto.tabla})
	});
}



function usuarioEstadoSucursal(objeto){
	confirm("¡Cambiará a la sucursal: "+objeto.descripcionDetalle+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body={
			id: objeto.id,
			idDetalle: objeto.idDetalle,
			sesId: verSesion()
		}
		try {
			const estado = await axios.post("/api/"+objeto.tabla+"/detalle/estado",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			desbloquea();
			const resp=estado.data.valor;
			if(resp.resultado){
				$("#"+objeto.tabla+"Tabla tr td span.actual").html('');
				$("#"+objeto.tabla+"Tabla #"+objeto.idDetalle+" span.actual").html("<span class='badge bg-success'>Actual</span>");

				socket.emit('actualizaNombreSucursal',{
					id_sucursal: objeto.idDetalle,
					sucursal: resp.info.SUCURSAL,
					empresa: resp.info.EMPRESA,
					usuario: "U"+verSesion()
				});

				//success("Sucursal","¡Se ha cambiado a la sucursal: "+objeto.nombre+"");
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

function usuarioAsignaSucursal(objeto){
	confirm("¡Cambiará la asignación de la sucursal: "+objeto.descripcionDetalle+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body={
			id: objeto.id,
			idDetalle: objeto.idDetalle,
			sesId: verSesion()
		}
		try {
			const estado = await axios.post("/api/"+objeto.tabla+"/detalle/asigna",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			desbloquea();
			const resp=estado.data.valor;
			if(resp.resultado){
				let asignado=(resp.info.ASIGNA==0)?'NO':'SI';
				$("#"+objeto.tabla+"Tabla #"+objeto.idDetalle+" div.asignado").text(asignado);

				//success("Sucursal","¡Se ha cambiado a la sucursal: "+objeto.nombre+"");
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

