//FUNCIONES
$(document).ready(function() {
	try {
		vistaReporteservicio();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaReporteservicio(){
	bloquea();
	let tabla="reporteservicio";
	const lista =  await axios.get("/api/cliente/listar/0/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	const lista2=  await axios.get("/api/empleado/listar/0/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	const lista3 =  await axios.get("/api/reporte/filtroInicio/servicio/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	
	desbloquea();
	const resp=lista.data.valor.info;
	const resp2=lista2.data.valor.info;
	const resp3=lista3.data.valor.info;

	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-shopping-cart"></i> REPORTE SERVICIO</div>
						<div class="row pt-3">
							<div class="form-group col-md-3">
								<label>Cliente</label>
								<select name="dato1" class="form-control select2">
									<option value="">Select...</option>`;
									for(var i=0;i<resp.length;i++){
										if(resp[i].ES_VIGENTE==1){
									listado+=`<option value="${resp[i].ID_CLIENTE}">${resp[i].APELLIDO_PATERNO+" "+resp[i].APELLIDO_MATERNO+" "+resp[i].NOMBRE}</option>`;
										}
									}
						listado+=`</select>
							</div>
							<div class="form-group col-md-3">
								<label>Colaborador</label>
								<select name="dato2" class="form-control select2">
									<option value="">Select...</option>`;
									for(var i=0;i<resp2.length;i++){
										if(resp2[i].ES_VIGENTE==1){
									listado+=`<option value="${resp2[i].ID_EMPLEADO}">${resp2[i].APELLIDO_PATERNO+" "+resp2[i].APELLIDO_MATERNO+" "+resp2[i].NOMBRE}</option>`;
										}
									}
									   
						listado+=`</select>
							</div>
							<div class="form-group col-md-3">
								<label>Fecha inicio (*)</label>
								<input name="fechaInicio" autocomplete="off" maxlength="10" type="fecha" class="form-control fecha1" placeholder="Seleccione la Fecha Inicio" value="${moment().format('DD-MM-YYYY')}">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-3">
								<label>Fecha fin (*)</label>
								<input name="fechaFin" autocomplete="off" maxlength="10" type="fecha" class="form-control fecha2" placeholder="Seleccione la Fecha Fin" value="${ moment().format('DD-MM-YYYY')}">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="pt-3 col-md-12 pl-0 pr-0 text-center">
							${descarga()+limpia()+buscar()}
						</div>
						<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
					</form>
					<hr class="border border-primary">
					<div class="table-responsive" id="filtroReporteservicio">
						<table id="${tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
						<thead class="color3">
							<tr>
								<th style="width: 5%;">#</th>
								<th style="width: 20%;">Servicio</th>
								<th style="width: 10%;">Fecha</th>
								<th style="width: 20%;">Cliente</th>
								<th style="width: 20%;">Colaborador</th>
								<th style="width: 10%;">Precio</th>
								<th style="width: 10%;">Tipo pago</th>
								<th style="width: 5%;">Gratis</th>
							</tr>
						</thead>
							<tbody>`;
							for(var i=0;i<resp3.length;i++){
							listado+=`<tr>
										<td>
											${ (i+1) }
										</td>
										<td>
											${ resp3[i].NOMBRE_SERVICIO }
										</td>
										<td>
											${ moment(resp3[i].FECHA_ATENCION).format('DD/MM/YYYY') }
										</td>
										<td>
											${ resp3[i].CLIENTE }
										</td>
										<td>
											${ resp3[i].EMPLEADO }
										</td>
										<td>
											${ parseFloat(resp3[i].PRECIO).toFixed(2) }
										</td>
										<td>
											${ (resp3[i].TIPO_PAGO===null)?'':resp3[i].TIPO_PAGO }
										</td>
										<td>
											${ resp3[i].ES_GRATIS}
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
		width: '100%',
		allowClear: true
	});

	$('.fecha1, .fecha2').datepicker({
		language: 'es',
		changeMonth: true,
		changeYear: true,
		todayHighlight: true,
		autoclose: true
	});

	$('.fecha1').datepicker({
        startDate: '+5d',
        endDate: '+35d',
    }).on('changeDate',
	function (selected) {
		$('.fecha2').datepicker('setStartDate', moment(selected.date).format('DD-MM-YYYY'));
	});
    
    $('.fecha2').datepicker({
        startDate: '+6d',
        endDate: '+36d',
    }).on('changeDate',
	function (selected) {
		$('.fecha1').datepicker('setEndDate', moment(selected.date).format('DD-MM-YYYY'));
	});

	$('#'+tabla+'Tabla').DataTable(valoresTabla);
	let objeto={
		cliente:$('#'+tabla+' select[name=dato1]'),
		barbero:$('#'+tabla+' select[name=dato2]'),
		fechaInicio:$('#'+tabla+' input[name=fechaInicio]'),
		fechaFin:$('#'+tabla+' input[name=fechaFin]'),
		tabla:tabla,
	}
	eventosReporteservicio(objeto);
}

function eventosReporteservicio(objeto){
	$('#'+objeto.tabla+' div').off( 'change');
    /*$('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
	});*/

	$('#'+objeto.tabla+' div').on( 'change','input[type=fecha]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='fechaInicio' || name=='fechaFin'){
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').off( 'click');
	$('#'+objeto.tabla+' div').on( 'click','button[name=btnBuscar]',function(){//buscar
		objeto.tipo= 'busca';
		validaFiltroReporteservicio(objeto);
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		objeto.tipo= 'limpia';
		limpiaTodo(objeto.tabla);
		busquedaFiltroReporteservicio(objeto);
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnDescarga]',function(){//descarga
		reporteServicio(objeto);
	});
}

async function reporteServicio(objeto){
	bloquea();
	try {
		let body={
			dato1:objeto.cliente.val(),
			dato2:objeto.barbero.val(),
			fechaInicio:objeto.fechaInicio.val(),
			fechaFin:objeto.fechaFin.val(),
			tipo:'servicio',
			sesId:verSesion(),
			token:verToken()
		}
		await axios.post("/reporte/servicio",body,{ 
			headers:{authorization: `Bearer ${verToken()}`} 
		});

		desbloquea();

		let url='/reporte/descarga/servicio';
		let a = document.createElement('a');
		a.href = url;
		a.download = 'Reporte Servicio';
		a.click();
		window.URL.revokeObjectURL(url);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
};

function validaFiltroReporteservicio(objeto){	
	validaVacio(objeto.fechaInicio);
	validaVacio(objeto.fechaFin);
	/*validaVacioSelect(objeto.cliente);
	validaVacioSelect(objeto.barbero);*/

	if(objeto.fechaInicio.val()=="" || objeto.fechaFin.val()=="" /*|| objeto.cliente.val()=="" || objeto.barbero.val()==""*/){
		return false;
	}else{
		busquedaFiltroReporteservicio(objeto);
	}
}

async function busquedaFiltroReporteservicio(objeto){
	bloquea()
	try{
		let reporteservicio;
		if(objeto.tipo=='busca'){
			let body={
				dato1:objeto.cliente.val(),
				dato2:objeto.barbero.val(),
				fechaInicio:objeto.fechaInicio.val(),
				fechaFin:objeto.fechaFin.val(),
				tipo:'servicio',
				sesId:verSesion()
			}
			let lista =  await axios.post('/api/reporte/filtro',body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			reporteservicio=lista.data.valor.info;
		}else{
			reporteservicio=[];
		}

		desbloquea();
let msg=`
		<table id="${objeto.tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
			<thead class="color3">
				<th style="width: 5%;">#</th>
				<th style="width: 20%;">Servicio</th>
				<th style="width: 10%;">Fecha</th>
				<th style="width: 20%;">Cliente</th>
				<th style="width: 20%;">Colaborador</th>
				<th style="width: 10%;">Precio</th>
				<th style="width: 10%;">Tipo pago</th>
				<th style="width: 5%;">Gratis</th>
			</thead>
			<tbody>`;
				for(var i=0;i<reporteservicio.length;i++){
			msg+=`<tr">
						<td>
							${ (i+1) }
						</td>
						<td>
							${ reporteservicio[i].NOMBRE_SERVICIO }
						</td>
						<td>
							${ moment(reporteservicio[i].FECHA_ATENCION).format('DD/MM/YYYY') }
						</td>
						<td>
							${ reporteservicio[i].CLIENTE }
						</td>
						<td>
							${ reporteservicio[i].EMPLEADO }
						</td>
						<td>
							${ parseFloat(reporteservicio[i].PRECIO).toFixed(2) }
						</td>
						<td>
							${ (reporteservicio[i].TIPO_PAGO===null)?'':reporteservicio[i].TIPO_PAGO }
						</td>
						<td>
							${ reporteservicio[i].ES_GRATIS}
						</td>
					</tr>`;
				}
	msg+=`</tbody>
		</table>`;
		$('#filtroReporteservicio').html(msg);
		$('#'+objeto.tabla+'Tabla').DataTable(valoresTabla);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}
