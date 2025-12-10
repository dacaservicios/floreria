//FUNCIONES
$(document).ready(function() {
	try {
		vistaIngresosegresos();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaIngresosegresos(){
	bloquea();
	let tabla="ingresosegresos";
	const lista= await axios.get('/api/'+tabla+'/listar/0/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});

	const empleado= await axios.get('/api/empleado/listar/0/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});

	const ingresosegresos = await axios.get("/api/parametro/detalle/listar/48/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});

	desbloquea();
	const resp=lista.data.valor.info;
	const resp2=empleado.data.valor.info;
	const resp3=ingresosegresos.data.valor.info;

	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-cash-register"></i> INGRESOS x EGRESOS</div>
						<div class="row pt-3">
							<div class="form-group col-md-6">
								<label>Movimiento (*)</label>
								<select name="movimiento" class="form-control select2 muestraMensaje">
									<option value="">Select...</option>`;
									for(var i=0;i<resp3.length;i++){
										if(resp3[i].ES_VIGENTE==1){
							listado+=`<option value="${resp3[i].ID_PARAMETRO_DETALLE}">${resp3[i].DESCRIPCIONDETALLE}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-6">
								<label>Concepto (*)</label>
								<div id="concepto">
									<select name="concepto" class="form-control select2">
										<option value=""></option>
									</select>
									<div class="vacio oculto">¡Campo obligatorio!</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-6">
								<label>Fecha (*)</label>
								<input name="fecha" autocomplete="off" maxlength="10" type="fecha" class="form-control datepicker" placeholder="Seleccione la Fecha" value="${moment().format('DD-MM-YYYY')}">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-6">
								<label>Monto (*)</label>
								<input name="monto" autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Ingrese el monto">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div> 
						</div>
						<div class="row">
							<div class="form-group col-md-12">
								<label>Colaborador</label>
								<select name="empleado" class="form-control select2">
									<option value="">Select...</option>`;
									for(var i=0;i<resp2.length;i++){
										if(resp2[i].ES_VIGENTE==1){
							listado+=`<option value="${resp2[i].ID_EMPLEADO}">${resp2[i].APELLIDO_PATERNO+" "+resp2[i].APELLIDO_MATERNO+" "+resp2[i].NOMBRE}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-12">
								<label>Descripcion</label>
								<textarea  rows="3" autocomplete="off" class="form-control p-1" maxlength="1000" name="descripcion" placeholder="Ingrese la descripcion"></textarea>
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
									<th style="width: 25%;">Concepto / Movimiento</th>
									<th style="width: 10%;">Fecha</th>
									<th style="width: 20%;">Colaborador</th>
									<th style="width: 5%;">Monto</th>
									<th style="width: 30%;">Descripcion</th>
									<th style="width: 10%;" class="nosort nosearch">Acciones</th>
								</tr>
							</thead>
							<tbody>`;
							let mestado;
							let mov;
							for(let i=0;i<resp.length;i++){
								if(resp[i].ES_VIGENTE==1){
									mestado='';
								}else{
									mestado='tachado';
								}
								if(resp[i].ID_TIPO_MOVIMIENTO==2514){
									mov='primary';
								}else{
									mov='danger';
								}
					listado+=`<tr id="${resp[i].ID_INGRESO_EGRESO}" >
									<td>
										<div class="estadoTachado concepto muestraMensaje ${mestado}">${resp[i].CONCEPTO }</div>
										<div class="movimiento"><span class='estadoTachado ${mestado} badge bg-${mov}'>${resp[i].TIPO_MOVIMIENTO}</span></div>
									</td>
									<td>
										<div class="estadoTachado fecha ${mestado}">${ moment(resp[i].FECHA).format('DD/MM/YYYY') }</div>
									</td>
									<td>
										<div class="estadoTachado empleado ${mestado}">${ (resp[i].EMPLEADO===null)?'':resp[i].EMPLEADO }</div>
									</td>
									<td>
										<div class="estadoTachado monto ${mestado}">${ parseFloat(resp[i].MONTO).toFixed(2) }</div>
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

	$('.datepicker').datepicker({
		language: 'es',
		changeMonth: true,
		changeYear: true,
		todayHighlight: true,
		autoclose: true
	});

	$("#"+tabla+" span#botonGuardar").text('Crear');
	$('#'+tabla+'Tabla').DataTable(valoresTabla);
	let objeto={
		movimiento:$("#"+tabla+" select[name=movimiento]"),
		concepto:$("#"+tabla+" select[name=concepto]"),
		empleado:$("#"+tabla+" select[name=empleado]"),
		fecha:$("#"+tabla+" input[name=fecha]"),
		descripcion:$("#"+tabla+" textarea[name=descripcion]"),
		monto:$("#"+tabla+" input[name=monto]"),
		tabla:tabla,
	}
	eventosIngresosegresos(objeto);
}

function eventosIngresosegresos(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');

    $('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='monto'){
			decimalRegex(elemento);
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'keyup','textarea',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" textarea[name="+name+"]");
		if(name=='descripcion'){
			comentarioRegex(elemento);
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').off( 'change');
    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
		if(name=='movimiento'){
			let id_movimiento=$(this).val();
			buscarConcepto({id_movimiento:id_movimiento, tabla:objeto.tabla});
		}
	});

	$('#'+objeto.tabla+' div').on( 'change','input[type=fecha]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		if(name=='fecha'){
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioIngresosegresos(objeto)
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
		ingresosegresosEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		ingresosegresosEstado({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		ingresosegresosElimina({id:id,nombre:nombre,tabla:objeto.tabla});
	});
}

async function buscarConcepto(objeto){
	bloquea();
	try {
		const lista= await axios.get('/api/concepto/listar/'+objeto.id_movimiento+'/'+verSesion(),{
			headers: 
			{ 
				authorization: `Bearer ${verToken()}`
			} 
		});

		desbloquea();
		const concepto=lista.data.valor.info;
		let select_concepto=`<select name="concepto" class="form-control select2">`;
		for(let a=0;a<concepto.length;a++){
			if(concepto[a].ES_VIGENTE==1){
			select_concepto+=`
				<option value="${concepto[a].ID_CONCEPTO}">${concepto[a].CONCEPTO}</option>
			`;
			}
		}
		select_concepto+=`</select><div class="vacio oculto">¡Campo obligatorio!</div>`;
		$('#'+objeto.tabla+' #concepto').html(select_concepto);

		let elemento=$('#'+objeto.tabla+' select[name=concepto]');
		validaVacioSelect(elemento);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function ingresosegresosEdita(objeto){
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
	objeto.movimiento.val(resp.ID_MOVIMIENTO).trigger('change.select2');
	buscarConcepto({id_movimiento:resp.ID_MOVIMIENTO, tabla:objeto.tabla});
	objeto.concepto.val(resp.ID_CONCEPTO).trigger('change.select2');
	objeto.empleado.val(resp.ID_EMPLEADO).trigger('change.select2');
	objeto.fecha.val(moment(resp.FECHA).format('DD-MM-YYYY'));
	objeto.descripcion.val(resp.DESCRIPCION);
	objeto.monto.val(resp.MONTO);
}

function validaFormularioIngresosegresos(objeto){
	let concepto=$("#"+objeto.tabla+" select[name=concepto]");
	validaVacioSelect(concepto);
	validaVacioSelect(objeto.movimiento);
	validaVacio(objeto.monto);
	validaVacio(objeto.fecha);

	if(objeto.movimiento.val()=="" || objeto.monto.val()=="" || concepto.val()=="" || objeto.fecha.val()==""){
		return false;
	}else{
		enviaFormularioIngresosegresos(objeto);
	}
}

function enviaFormularioIngresosegresos(objeto){
	let dato=(objeto.id==0)?muestraMensaje({tabla:objeto.tabla}):objeto.nombreMsg;
	let verbo=(objeto.id==0)?'Creará':'Modificará';

	var fd = new FormData(document.getElementById(objeto.tabla));
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

				let mov=(resp.info.ID_TIPO_MOVIMIENTO==2514)?'primary':'danger';
	
				if(objeto.id>0){
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .concepto").html(resp.info.CONCEPTO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .movimiento").html(`<span class='estadoTachado badge bg-${mov}'>${resp.info.TIPO_MOVIMIENTO}</span>`);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .empleado").text((resp.info.EMPLEADO===null)?'':resp.info.EMPLEADO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .monto").text(parseFloat(resp.info.MONTO).toFixed(2));
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .descripcion").text((resp.info.DESCRIPCION===null)?'':resp.info.DESCRIPCION);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .fecha").text(moment(resp.info.FECHA).format('DD/MM/YYYY'));
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
					
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						`<div class="estadoTachado concepto muestraMensaje">${resp.info.CONCEPTO }</div>
						<div class="movimiento"><span class='estadoTachado badge bg-${mov}'>${resp.info.TIPO_MOVIMIENTO}</span></div>`,
						`<div class="estadoTachado fecha">${moment(resp.info.FECHA).format('DD/MM/YYYY')}</div>`,
						`<div class="estadoTachado empleado">${(resp.info.EMPLEADO===null)?'':resp.info.EMPLEADO}</div>`,
						`<div class="estadoTachado monto">${parseFloat(resp.info.MONTO).toFixed(2)}</div>`,
						`<div class="estadoTachado descripcion">${(resp.info.DESCRIPCION===null)?'':resp.info.DESCRIPCION}</div>`,
						estado()+modifica()+elimina()
					] ).draw( false ).node();
					$( rowNode ).attr('id',resp.info.ID_INGRESO_EGRESO);
					
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

function ingresosegresosElimina(objeto){
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

function ingresosegresosEstado(objeto){
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