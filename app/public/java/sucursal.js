//FUNCIONES
$(document).ready(function() {
	try {
		//vistaSucursal();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaSucursal(objetoEmpresa){
	bloquea();
	let tabla="sucursal";
	/*const lista= await axios.get('/api/'+tabla+'/listar/'+objetoEmpresa.id+'/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});*/
	const lista =  await axios.get("/api/sucursal/listar/detalle/"+verSesion()+"/"+objetoEmpresa.id+"/"+verSesion(),{ 
		headers:{
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
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-city"></i> SUCURSAL</div>
						<div class="pb-0 alert alert-primary" role="alert">${objetoEmpresa.razon}</div>
						<div class="row pt-3">
							<div class="form-group col-md-5">
								<label>Nombre (*)</label>
								<input name="nombre" autocomplete="off" maxlength="200" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese el nombre">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-7">
								<label>Dirección</label>
								<input name="direccion" autocomplete="off" maxlength="200" type="text" class="form-control p-1" placeholder="Ingrese la dirección">
							</div> 
						</div>
						<div class="row">
							<div class="form-group col-md-6">
								<label>Fijo</label>
								<input name="fijo" autocomplete="off" maxlength="7" type="tel" class="form-control p-1" placeholder="Ingrese el fijo">
							</div> 
							<div class="form-group col-md-6">
								<label>Celular (*)</label>
								<input name="celular" autocomplete="off" maxlength="9" type="tel" class="form-control p-1" placeholder="Ingrese el celular">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-6">
								<label>Ruc (*)</label>
								<input readonly name="ruc" autocomplete="off" maxlength="11" type="tel" class="form-control p-1" placeholder="Ingrese el ruc" value='${objetoEmpresa.ruc}'>
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div> 
							<div class="form-group col-md-6">
								<label>Nro. Documentos</label>
								<input name="documentos" autocomplete="off" maxlength="5" type="tel" class="form-control p-1" placeholder="Ingrese el nro de documentos">
							</div>
						</div>
						<div class="pt-3 col-md-12 pl-0 pr-0 text-center">
							${regresa()+limpia()+guarda()}
						</div>
						<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
					</form>
					<hr class="border border-primary">
					<div class="table-responsive">
						<table id="${tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
							<thead>
								<tr>
									<th style="width: 50%;">Nombre</th>
									<th style="width: 10%;">Ruc</th>
									<th style="width: 10%;">Celular</th>
									<th style="width: 10%;">Nro. Doc.</th>
									<th style="width: 10%;">Doc. Emit.</th>
									<th style="width: 10%;" class="nosort nosearch">Acciones</th>
								</tr>
							</thead>
							<tbody>`;
							var mestado;
							var mactual;
							for(let i=0;i<resp.length;i++){
								if(resp[i].ES_VIGENTE==1){
									mestado='';
								}else{
									mestado='tachado';
								}
								if(resp[i].ES_PRINCIPAL==1){
									mprincipal="<span class='badge bg-primary'>Principal</span>";
								}else{
									mprincipal='';
								}
								if(resp[i].ID_SUCURSAL==resp[i].SUCURSAL_ACTUAL){
									mactual="<span class='badge bg-success'>Actual</span>";
								}else{
									mactual='';
								}
					listado+=`<tr id="${resp[i].ID_SUCURSAL}">
									<td>
										<div class="estadoTachado nombre muestraMensaje ${mestado}">${resp[i].NOMB_SUCURSAL }</div>
										<span class='principal'>${mprincipal}</span><span class='actual'>${mactual}</span>
									</td>
									<td>
										<div class="estadoTachado ruc ${mestado}">${resp[i].RUC }</div>
									</td>
									<td>
										<div class="estadoTachado celular ${mestado}">${resp[i].NRO_CELULAR}</div>
									</td>
									<td>
										<div class="estadoTachado documentos ${mestado}">${(resp[i].DOCUMENTOS===null)?'Ilimitado':resp[i].DOCUMENTOS }</div>
									</td>
									<td>
										<div class="estadoTachado documentos_emitidos ${mestado}">${resp[i].DOCUMENTOS_GENERADOS}</div>
									</td>
									<td>
										${estado()+((resp[i].ES_PRINCIPAL==1)?'':modifica()+elimina())}
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
		direccion:$('#'+tabla+' input[name=direccion]'),
		fijo:$('#'+tabla+' input[name=fijo]'),
		celular:$('#'+tabla+' input[name=celular]'),
		ruc:$('#'+tabla+' input[name=ruc]'),
		documentos:$('#'+tabla+' input[name=documentos]'),
		idPadre:objetoEmpresa.id,
		tabla:tabla,
	}
	eventosSucursal(objeto);
}

function eventosSucursal(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='nombre'){
			textoNumeroRegex(elemento);
			validaVacio(elemento);
		}else if(name=='direccion'){
			comentarioRegex(elemento);
		}
	});

	$('#'+objeto.tabla+' div').off( 'change');
    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
	});

	$('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='ruc'){
			validaRuc(elemento);
		}else if(name=='documentos'){
			numeroRegex(elemento);
		}else if(name=='celular'){
			validaCelular(elemento);
		}else if(name=='fijo'){
			fijoRegex(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioSucursal(objeto)
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		limpiaTodo(objeto.tabla);
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnRegresa]',function(){//regresa
		vistaEmpresa();
	});

	$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.edita',function(){//edita
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		objeto.id=id;
		objeto.nombreEdit=nombre;
		sucursalEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr");
    	//let id=evento.attr('id');
		//let nombre=evento.find("td div.nombre").text();
		//sucursalEstado({id:id,nombre:nombre,tabla:objeto.tabla});
		let idDetalle=evento.attr('id');
		let sucursal=evento.find("td div.razon").text();
		let ruc=evento.find("td div.ruc").text();
		usuarioEstadoSucursal({idDetalle:idDetalle,descripcionDetalle:sucursal+" - "+ruc,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		sucursalElimina({id:id,nombre:nombre,tabla:objeto.tabla});
	});
}

