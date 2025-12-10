//FUNCIONES
$(document).ready(function() {
	try {
		vistaReporteingresoegreso();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaReporteingresoegreso(){
	bloquea();
	let tabla="reporteingresoegreso";

	const lista3 =  await axios.get("/api/reporte/filtroInicio/ingresoegreso/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	
	desbloquea();
	const resp3=lista3.data.valor.info;

	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-coins"></i> REPORTE INGRESO Y EGRESO</div>
						<div class="row pt-3">
							<div class="form-group col-md-6">
								<label>Fecha inicio (*)</label>
								<input name="fechaInicio" autocomplete="off" maxlength="10" type="fecha" class="form-control fecha1" placeholder="Seleccione la Fecha Inicio" value="${moment().format('DD-MM-YYYY')}">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-6">
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
					<div class="table-responsive" id="filtroReporteingresoegreso">
						<table id="${tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
						<thead class="color3">
							<tr>
								<th style="width: 5%;">#</th>
								<th style="width: 10%;">Movimiento</th>
								<th style="width: 10%;">Concepto</th>
								<th style="width: 10%;">Fecha</th>
								<th style="width: 10%;">Monto</th>
								<th style="width: 25%;">Colaborador</th>
								<th style="width: 30%;">Descripcion</th>
							</tr>
						</thead>
							<tbody>`;
							for(var i=0;i<resp3.length;i++){
							listado+=`<tr>
										<td>
											${ (i+1) }
										</td>
										<td>
											${ resp3[i].TIPO_MOVIMIENTO }
										</td>
										<td>
											${ resp3[i].CONCEPTO }
										</td>
										<td>
											${ moment(resp3[i].FECHA).format('DD/MM/YYYY') }
										</td>
										<td>
											${ parseFloat(resp3[i].MONTO).toFixed(2) }
										</td>
										<td>
											${ (resp3[i].ID_EMPLEADO===null)?'':resp3[i].EMPLEADO}
										</td>
										<td>
											${ (resp3[i].DESCRIPCION===null)?'':resp3[i].DESCRIPCION}
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
		fechaInicio:$('#'+tabla+' input[name=fechaInicio]'),
		fechaFin:$('#'+tabla+' input[name=fechaFin]'),
		tabla:tabla,
	}
	eventosReporteventa(objeto);
}

function eventosReporteventa(objeto){
	$('#'+objeto.tabla+' div').off( 'change');
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
		validaFiltroReporteingresoegreso(objeto);
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		objeto.tipo= 'limpia';
		limpiaTodo(objeto.tabla);
		busquedaFiltroReporteingresoegreso(objeto);
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnDescarga]',function(){//descarga
		reporteingresoegreso(objeto);
	});
}

async function reporteingresoegreso(objeto){
	bloquea();
	try {
		let body={
			dato1:'',
			dato2:'',
			fechaInicio:objeto.fechaInicio.val(),
			fechaFin:objeto.fechaFin.val(),
			tipo:'ingresoegreso',
			sesId:verSesion(),
			token:verToken()
		}
		await axios.post("/reporte/ingresoegreso",body,{ 
			headers:{authorization: `Bearer ${verToken()}`} 
		});

		desbloquea();

		let url='/reporte/descarga/ingresoegreso';
		let a = document.createElement('a');
		a.href = url;
		a.download = 'Reporte Ingreo y Egreso';
		a.click();
		window.URL.revokeObjectURL(url);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
};

function validaFiltroReporteingresoegreso(objeto){	
	validaVacio(objeto.fechaInicio);
	validaVacio(objeto.fechaFin);

	if(objeto.fechaInicio.val()=="" || objeto.fechaFin.val()==""){
		return false;
	}else{
		busquedaFiltroReporteingresoegreso(objeto);
	}
}

async function busquedaFiltroReporteingresoegreso(objeto){
	bloquea()
	try{
		let resp3;
		if(objeto.tipo=='busca'){
			let body={
				dato1:'',
				dato2:'',
				fechaInicio:objeto.fechaInicio.val(),
				fechaFin:objeto.fechaFin.val(),
				tipo:'ingresoegreso',
				sesId:verSesion()
			}
			let lista =  await axios.post('/api/reporte/filtro',body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			resp3=lista.data.valor.info;
		}else{
			resp3=[];
		}

		desbloquea();
let msg=`
		<table id="${objeto.tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
			<thead class="color3">
				<th style="width: 5%;">#</th>
				<th style="width: 10%;">Movimiento</th>
				<th style="width: 10%;">Concepto</th>
				<th style="width: 10%;">Fecha</th>
				<th style="width: 10%;">Monto</th>
				<th style="width: 25%;">Colaborador</th>
				<th style="width: 30%;">Descripcion</th>
			</thead>
			<tbody>`;
				for(var i=0;i<resp3.length;i++){
			msg+=`<tr">
						<td>
							${ (i+1) }
						</td>
						<td>
							${ resp3[i].TIPO_MOVIMIENTO }
						</td>
						<td>
							${ resp3[i].CONCEPTO }
						</td>
						<td>
							${ moment(resp3[i].FECHA).format('DD/MM/YYYY') }
						</td>
						<td>
							${ parseFloat(resp3[i].MONTO).toFixed(2) }
						</td>
						<td>
							${ (resp3[i].ID_EMPLEADO===null)?'':resp3[i].EMPLEADO}
						</td>
						<td>
							${ (resp3[i].DESCRIPCION===null)?'':resp3[i].DESCRIPCION}
						</td>
					</tr>`;
				}
	msg+=`</tbody>
		</table>`;
		$('#filtroReporteingresoegreso').html(msg);
		$('#'+objeto.tabla+'Tabla').DataTable(valoresTabla);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}
