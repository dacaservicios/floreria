//FUNCIONES
$(document).ready(function() {
	try {
		vistaConcepto();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaConcepto(){
	bloquea();
	let tabla="concepto";
	const lista= await axios.get('/api/'+tabla+'/listar/0/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});

	const lista2 = await axios.get("/api/parametro/detalle/listar/48/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	desbloquea();
	const resp=lista.data.valor.info;
	const resp2=lista2.data.valor.info;
	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-comments-dollar"></i> CONCEPTO</div>
						<div class="row pt-3">
							<div class="form-group col-md-5">
								<label>Movimiento (*)</label>
								<select name="tipo" class="form-control select2">
									<option value="">Select...</option>`;
									for(var i=0;i<resp2.length;i++){
										if(resp2[i].ES_VIGENTE==1){
									listado+=`<option value="${resp2[i].ID_PARAMETRO_DETALLE}">${resp2[i].DESCRIPCIONDETALLE}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-7">
								<label>Concepto (*)</label>
								<input name="nombre" autocomplete="off" maxlength="100" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese el nombre">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
						</div>
						<div class="row">	
							<div class="form-group col-md-12">
								<label>Descripcion</label>
								<input name="descripcion" autocomplete="off" maxlength="250" type="text" class="form-control p-1" placeholder="Ingrese la descripción">
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
									<th style="width: 30%;">Movimiento</th>
									<th style="width: 40%;">Concepto</th>
									<th style="width: 20%;">Descripción</th>
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
								
					listado+=`<tr id="${resp[i].ID_CONCEPTO}">
									<td>
										<div class="estadoTachado movimiento muestraMensaje ${mestado}">${resp[i].TIPO_MOVIMIENTO}</div>
									</td>
									<td>
										<div class="estadoTachado concepto ${mestado}">${resp[i].CONCEPTO}</div>
									</td>
									<td>
										<div class="estadoTachado descripcion ${mestado}">${(resp[i].DESCRIPCION===null)?'':resp[i].DESCRIPCION}</div>
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
		nombre:$('#'+tabla+' input[name=nombre]'),
		tipo:$('#'+tabla+' select[name=tipo]'),
		descripcion:$('#'+tabla+' input[name=descripcion]'),
		tabla:tabla
	}
	eventosConcepto(objeto);
}

function eventosConcepto(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='descripcion'){
			comentarioRegex(elemento);
		}else if(name=='nombre'){
			validaVacio(elemento);
			comentarioRegex(elemento);
		}
	});

	$('#'+objeto.tabla+' div').off( 'change');
    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
	});

	$('#'+objeto.tabla+' div').off( 'click');
	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioConcepto(objeto)
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
		conceptoEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		conceptoEstado({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		conceptoElimina({id:id,nombre:nombre,tabla:objeto.tabla});
	});
}

async function conceptoEdita(objeto){
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
	objeto.nombre.val(resp.CONCEPTO);
	objeto.tipo.val(resp.ID_MOVIMIENTO).trigger('change.select2');
	objeto.descripcion.val(resp.DESCRIPCION);
}

function validaFormularioConcepto(objeto){	
	validaVacio(objeto.nombre);
	validaVacioSelect(objeto.tipo);

	if(objeto.nombre.val()=="" || objeto.tipo.val()==""){
		return false;
	}else{
		enviaFormularioConcepto(objeto);
	}
}

function enviaFormularioConcepto(objeto){
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
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .movimiento").text(resp.info.TIPO_MOVIMIENTO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .concepto").html(resp.info.CONCEPTO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .descripcion").text((resp.info.DESCRIPCION===null)?'':resp.info.DESCRIPCION);
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
					
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						`<div class="estadoTachado movimiento">${resp.info.TIPO_MOVIMIENTO}</div>`,
						`<div class="estadoTachado concepto muestraMensaje">${resp.info.CONCEPTO}</div>`,
						`<div class="estadoTachado descripcion">${(resp.info.DESCRIPCION===null)?'':resp.info.DESCRIPCION}</div>`,
						estado()+modifica()+elimina()
					] ).draw( false ).node();
					$( rowNode ).attr('id',resp.info.ID_CONCEPTO);
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

function conceptoElimina(objeto){
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

function conceptoEstado(objeto){
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