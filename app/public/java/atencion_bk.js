//FUNCIONES
$(document).ready(function() {
	try {
		vistaAtencion();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaAtencion(){
	bloquea();
	let tabla="atencion";
	let body={
        sesId:verSesion(),
        token:verToken()
    }
	const result = await axios.post("/api/general/atencion",body,{
        headers:{
			authorization: `Bearer ${verToken()}`
		} 
    });

	desbloquea();
	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-receipt"></i> ATENCION</div>
						<div class="row pt-3">
							<div class="form-group col-md-6">
								<label>Cliente (*)</label>
								<select name="cliente" class="form-control select2 muestraMensaje">
									<option value="">Select...</option>`;
									for(var i=0;i<result.data.resp.length;i++){
										if(result.data.resp[i].ES_VIGENTE==1){
									listado+=`<option value="${result.data.resp[i].ID_CLIENTE}">${result.data.resp[i].APELLIDO_PATERNO+" "+result.data.resp[i].APELLIDO_MATERNO+" "+result.data.resp[i].NOMBRE}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-6">
								<label>Servicio (*)</label>
								<select name="servicio" class="form-control select2">
									<option value="">Select...</option>`;
									for(var i=0;i<result.data.resp2.length;i++){
										if(result.data.resp2[i].ES_VIGENTE==1){
									listado+=`<option value="${result.data.resp2[i].ID_SERVICIO_SUCURSAL}">${result.data.resp2[i].NOMBRE+" ("+parseFloat(result.data.resp2[i].PRECIO).toFixed(2)+")"}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-2 oculto">
								<label>Cantidad (*)</label>
								<input name="cantidad" maxlength="2" autocomplete="off" type="tel" class="form-control" placeholder="Ingrese la cantidad" value="1">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-6">
								<label>Colaborador (*)</label>
								<select name="colaborador" class="form-control select2">
									<option value="">Select...</option>`;
									for(var i=0;i<result.data.resp3.length;i++){
										if(result.data.resp3[i].ES_VIGENTE==1 && result.data.resp3[i].TIPO_EMPLEADO=='Barbero'){
									listado+=`<option value="${result.data.resp3[i].ID_EMPLEADO}">${result.data.resp3[i].APELLIDO_PATERNO+" "+result.data.resp3[i].APELLIDO_MATERNO+" "+result.data.resp3[i].NOMBRE}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-4">
								<label>Fecha atencion (*)</label>
								<input name="fechaAtencion" maxlength="10" autocomplete="off" type="fecha" class="datepicker form-control" placeholder="Ingrese la fecha" value="${moment().format('DD-MM-YYYY')}">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-2">
								<label>Gratis (*)</label>
								<select name="gratis" class="form-control select2">
									<option value="0">No</option>
									<option value="1">Si</option>
								</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-3">
								<label>Tipo pago (*)</label>
								<select name="tipoPago" class="form-control select2">
									<option value="">Select...</option>`;
									for(var i=0;i<result.data.resp5.length;i++){
										if(result.data.resp5[i].ES_VIGENTE==1){
									listado+=`<option value="${result.data.resp5[i].ID_PARAMETRO_DETALLE}">${result.data.resp5[i].DESCRIPCIONDETALLE}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-9">
								<label>Comentario</label>
								<input name="comentario" autocomplete="off" maxlength="250" type="text" class="form-control p-1" placeholder="Ingrese un comentario">
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
									<th style="width: 10%;">Fecha</th>
									<th style="width: 15%;">Nro Doc.</th>
									<th style="width: 20%;">Cliente</th>
									<th style="width: 20%;">Servicio</th>
									<th style="width: 10%;">Precio</th>
									<th style="width: 5%;">Gratis</th>
									<th style="width: 20%;">Colaborador</th>
									<th style="width: 5%;" class="nosort nosearch">Acciones</th>
								</tr>
							</thead>
							<tbody>`;
							var mestado;
							var badge;
							for(let i=0;i<result.data.resp4.length;i++){
								if(result.data.resp4[i].ES_VIGENTE==1){
									mestado='';
								}else{
									mestado='tachado';
								}
								if(result.data.resp4[i].GRATIS==1){
									badge="badge bg-primary"; 
								}else{
									badge="badge bg-dark";
								}
								color=getContrastColor(result.data.resp4[i].COLORGRILLA);
					listado+=`<tr id="${result.data.resp4[i].ID_ATENCION}">
								<td>
									<div class="estadoTachado fecha ${mestado}">${moment(result.data.resp4[i].FECHA_ATENCION).format('DD/MM/YYYY') }</div>
									<div class="oculto correo">${result.data.resp4[i].CORREO_CLIENTE }</div>
								</td>
								<td>
									<div class="estadoTachado documento ${mestado}">${result.data.resp4[i].NUMERO_DOCUMENTO}</div>
								</td>
								<td>
									<div class="estadoTachado cliente muestraMensaje ${mestado}">${result.data.resp4[i].PATERNO_CLIENTE+" "+result.data.resp4[i].MATERNO_CLIENTE+" "+result.data.resp4[i].NOMBRE_CLIENTE}</div>
								</td>
								<td>
									<div class="estadoTachado servicio ${mestado}">
										<span style="border: 1px #000000 solid;background-color:${result.data.resp4[i].COLORGRILLA}; color:${color};" class="badge">${result.data.resp4[i].NOMBRE_SERVICIO}</span>
									</div>
								</td>
								<td>
									<div class="estadoTachado precio ${mestado}">${parseFloat(result.data.resp4[i].PRECIO_SERVICIO).toFixed(2) }</div>
									<div class="estadoTachado tipoPago badge bg-${result.data.resp4[i].COLOR}">${(result.data.resp4[i].TIPO_PAGO===null)?'':result.data.resp4[i].TIPO_PAGO}</div>
								</td>
								<td>
									<div class="estadoTachado gratis ${mestado}"><span class="${badge}">${result.data.resp4[i].ES_GRATIS}</span></div>
								</td>
								<td>
									<div class="estadoTachado colaborador ${mestado}">${result.data.resp4[i].PATERNO_EMPLEADO+" "+result.data.resp4[i].MATERNO_EMPLEADO+" "+result.data.resp4[i].NOMBRE_EMPLEADO}</div>
								</td>
								<td>
									${ver()+enviar()}
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
	//$("#"+tabla+" span#botonGuardar").text('Crear');

	$('#'+tabla+'Tabla').DataTable(valoresTabla);
	let objeto={
		cliente:$('#'+tabla+' select[name=cliente]'),
		servicio:$('#'+tabla+' select[name=servicio]'),
		cantidad:$('#'+tabla+' input[name=cantidad]'),
		colaborador:$('#'+tabla+' select[name=colaborador]'),
		fechaAtencion:$('#'+tabla+' input[name=fechaAtencion]'),
		gratis:$('#'+tabla+' select[name=gratis]'),
		colaborador:$('#'+tabla+' select[name=colaborador]'),
		tipoPago:$('#'+tabla+' select[name=tipoPago]'),
		comentario:$('#'+tabla+' input[name=comentario]'),
		tabla:tabla,
	}
	eventosAtencion(objeto);
}

function eventosAtencion(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='comentario'){
			comentarioRegex(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='cantidad'){
			numeroRegexSinCero(elemento);
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').off( 'change');
	$('#'+objeto.tabla+' div').on( 'change','input[type=fecha]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='fechaAtencion'){
			validaVacio(elemento);
		}
	});

    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
		if(name=='cliente'){
			let cliente=$("#"+objeto.tabla+" select[name="+name+"] option:selected").text();
			verificaCorteGratis({idCliente:elemento.val(),cliente:cliente,tabla:objeto.tabla})
		}else if(name=='gratis'){
			if(elemento.val()==1){
				objeto.tipoPago.prop('disabled', true);
			}else{
				objeto.tipoPago.prop('disabled', false);
			}
			quitaValidacionSelect(objeto.tipoPago);
		}
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioAtencion(objeto)
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		limpiaTodo(objeto.tabla);
		objeto.tipoPago.prop('disabled', false);
		objeto.gratis.val(0).trigger('change.select2');
	});

	/*$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.edita',function(){//edita
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		objeto.id=id;
		objeto.nombreEdit=nombre;
		atencionEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		atencionEstado({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		atencionElimina({id:id,nombre:nombre,tabla:objeto.tabla});
	});*/

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.ver',function(){//ver
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		verTicket({id:id,nombre:nombre,tabla:objeto.tabla, tipo:'ver'});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.enviar',function(){//enviar
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.cliente").text();
		let correo=evento.find("td div.correo").text();
		if(correo=='NO'){
			mensajeSistema('¡El cliente no tiene un correo electrónico registrado!');
		}else{
			verTicket({id:id,nombre:nombre,tabla:objeto.tabla, tipo:'enviar'});
		}
		
	});
}

