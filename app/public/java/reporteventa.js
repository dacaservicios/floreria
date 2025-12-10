//FUNCIONES
$(document).ready(function() {
	try {
		vistaReporteventa();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaReporteventa(){
	bloquea();
	let tabla="reporteventa";
	const lista= await axios.get('/api/productosucursal/listar/0/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});
	
	const lista2=  await axios.get("/api/cliente/listar/0/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});

	const lista3 =  await axios.get("/api/reporte/filtroInicio/venta/"+verSesion(),{ 
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
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-coins"></i> REPORTE VENTAS</div>
						<div class="row pt-3">
							<div class="form-group col-md-3">
								<label>Producto</label>
								<select name="dato1" class="form-control select2">
									<option value="">Select...</option>`;
									for(var i=0;i<resp.length;i++){
										if(resp[i].ES_VIGENTE==1){
									listado+=`<option value="${resp[i].ID_PRODUCTO_SUCURSAL}">${resp2[i].CODIGO_PRODUCTO+" - "+resp[i].NOMBRE}</option>`;
										}
									}
						listado+=`</select>
							</div>
							<div class="form-group col-md-3">
								<label>Cliente</label>
								<select name="dato2" class="form-control select2">
									<option value="">Select...</option>`;
									for(var i=0;i<resp2.length;i++){
										if(resp2[i].ES_VIGENTE==1){
									listado+=`<option value="${resp2[i].ID_CLIENTE}">${resp2[i].APELLIDO_PATERNO+" "+resp2[i].APELLIDO_MATERNO+" "+resp2[i].NOMBRE}</option>`;
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
					<div class="table-responsive" id="filtroReporteventa">
						<table id="${tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
						<thead class="color3">
							<tr>
								<th style="width: 5%;">#</th>
								<th style="width: 10%;">Codigo</th>
								<th style="width: 20%;">Producto</th>
								<th style="width: 10%;">F.Venta</th>
								<th style="width: 5%;">Cantidad</th>
								<th style="width: 5%;">P.Venta</th>
								<th style="width: 5%;">Total</th>
								<th style="width: 10%;">Serie</th>
								<th style="width: 10%;">Documento</th>
								<th style="width: 20%;">Cliente</th>
							</tr>
						</thead>
							<tbody>`;
							for(var i=0;i<resp3.length;i++){
							listado+=`<tr>
										<td>
											${ (i+1) }
										</td>
										<td>
											${ resp3[i].CODIGO_PRODUCTO }
										</td>
										<td>
											${ resp3[i].NOMBRE }
										</td>
										<td>
											${ moment(resp3[i].FECHA_VENTA).format('DD/MM/YYYY') }
										</td>
										
										<td>
											${ resp3[i].CANTIDAD }
										</td>
										<td>
											${ parseFloat(resp3[i].PRECIO_VENTA).toFixed(2) }
										</td>
										<td>
											${ parseFloat(resp3[i].MONTO_TOTAL).toFixed(2)}
										</td>
										<td>
											${ resp3[i].SERIE_DOCUMENTO}
										</td>
										<td>
											${ resp3[i].NRO_DOCUMENTO}
										</td>
										<td>
											${ resp3[i].CLIENTE}
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
		producto:$('#'+tabla+' select[name=dato1]'),
		cliente:$('#'+tabla+' select[name=dato2]'),
		fechaInicio:$('#'+tabla+' input[name=fechaInicio]'),
		fechaFin:$('#'+tabla+' input[name=fechaFin]'),
		tabla:tabla,
	}
	eventosReporteventa(objeto);
}

function eventosReporteventa(objeto){
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
		validaFiltroReporteventa(objeto);
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		objeto.tipo= 'limpia';
		limpiaTodo(objeto.tabla);
		busquedaFiltroReporteventa(objeto);
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnDescarga]',function(){//guarda
		reporteventa(objeto);
	});
}

async function reporteventa(objeto){
	bloquea();
	try {
		let body={
			dato1:objeto.producto.val(),
			dato2:objeto.cliente.val(),
			fechaInicio:objeto.fechaInicio.val(),
			fechaFin:objeto.fechaFin.val(),
			tipo:'venta',
			sesId:verSesion(),
			token:verToken()
		}
		await axios.post("/reporte/venta",body,{ 
			headers:{authorization: `Bearer ${verToken()}`} 
		});

		desbloquea();

		let url='/reporte/descarga/venta';
		let a = document.createElement('a');
		a.href = url;
		a.download = 'Reporte Venta';
		a.click();
		window.URL.revokeObjectURL(url);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
};

function validaFiltroReporteventa(objeto){	
	validaVacio(objeto.fechaInicio);
	validaVacio(objeto.fechaFin);
	/*validaVacioSelect(objeto.cliente);
	validaVacioSelect(objeto.barbero);*/

	if(objeto.fechaInicio.val()=="" || objeto.fechaFin.val()=="" /*|| objeto.cliente.val()=="" || objeto.barbero.val()==""*/){
		return false;
	}else{
		busquedaFiltroReporteventa(objeto);
	}
}

async function busquedaFiltroReporteventa(objeto){
	bloquea()
	try{
		let reporteventa;
		if(objeto.tipo=='busca'){
			let body={
				dato1:objeto.producto.val(),
				dato2:objeto.cliente.val(),
				fechaInicio:objeto.fechaInicio.val(),
				fechaFin:objeto.fechaFin.val(),
				tipo:'venta',
				sesId:verSesion()
			}
			let lista =  await axios.post('/api/reporte/filtro',body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			reporteventa=lista.data.valor.info;
		}else{
			reporteventa=[];
		}

		desbloquea();
let msg=`
		<table id="${objeto.tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
			<thead class="color3">
				<th style="width: 5%;">#</th>
				<th style="width: 10%;">Codigo</th>
				<th style="width: 20%;">Producto</th>
				<th style="width: 10%;">F.Venta</th>
				<th style="width: 5%;">Cantidad</th>
				<th style="width: 5%;">P.Venta</th>
				<th style="width: 5%;">Total</th>
				<th style="width: 10%;">Serie</th>
				<th style="width: 10%;">Documento</th>
				<th style="width: 20%;">Cliente</th>
			</thead>
			<tbody>`;
				for(var i=0;i<reporteventa.length;i++){
			msg+=`<tr">
						<td>
							${ (i+1) }
						</td>
						<td>
							${ reporteventa[i].CODIGO_PRODUCTO }
						</td>
						<td>
							${ reporteventa[i].NOMBRE }
						</td>
						<td>
							${ moment(reporteventa[i].FECHA_VENTA).format('DD/MM/YYYY') }
						</td>
						
						<td>
							${ reporteventa[i].CANTIDAD }
						</td>
						<td>
							${ parseFloat(reporteventa[i].PRECIO_VENTA).toFixed(2) }
						</td>
						<td>
							${ parseFloat(reporteventa[i].MONTO_TOTAL).toFixed(2)}
						</td>
						<td>
							${ reporteventa[i].SERIE_DOCUMENTO}
						</td>
						<td>
							${ reporteventa[i].NRO_DOCUMENTO}
						</td>
						<td>
							${ reporteventa[i].CLIENTE}
						</td>
					</tr>`;
				}
	msg+=`</tbody>
		</table>`;
		$('#filtroReporteventa').html(msg);
		$('#'+objeto.tabla+'Tabla').DataTable(valoresTabla);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}
