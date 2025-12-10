//FUNCIONES
$(document).ready(function() {
	try {
		vistaKardex();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaKardex(){
	bloquea();
	let tabla="kardex";
	const lista =  await axios.get("/api/productosucursal/listar/0/"+verSesion(),{ 
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
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-file-invoice-dollar"></i> KARDEX</div>
						<div class="row pt-3">
							<div class="form-group col-md-6">
								<label>Producto (*)</label>
								<select name="producto" class="muestraMensaje form-control select2">
									<option value="">Select...</option>`;
									for(var i=0;i<resp.length;i++){
										if(resp[i].ES_VIGENTE==1){
									listado+=`<option value="${resp[i].ID_PRODUCTO_SUCURSAL}">${resp[i].CODIGO_PRODUCTO+" - "+resp[i].NOMBRE}</option>`;
										}
									}
									   
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
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
					<div class="table-responsive" id="filtroKardex">
						<table id="${tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
						<thead class="color3">
							<tr>
								<th rowspan="2">#</th>
								<th rowspan="2">Fecha</th>
								<th rowspan="2">Operación</th>
								<th rowspan="2">Nro doc.</th>
								<th colspan="3" class="text-center">Entrada</th>
								<th colspan="3" class="text-center">Salida</th>
								<th colspan="3" class="text-center">Saldo</th>
							</tr>
							<tr>
								<th>Cant.</th>
								<th>Valor</th>
								<th>Total</th>
								<th>Cant</th>
								<th>Valor</th>
								<th>Total</th>
								<th>Cant</th>
								<th>Valor</th>
								<th>Total</th>
							</tr>
						</thead>
							<tbody>
							
							
							</tbody>
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
		producto:$('#'+tabla+' select[name=producto]'),
		fechaInicio:$('#'+tabla+' input[name=fechaInicio]'),
		fechaFin:$('#'+tabla+' input[name=fechaFin]'),
		tabla:tabla,
	}
	eventosKardex(objeto);
}

function eventosKardex(objeto){
	$('#'+objeto.tabla+' div').off( 'change');
    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
	});

	$('#'+objeto.tabla+' div').on( 'change','input[type=fecha]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='fechaInicio' || name=='fechaFin'){
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnBuscar]',function(){//guarda
		objeto.tipo= 'busca';
		validaFiltroKardex(objeto);
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		objeto.tipo= 'limpia';
		limpiaTodo(objeto.tabla);
		busquedaFiltroKardex(objeto);
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnDescarga]',function(){//descarga
		reporteKardex(objeto);
	});
}


async function reporteKardex(objeto){
	if(objeto.producto.val()==''){
		mensajeSistema('¡Debe indicar el producto!');
	}else{
		bloquea();
		try {
			let body={
				producto:objeto.producto.val(),
				fechaInicio:objeto.fechaInicio.val(),
				fechaFin:objeto.fechaFin.val(),
				tipo:'kardex',
				sesId:verSesion(),
				token:verToken()
			}
			await axios.post("/reporte/kardex",body,{ 
				headers:{authorization: `Bearer ${verToken()}`} 
			});

			desbloquea();

			let url='/reporte/descarga/kardex';
			let a = document.createElement('a');
			a.href = url;
			a.download = 'Reporte Kardex';
			a.click();
			window.URL.revokeObjectURL(url);
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
	}

};


function validaFiltroKardex(objeto){	
	validaVacio(objeto.fechaInicio);
	validaVacio(objeto.fechaFin);
	validaVacioSelect(objeto.producto);

	if(objeto.fechaInicio.val()=="" || objeto.fechaFin.val()=="" || objeto.producto.val()==""){
		return false;
	}else{
		busquedaFiltroKardex(objeto);
	}
}

async function busquedaFiltroKardex(objeto){
	bloquea()
	try{
		let kardex;
		if(objeto.tipo=='busca'){
			let body={
				producto:objeto.producto.val(),
				fechaInicio:objeto.fechaInicio.val(),
				fechaFin:objeto.fechaFin.val(),
				tipo:objeto.tipo,
				sesId:verSesion()
			}
			let lista =  await axios.post('/api/'+objeto.tabla+'/filtro',body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			kardex=lista.data.valor.info;
		}else{
			kardex=[];
		}
		desbloquea();
let msg=`
		<table id="${objeto.tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
			<thead class="color3">
				<tr>
					<th rowspan="2">#</th>
					<th rowspan="2">Fecha</th>
					<th rowspan="2">Operación</th>
					<th rowspan="2">Nro doc.</th>
					<th colspan="3" class="text-center">Entrada</th>
					<th colspan="3" class="text-center">Salida</th>
					<th colspan="3" class="text-center">Saldo</th>
				</tr>
				<tr>
					<th>Cant.</th>
					<th>Valor</th>
					<th>Total</th>
					<th>Cant</th>
					<th>Valor</th>
					<th>Total</th>
					<th>Cant</th>
					<th>Valor</th>
					<th>Total</th>
				</tr>
			</thead>
			<tbody>`;
				for(var i=0;i<kardex.length;i++){
			msg+=`<tr id="${ kardex[i].ID_KARDEX }">
						<td>
							${ (i+1) }
						</td>
						<td>
							${ moment(kardex[i].FECHA_CREA).format('DD/MM/YYYY') }
						</td>
						<td>
							${ kardex[i].OPERACION }
						</td>
						<td>
							${ (kardex[i].DOCUMENTO ===null)?'':kardex[i].DOCUMENTO }
						</td>
						<td>
							${ (kardex[i].CANT_ENTRA ===null)?0:kardex[i].CANT_ENTRA}
						</td>
						<td>
							${ (kardex[i].VUNI_ENTRA===null)?'0.00':parseFloat(kardex[i].VUNI_ENTRA).toFixed(2) }
						</td>
						<td>
							${ (kardex[i].VTOT_ENTRA===null)?'0.00':parseFloat(kardex[i].VTOT_ENTRA).toFixed(2) }
						</td>
						<td>
							${ (kardex[i].CANT_SALE ===null)?0:kardex[i].CANT_SALE }
						</td>
						<td>
							${ (kardex[i].VUNI_SALE===null)?'0.00':parseFloat(kardex[i].VUNI_SALE).toFixed(2) }
						</td>
						<td>
							${ (kardex[i].VTOT_SALE===null)?'0.00':parseFloat(kardex[i].VTOT_SALE).toFixed(2) }
						</td>
						<td>
							${ (kardex[i].CANT_TOTAL===null)?0:kardex[i].CANT_TOTAL}
						</td>
						<td>
							${ (kardex[i].VUNI_TOTAL===null)?'0.00':parseFloat(kardex[i].VUNI_TOTAL).toFixed(2)}
						</td>
						<td>
							${ (kardex[i].VALOR_TOTAL===null)?'0.00':parseFloat(kardex[i].VALOR_TOTAL).toFixed(2) } 
						</td>
					</tr>`;
				}
	msg+=`</tbody>
		</table>`;
		$('#filtroKardex').html(msg);
		$('#'+objeto.tabla+'Tabla').DataTable(valoresTabla);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}
