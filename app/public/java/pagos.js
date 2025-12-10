//FUNCIONES
$(document).ready(function() {
	try {
		vistaPagos();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaPagos(){
	bloquea();
	let tabla="pagos";
	const lista= await axios.get('/api/'+tabla+'/listar/0/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});

	const lista2 = await axios.get("/api/parametro/detalle/listar/47/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});

	const lista3= await axios.get('/api/'+tabla+'/verificar/0/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});

	desbloquea();
	const resp=lista.data.valor.info;
	const resp2=lista2.data.valor.info;
	const verifica=lista3.data.valor.info;
	const valida=lista3.data.valida;
	
	console.log(verifica)

	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<div id="mensajePago">
							<div class="bg-${(verifica.length==0)?'':((valida.color=='')?verifica.COLOR:valida.color)} alert" role="alert">
								${(verifica.length==0)?'':(((valida.mensaje=='')?verifica.MENSAJE:valida.mensaje)+' '+valida.periodo)}
							</div>
						</div>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-credit-card"></i> MEMBRESÍA</div>
						<div id="controles" class="${valida.mostrar}">
							<div class="row pt-3">
								<div class="form-group col-md-4">
									<label>Medio de pago (*)</label>
									<select name="medioPago" class="form-control select2">
										<option value="">Select...</option>`;
										for(var i=0;i<resp2.length;i++){
											if(resp2[i].ES_VIGENTE==1){
										listado+=`<option value="${resp2[i].ID_PARAMETRO_DETALLE}">${resp2[i].DESCRIPCIONDETALLE}</option>`;
											}
										}
							listado+=`</select>
									<div class="vacio oculto">¡Campo obligatorio!</div>
								</div>
								<div class="form-group col-md-8">
									<label>Imagen (Solo se permite formatos: JPG, JPEG o PNG no mayor a 1Mb) (*)</label>
									<input type="file" class="form-control p-1" name="imagen" id="imagen">
									<div class="vacio oculto">¡Campo obligatorio!</div>
								</div>
							</div>
							<div class="pt-3 col-md-12 pl-0 pr-0 text-center">
								${guarda()}
							</div>
							<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
						</div>
					</form>
					<hr class="border border-primary">
					<div class="table-responsive">
						<table id="${tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
							<thead>
								<tr>
									<th style="width: 35%;">Periodo</th>
									<th style="width: 30%;">Descripcion</th>
									<th style="width: 5%;">Medio pago</th>
									<th style="width: 5%;">Monto</th>
									<th style="width: 5%;">F.Pago</th>
									<th style="width: 5%;">Observación</th>
									<th style="width: 5%;">Estado</th>
									<th style="width: 10%;" class="nosort nosearch">Acciones</th>
								</tr>
							</thead>
							<tbody>`;
							var mestado;
							for(let i=0;i<resp.length;i++){
								if(resp[i].ES_VIGENTE==1){
									mestado='';
								}else{
									mestado='tachado';
								}

					listado+=`<tr id="${resp[i].ID_PAGOS}">
									<td>
										<div class="estadoTachado fecha ${mestado}">${moment(resp[i].FECHA_INICIO).format('DD-MM-YYYY')+" - "+moment(resp[i].FECHA_FIN).format('DD-MM-YYYY') }</div>
										<div class="oculto imagen">${resp[i].IMAGEN}</div>
									</td>
									<td>
										<div class="estadoTachado descripcion muestraMensaje ${mestado}">${resp[i].DESCRIPCION }</div>
									</td>
									<td>
										<div class="estadoTachado medioPago ${mestado}">${resp[i].MEDIO_PAGO }</div>
									</td>
									<td>
										<div class="estadoTachado monto ${mestado}">${parseFloat(resp[i].MONTO).toFixed(2)}</div>
									</td>
									<td>
										<div class="estadoTachado fechaPago ${mestado}">${moment(resp[i].FECHA_CREA).format('DD-MM-YYYY')}</div>
									</td>
									<td>
										<div class="estadoTachado observacion ${mestado}">${(resp[i].OBSERVACION===null)?'':resp[i].OBSERVACION }</div>
									</td>
									<td>
										<div class="estadoTachado estado ${mestado}"><span class="badge bg-${resp[i].COLOR}">${resp[i].ESTADO_PAGO}</span></div>
									</td>
									<td>
										${ver()+((verNivel()==1)?modifica():'')}
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
	$("#"+tabla+" span#botonGuardar").text('Enviar');
	$(".select2").select2({
		placeholder:'Select...',
		dropdownAutoWidth: true,
		width: '100%'
	});

	$('#'+tabla+'Tabla').DataTable(valoresTabla);
	let objeto={
		medioPago:$('#'+tabla+' select[name=medioPago]'),
		imagen:$('#'+tabla+' input[name=imagen]'),
		estado:(verifica.ID_ESTADO_PAGO===null)?0:verifica.ID_ESTADO_PAGO,
		observacion:'',
		tabla:tabla,
	}
	eventosPagos(objeto);
	
}

function eventosPagos(objeto){
	$('#'+objeto.tabla+' div').off( 'change');
    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
	});

	$('#'+objeto.tabla+' div').on( 'change','input[type=file]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		validaVacio(elemento);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.edita',function(){//editar
		let evento=$(this).parents("tr");
		let id=evento.attr('id');
		muestraEstadosPago({id:id,tabla:objeto.tabla})
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.ver',function(){//ver
		let evento=$(this).parents("tr");
		let id=evento.attr('id');
		let imagen_pago=evento.find("td div.imagen").text();
		let imagen=`<img src="../imagenes/pagos/MB_`+id+`_`+imagen_pago+`">`;
		mostrar_general1({titulo:'IMAGEN',nombre:objeto.nombreEdit,msg:imagen,ancho:300});
		$('#contenidoGeneral1').addClass('text-center');
	});


	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioPagos(objeto);
	});

}

async function muestraEstadosPago(objeto){
	bloquea();
	const busca= await axios.get('/api/'+objeto.tabla+'/buscar/'+objeto.id+'/'+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		}
	});

	const lista = await axios.get("/api/parametro/detalle/listar/45/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	desbloquea();
	const estados=busca.data.valor.info;
	const rpsta=lista.data.valor.info;
	let msg=`
		<div class="card card-primary">
			<div class="card-body">
				<form id="${objeto.tabla}ModalPagos" class="needs-validation" novalidate>
					<span class='oculto muestraIdPadre'>${objeto.id}</span>
					<span class='oculto muestraId'>0</span>
					<span class='oculto muestraNombre'></span>
					<div class="row">
						<div class="form-group col-md-12">
							<label class="etiqueta">ESTADO (*)</label>
							<select name="estado" class="form-control select2">
								<option value="${estados.ID_ESTADO_PAGO}">${estados.ESTADO_PAGO}</option>`;
								for(var i=0;i<rpsta.length;i++){
									if(rpsta[i].ES_VIGENTE==1 && estados.ID_ESTADO_PAGO!=rpsta[i].ID_PARAMETRO_DETALLE){
								msg+=`<option value="${rpsta[i].ID_PARAMETRO_DETALLE}">${rpsta[i].DESCRIPCIONDETALLE}</option>`;
									}
								}
							msg+=`</select>
							<div class="vacio oculto">¡Campo obligatorio!</div>
						</div>
					</div>
					<div class="row">
						<div class="form-group col-md-12">
							<textarea  rows="5" autocomplete="off" class="form-control p-1" maxlength="500" name="observacion" placeholder="">${(estados.OBSERVACION===null)?'':estados.OBSERVACION}</textarea>
						</div>
					</div>
					<div class="pt-3 col-md-12 pl-0 pr-0 text-center">
						${edita()}
					</div>
					<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
				</form>
			</div>
		</div>`;
	mostrar_general1({titulo:'REGISTRA PUEBLE',msg:msg,nombre:'',ancho:600});
	$(".select2").select2({
		placeholder:'Select...',
		dropdownAutoWidth: true,
		width: '100%'
	});

	let elementos={
		estado:$('#'+objeto.tabla+'ModalPagos select[name=estado]'),
		observacion:$('#'+objeto.tabla+'ModalPagos textarea[name=observacion]'),
		medioPago:0,
		imagen:'',
		tabla:objeto.tabla,
		id_pagos:$('#'+objeto.tabla+'ModalPagos span.muestraIdPadre').text(),
	}
	
	eventoModalPagos(objeto,elementos);
}

function eventoModalPagos(objeto,elementos){
	$('#'+objeto.tabla+'ModalPagos').on( 'click','button[name=btnGuarda]',function(){//edita
		objeto.nombreMsg=$('#'+objeto.tabla+'ModalPagos select[name=estado] option:selected').text();
		validaModalPago(objeto, elementos);
	});
}

function validaModalPago(objeto, elementos){
	validaVacioSelect(elementos.estado);
	
	if(elementos.estado.val()==""){
		return false;
	}else{
		enviaFormularioModalPagos(objeto,elementos);
	}
}

function validaFormularioPagos(objeto){	
	validaVacio(objeto.imagen);
	validaVacioSelect(objeto.medioPago);

	if(objeto.imagen.val()=="" || objeto.medioPago.val()==""){
		return false;
	}else{
		enviaFormularioPagos(objeto);
	}
}

function enviaFormularioPagos(objeto){
	let imagen;
	let dato='Servicio web';
	imagen=(objeto.imagen.val()=='')?'':objeto.imagen.val().substring(12).trim();

	var fd = new FormData(document.getElementById(objeto.tabla));
	// Filtrar los campos extra (si existen)
	fd.delete("pagosTabla_length");
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	fd.append("observacion", '');
	fd.append("imagen", imagen);
	fd.append("estado", objeto.estado);
	

	confirm("¡Se enviará el pago: "+dato+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body=fd;
		try {
			let creaEdita = await axios.post("/api/"+objeto.tabla+"/crear",body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
			
			desbloquea();
			resp=creaEdita.data.valor;
			if(resp.resultado){
				let t = $('#'+objeto.tabla+'Tabla').DataTable();
				let rowNode =t.row.add( [
					`<div class="estadoTachado  fecha ">${moment(resp.info.FECHA_INICIO).format('DD-MM-YYYY')+" - "+moment(resp.info.FECHA_FIN).format('DD-MM-YYYY')}</div>
					<div class="oculto imagen">${resp.info.IMAGEN}</div>`,
					`<div class="estadoTachado  descripcion muestraMensaje">${resp.info.DESCRIPCION}</div>`,
					`<div class="estadoTachado  medioPago">${resp.info.MEDIO_PAGO}</div>`,
					`<div class="estadoTachado  monto">${parseFloat(resp.info.MONTO).toFixed(2)}</div>`,
					`<div class="estadoTachado  fechaPago">${moment(resp.info.FECHA_PAGO).format('DD-MM-YYYY')}</div>`,
					`<div class="estadoTachado  observacion">${(resp.info.OBSERVACION===null)?'':resp.info.OBSERVACION}</div>`,
					`<div class="estadoTachado  estado"><span class="badge bg-${resp.info.COLOR}">${resp.info.ESTADO_PAGO}</span></div>`,
					ver()+((verNivel()==1)?modifica():'')
				] ).draw( false ).node();
				$( rowNode ).attr('id',resp.info.ID_PAGOS);

				limpiaTodo(objeto.tabla);
				$("#"+objeto.tabla+" span#botonGuardar").text('Enviar');
				$("#mensajePago").html(
					`<div class="alert bg-${resp.info.COLOR}" role="alert">
						${resp.info.MENSAJE}
					</div>`
				);
				$('#controles').addClass('oculto')
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


function enviaFormularioModalPagos(objeto){
	let dato='Servicio web';
	var fd = new FormData(document.getElementById(objeto.tabla+'ModalPagos'));
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	fd.append("imagen", '');
	fd.append("medioPago", 0);

	confirm("¡Se enviará el pago: "+dato+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body=fd;
		try {
			let creaEdita = await axios.put("/api/"+objeto.tabla+"/editar/"+objeto.id,body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
			$("#general1").modal("hide");
			desbloquea();
			resp=creaEdita.data.valor;
			if(resp.resultado){
				if(objeto.id>0){
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estado").html(`<span class="badge bg-${resp.info.COLOR}">${resp.info.ESTADO_PAGO}</span>`);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .observacion").text(resp.info.OBSERVACION)
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
				}
				let periodo='';
				if(resp.info.ABREVIATURA=='RECH'){
					$('#controles').removeClass('oculto');
					fechaInicio=moment(resp.info.FECHA_INICIO).format('DD/MM/YYYY');
					fechaFinal=moment(resp.info.FECHA_FIN).format('DD/MM/YYYY');
					periodo=fechaInicio+" - "+fechaFinal;
				}else if(resp.info.ABREVIATURA=='CONF' || resp.info.ABREVIATURA=='ENRE'){
					$('#controles').addClass('oculto')
				}

				$("#mensajePago").html(
					`<div class="alert bg-${resp.info.COLOR}" role="alert">
						${resp.info.MENSAJE+" "+periodo}
					</div>`
				);
					
				
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


