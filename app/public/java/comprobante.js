//FUNCIONES
$(document).ready(function() {
	try {
		vistaComprobante();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaComprobante(){
	bloquea();
	let tabla="comprobante";
	const lista= await axios.get('/api/'+tabla+'/listar/0/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});

	const documento =  await axios.get("/api/parametro/detalle/listar/41/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});

	const tipoventa =  await axios.get("/api/parametro/detalle/listar/61/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	
	desbloquea();
	const resp=lista.data.valor.info;
	const resp2=documento.data.valor.info;
	const resp3=tipoventa.data.valor.info;
			
	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-receipt"></i> COMPROBANTE</div>
						<div class="row pt-3">
							<div class="form-group col-md-3">
								<label>Tipo documento (*)</label>
								<select name="tipoDocumento" class="form-control select2 muestraMensaje">
									<option value="">Select...</option>`;
									for(var i=0;i<resp2.length;i++){
										if(resp2[i].ES_VIGENTE==1){
									listado+=`<option value="${resp2[i].ID_PARAMETRO_DETALLE}">${resp2[i].DESCRIPCIONDETALLE}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-3">
								<label>Tipo venta (*)</label>
								<select name="tipoVenta" class="form-control select2">
									<option value="">Select...</option>`;
									for(var i=0;i<resp3.length;i++){
										if(resp3[i].ES_VIGENTE==1){
									listado+=`<option value="${resp3[i].ID_PARAMETRO_DETALLE}">${resp3[i].DESCRIPCIONDETALLE}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-3">
								<label>Serie (*)</label>
								<input name="serie" autocomplete="off" maxlength="10" type="text" class="form-control p-1" placeholder="Ingrese la serie">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div> 
							<div class="form-group col-md-3">
								<label>Inicio</label>
								<input name="inicio" autocomplete="off" maxlength="10" type="text" class="form-control p-1" placeholder="Ingrese el inicio">
								<div class="vacio oculto">¡Campo obligatorio!</div>
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
									<th style="width: 25%;">Nombre</th>
									<th style="width: 25%;">Tipo</th>
									<th style="width: 10%;">Serie</th>
									<th style="width: 15%;">Inicio</th>
									<th style="width: 15%;">Actual</th>
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
					listado+=`<tr id="${resp[i].ID_COMPROBANTE}">
									<td>
										<div class="estadoTachado tipoDocumento muestraMensaje ${mestado}">${resp[i].TIPO_DOCUMENTO}</div>
									</td>
									<td>
										<div class="estadoTachado tipoVenta muestraMensaje ${mestado}">${resp[i].TIPO_VENTA}</div>
									</td>
									<td>
										<div class="estadoTachado serie ${mestado}">${resp[i].SERIE}</div>
									</td>
									<td>
										<div class="estadoTachado inicio ${mestado}">${resp[i].CORRELATIVO_INICIAL}</div>
									</td>
									<td>
										<div class="estadoTachado actual ${mestado}">${ (resp[i].CORRELATIVO_ACTUAL===null)?'': resp[i].CORRELATIVO_ACTUAL}</div>
									</td>
									<td>
										${estado()+modifica()+elimina()}
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

	$("#"+tabla+" span#botonGuardar").text('Crear');
	$('#'+tabla+'Tabla').DataTable(valoresTabla);
	let objeto={
		tipoDocumento:$('#'+tabla+' select[name=tipoDocumento]'),
		tipoVenta:$('#'+tabla+' select[name=tipoVenta]'),
		serie:$('#'+tabla+' input[name=serie]'),
		inicio:$('#'+tabla+' input[name=inicio]'),
		tabla:tabla,
	}
	eventosComprobante(objeto);
}


function eventosComprobante(objeto){
	$('#'+objeto.tabla+' div').off( 'change');
	$('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
	});

	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='serie'){
			comprobanteRegex(elemento);
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='inicio'){
			validaVacio(elemento);
			numeroRegex(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioComprobante(objeto)
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		limpiaTodo(objeto.tabla);
	});

	$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.edita',function(){//edita
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		objeto.id=id;
		objeto.nombreEdit=nombre;
		comprobanteEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		comprobanteEstado({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		comprobanteElimina({id:id,nombre:nombre,tabla:objeto.tabla});
	});
}

async function comprobanteEdita(objeto){
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
	objeto.tipoDocumento.val(resp.ID_TIPO_DOCUMENTO).trigger('change.select2');
	objeto.tipoVenta.val(resp.ID_TIPO_VENTA).trigger('change.select2');
	objeto.serie.val(resp.SERIE);
	objeto.inicio.val(resp.CORRELATIVO_INICIAL);
}

function validaFormularioComprobante(objeto){
	validaVacioSelect(objeto.tipoDocumento);
	validaVacioSelect(objeto.tipoVenta);
	validaVacio(objeto.serie);
	validaVacio(objeto.inicio);

	if(objeto.tipoDocumento.val()=="" || objeto.tipoVenta.val()=="" || objeto.serie.val()=="" ||objeto.inicio.val()==""){
		return false;
	}else{
		enviaFormularioComprobante(objeto);
	}
}

function enviaFormularioComprobante(objeto){
	let dato=(objeto.id==0)?muestraMensaje({tabla:objeto.tabla}):objeto.nombreMsg;
	let verbo=(objeto.id==0)?'Creará':'Modificará';

	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	
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
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .tipoDocumento").text(resp.info.TIPO_DOCUMENTO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .tipoVenta").text(resp.info.TIPO_VENTA);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .serie").text(resp.info.SERIE);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .inicio").text(resp.info.CORRELATIVO_INICIAL);
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
					
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						`<div class="estadoTachado  tipoDocumento muestraMensaje">${resp.info.TIPO_DOCUMENTO}</div>`,
						`<div class="estadoTachado  tipoVenta">${resp.info.TIPO_VENTA}</div>`,
						`<div class="estadoTachado  serie">${resp.info.SERIE}</div>`,
						`<div class="estadoTachado  inicio">${resp.info.CORRELATIVO_INICIAL}</div>`,
						``,
						estado()+modifica()+elimina()
					] ).draw( false ).node();
					$( rowNode ).attr('id',resp.info.ID_COMPROBANTE);
										
					//success("Creado","¡Se ha creado el registro: "+dato+"!");
				}
				limpiaTodo(objeto.tabla);
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

function comprobanteElimina(objeto){
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

function comprobanteEstado(objeto){
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

				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .tipoDocumento").removeClass('tachado');
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .tipoVenta").removeClass('tachado');
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .serie").removeClass('tachado');
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .inicio").removeClass('tachado');

				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .tipoDocumento").addClass(estado);
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .tipoVenta").removeClass('tachado');
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .serie").addClass(estado);
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .inicio").addClass(estado);

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