async function verTicket(objeto){
	bloquea();
	try {
		let body={
			id:objeto.id,
			sesId:verSesion(),
			token:verToken()
		}
		const verifica = await axios.post("/"+objeto.tabla+"/ticket/",body,{
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		
		desbloquea();
		if(verifica.data.resultado){
			if(objeto.tipo=='ver'){
				descargaTicket(objeto);
			}else{
				enviarTicket(objeto);
			}
		}else{
			mensajeSistema(resp.mensaje);
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function descargaTicket(objeto){
	let url="/"+objeto.tabla+"/descarga/ticket/"+objeto.id;
	let a = document.createElement('a');
	a.href = url;
	a.download = 'Expediente_Virtual_Marca';
	a.click();
}


function enviarTicket(objeto){
	confirm("¡Enviará el ticket por correo electrónico y whatsapp  al cliente: "+objeto.nombre+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body={
			id : objeto.id,
			sesId:verSesion(),
			token:verToken()
		}
		try {
			const correo = await axios.post("/api/"+objeto.tabla+"/correo/",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});

			const whatsapp = await axios.post("/api/"+objeto.tabla+"/whatsapp/",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			resp2=whatsapp.data.valor;
			desbloquea();
			resp=correo.data.valor;
			if(resp.resultado){
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

async function enviarTicketAutomatico(objeto){
	bloquea();
	let body={
		id : objeto.id,
		sesId:verSesion(),
		token:verToken()
	}
	try {
		const verifica = await axios.post("/"+objeto.tabla+"/ticket/",body,{
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});

		const correo = await axios.post("/api/"+objeto.tabla+"/correo/",body,{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		const whatsapp = await axios.post("/api/"+objeto.tabla+"/whatsapp/",body,{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		desbloquea();
		resp3=verifica.data.valor;
		resp=correo.data.valor;
		resp2=whatsapp.data.valor;
		if(resp.resultado){
			return true;
		}else{
			mensajeSistema(resp.mensaje);
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

/*async function atencionEdita(objeto){
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
	if(resp.FECHA_NACIMIENTO===null){
		objeto.fechaNacimiento.val('');
	}else{
		objeto.fechaNacimiento.val(moment(resp.FECHA_NACIMIENTO).format('DD-MM-YYYY'));
	}
}*/

async function verificaCorteGratis(objeto){
	bloquea();
	try {
		const verifica = await axios.get("/api/"+objeto.tabla+"/cortegratis/"+objeto.idCliente+"/"+verSesion(),{ 
			headers:{authorization: `Bearer ${verToken()}`} 
		});
		
		desbloquea();
		resp=verifica.data.valor;
		if(resp.resultado){
			if(resp.info.CORTE==resp.info.CANTIDAD_CORTE){
				info('Es el corte Nro. '+resp.info.CANTIDAD_CORTE+' para el cliente: '+objeto.cliente+', '+resp.info.MENSAJE_CORTE);
			}
		}else{
			mensajeSistema(resp.mensaje);
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function validaFormularioAtencion(objeto){	
	validaVacioSelect(objeto.cliente);
	validaVacioSelect(objeto.servicio);
	validaVacio(objeto.fechaAtencion);
	validaVacio(objeto.cantidad);
	validaVacioSelect(objeto.colaborador);
	validaVacioSelect(objeto.gratis);
	if(objeto.gratis.val()==0){
		validaVacioSelect(objeto.tipoPago);
	}

	if(objeto.cliente.val()=="" || objeto.servicio.val()=="" || objeto.fechaAtencion.val()=="" || objeto.cantidad.val()=="" || objeto.colaborador.val()=="" || objeto.gratis.val()=="" || (objeto.tipoPago.val()=="" && objeto.gratis.val()==0)){
		return false;
	}else{
		enviaFormularioAtencion(objeto);
	}
}

function enviaFormularioAtencion(objeto){
	let dato=(objeto.id==0)?muestraMensaje({tabla:objeto.tabla}):objeto.nombreMsg;
	//let verbo=(objeto.id==0)?'Creará':'Modificará';

	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	
	confirm("¡Se realizará el servicio al cliente: "+dato+"!",function(){
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
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .fecha").text(moment(resp.info.FECHA_ATENCION).format('DD/MM/YYYY'));
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .documento").text(resp.info.NRO_DOCUMENTO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .nombre").text(resp.info.NOMBRE);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .correo").text(resp.info.EMAIL);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .documento").text(resp.info.NUMERO_DOCUMENTO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .tipoDocumento").text(resp.info.TIPO_DOCUMENTO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .celular").text(resp.info.NRO_CELULAR);
					$("#"+objeto.tabla+"Tabla #"+objeto.id).css('background-color',resp.info.COLORGRILLA);
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
					
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					enviarTicketAutomatico({id:resp.info.ID_ATENCION,nombre:dato,tabla:objeto.tabla});
					vistaAtencion();
					/*$.fn.dataTable.Api.register('row().moveTo()', function(newPos) {
						var index = this.index();
						var dt = this.table();
					
						// Obtener los datos de la fila
						var rowData = dt.row(index).data();
					
						// Remover la fila de su posición actual
						dt.row(index).remove();
					
						// Insertar los datos en la nueva posición
						var tempData = dt.rows().data().toArray();
						tempData.splice(newPos, 0, rowData);
						dt.clear().rows.add(tempData).draw(false);
					
						return this;
					});

					let badge=(resp.info.GRATIS==1)?'badge bg-primary':'';
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					var newRowData =[
						`<div class="estadoTachado fecha">${moment(resp.info.FECHA_ATENCION).format('DD/MM/YYYY')}</div>`,
						`<div class="estadoTachado documento">${resp.info.NRO_DOCUMENTO}</div>`,
						`<div class="estadoTachado cliente muestraMensaje">${resp.info.CLIENTE}</div>`,
						`<div class="estadoTachado servicio">${resp.info.SERVICIO}</div>`,
						`<div class="estadoTachado precio">${parseFloat(resp.info.PRECIO).toFixed(2)}</div>
						<div class="estadoTachado tipoPago badge bg-${resp.info.COLOR}">${resp.info.TIPO_PAGO}</div>`,
						`<div class="estadoTachado gratis"><span class="${badge}">${(resp.info.GRATIS==0)?'NO':'SI'}</span></div>`,
						`<div class="estadoTachado colaborador">${resp.info.EMPLEADO}</div>`,
						ver()+enviar()
					]
					let rowNode =t.row.add(newRowData).draw( false ).node();
					$( rowNode ).attr('id',resp.info.ID_ATENCION);

					var index = t.rows().indexes().filter(function(value, index) {
						return value == t.data().length - 1;
					});
					t.row(index).moveTo(0);
                	t.draw(false);
					$("#"+objeto.tabla+"Tabla #"+resp.info.ID_ATENCION).css('background-color',resp.info.COLORGRILLA);
					verTicket({id:resp.info.ID_ATENCION,nombre:dato,tabla:objeto.tabla, tipo:'enviar'});
					//success("Creado","¡Se ha creado el registro: "+dato+"!");*/
				}
				limpiaTodo(objeto.tabla);
				objeto.tipoPago.prop('disabled', false);
				objeto.cantidad.val(1);
				objeto.gratis.val(0).trigger('change.select2');
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

function atencionElimina(objeto){
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

function atencionEstado(objeto){
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


