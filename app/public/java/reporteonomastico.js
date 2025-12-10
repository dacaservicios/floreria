//FUNCIONES
$(document).ready(function() {
	try {
		vistaReporteonomastico();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaReporteonomastico(){
	bloquea();
	let tabla="reporteonomastico";
	const lista2 =  await axios.get("/api/reporte/filtroInicio/onomastico/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	
	desbloquea();
	const resp2=lista2.data.valor.info;

	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-users"></i> REPORTE CLIENTE ONOMÁSTICO</div>
						<div class="pt-3 col-md-12 pl-0 pr-0 text-center">
							${descarga()}
						</div>
					</form>
					<hr class="border border-primary">
					<div class="table-responsive" id="filtroReporteonomastico">
						<table id="${tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
						<thead class="color3">
							<tr>
								<th style="width: 5%;">#</th>
								<th style="width: 45%;">Cliente</th>
								<th style="width: 20%;">Onomástico</th>
								<th style="width: 30%;">Días</th>
							</tr>
						</thead>
						<tbody>`;
						let n=1;
						for(var i=0;i<resp2.length;i++){
							if(resp2[i].DIAS>=0 && resp2[i].DIAS!==null && resp2[i].ES_VIGENTE==1){

				listado+=`<tr>
								<td>
									${ n }
								</td>
								<td>
									${ resp2[i].CLIENTE }
								</td>
								<td>
									${ moment(resp2[i].FECHA_NACIMIENTO).format('DD/MM') }
								</td>
								<td>
									${(resp2[i].DIAS==0)?'<span class="badge bg-success">Hoy es su cumpleaños</span>':'<span class="badge bg-primary">falta '+resp2[i].DIAS+((resp2[i].DIAS==1)?' día</span>':' días</span>')}
								</td>
							</tr>`;
							n++;
							}
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
		cliente:$('#'+tabla+' select[name=cliente]'),
		tabla:tabla,
	}
	eventosReporteonomastico(objeto);
}

function eventosReporteonomastico(objeto){
	$('#'+objeto.tabla+' div').off( 'click');
	$('#'+objeto.tabla+' div').on( 'click','button[name=btnDescarga]',function(){//guarda
		reporteOnomastico();
	});
}

async function reporteOnomastico(){
	bloquea();
	try {
		let body={
			token:verToken()
		}
		await axios.post("/reporte/onomastico",body,{ 
			headers:{authorization: `Bearer ${verToken()}`} 
		});

		desbloquea();

		let url='/reporte/descarga/onomastico';
		let a = document.createElement('a');
		a.href = url;
		a.download = 'Reporte Onomastico';
		a.click();
		window.URL.revokeObjectURL(url);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
};