async function sucursalEdita(objeto){
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
	objeto.nombre.val(resp.NOMB_SUCURSAL);
	objeto.direccion.val(resp.DIRECCION);
	objeto.fijo.val(resp.NRO_FIJO);
	objeto.celular.val(resp.NRO_CELULAR);
	objeto.ruc.val(resp.RUC);
	objeto.documentos.val(resp.DOCUMENTOS);
}

function validaFormularioSucursal(objeto){	
	validaVacio(objeto.nombre);
	let vruc=validaRuc(objeto.ruc);
	let vcel=validaCelular(objeto.celular);

	if(objeto.nombre.val()=="" || vruc==false || vcel==false){
		return false;
	}else{
		enviaFormularioSucursal(objeto);
	}
}

function enviaFormularioSucursal(objeto){
	let dato=(objeto.id==0)?muestraMensaje({tabla:objeto.tabla}):objeto.nombreMsg;
	let verbo=(objeto.id==0)?'Creará':'Modificará';

	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("idEmpresa", objeto.idPadre);
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	fd.append("imagen", null);
	
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
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .nombre").text(resp.info.NOMB_SUCURSAL);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .ruc").text(resp.info.RUC);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .celular").text(resp.info.NRO_CELULAR);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .documentos").text((resp.info.DOCUMENTOS===null)?'Ilimitado':resp.info.DOCUMENTOS);
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
					
					if(resp.info.ID_SUCURSAL==resp.info.SUCURSAL_ACTUAL){
						socket.emit('actualizaNombreSucursal',{
							id_sucursal:resp.info.ID_SUCURSAL,
							sucursal: resp.info.NOMB_SUCURSAL,
							empresa: '',
							usuario: "U"+verSesion()
						});
					}

					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						`<div class="estadoTachado nombre muestraMensaje">${resp.info.NOMB_SUCURSAL}</div>`,
						`<div class="estadoTachado ruc">${resp.info.RUC}</div>`,
						`<div class="estadoTachado celular">${resp.info.NRO_CELULAR}</div>`,
						`<div class="estadoTachado documentos">${(resp.info.DOCUMENTOS===null)?'Ilimitado':resp.info.DOCUMENTOS}</div>`,
						`<div class="estadoTachado documentos_emitidos">0</div>`,
						estado()+modifica()+elimina()
					] ).draw( false ).node();
					$( rowNode ).attr('id',resp.info.ID_SUCURSAL);
										
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

function sucursalElimina(objeto){
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

function sucursalEstado(objeto){
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

function usuarioEstadoSucursal(objeto){
	confirm("¡Cambiará a la sucursal: "+objeto.descripcionDetalle+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body={
			id: verSesion(),
			idDetalle: objeto.idDetalle,
			sesId: verSesion()
		}
		try {
			const estado = await axios.post("/api/usuario/detalle/estado",body,{ 
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
					id_sucursal:objeto.idDetalle,
					sucursal: resp.info.SUCURSAL,
					empresa: resp.info.EMPRESA,
					usuario: "U"+verSesion()
				});

				actualizaDashboard();
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