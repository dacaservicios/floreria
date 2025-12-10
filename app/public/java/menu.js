//FUNCIONES
$(document).ready(function() {
	try {
		vistaMenu();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaMenu(){
	bloquea();
	let tabla="menu";
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
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="la la-ellipsis-h"></i> MENÚ</div>
						<div class="row pt-3">
							<div class="form-group col-md-10">
								<label>Nombre (*)</label>
								<input name="nombre" autocomplete="off" maxlength="100" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese el nombre">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-2">
								<label>Orden (*)</label>
								<input name="orden" autocomplete="off" maxlength="5" type="tel" class="form-control p-1" placeholder="ingrese un orden">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-12">
								<label>Descripción</label>
								<input name="descripcion" autocomplete="off" maxlength="100" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese la descripción">
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
									<th style="width: 20%;">Nombre</th>
									<th style="width: 70%;">Descripción</th>
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
					listado+=`<tr id="${resp[i].ID_MENU}" >
									<td>
										<div class="estadoTachado nombre muestraMensaje ${mestado}">${resp[i].NOMB_MENU}</div>
									</td>
									<td>
										<div class="estadoTachado descripcion ${mestado}">${resp[i].DESC_MENU}</div>
									</td>
									<td>
										${detalle()+estado()+modifica()+elimina()}
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
	$("#"+tabla+" span#botonGuardar").text('Crear');
	$('#'+tabla+'Tabla').DataTable(valoresTabla);
	let objeto={
		nombre:$('#'+tabla+' input[name=nombre]'),
		orden:$('#'+tabla+' input[name=orden]'),
		descripcion:$('#'+tabla+' input[name=descripcion]'),
		tabla:tabla,
	}
	eventosMenu(objeto);
}

function eventosMenu(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='nombre'){
			comentarioRegex(elemento);
			validaVacio(elemento);
		}else if(name=='descripcion'){
			comentarioRegex(elemento);
		}
	});

    $('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='orden'){
			decimalRegex(elemento);
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioMenu(objeto)
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
		menuEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		menuEstado({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		menuElimina({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.detalle',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		vistaMenuDetalle({id:id,nombre:nombre,tabla:objeto.tabla});
	});
}

async function menuEdita(objeto){
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
	objeto.nombre.val(resp.NOMB_MENU);
	objeto.orden.val(resp.ORDE_MENU);
	objeto.descripcion.val(resp.DESC_MENU);
}

function validaFormularioMenu(objeto){	
	validaVacio(objeto.nombre);
	validaVacio(objeto.orden);

	if(objeto.nombre.val()=="" || objeto.orden.val()==""){
		return false;
	}else{
		enviaFormularioMenu(objeto);
	}
}

function enviaFormularioMenu(objeto){
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
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .nombre").text(resp.info.nombreMenu);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .descripcion").text((resp.info.descripcionMenu===null)?'':resp.info.descripcionMenu);
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
					
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						`<div class="estadoTachado nombre muestraMensaje">${resp.info.nombreMenu}</div>`,
						`<div class="estadoTachado descripcion">${(resp.info.descripcionMenu===null)?'':resp.info.descripcionMenu}</div>`,
						detalle()+estado()+modifica()+elimina()
					] ).draw( false ).node();
					$( rowNode ).attr('id',resp.info.idMenu);

					//success("Creado","¡Se ha creado el registro: "+dato+"!");
				}
				limpiaTodo(objeto.tabla);
				socket.emit('actualizaModulo',{
					cargaMenu: true
				});
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

function menuElimina(objeto){
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
				socket.emit('actualizaModulo',{
					cargaMenu: true
				});
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

function menuEstado(objeto){
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

				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadoTachado").removeClass('tachado');

				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadoTachado").addClass(estado);
	
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

//DETALLE DE MENU
async function vistaMenuDetalle(objeto){
	bloquea();
	const lista= await axios.get('/api/'+objeto.tabla+'/detalle/listar/'+objeto.id+'/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});
	const submenu = await axios.get("/api/submenu/listar/0/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		}
	});

	desbloquea();
	const resp=lista.data.valor.info;
	const resp2=submenu.data.valor.info;
	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${objeto.tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="la la-list-alt"></i> DETALLE MENÚ</div>
						<div class="alert alert-primary" role="alert">${objeto.nombre}</div>
						<div class="row">
							<div class="form-group col-md-12">
								<select class="form-control select2 muestraMensaje" name="submenu">
									<option value="">Select..</option>`;
									let arrayIdSubmenu=[];
									for(var i=0;i<resp.length;i++){
										arrayIdSubmenu.push(resp[i].ID_SUME);
									}
									arrayIdSubmenu = [...new Set(arrayIdSubmenu)];
									
									for(var i=0;i<resp2.length;i++){
										if(resp2[i].ES_VIGENTE==1 && !arrayIdSubmenu.includes(resp2[i].ID_SUME)){
								listado+=`<option value="${resp2[i].ID_SUME}">${resp2[i].NOMB_SUME}</option>`;
										}
									} 
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="col-md-12 pl-0 pr-0 text-center pd-t-15">
							${regresa()+guarda()}
						</div>
						<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
					</form>
					<hr class="border border-primary">
					<div class="table-responsive">
						<table id="${objeto.tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
							<thead>
								<tr>
									<th style="width:70%;">Submnenú</th>
									<th style="width:20%;">Nivel</th>
									<th style="width:10%;" class="nosort nosearch">Acciones</th>
								</tr>
							</thead>
							<tbody>`;
								let mestado;
								for(var i=0;i<resp.length;i++){
									if(resp[i].ES_VIGENTE==1){
										mestado='';
									}else{
										mestado='tachado';
									}
						listado+=`<tr id="${resp[i].ID_MESU}">
									<td>
										<div class="estadoTachado submenu muestraMensaje ${mestado}">${resp[i].NOMB_SUME }</div>
									</td>
									<td>
										<div class="estadoTachado nivel ${mestado}">${resp[i].NOMB_NIVEL }</div>
									</td>
									<td>
										${estado()+elimina()}
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
	$("#"+objeto.tabla+" span#botonGuardar").text('Crear');
	$('#'+objeto.tabla+'Tabla').DataTable(valoresTabla);
	let objetoDetalle={
		submenu:$('#'+objeto.tabla+' select[name=submenu]'),
		tabla:objeto.tabla,
		idPadre:objeto.id,
		nombrePadre:objeto.nombre
	}
	eventosMenuDetalle(objetoDetalle);
}

function eventosMenuDetalle(objeto){
	$('#'+objeto.tabla+' div').off( 'change');
    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		if(name=='submenu'){
			validaVacioSelect(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.idDetalle= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioMenuDetalle(objeto)
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnRegresa]',function(){//regresa
		vistaMenu();
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let idDetalle=evento.attr('id');
		let submenu=evento.find("td div.submenu").text();
		let nivel=evento.find("td div.nivel").text();
		menuEstadoDetalle({idDetalle:idDetalle,descripcionDetalle:submenu+" - "+nivel,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let idDetalle=evento.attr('id');
		let submenu=evento.find("td div.submenu").text();
		let nivel=evento.find("td div.nivel").text();
		menuEliminaDetalle({idDetalle:idDetalle,descripcionDetalle:submenu+" - "+nivel,tabla:objeto.tabla});
	});
}


function validaFormularioMenuDetalle(objeto){	
	validaVacioSelect(objeto.submenu);

	if(objeto.submenu.val()==""){
		return false;
	}else{
		enviaFormularioMenuDetalle(objeto);
	}
}

function enviaFormularioMenuDetalle(objeto){
	let dato=(objeto.idDetalle==0)?muestraMensaje({tabla:objeto.tabla}):objeto.nombreMsg;
	let verbo=(objeto.idDetalle==0)?'Creará':'Modificará';

	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("id", objeto.idPadre);
	fd.append("sesId", verSesion());
	
	confirm("¡"+verbo+" el registro: "+dato+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body=fd;
		try {
			let crea = await axios.post("/api/"+objeto.tabla+"/detalle/crear",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});

			desbloquea();
			resp=crea.data.valor;
			if(resp.resultado){
				vistaMenuDetalle({id:objeto.idPadre,nombre:objeto.nombrePadre,tabla:objeto.tabla});
				socket.emit('actualizaModulo',{
					cargaMenu: true
				});
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

function menuEliminaDetalle(objeto){
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
				if(resp.info.cuenta==0){
					vistaMenuDetalle({id:objeto.idPadre,nombre:objeto.nombrePadre,tabla:objeto.tabla});
				}
				socket.emit('actualizaModulo',{
					cargaMenu: true
				});
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

function menuEstadoDetalle(objeto){
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