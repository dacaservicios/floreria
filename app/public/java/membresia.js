//FUNCIONES
$(document).ready(function() {
	try {
		vistaMembresia();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaMembresia(){
	bloquea();
	let tabla="membresia";
	const lista= await axios.get('/api/'+tabla+'/listar/0/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});


	const lista2 = await axios.get("/api/parametro/detalle/listar/38/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});

	const lista3= await axios.get('/api/empresa/listar/0/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});
	
	desbloquea();
	const membresia=lista.data.valor.info;
	const tipo_moneda=lista2.data.valor.info;
	const empresa=lista3.data.valor.info;

	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-credit-card"></i> MEMBRESÍA</div>
						<div class="row pt-3">
							<div class="form-group col-md-12">
								<label>Empresa (*)</label>
								<select name="empresa" class="form-control select2 muestraMensaje">
									<option value="">Select...</option>`;
									for(var i=0;i<empresa.length;i++){
										if(empresa[i].ES_VIGENTE==1){
									listado+=`<option value="${empresa[i].ID_EMPRESA}">${empresa[i].RUC+" - "+empresa[i].NOMB_EMPRESA}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="row pt-3">
							<div class="form-group col-md-4">
								<label>Moneda (*)</label>
								<select name="tipoMoneda" class="form-control select2">
									<option value="">Select...</option>`;
									for(var i=0;i<tipo_moneda.length;i++){
										if(tipo_moneda[i].ES_VIGENTE==1){
									listado+=`<option value="${tipo_moneda[i].ID_PARAMETRO_DETALLE}">${tipo_moneda[i].DESCRIPCIONDETALLE}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-4">
								<label>Monto (*)</label>
								<input name="monto" autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Ingrese el monto">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-4">
								<label>Fecha inicio (*)</label>
								<input name="fechaInicio" maxlength="10" autocomplete="off" type="fecha" class="datepicker form-control" placeholder="Ingrese la fecha">
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
									<th style="width: 45%;">Empresa</th>
									<th style="width: 20%;">Moneda</th>
									<th style="width: 15%;">Monto</th>
									<th style="width: 10%;">Fecha Inicio</th>
									<th style="width: 10%;" class="nosort nosearch">Acciones</th>
								</tr>
							</thead>
							<tbody>`;
							var mestado;
	
							for(let i=0;i<membresia.length;i++){
								if(membresia[i].ES_VIGENTE==1){
									mestado='';
								}else{
									mestado='tachado';
								}
								
					listado+=`<tr id="${membresia[i].ID_MEMBRESIA}">
								<td>
									<div class="estadoTachado empresa muestraMensaje ${mestado}">${membresia[i].RUC+" - "+membresia[i].NOMB_EMPRESA}</div>
								</td>
								<td>
									<div class="estadoTachado moneda ${mestado}">${membresia[i].TIPO_MONEDA }</div>
								</td>
								<td>
									<div class="estadoTachado monto ${mestado}">${parseFloat(membresia[i].MONTO).toFixed(2)}</div>
								</td>
								<td>
									<div class="estadoTachado fecha ${mestado}">${moment(membresia[i].FECHA_INICIO).format('DD/MM/YYYY')}</div>
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
		empresa:$('#'+tabla+' select[name=empresa]'),
		tipoMoneda:$('#'+tabla+' select[name=tipoMoneda]'),
		monto:$('#'+tabla+' input[name=monto]'),
		fechaInicio:$('#'+tabla+' input[name=fechaInicio]'),
		tabla:tabla,
	}
	eventosMembresia(objeto);
}

function eventosMembresia(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		validaVacio(elemento);
		
	});

	$('#'+objeto.tabla+' div').off( 'change');
    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
	});

	$('#'+objeto.tabla+' div').on( 'change','input[type=fecha]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		validaVacio(elemento);
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioMembresia(objeto)
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		limpiaTodo(objeto.tabla);
		$('span#imagenMembresia').html('');
		objeto.color.val('#FFFFFF')
	});

	$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.edita',function(){//edita
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		objeto.id=id;
		objeto.nombreEdit=nombre;
		membresiaEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		membresiaEstado({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		membresiaElimina({id:id,nombre:nombre,tabla:objeto.tabla});
	});
}

async function membresiaEdita(objeto){
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
	objeto.monto.val(resp.MONTO);
	objeto.empresa.val(resp.ID_EMPRESA).trigger('change.select2');
	objeto.tipoMoneda.val(resp.ID_TIPO_MONEDA).trigger('change.select2');
	objeto.fechaInicio.val(moment(resp.FECHA_INICIO).format('DD-MM-YYYY'));
}

function validaFormularioMembresia(objeto){	
	validaVacio(objeto.monto);
	validaVacio(objeto.fechaInicio);
	validaVacioSelect(objeto.tipoMoneda);
	validaVacioSelect(objeto.empresa);
	
	if(objeto.monto.val()=="" || objeto.fechaInicio.val()=="" || objeto.tipoMoneda.val()=="" || objeto.empresa.val()==""){
		return false;
	}else{
		enviaFormularioMembresia(objeto);
	}
}

function enviaFormularioMembresia(objeto){
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
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .empresa").text(resp.info.RUC+" - "+resp.info.EMPRESA);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .moneda").text(resp.info.TIPO_MONEDA);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .monto").text(parseFloat(resp.info.MONTO).toFixed(2));
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .fecha").text(moment(resp.info.FECHA_INICIO).format('DD/MM/YYYY'));
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
					
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						`<div class="estadoTachado empresa muestraMensaje">${resp.info.RUC+" - "+resp.info.EMPRESA}</div>`,
						`<div class="estadoTachado moneda">${resp.info.TIPO_MONEDA}</div>`,
						`<div class="estadoTachado monto">${parseFloat(resp.info.MONTO).toFixed(2)}</div>`,
						`<div class="estadoTachado fecha">${moment(resp.info.FECHA_INICIO).format('DD/MM/YYYY')}</div>`,
						estado()+modifica()+elimina()
					] ).draw( false ).node();
					$( rowNode ).attr('id',resp.info.ID_MEMBRESIA);
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

function membresiaElimina(objeto){
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

function membresiaEstado(objeto){
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

