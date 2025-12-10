//FUNCIONES
$(document).ready(function() {
	try {
		vistaCliente();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaCliente(){
	bloquea();
	let tabla="cliente";
	const lista= await axios.get('/api/'+tabla+'/listar/0/'+verSesion(),{
		headers: 
		{ 
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
	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-users"></i> CLIENTE</div>
						<div class="row pt-3">
							<div class="form-group col-md-4">
								<label>Apellido paterno (*)</label>
								<input name="apellidoPaterno" autocomplete="off" maxlength="50" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese el apellido paterno">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-4">
								<label>Apellido materno (*)</label>
								<input name="apellidoMaterno" autocomplete="off" maxlength="50" type="text" class="form-control p-1" placeholder="Ingrese el apellido materno">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>  
							<div class="form-group col-md-4">
								<label>Nombres (*)</label>
								<input name="nombre" autocomplete="off" maxlength="100" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese el primer nombre">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-6">
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
							<div class="form-group col-md-6">
								<label>Nro documento (*)</label>
								<input name="documento" autocomplete="off" maxlength="15" type="tel" class="form-control p-1" placeholder="Ingrese el documento">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-8">
								<label>Dirección</label>
								<input name="direccion" autocomplete="off" maxlength="200" type="text" class="form-control p-1" placeholder="Ingrese la direccion">
							</div>
							<div class="form-group col-md-4">
								<label>Fono Móvil</label>
								<input name="celular" autocomplete="off" maxlength="9" type="tel" class="form-control p-1" placeholder=" Ingrese el número móvil">
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-8">
								<label>Email</label>
								<input name="email" autocomplete="off" maxlength="100" type="text" class="form-control p-1" placeholder="Ingrese el email">
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
							<div class="form-group col-md-4">
								<label>Fecha nacimiento</label>
								<input name="fechaNacimiento" maxlength="10" autocomplete="off" type="fecha" class="datepicker form-control" placeholder="Ingrese la fecha">
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-12">
								<label>Comentario</label>
								<textarea  rows="3" autocomplete="off" class="form-control p-1" maxlength="500" name="comentario" placeholder="Ingrese el comentario"></textarea>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-12">
								<label>Imagen (*)  (Solo se permite formatos: JPG, JPEG o PNG no mayor a 1Mb)</label>
								<input type="file" class="form-control p-1" name="imagen" id="imagen">
								<span id="imagenCliente" class="cursor"></span>
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
									<th style="width: 40%;">Apellidos y Nombres</th>
									<th style="width: 15%;">Tipo Doc.</th>
									<th style="width: 10%;">Número Doc.</th>
									<th style="width: 15%;">Email</th>
									<th style="width: 10%;">Celular</th>
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
								if(resp[i].VIP==1){
									mvip="<span class='badge rounded-pill bg-primary'><i class='las la-user-check'></i></span>";
								}else{
									mvip="";
								}
					listado+=`<tr id="${resp[i].ID_CLIENTE}">
								<td>
									<div class="estadoTachado nombre muestraMensaje ${mestado}">${resp[i].APELLIDO_PATERNO+" "+resp[i].APELLIDO_MATERNO+" "+resp[i].NOMBRE} ${mvip}</div>
									
								</td>
								<td>
									<div class="estadoTachado tipoDocumento ${mestado}">${resp[i].TIPO_DOCUMENTO }</div>
								</td>
								<td>
									<div class="estadoTachado documento ${mestado}">${resp[i].NUMERO_DOCUMENTO }</div>
								</td>
								<td>
									<div class="estadoTachado correo ${mestado}">${(resp[i].EMAIL===null)?'':resp[i].EMAIL}</div>
								</td>
								<td>
									<div class="estadoTachado movil ${mestado}">${(resp[i].NRO_CELULAR===null)?'':resp[i].NRO_CELULAR}</div>
								</td>
								<td>
									${visita()+estado()+modifica()+elimina()}
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
		direccion:$('#'+tabla+' input[name=direccion]'),
		celular:$('#'+tabla+' input[name=celular]'),
		fechaNacimiento:$('#'+tabla+' input[name=fechaNacimiento]'),
		email:$('#'+tabla+' input[name=email]'),
		comentario:$('#'+tabla+' textarea[name=comentario]'),
		imagen:$('#'+tabla+' input[name=imagen]'),
		tabla:tabla,
	}
	eventosCliente(objeto);
}

function eventosCliente(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='apellidoPaterno' || name=='apellidoMaterno' || name=='nombre'){
			comentarioRegex(elemento);
			validaVacio(elemento);
		}else if(name=='email'){
			validaCorreoNo(elemento);
		}else if(name=='comentario'){
			comentarioRegex(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'keyup','textarea',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		comentarioRegex(elemento);
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
		validaFormularioCliente(objeto)
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		limpiaTodo(objeto.tabla);
		$('span#imagenCliente').html('');
	});

	$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.edita',function(){//edita
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		objeto.id=id;
		objeto.nombreEdit=nombre;
		clienteEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		clienteEstado({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		clienteElimina({id:id,nombre:nombre,tabla:objeto.tabla});
	});
}

async function clienteEdita(objeto){
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
	objeto.documento.val(resp.NUMERO_DOCUMENTO);
	objeto.direccion.val(resp.DIRECCION);
	objeto.celular.val(resp.NRO_CELULAR);
	objeto.email.val(resp.EMAIL);
	objeto.comentario.val(resp.COMENTARIO);
	if(resp.IMAGEN!==null){
		$('span#imagenCliente').html('<span class="badge bg-primary">'+resp.IMAGEN+'</span>');
		$('span#imagenCliente').off( 'click');
		$('span#imagenCliente').on( 'click',function(){
			let imagen=`<img src="../imagenes/cliente/CLI_`+objeto.id+`_`+resp.IMAGEN+`">`;
			mostrar_general1({titulo:'IMAGEN',nombre:objeto.nombreEdit,msg:imagen,ancho:300});
			$('#contenidoGeneral1').addClass('text-center');
		});
	}
	if(resp.FECHA_NACIMIENTO===null){
		objeto.fechaNacimiento.val('');
	}else{
		objeto.fechaNacimiento.val(moment(resp.FECHA_NACIMIENTO).format('DD-MM-YYYY'));
	}
}

function validaFormularioCliente(objeto){	
	validaVacio(objeto.apellidoPaterno);
	validaVacio(objeto.apellidoMaterno);
	validaVacio(objeto.nombre);
	validaVacioSelect(objeto.tipoDocumento);
	let vdoc=validaDocumento(objeto.documento);
	let vcel=validaCelular(objeto.celular);
	let vemai=validaCorreoNo(objeto.email);
	
	if(objeto.apellidoPaterno.val()=="" || objeto.apellidoMaterno.val()=="" || objeto.nombre.val()=="" || objeto.tipoDocumento.val()=="" || vdoc==false || vcel==false || vemai==false ){
		return false;
	}else{
		enviaFormularioCliente(objeto);
	}
}

function enviaFormularioCliente(objeto){
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
				let mvip=(resp.info.VIP==1)?"<span class='badge rounded-pill bg-primary'><i class='las la-user-check'></i></span>":"";
				if(objeto.id>0){
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .nombre").html(resp.info.NOMBRE+" "+mvip);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .correo").text(resp.info.EMAIL);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .documento").text(resp.info.NUMERO_DOCUMENTO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .tipoDocumento").text(resp.info.TIPO_DOCUMENTO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .celular").text(resp.info.NRO_CELULAR);
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
					if(resp.info.IMAGEN!==null){
						$('span#imagenCliente').html('<span class="badge bg-primary">'+resp.info.IMAGEN+'</span>');
					}
					
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{					
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						`<div class="estadoTachado nombre muestraMensaje">${resp.info.NOMBRE} ${mvip}</div>`,
						`<div class="estadoTachado tipoDocumento muestraMensaje">${resp.info.TIPO_DOCUMENTO}</div>`,
						`<div class="estadoTachado documento">${resp.info.NUMERO_DOCUMENTO}</div>`,
						`<div class="estadoTachado correo">${resp.info.EMAIL}</div>`,
						`<div class="estadoTachado celular">${resp.info.NRO_CELULAR}</div>`,
						visita()+estado()+modifica()+elimina()
					] ).draw( false ).node();
					$( rowNode ).attr('id',resp.info.ID_CLIENTE);
										
					//success("Creado","¡Se ha creado el registro: "+dato+"!");
				}
				limpiaTodo(objeto.tabla);
				$('span#imagenCliente').html('');
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

function clienteElimina(objeto){
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

function clienteEstado(objeto){
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

