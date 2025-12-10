//FUNCIONES
$(document).ready(function() {
	try {
		vistaReporteflujocaja();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaReporteflujocaja(){
	bloquea();
	let tabla="reporteflujocaja";

	const lista1 =  await axios.get("/api/reporte/filtroInicio/flujoServicio/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	const lista2 =  await axios.get("/api/reporte/filtroInicio/flujoProducto/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	const lista3 =  await axios.get("/api/reporte/filtroInicio/flujoIngreso/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	const lista4 =  await axios.get("/api/reporte/filtroInicio/flujoCompra/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	const lista5 =  await axios.get("/api/reporte/filtroInicio/flujoEgreso/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	
	desbloquea();
	const servicio=lista1.data.valor.info;
	const producto=lista2.data.valor.info;
	const ingreso=lista3.data.valor.info;
	const compra=lista4.data.valor.info;
	const egreso=lista5.data.valor.info;

	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-coins"></i> REPORTE FLUJO DE CAJA</div>
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
					<div class="table-responsive" id="filtroReporteflujocaja">
						<table id="${tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
						<thead class="color3">
							<tr>
								<th style="width: 20%;">Flujo</th>
								<th style="width: 10%;">Subtotal</th>
								<th style="width: 10%;">Igv</th>
								<th style="width: 10%;">Total</th>
							</tr>
						</thead>`;
						let subtotalIngreso=parseFloat(servicio[0].SUBTOTAL+producto[0].SUBTOTAL+ingreso[0].SUBTOTAL).toFixed(2);
						let igvIngreso=parseFloat(servicio[0].IGV+producto[0].IGV+ingreso[0].IGV).toFixed(2);
						let totalIngreso=parseFloat(servicio[0].TOTAL+producto[0].TOTAL+ingreso[0].TOTAL).toFixed(2);

						let subtotalEgreso=parseFloat(compra[0].SUBTOTAL+egreso[0].SUBTOTAL).toFixed(2);
						let igvEgreso=parseFloat(compra[0].IGV+egreso[0].IGV).toFixed(2);
						let totalEgreso=parseFloat(compra[0].TOTAL+egreso[0].TOTAL).toFixed(2);

						let subtotal=parseFloat(subtotalIngreso-subtotalEgreso).toFixed(2);
						let igv=parseFloat(igvIngreso-igvEgreso).toFixed(2);
						let total=parseFloat(totalIngreso-totalEgreso).toFixed(2);

					listado+=`<tbody>
								<tr>
									<td>Servicios</td>
									<td>${parseFloat(servicio[0].SUBTOTAL).toFixed(2)}</td>
									<td>${parseFloat(servicio[0].IGV).toFixed(2)}</td>
									<td>${parseFloat(servicio[0].TOTAL).toFixed(2)}</td>
								</tr>
								<tr>
									<td>Productos</td>
									<td>${parseFloat(producto[0].SUBTOTAL).toFixed(2)}</td>
									<td>${parseFloat(producto[0].IGV).toFixed(2)}</td>
									<td>${parseFloat(producto[0].TOTAL).toFixed(2)}</td>
								</tr>
								<tr>
									<td>Ingresos exonerados de IGV</td>
									<td>${parseFloat(ingreso[0].SUBTOTAL).toFixed(2)}</td>
									<td>${parseFloat(ingreso[0].IGV).toFixed(2)}</td>
									<td>${parseFloat(ingreso[0].TOTAL).toFixed(2)}</td>
								</tr>
								<tr>
									<td><strong>(+) Ingresos</strong></td>
									<td><strong>${subtotalIngreso}</strong></td>
									<td><strong>${igvIngreso}</strong></td>
									<td><strong>${totalIngreso}</strong></td>
								</tr>
								<tr>
									<td>Compras</td>
									<td>${parseFloat(compra[0].SUBTOTAL).toFixed(2)}</td>
									<td>${parseFloat(compra[0].IGV).toFixed(2)}</td>
									<td>${parseFloat(compra[0].TOTAL).toFixed(2)}</td>
								</tr>
								<tr>
									<td>Egresos exonerados de IGV</td>
									<td>${parseFloat(egreso[0].SUBTOTAL).toFixed(2)}</td>
									<td>${parseFloat(egreso[0].IGV).toFixed(2)}</td>
									<td>${parseFloat(egreso[0].TOTAL).toFixed(2)}</td>
								</tr>
								<tr>
									<td><strong>(-) Egresos</strong></td>
									<td><strong>${subtotalEgreso}</strong></td>
									<td><strong>${igvEgreso}</strong></td>
									<td><strong>${totalEgreso}</strong></td>
								</tr>
								<tr>
									<td><strong>Saldo Final Acumulado</strong></td>
									<td><strong>${subtotal}</strong></td>
									<td><strong>${igv}</strong></td>
									<td><strong>${total}</strong></td>
								</tr>
							</tbody>
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
	eventosReporteflujocaja(objeto);
}

function eventosReporteflujocaja(objeto){
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
		validaFiltroReporteflujocaja(objeto);
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		objeto.tipo= 'limpia';
		limpiaTodo(objeto.tabla);
		busquedaFiltroReporteflujocaja(objeto);
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnDescarga]',function(){//descarga
		validaReporteflujocaja(objeto);
	});
}

async function reporteflujocaja(objeto){
	bloquea();
	try {
		let body={
			dato1:'',
			dato2:'',
			fechaInicio:objeto.fechaInicio.val(),
			fechaFin:objeto.fechaFin.val(),
			sesId:verSesion(),
			sucursalId:verSucursal(),
			token:verToken()
		}
		const verifica = await axios.post("/"+objeto.tabla+"/flujocaja/",body,{
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		
		desbloquea();
		if(verifica.data.resultado){
			descargaFlujocaja(objeto);
		}else{
			mensajeSistema(resp.mensaje);
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function descargaFlujocaja(objeto){
	let url="/"+objeto.tabla+"/descarga/flujocaja/"+verSucursal();
	let a = document.createElement('a');
	a.href = url;
	a.download = 'Reporte flujo de caja';
	a.click();
}

function validaReporteflujocaja(objeto){	
	validaVacio(objeto.fechaInicio);
	validaVacio(objeto.fechaFin);

	if(objeto.fechaInicio.val()=="" || objeto.fechaFin.val()==""){
		return false;
	}else{
		reporteflujocaja(objeto);
	}
}

function validaFiltroReporteflujocaja(objeto){	
	validaVacio(objeto.fechaInicio);
	validaVacio(objeto.fechaFin);

	if(objeto.fechaInicio.val()=="" || objeto.fechaFin.val()==""){
		return false;
	}else{
		busquedaFiltroReporteflujocaja(objeto);
	}
}

async function busquedaFiltroReporteflujocaja(objeto){
	bloquea()
	try{
		let servicio;
		let producto;
		let ingreso;
		let compra;
		let egreso;
		if(objeto.tipo=='busca'){
			let body={
				dato1:'',
				dato2:'',
				fechaInicio:objeto.fechaInicio.val(),
				fechaFin:objeto.fechaFin.val(),
				sesId:verSesion()
			}

			body.tipo='flujoServicio';
			const lista1 =  await axios.post("/api/reporte/filtro",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			body.tipo='flujoProducto';
			const lista2 =  await axios.post("/api/reporte/filtro",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			body.tipo='flujoIngreso';
			const lista3 =  await axios.post("/api/reporte/filtro",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			body.tipo='flujoCompra';
			const lista4 =  await axios.post("/api/reporte/filtro",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			body.tipo='flujoEgreso';
			const lista5 =  await axios.post("/api/reporte/filtro",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			servicio=lista1.data.valor.info;
			producto=lista2.data.valor.info;
			ingreso=lista3.data.valor.info;
			compra=lista4.data.valor.info;
			egreso=lista5.data.valor.info;
		}else{
			servicio=[];
			producto=[];
			ingreso=[];
			compra=[];
			egreso=[];
		}

		desbloquea();
let msg=`
		<table id="${objeto.tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
			<thead class="color3">
				<th style="width: 20%;">Flujo</th>
				<th style="width: 10%;">Subtotal</th>
				<th style="width: 10%;">Igv</th>
				<th style="width: 10%;">Total</th>
			</thead>
			<tbody>`;
			if(servicio.length>0 || producto.length>0 || ingreso.length>0 || compra.length>0 || egreso.length>0){
				let subtotalIngreso=parseFloat(servicio[0].SUBTOTAL+producto[0].SUBTOTAL+ingreso[0].SUBTOTAL).toFixed(2);
				let igvIngreso=parseFloat(servicio[0].IGV+producto[0].IGV+ingreso[0].IGV).toFixed(2);
				let totalIngreso=parseFloat(servicio[0].TOTAL+producto[0].TOTAL+ingreso[0].TOTAL).toFixed(2);

				let subtotalEgreso=parseFloat(compra[0].SUBTOTAL+egreso[0].SUBTOTAL).toFixed(2);
				let igvEgreso=parseFloat(compra[0].IGV+egreso[0].IGV).toFixed(2);
				let totalEgreso=parseFloat(compra[0].TOTAL+egreso[0].TOTAL).toFixed(2);

				let subtotal=parseFloat(subtotalIngreso-subtotalEgreso).toFixed(2);
				let igv=parseFloat(igvIngreso-igvEgreso).toFixed(2);
				let total=parseFloat(totalIngreso-totalEgreso).toFixed(2);
				msg+=`<tr>
						<td>Servicios</td>
						<td>${parseFloat(servicio[0].SUBTOTAL).toFixed(2)}</td>
						<td>${parseFloat(servicio[0].IGV).toFixed(2)}</td>
						<td>${parseFloat(servicio[0].TOTAL).toFixed(2)}</td>
					</tr>
					<tr>
						<td>Productos</td>
						<td>${parseFloat(producto[0].SUBTOTAL).toFixed(2)}</td>
						<td>${parseFloat(producto[0].IGV).toFixed(2)}</td>
						<td>${parseFloat(producto[0].TOTAL).toFixed(2)}</td>
					</tr>
					<tr>
						<td>Ingresos exonerados de IGV</td>
						<td>${parseFloat(ingreso[0].SUBTOTAL).toFixed(2)}</td>
						<td>${parseFloat(ingreso[0].IGV).toFixed(2)}</td>
						<td>${parseFloat(ingreso[0].TOTAL).toFixed(2)}</td>
					</tr>
					<tr>
						<td><strong>(+) Ingresos</strong></td>
						<td><strong>${subtotalIngreso}</strong></td>
						<td><strong>${igvIngreso}</strong></td>
						<td><strong>${totalIngreso}</strong></td>
					</tr>
					<tr>
						<td>Compras</td>
						<td>${parseFloat(compra[0].SUBTOTAL).toFixed(2)}</td>
						<td>${parseFloat(compra[0].IGV).toFixed(2)}</td>
						<td>${parseFloat(compra[0].TOTAL).toFixed(2)}</td>
					</tr>
					<tr>
						<td>Egresos exonerados de IGV</td>
						<td>${parseFloat(egreso[0].SUBTOTAL).toFixed(2)}</td>
						<td>${parseFloat(egreso[0].IGV).toFixed(2)}</td>
						<td>${parseFloat(egreso[0].TOTAL).toFixed(2)}</td>
					</tr>
					<tr>
						<td><strong>(-) Egresos</strong></td>
						<td><strong>${subtotalEgreso}</strong></td>
						<td><strong>${igvEgreso}</strong></td>
						<td><strong>${totalEgreso}</strong></td>
					</tr>
					<tr>
						<td><strong>Saldo Final Acumulado</strong></td>
						<td><strong>${subtotal}</strong></td>
						<td><strong>${igv}</strong></td>
						<td><strong>${total}</strong></td>
					</tr>`;
				}
		msg+=`</tbody>
		</table>`;
		$('#filtroReporteflujocaja').html(msg);
		$('#'+objeto.tabla+'Tabla').DataTable(valoresTabla);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}
