//FUNCIONES
$(document).ready(function() {
	try {
		vistaParametro();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaParametro(){
	bloquea();
	let tabla="parametro";
	const lista= await axios.get('/api/'+tabla+'/listar/0/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});
	desbloquea();
	const resp=lista.data.valor.info;

	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="la la-list-alt"></i> MI PARÁMETRO</div>
					</form>
					<div class="table-responsive pt-4">
						<table id="${tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
							<thead>
								<tr>
									<th style="width: 70%;">Descripción</th>
									<th style="width: 20%;">Abreviatura</th>
									<th style="width: 10%;" class="nosort nosearch">Acciones</th>
								</tr>
							</thead>
							<tbody>`;
							let mestado;
							for(let i=0;i<resp.length;i++){
								if(resp[i].ES_VIGENTE==1){
									mestado='';
								}else{
									mestado='tachado';
								}
								if(resp[i].ES_VISIBLE==1){
					listado+=`<tr id="${resp[i].ID_PARAMETRO}" >
									<td>
										<div class="estadoTachado descripcion muestraMensaje ${mestado}">${resp[i].DESCRIPCION}</div>
									</td>
									<td>
										<div class="estadoTachado abreviatura ${mestado}">${resp[i].ABREVIATURA}</div>
									</td>
									<td>
										${detalle()}
									</td>
								</tr>`;
								}}
					listado+=`</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>`;

	$("#cuerpoPrincipal").html(listado);
	$("#"+tabla+" span#botonGuardar").text('Crear');
	$('#'+tabla+'Tabla').DataTable(valoresTabla);
	let objeto={
		abreviatura:$('#'+tabla+' input[name=abreviatura]'),
		descripcion:$('#'+tabla+' input[name=descripcion]'),
		tabla:tabla,
	}
	eventosParametro(objeto);
}

function eventosParametro(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='descripcion'){
			comentarioRegex(elemento);
			validaVacio(elemento);
		}else if(name=='abreviatura'){
			validaAbreviatura(elemento);
		}
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.detalle',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let descripcion=evento.find("td div.descripcion").text();
		vistaParametroDetalle({id:id,descripcion:descripcion,tabla:objeto.tabla});
	});
}


//DETALLE DE PARAMETRO
async function vistaParametroDetalle(objeto){
	bloquea();
	const lista= await axios.get('/api/mi'+objeto.tabla+'/detalle/listar/'+objeto.id+'/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});
	desbloquea();
	const resp=lista.data.valor.info;
	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${objeto.tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="la la-list-alt la-2x"></i> DETALLE PARAMETRO</div>
						<div class="pb-0 alert alert-primary" role="alert">${objeto.descripcion}</div>
						<div class="row">
							<div class="form-group col-md-12">
								<label>Descripción (*)</label>
								<input name="descripcionDetalle" autocomplete="off" maxlength="200" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese la descripción">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-12">
								<label>Valor (*)</label>
								<input name="valorDetalle" autocomplete="off" maxlength="500" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese el valor">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-12 oculto">
								<label>Abreviatura (*)</label>
								<input name="abreviaturaDetalle" autocomplete="off" maxlength="10" type="text" class="form-control p-1" placeholder="Ingrese la abreviatura">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div> 
						</div> 
						<div class="pt-3 col-md-12 pl-0 pr-0 text-center">
							${regresa()+limpia()+guarda()}
						</div>
						<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
					</form>
					<hr class="border border-primary">
					<div class="table-responsive">
						<table id="${objeto.tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
							<thead>
								<tr>
									<th style="width:50%;">Descripción</th>
									<th style="width:20%;">Valor</th>
									<th style="width:20%;">Abreviatura</th>
									<th style="width:10%;" class="nosort nosearch">Acciones</th>
								</tr>
							</thead>
							<tbody>`;
								for(var i=0;i<resp.length;i++){
									if(resp[i].ES_VISIBLE==1){
										
						listado+=`<tr id="${resp[i].ID_PARAMETRO_DETALLE_SUCURSAL}">
									<td>
										<div class="estadoTachado descripcionDetalle muestraMensaje">${resp[i].DESCRIPCIONDETALLE }</div>
									</td>
									<td>
										<div class="estadoTachado valorDetalle muestraMensaje">${resp[i].VALORDETALLE }</div>
									</td>
									<td>
										<div class="estadoTachado abreviaturaDetalle">${resp[i].ABREVIATURA }</div>
									</td>
									<td>
										${modifica()}
									</td>
								</tr>`;
								}}
					listado+=`</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>`;
	$("#cuerpoPrincipal").html(listado);
	$("#"+objeto.tabla+" span#botonGuardar").text('Modificar');
	$('#'+objeto.tabla+'Tabla').DataTable(valoresTabla);
	let objetoDetalle={
		abreviaturaDetalle:$('#'+objeto.tabla+' input[name=abreviaturaDetalle]'),
		descripcionDetalle:$('#'+objeto.tabla+' input[name=descripcionDetalle]'),
		valorDetalle:$('#'+objeto.tabla+' input[name=valorDetalle]'),
		tabla:objeto.tabla,
		idPadre:objeto.id
	}
	eventosParametroDetalle(objetoDetalle);
}

function eventosParametroDetalle(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='descripcionDetalle' || name=='valorDetalle'){
			comentarioRegex(elemento);
			validaVacio(elemento);
		}else if(name=='abreviaturaDetalle'){
			validaAbreviatura(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.idDetalle= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioParametroDetalle(objeto)
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		limpiaTodo(objeto.tabla);
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnRegresa]',function(){//regresa
		vistaParametro();
	});

	$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.edita',function(){//edita
		let evento=$(this).parents("tr")
    	let idDetalle=evento.attr('id');
		let descripcionDetalle=evento.find("td div.descripcionDetalle").text();
		objeto.idDetalle=idDetalle;
		objeto.nombreEdit=descripcionDetalle;
		parametroEditaDetalle(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let idDetalle=evento.attr('id');
		let descripcionDetalle=evento.find("td div.descripcionDetalle").text();
		parametroEstadoDetalle({idDetalle:idDetalle,descripcionDetalle:descripcionDetalle,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let idDetalle=evento.attr('id');
		let descripcionDetalle=evento.find("td div.descripcionDetalle").text();
		parametroEliminaDetalle({idDetalle:idDetalle,descripcionDetalle:descripcionDetalle,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.visible',function(){//estado
		let evento=$(this).parents("tr")
    	let idDetalle=evento.attr('id');
		let descripcionDetalle=evento.find("td div.descripcionDetalle").text();
		parametroVisibleDetalle({idDetalle:idDetalle,descripcionDetalle:descripcionDetalle,tabla:objeto.tabla});
	});
}

async function parametroEditaDetalle(objeto){
	$("#"+objeto.tabla+" span.muestraId").text(objeto.idDetalle);
	$("#"+objeto.tabla+" span.muestraNombre").text(objeto.nombreEdit);
	$("#"+objeto.tabla+" span#botonGuardar").text('Modificar');
	quitaValidacion(objeto.abreviaturaDetalle);
	quitaValidacion(objeto.descripcionDetalle);
	quitaValidacion(objeto.valorDetalle);
	bloquea();
	const busca= await axios.get('/api/mi'+objeto.tabla+'/detalle/buscar/'+objeto.idDetalle+'/'+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		}
	});
	desbloquea();
	const resp=busca.data.valor.info;
	objeto.abreviaturaDetalle.val(resp.ABREVIATURA);
	objeto.descripcionDetalle.val(resp.DESCRIPCION_PARAMETRO_DETALLE);
	objeto.valorDetalle.val(resp.VALOR_PARAMETRO_DETALLE);

}

function validaFormularioParametroDetalle(objeto){	
	validaVacio(objeto.descripcionDetalle);
	let vabrev=validaAbreviatura(objeto.abreviaturaDetalle);

	if(objeto.descripcionDetalle.val()=="" || objeto.valorDetalle.val()=="" || vabrev==false){
		return false;
	}else{
		enviaFormularioParametroDetalle(objeto);
	}
}

function enviaFormularioParametroDetalle(objeto){
	let dato=(objeto.idDetalle==0)?muestraMensaje({tabla:objeto.tabla}):objeto.nombreMsg;
	let verbo=(objeto.idDetalle==0)?'Creará':'Modificará';

	let id=(objeto.idDetalle==0)?objeto.idPadre:objeto.idDetalle;
	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("id", id);
	fd.append("sesId", verSesion());
	
	confirm("¡"+verbo+" el registro: "+dato+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body=fd;
		try {
			let creaEdita;
			if(objeto.idDetalle==0){
				creaEdita = await axios.post("/api/mi"+objeto.tabla+"/detalle/crear",body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
			}else{
				creaEdita = await axios.put("/api/mi"+objeto.tabla+"/detalle/editar/"+objeto.idDetalle,body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
			}
			desbloquea();
			resp=creaEdita.data.valor;
			if(resp.resultado){
				if(objeto.idDetalle>0){
					$("#"+objeto.tabla+"Tabla #"+objeto.idDetalle+" .descripcionDetalle").text(resp.info.DESCRIPCION);
					$("#"+objeto.tabla+"Tabla #"+objeto.idDetalle+" .abreviaturaDetalle").text(resp.info.ABREVIATURA);
					$("#"+objeto.tabla+"Tabla #"+objeto.idDetalle+" .valorDetalle").text(resp.info.VALOR);
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);

					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						`<div class="estadoTachado descripcionDetalle muestraMensaje">${resp.info.DESCRIPCION}</div>`,
						`<div class="estadoTachado valorDetalle muestraMensaje">${resp.info.VALOR}</div>`,
						`<div class="estadoTachado abreviaturaDetalle">${resp.info.ABREVIATURA}</div>`,
						estado()+visible()+modifica()+elimina()
					] ).draw( false ).node();
					$( rowNode ).attr('id',resp.info.ID_PARAMETRO_DETALLE);

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

function parametroEliminaDetalle(objeto){
	confirm("¡Eliminará el registro: "+objeto.descripcionDetalle+"!",function(){
		return false;
	},async function(){
        bloquea();
		try {
			const eliminar = await axios.delete("/api/"+objeto.tabla+"/detalle/eliminar/"+objeto.idDetalle,{ 
				headers:{authorization: `Bearer ${verToken()}`} 
			});
			
			desbloquea();
			resp=eliminar.data.valor;
			if(resp.resultado){
				let  elimina=$('#'+objeto.tabla+'Tabla').DataTable();
				$('#'+objeto.tabla+'Tabla #'+objeto.idDetalle).closest('tr');
				elimina.row($('#'+objeto.tabla+'Tabla #'+objeto.idDetalle)).remove().draw(false); 
				//success("Eliminado","¡Se ha eliminado el registro: "+objeto.descripcion+"¡");
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

function parametroEstadoDetalle(objeto){
	confirm("¡Cambiará el estado del registro: "+objeto.descripcionDetalle+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body={
		}
		try {
			const estado = await axios.put("/api/"+objeto.tabla+"/detalle/estado/"+objeto.idDetalle,body,{ 
				headers:{authorization: `Bearer ${verToken()}`} 
			});
			desbloquea();
			resp=estado.data.valor;
			if(resp.resultado){
				let estado=(resp.info.ESTADO==0)?'tachado':'';

				$("#"+objeto.tabla+"Tabla #"+objeto.idDetalle+" .estadoTachado").removeClass('tachado');

				$("#"+objeto.tabla+"Tabla #"+objeto.idDetalle+" .estadoTachado").addClass(estado);

				//success("Estado","¡Se ha cambiado el estado del registro: "+objeto.descripcion+"!");
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

function parametroVisibleDetalle(objeto){
	confirm("¡Cambiará la visibilidad del registro: "+objeto.descripcionDetalle+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body={
		}
		try {
			const visible = await axios.put("/api/"+objeto.tabla+"/detalle/visible/"+objeto.idDetalle,body,{ 
				headers:{authorization: `Bearer ${verToken()}`} 
			});
			desbloquea();
			resp=visible.data.valor;
			if(resp.resultado){
				let visible=(resp.info.VISIBLE==0)?'opaco':'';

				$("#"+objeto.tabla+"Tabla #"+objeto.idDetalle+" .abreviaturaDetalle").removeClass('opaco');
				$("#"+objeto.tabla+"Tabla #"+objeto.idDetalle+" .descripcionDetalle").removeClass('opaco');

				$("#"+objeto.tabla+"Tabla #"+objeto.idDetalle+" .abreviaturaDetalle").addClass(visible);
				$("#"+objeto.tabla+"Tabla #"+objeto.idDetalle+" .descripcionDetalle").addClass(visible);

				//success("Estado","¡Se ha cambiado el estado del registro: "+objeto.descripcion+"!");
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
