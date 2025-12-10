//FUNCIONES
$(document).ready(function() {
	try {
		vistaVenta();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaVenta(){
	bloquea();
	let tabla="venta";
	let idVenta=0;
	let totalVenta=0;
	let lista;
	let ventas;
	let resp;
	let resp2;
	const busca =  await axios.get('/api/'+tabla+'/buscar/0/'+verSesion(),{ 
		headers:{authorization: `Bearer ${verToken()}`} 
	});

	if(busca.data.valor.info!==undefined){
		idVenta=busca.data.valor.info.ID_VENTA;
		totalVenta=(busca.data.valor.info.TOTAL===null)?0:busca.data.valor.info.TOTAL;
		totalDescuento=(busca.data.valor.info.DESCUENTO===null)?0:busca.data.valor.info.DESCUENTO;
	}else{
		crearVenta({idVenta:0,tabla:tabla,accion:'crea'});
		return false;
	}

	lista= await axios.get('/api/'+tabla+'/detalle/listar/'+idVenta+'/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});
	resp=lista.data.valor.info;

	ventas= await axios.get('/api/'+tabla+'/inicio/listar/'+verSesion()+"/reporteVentasPorFecha",{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		}
	});
	resp2=ventas.data.valor.info;
	desbloquea();
	let noMostrar=(verNivel()==5)?'oculto':'';
	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<div id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>${ idVenta}</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-coins"></i> VENTA</div>
						<ul class="nav nav-pills mb-3 mt-3 ${noMostrar}" id="pills-tab" role="tablist">
							<li class="nav-item" role="presentation">
								<button class="nav-link active" id="pills-vender-tab" data-bs-toggle="pill" data-bs-target="#pills-vender" type="button" role="tab" aria-controls="pills-vender" aria-selected="true">VENDER</button>
							</li>
							<li class="nav-item" role="presentation">
								<button class="nav-link" id="pills-listaVenta-tab" data-bs-toggle="pill" data-bs-target="#pills-listaVenta" type="button" role="tab" aria-controls="pills-listaVenta" aria-selected="false">LISTA DE VENTAS</button>
							</li>
						</ul>
						<div class="tab-content" id="pills-tabContent">
							<div class="tab-pane fade show active" id="pills-vender" role="tabpanel" aria-labelledby="pills-vender-tab">
								<div class="row">
									<div class="col-12">
										<div  id="${tabla}Info" class="pb-0 pt-2 pr-3 pl-3">
											<div class="text-right d-flex justify-content-between">
												<h4>TOTAL: S/. <strong><span class="totalVenta">${parseFloat(totalVenta).toFixed(2)}</span></strong></h4>
												<h4>DESCUENTO: S/. <strong><span class="totalDescuento">${parseFloat(totalDescuento).toFixed(2)}</span></strong></h4>
												<span>${borrar()+venta()}</span>
											</div>
											<div class="row">
												<div class="form-group col-md-6">
													<label>Codigo de barra</label>
													<input id="codigoBarra" name="codigoBarra" autocomplete="off" maxlength="10" type="text" class="form-control p-1" placeholder="Busque el producto">
												</div>
												<div class="form-group col-md-2 pt-4">
													${buscar()}
												</div>
											</div>
										</div>
										<div class="card-content collapse show">
											<div class="card-body card-dashboard">
												<div class="table-responsive">
													<table id="${tabla}Tabla" class="pt-3 table table-striped text-center">
														<thead>
															<tr>
																<th>Código</th>
																<th>Producto</th>
																<th>P. Venta</th>
																<th>Cantidad</th>
																<th>Descuento</th>
																<th>Total</th>
																<th class="nosort nosearch">Acciones</th>
															</tr>
														</thead>
														<tbody>`;
															for(var i=0;i<resp.length;i++){
												listado+=`<tr id="${ resp[i].ID_DETALLE }">
																<td>
																	<div class="codigo">${ (resp[i].CODIGO_PRODUCTO===null)?'':resp[i].CODIGO_PRODUCTO}</div>
																</td>
																<td>
																	<div class="nombre muestraMensaje">${ resp[i].NOMBRE }</div>
																</td>
																<td>
																	<div class="precio">${ parseFloat(resp[i].PRECIO_VENTA).toFixed(2) }</div>
																</td>
																<td>
																	<div class="cantidad">${ resp[i].CANTIDAD}</div>
																</td>
																<td>
																	<div class="descuento">${ parseFloat(resp[i].DESCUENTO).toFixed(2)}</div>
																</td>
																<td>
																	<div class="total">${ parseFloat(resp[i].MONTO_TOTAL).toFixed(2) }</div>
																</td>
																<td>
																	${modifica()+elimina()}
																</td>
															</tr>`;
															}
											listado+=`</tbody>
													</table>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="tab-pane fade" id="pills-listaVenta" role="tabpanel" aria-labelledby="pills-listaVenta-tab">
								<div class="row pt-3">
									<div class="col-12">
										<div class="card-content collapse show">
											<div class="card-body card-dashboard">
												<div class="table-responsive">
													<table id="${tabla}TablaLista" class="pt-3 table table-striped text-center">
														<thead>
															<tr>
																<th>Tipo documento</th>
																<th>Fecha venta</th>
																<th>cliente</th>
																<th>Total</th>
																<th>Usuario</th>
																<th class="nosort nosearch">Acciones</th>
															</tr>
														</thead>
														<tbody>`;
															for(var i=0;i<resp2.length;i++){
																let descuento=(parseInt(resp2[i].DESCUENTO)>0)?'<span class="badge bg-info" data-bs-toggle="tooltip" data-bs-placement="top" title="Tiene descuento"><i class="las la-user-tag"></i></span>':'';
												listado+=`<tr id="${ resp2[i].ID_VENTA }">
																<td>
																	<div class="tipoDocumento">${ resp2[i].TIPO_DOCUMENTO}</div>
																	<div class="serie"><span class="badge bg-primary">${ resp2[i].SERIE+" - "+resp2[i].NUMERO_DOCUMENTO }</span></div>
																</td>
																<td>
																	<div class="fechaVenta">${ moment(resp2[i].FECHA_VENTA).format('DD/MM/YYYY') }</div>
																</td>
																<td>
																	<div class="cliente">${ resp2[i].CLIENTE}</div>
																	<div class="comentario badge bg-secondary">${ resp2[i].COMENTARIO }</div>
																</td>
																<td>
																	<div class="total">${ parseFloat(resp2[i].TOTAL).toFixed(2)+" "+descuento}</div>
																</td>
																<td>
																	<div class="usuario">${ resp2[i].USUARIO}</div>
																</td>
																<td>
																	${detalle()}
																</td>
															</tr>`;
															}
											listado+=`</tbody>
													</table>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
		`;
		
	$("#cuerpoPrincipal").html(listado);
	tooltip();
	$('#'+tabla+'Tabla').DataTable(valoresTabla);
	$('#'+tabla+'TablaLista').DataTable(valoresTabla);

	$('[data-toggle="tooltip"]').tooltip();
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

	let objeto={
		tabla:tabla,
		idVenta:$('#'+tabla+' span.muestraId').text(),
		barra:$("#"+tabla+"Info input[name='codigoBarra']")
	}
	$("#"+tabla+" input[name='codigoBarra']").focus();
	eventosVenta(objeto);
}

function focusBarra(elemento){
	elemento.focus();
	elemento.val('');
}

function eventosVenta(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='comentario'){
			comentarioRegex(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='cantidad'){
			numeroMaskSinCero(elemento);
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').off( 'change');
	$('#'+objeto.tabla+' div').on( 'change','input[type=fecha]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='fechaVenta'){
			validaVacio(elemento);
		}
	});

    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
	});

	$('#'+objeto.tabla+'Info').off( 'click');
	$('#'+objeto.tabla+'Info').on( 'click','button[name=btnVenta]',function(){//venta
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text();
		objeto.total= $("#"+objeto.tabla+"Info .totalVenta").text();
		if(objeto.total>0){
			procesaFormularioPago(objeto);
		}else{
			focusBarra(objeto.barra);
			mensajeSistema('¡No hay productos para cerrar la venta!')
		}
	});

	$('#'+objeto.tabla+'Info').on( 'click','button[name=btnBorrar]',function(){//borra venta
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text();
		objeto.total= $("#"+objeto.tabla+"Info .totalVenta").text();
		focusBarra(objeto.barra);
		if(objeto.total>0){
			ventaElimina(objeto);
		}else{
			mensajeSistema('¡No hay productos para quitar de la venta!')
		}
	});

	$('#'+objeto.tabla+'Info').on( 'click', 'button[name=btnBuscar]', function () {
		let producto=$("#"+objeto.tabla+" input[name='codigoBarra']").val();
		if(producto!=''){
			ventaBusca({idVenta:objeto.idVenta,producto:producto,tabla:objeto.tabla});
		}
		focusBarra(objeto.barra);
		
	});

	$('#'+objeto.tabla+'Info').off( 'keypress');
	$('#'+objeto.tabla+'Info').on( 'keypress', 'input[name=codigoBarra]', function (e) {
		let $inputBarra = $(this);
		if (e.which == 13) {
			e.preventDefault();
			let producto=$inputBarra.val();
			if(producto!==''){
				ventaBusca({idVenta:objeto.idVenta,producto:producto,tabla:objeto.tabla});
				focusBarra(objeto.barra);
			}
		}
	});

	$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.edita',function(){//edita
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		objeto.id=id;
		objeto.nombreEdit=nombre;
		objeto.tabla2=objeto.tabla+'Edita';
		ventaEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		focusBarra(objeto.barra);
		ventaEliminaDetalle({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'TablaLista tbody').off( 'click');
	$('#'+objeto.tabla+'TablaLista tbody').on( 'click','td a.detalle',function(){//detalle
		let evento=$(this).parents("tr")
		let id=evento.attr('id');
		let nombre=evento.find("td div.tipoDocumento").text()+": "+evento.find("td div.serie").text();
		let comentario=evento.find("td div.comentario").text();			
		let objeto2={
			tabla:objeto.tabla,
			id:id,
			nombreEdit:nombre,
			comentario:comentario
		}
		ventaDetalle(objeto2);
	});

}

async function ventaBusca(objeto){
	bloquea();
	try {
		const busca =  await axios.get('/api/productosucursal/buscar/codigo/'+objeto.producto+'/'+verSesion(),{ 
			headers:{authorization: `Bearer ${verToken()}`} 
		});

		desbloquea();

		const resp=busca.data.valor.info;

		if(resp===undefined){
			mensajeSistema('¡No hay productos para vender!');
		}else{
			let body={
				idProductoSucursal: resp.ID_PRODUCTO_SUCURSAL,
				codigo: resp.CODIGO_PRODUCTO,
				nombre: resp.NOMBRE,
				precioVenta: resp.PRECIO_VENTA,
				cantidad: 1,
				tabla: objeto.tabla,
				idVenta: objeto.idVenta,
				sesId: verSesion()
			}
			agregaVenta(body);
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}
//PAGOS
async function procesaFormularioPago(objeto){
	bloquea();
	try {
		const busca =  await axios.get('/api/venta/buscar/0/'+verSesion(),{ 
			headers:{authorization: `Bearer ${verToken()}`} 
		});

		const cliente =  await axios.get("/api/cliente/listar/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
		} 
		});
		const tipoPago =  await axios.get("/api/parametro/detalle/listar/47/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
		} 
		});

		const comprobante =  await axios.get("/api/comprobante/listar/pago/2545/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
		} 
		});

		desbloquea();
		const resp=busca.data.valor.info;
		const resp2=cliente.data.valor.info;
		const resp3=tipoPago.data.valor.info;
		const resp4=comprobante.data.valor.info;
		
		let listado=`
		<form id="pago">
			<div class="row">
				<div class="form-group col-md-6">	
					<h4><strong>TOTAL: S/. <span class="totalVenta">${parseFloat(resp.TOTAL).toFixed(2)}</span></strong></h4>
					<h3>VUELTO: S/. <span class="vuelto">0.00</span></h3>
				</div>
				<div class="form-group col-md-3">
					<label><strong>PAGA CON (*)</strong></label>
					<input name="pagacon" autocomplete="off" maxlength="10" type="tel" class="form-control p-1 focus tamano" placeholder="Ingrese pago" value="0.00">
				</div>
				<div id="descuentoTotal" class="form-group col-md-3">
					<label><strong>Descuento total</strong></label>`;
					if(verNivel()==5){
				listado+=`<h5>S/. <span>${parseFloat(resp.DETALLE_DESCUENTO).toFixed(2)}</span></h5>
							<input name="descuento" type="hidden" value="0.00">`;
					}else{
				listado+=`<input name="descuento" readonly autocomplete="off" maxlength="10" type="tel" class="form-control p-1 focus" placeholder="Ingrese el descuento" value="${parseFloat(resp.DESCUENTO).toFixed(2)}">`;
					}
	listado+=`</div>
			</div>
			<hr class="border border-primary">
			<div class="row">
				<div class="form-group col-md-12">
					<label>Cliente (*)</label>
					<select name="cliente" class="form-control muestraMensaje" id="select2Cliente">
						<option value="">Select...</option>`;
						for(var i=0;i<resp2.length;i++){
							if(resp2[i].ES_VIGENTE==1){
						listado+=`<option value="${resp2[i].ID_CLIENTE}">${resp2[i].NUMERO_DOCUMENTO+" - "+resp2[i].APELLIDO_PATERNO+" "+resp2[i].APELLIDO_MATERNO+" "+resp2[i].NOMBRE}</option>`;
							}
						}
			listado+=`</select>
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
			</div>
			<div class="row">
				<div class="form-group col-md-6">
					<label>Tipo pago (*)</label>
					<select name="tipoPago" class="form-control select2">
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
					<label>Comprobante (*)</label>
					<select name="comprobante" class="form-control select2">
						<option value="">Select...</option>`;
						for(var i=0;i<resp4.length;i++){
							if(resp4[i].ES_VIGENTE==1){
						listado+=`<option value="${resp4[i].ID_COMPROBANTE}">${resp4[i].TIPO_DOCUMENTO}</option>`;
							}
						}
			listado+=`</select>
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
			</div>
			<div class="row">
				<div class="form-group col-md-12">
					<label>Comentario</label>
					<textarea  rows="3" autocomplete="off" class="form-control p-1" maxlength="500" name="comentario" placeholder="Ingrese el comentario"></textarea>
				</div>
			</div>
			<div class="form-section p-0"></div>
			<div class="col-md-12 pl-0 pr-0 text-center">
				${cancela()+guarda()}
			</div>
			<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
		</form>`;
		mostrar_general1({titulo:'DETALLE PAGO',nombre:objeto.nombreMsg,msg:listado,ancho:600,barra:objeto.barra});
		
		focusInput();
		$(".select2").select2({
			dropdownAutoWidth: true,
			width: '100%',
			placeholder: "Select...",
			dropdownParent: $('#general1')
		});

		$("#select2Cliente").select2({
			//allowClear: true,
			dropdownAutoWidth: true,
			width: '100%',
			placeholder: "Select...",
			dropdownParent: $('#general1'),
			tags: true,
			createTag: function (params) {
				// params.term es el DNI/RUC que el usuario escribió
				const documento = params.term;
        		const tipo = identificarTipoDocumento(documento);

				// 1. Recorrer las opciones ya existentes en el Select2
					let exists = false;
					$('#select2Cliente option').each(function() {
						// 2. Comprobar si el texto de la opción contiene el DNI/RUC buscado
						// (Ej: Busca '12345678' en '12345678 - JUAN PÉREZ')
						if ($(this).text().includes(documento)) {
							exists = true;
							return false; // Salir del .each()
						}
					});

					// 3. Si ya existe, NO creamos el tag de consulta
					if (exists) {
						//console.log(`DNI/RUC ${documento} ya existe en la lista.`);
						return null; 
					}


				if (tipo === 'DNI' || tipo === 'RUC') {
					return {
						id: 'NUEVO_' + tipo + '_' + documento, // Nuevo formato de ID
						text: `🔎 Consultar ${tipo}: ${documento}`, 
						isNew: true 
					};
				} else {
					// No crear el tag si es un formato inválido (menos de 8 o distinto de 11)
					return null; 
				}
			},
		});

		let objeto2={
			cliente:$('#pago select[name=cliente]'),
			tipoPago:$('#pago select[name=tipoPago]'),
			comprobante:$('#pago select[name=comprobante]'),
			comentario:$('#pago textarea[name=comentario]'),
			descuento:$('#pago input[name=descuento]'),
			total:resp.TOTAL,
			pagacon:$('#pago input[name=pagacon]'),
			tabla:'pago',
			id:objeto.id
		}

		eventosPago(objeto2);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function eventosPago(objeto){
	$('#select2Cliente').on('select2:select', async function (e) {
		var data = e.params.data;
		if (data.id && data.id.startsWith('NUEVO_')) {
			const partes = data.id.split('_'); 
			const tipoDocumento = partes[1].toLowerCase(); // 'DNI' o 'RUC'
			const numeroDocumento = partes[2]; // El número

			// Deseleccionar el tag y consultar
        	$('#select_cliente').val(null).trigger('change'); 
			let cliente=await consultarReniecSunat({tipo:tipoDocumento, documento:numeroDocumento});
			
			agregaNuevoCliente(cliente);
		}
	});


	$('#'+objeto.tabla+' div').off( 'change');
    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		if(name=='comprobante'){
			//let idDocumento=$(this).val();
			//muestraDocumentoVenta({idDocumento:idDocumento, tabla:objeto.tabla})
		}else{
			validaVacioSelect(elemento);
		}
		
	});

	$('#'+objeto.tabla+' div').off( 'keyup');
	$('#'+objeto.tabla+' div').on( 'keyup','textarea',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" textarea[name="+name+"]");
		comentarioRegex(elemento);
	});

    $('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='descuento'){
			validaVacio(elemento);
			decimalRegex(elemento);
			resetCero(elemento);
			calculaTotalVenta({total:objeto.total,descuento:objeto.descuento.val()});
		}else if(name=='pagacon'){
			validaVacio(elemento);
			decimalRegex(elemento);
			resetCero(elemento);
			mostrarVuelto({total:objeto.total,pagacon:objeto.pagacon.val()})
		}
	});

	$('#'+objeto.tabla).off( 'click');
	$('#'+objeto.tabla).on( 'click','button[name=btnGuarda]',function(){//pago
		validaFormularioPago(objeto);
	});

	$('#'+objeto.tabla).off( 'keypress');
	$('#'+objeto.tabla).on( 'keypress', 'select[name=cliente],select[name=tipoPago],select[name=comprobante],textarea[name=comentario],input[name=descuento],input[name=pagacon]', function (e) {
		if (e.which == 13) {
			e.preventDefault();
			validaFormularioPago(objeto);
		}
	});
}

function mostrarVuelto(objeto){
	if(objeto.pagacon>=objeto.total){
		let vuelto=parseFloat(objeto.pagacon - objeto.total).toFixed(2);
		$('#pago .vuelto').text(vuelto);
	}else{
		$('#pago .vuelto').text('0.00');
	}
}


async function agregaNuevoCliente(objeto){
	bloquea();
	let tipo;
	let numero;
	if(objeto.razonSocial){
		tipo=2516;
		numero=objeto.ruc;
	}else{
		tipo=35;
		numero=objeto.dni;
	}

	let body={
		apellidoPaterno:objeto.apellidoPaterno,
		apellidoMaterno:objeto.apellidoMaterno,
		nombre:objeto.nombres,
		tipoDocumento:tipo,
		documento: numero,
		direccion:'',
		fechaNacimiento:'',
		celular:'', 
		email:'',
		comentario:'',
		imagen:'',
		sesId:verSesion()
	}
	let crea = await axios.post("/api/cliente/crear",body,{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	desbloquea();
	let resp=crea.data.valor.info;
	let idCliente=resp.ID_CLIENTE;
	let numeroCliente=resp.NUMERO_DOCUMENTO;
	let nombreCliente=resp.NOMBRE;

	const nuevoCliente = new Option(numeroCliente+' - '+nombreCliente, idCliente, true, true);
                
	$('#select2Cliente').append(nuevoCliente);
	$('#select2Cliente').val(idCliente).trigger('change');

}

function calculaTotalVenta(objeto){
	let total=parseFloat(objeto.total - objeto.descuento).toFixed(2);
	$('.totalVenta').text(total);
}

function validaFormularioPago(objeto){	
	validaVacioSelect(objeto.cliente);
	validaVacioSelect(objeto.tipoPago);
	validaVacioSelect(objeto.comprobante);
	validaVacio(objeto.descuento);
	validaVacio(objeto.pagacon);

	if(objeto.cliente.val()=="" || objeto.tipoPago.val()=="" || objeto.comprobante.val()=="" || objeto.descuento.val()=="" || objeto.pagacon.val()==""){
		return false;
	}else{
		enviaFormularioPago(objeto);
	}
}

function enviaFormularioPago(objeto){
	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	let vuelto=$('#pago .vuelto').text();
	confirm(`¡El vuelto es: <span class="tamano">S/.${vuelto}</span>!`,function(){
		return false;
	},async function(){
		bloquea();
		let body=fd;
		try {
			let edita = await axios.put("/api/venta/editar/"+objeto.id,body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});

			desbloquea();
			$("#general1").modal("hide");
			resp=edita.data.valor;
			if(resp.resultado){
				vistaVenta();
				//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
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

//MUESTRA NUMERO DE DOCUMENTO
async function muestraDocumentoVenta(objeto){
	bloquea();
	try{
		const buscar =  await axios.get("/api/venta/muestra/documento/"+objeto.idDocumento+"/"+verSesion(),{ 
            headers:{
				authorization: `Bearer ${verToken()}`
			} 
        });
		const resp=buscar.data.valor;
		desbloquea();
		$('#'+objeto.tabla+' div input[name=serie]').val(resp.info.SERIE);
		$('#'+objeto.tabla+' div input[name=numero]').val(resp.info.NRO_DOCUMENTO);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

//VENTA
async function crearVenta(objeto){
	bloquea();
	let body={
		idVenta:objeto.idVenta,
		sesId:verSesion()
	}
	try {
		crea = await axios.post("/api/"+objeto.tabla+"/crear",body,{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		const resp=crea.data.valor;
		desbloquea();
		if(resp.resultado){
			vistaVenta();
		}else{
			mensajeSistema(resp.mensaje);
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function agregaVenta(objeto){
	bloquea();
	try{
		crea = await axios.post("/api/"+objeto.tabla+"/detalle/crear",objeto,{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		desbloquea();
		resp=crea.data.valor;

		let t = $('#'+objeto.tabla+'Tabla').DataTable();
		let rowNode =t.row.add( [
			`<div class="estadoTachado codigo">${resp.info.CODIGO}</div>`,
			`<div class="estadoTachado nombre muestraMensaje">${resp.info.PRODUCTO}</div>`,
			`<div class="estadoTachado precio">${parseFloat(resp.info.PRECIO_VENTA).toFixed(2)}</div>`,
			`<div class="estadoTachado cantidad">${resp.info.CANTIDAD}</div>`,
			`<div class="estadoTachado descuento">${parseFloat(resp.info.DESCUENTO).toFixed(2)}</div>`,
			`<div class="estadoTachado total">${parseFloat(resp.info.MONTO_TOTAL).toFixed(2)}</div>`,
			modifica()+elimina()
		] ).draw( false ).node();
		$( rowNode ).attr('id',resp.info.ID_DETALLE);
		$("#"+objeto.tabla+"Info .totalVenta").text(parseFloat(resp.info.TOTAL).toFixed(2));
		$("#"+objeto.tabla+"Info .totalDescuento").text(parseFloat(resp.info.DESCUENTO_TOTAL).toFixed(2));
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function ventaEdita(objeto){
	bloquea();
	try {
		const producto= await axios.get("/api/venta/detalle/buscar/"+objeto.id+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		desbloquea();
		const resp=producto.data.valor.info;
		let listado=`
		<div class="text-right d-flex justify-content-between">
			<h4>TOTAL: S/. <span id="montoDetalle" class="totalVenta">${parseFloat(resp.MONTO_TOTAL).toFixed(2)}</span></h4>
		</div>
		<form id="${objeto.tabla2}">
			<div class="row">
				<div class="form-group col-md-4">
					<label>P. Venta (*)</label>
					<input name="precioVenta" disabled autocomplete="off" maxlength="10" type="tel" class="form-control p-1 focus" placeholder="Ingrese el precio venta" value="${parseFloat(resp.PRECIO_VENTA).toFixed(2)}">
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
				<div class="form-group col-md-4">
					<label>Descuento (*)</label>
					<input name="descuento" readonly autocomplete="off" maxlength="10" type="tel" class="form-control p-1 focus" placeholder="Ingrese el descuento" value="${parseFloat(resp.DESCUENTO).toFixed(2)}">
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
				<div class="form-group col-md-4">
					<label>Cantidad (*)</label>
					<input name="cantidad" autocomplete="off" maxlength="10" type="tel" class="form-control p-1 focus" placeholder="Ingrese cantidad" value="${resp.CANTIDAD}">
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
			</div>
			<div class="row">
				<div class="form-group col-md-12">
					<label>Comentario</label>
					<textarea  rows="3" autocomplete="off" class="form-control p-1" maxlength="500" name="comentario" placeholder="Ingrese el comentario">${(resp.OBSERVACION===null)?'':resp.OBSERVACION}</textarea>
				</div>
			</div>
			<div class="form-section p-0"></div>
			<div class="col-md-12 pl-0 pr-0 text-center">
				${cancela()+edita()}
			</div>
			<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
		</form>`;
		mostrar_general1({titulo:'DETALLE DE PRODUCTO',nombre:objeto.nombreEdit,msg:listado,ancho:600, barra:objeto.barra});
		focusInput();
		procesaDetalleVenta(objeto);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function procesaDetalleVenta(objeto){
	let precioVenta=$('#'+objeto.tabla2+' input[name=precioVenta]');
	let descuento=$('#'+objeto.tabla2+' input[name=descuento]');
	let cantidad=$('#'+objeto.tabla2+' input[name=cantidad]');
	let comentario=$('#'+objeto.tabla2+' textarea[name=comentario]');

	let elementos={
		precioVenta:precioVenta,
		descuento:descuento,
		cantidad:cantidad,
		comentario:comentario,
		tabla:objeto.tabla,
		tabla2:objeto.tabla2,
		id:objeto.id,
		nombreMsg:objeto.nombreEdit,
		barra:objeto.barra
	}

	eventoDetalleVenta(elementos);
}

function eventoDetalleVenta(objeto){
	$('#'+objeto.tabla2+' div').off( 'keyup');
    $('#'+objeto.tabla2+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla2+" input[name="+name+"]");
		if(name=='descuento'){
			decimalRegex(elemento);
			validaVacio(elemento);
			calculaTotalDetalle({precioVenta:objeto.precioVenta.val(),descuento:objeto.descuento.val(), cantidad:objeto.cantidad.val()});
			resetCero(elemento);
		}else if(name=='cantidad'){
			numeroRegexSinCero(elemento);
			validaVacio(elemento);
			calculaTotalDetalle({precioVenta:objeto.precioVenta.val(),descuento:objeto.descuento.val(), cantidad:objeto.cantidad.val()});
			resetCantidad(elemento)
		}
	});

    $('#'+objeto.tabla2+' div').on( 'keyup','textarea',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla2+" textarea[name="+name+"]");
		if(name=='comentario'){
			comentarioRegex(elemento);
		}
	});

	$('#'+objeto.tabla2+' div').off( 'click');
	$('#'+objeto.tabla2+' div').on( 'click','button[name=btnGuarda]',function(){//edita
		validaFormularioDetalleVenta(objeto)
	});

	$('#'+objeto.tabla2+' div').off( 'keypress');
	$('#'+objeto.tabla2+' div').on( 'keypress', 'input[name=descuento],input[name=cantidad],textarea[name=comentario]', function (e) {
		if (e.which == 13) {
			e.preventDefault();
			validaFormularioDetalleVenta(objeto);
		}
	});
}

function resetCero(elemento){
	let reset=(elemento.val()=='')?'0.00':elemento.val();
	elemento.val(reset);
}

function resetCantidad(elemento){
	let reset=(elemento.val()=='')?'1':elemento.val();
	elemento.val(reset);
}

function calculaTotalDetalle(objeto){
	let total=parseFloat((objeto.precioVenta * objeto.cantidad) - objeto.descuento).toFixed(2);
	$('#montoDetalle').text(total);
}

function validaFormularioDetalleVenta(objeto){
	validaVacio(objeto.precioVenta);
	validaVacio(objeto.descuento);
	validaVacio(objeto.cantidad);

	if(objeto.precioVenta.val()=="" || objeto.cantidad.val()=="" || objeto.descuento.val()==""){
		return false;
	}else{
		enviaFormularioDetalleVenta(objeto);
	}
}

async function enviaFormularioDetalleVenta(objeto){
	var fd = new FormData(document.getElementById(objeto.tabla2));
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	
	bloquea();
	let body=fd;
	try {
		let edita = await axios.put("/api/"+objeto.tabla+"/detalle/editar/"+objeto.id,body,{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});

		desbloquea();
		$("#general1").modal("hide");
		$("#contenidoGeneral1").html('');
		$("#subtituloGeneral1").html('');
		$("#general1 span#padreId").text('');
		resp=edita.data.valor;
		if(resp.resultado){
			$("#"+objeto.tabla+"Tabla #"+objeto.id+" .descuento").text(parseFloat(resp.info.DESCUENTO).toFixed(2));
			$("#"+objeto.tabla+"Tabla #"+objeto.id+" .cantidad").text(resp.info.CANTIDAD);
			$("#"+objeto.tabla+"Tabla #"+objeto.id+" .total").text(parseFloat(resp.info.MONTO_TOTAL).toFixed(2));
			$("#"+objeto.tabla+"Info .totalVenta").text(parseFloat(resp.info.TOTAL).toFixed(2));
			focusBarra(objeto.barra);
				//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
		}else{
			mensajeSistema(resp.mensaje);
		}	
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function ventaEliminaDetalle(objeto){
	//confirmSupervisor("<div>¡Eliminará el registro: "+objeto.nombre+"!</div><div>Autorización de Supervisor Requerida.<div>",function(){
	confirm("¡Eliminará el registro: "+objeto.nombre+"!",function(){
		return false;
	},async function(){
        bloquea();
		try {
			const eliminar = await axios.delete("/api/"+objeto.tabla+"/detalle/eliminar/"+objeto.id,{ 
				headers:{authorization: `Bearer ${verToken()}`} 
			});
			
			desbloquea();
			resp=eliminar.data.valor;
			if(resp.resultado){
				let  elimina=$('#'+objeto.tabla+'Tabla').DataTable();
				$('#'+objeto.tabla+'Tabla #'+objeto.id).closest('tr');
				elimina.row($('#'+objeto.tabla+'Tabla #'+objeto.id)).remove().draw(false);

				$("#"+objeto.tabla+"Info .totalVenta").text(parseFloat(resp.info.TOTAL).toFixed(2));
				$("#"+objeto.tabla+"Info .totalDescuento").text(parseFloat(resp.info.DESCUENTO_TOTAL).toFixed(2));
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

function ventaElimina(objeto){
	//confirmSupervisor("<div>¡Eliminará toda la venta!</div><div>Autorización de Supervisor Requerida.<div>",function(){
	confirm("¡Eliminará toda la venta!",function(){	
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
				vistaVenta();
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

async function ventaDetalle(objeto){
	bloquea();
	try {
		lista= await axios.get('/api/'+objeto.tabla+'/detalle/listar/'+objeto.id+'/'+verSesion(),{
			headers: 
			{ 
				authorization: `Bearer ${verToken()}`
			} 
		});
		lista2= await axios.get('/api/'+objeto.tabla+'/buscar/totales/'+objeto.id+'/'+verSesion(),{
			headers: 
			{ 
				authorization: `Bearer ${verToken()}`
			} 
		});
		resp=lista.data.valor.info;
		resp2=lista2.data.valor.info;
		desbloquea();
		let listado=`
			<div class="row">
				<div class="col-12">
					<div class="card-content collapse show">
						<div class="card-body card-dashboard pt-0">
							<div class="table-responsive">
								<table id='detalleTablaVenta' class="pt-3 table table-striped text-center">
									<thead>
										<tr>
											<th>Código</th>
											<th>Producto</th>
											<th>P. Venta</th>
											<th>Cantidad</th>
											<th>Descuento</th>
											<th>Total</th>
										</tr>
									</thead>
									<tbody>`;
										for(var i=0;i<resp.length;i++){
								listado+=`<tr id="${ resp[i].ID_DETALLE }">
											<td>
												<div class="codigo">${ (resp[i].CODIGO_PRODUCTO===null)?'':resp[i].CODIGO_PRODUCTO}</div>
											</td>
											<td>
												<div class="nombre muestraMensaje">${ resp[i].NOMBRE }</div>
											</td>
											<td>
												<div class="precio">${ parseFloat(resp[i].PRECIO_VENTA).toFixed(2) }</div>
											</td>
											<td>
												<div class="cantidad">${ parseFloat(resp[i].CANTIDAD).toFixed(2) }</div>
											</td>
											<td>
												<div class="descuento">${ parseFloat(resp[i].DESCUENTO).toFixed(2) }</div>
											</td>
											<td>
												<div class="total">${ parseFloat(resp[i].MONTO_TOTAL).toFixed(2) }</div>
											</td>
										</tr>`;
										}
						listado+=`		<tr>
											<td colspan='4'></td>
											<td><strong>DESCUENTO</strong></td>
											<td>
												<div class="descuento"><strong>${parseFloat(resp2.DESCUENTO).toFixed(2)}</strong></div>
											</td>
										</tr>
										<tr>
											<td colspan='4'></td>
											<td><strong>SUBTOTAL</strong></td>
											<td>
												<div class="subtotal"><strong>${parseFloat(resp2.SUBTOTAL).toFixed(2)}</strong></div>
											</td>
										</tr>
										<tr>
											<td colspan='4'></td>
											<td><strong>IGV ${resp2.IGV*100+'%'}</strong></td>
											<td>
												<div class="igv"><strong>${parseFloat(resp2.IMPUESTO).toFixed(2)}</strong></div>
											</td>
										</tr>
										<tr>
											<td colspan='4'></td>
											<td><strong>TOTAL</strong></td>
											<td>
												<div class="total"><strong>${parseFloat(resp2.TOTAL).toFixed(2)}</strong></div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div><strong>Comentario: </strong>${objeto.comentario}</div>
						</div>
					</div>
				</div>
			</div>`;
		mostrar_general1({titulo:'DETALLE DE VENTA',nombre:objeto.nombreEdit,msg:listado,ancho:600});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

