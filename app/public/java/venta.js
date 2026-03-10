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
	

	const cliente =  await axios.get("/api/cliente/listar/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
		} 
	});
	const tipoPago =  await axios.get("/api/parametro/detalle/listar/0/TIPA/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
	} 
	});

	const comprobante =  await axios.get("/api/comprobante/listar/pago/0/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
	} 
	});

	let resp=lista.data.valor.info;
	let resp3=cliente.data.valor.info;
	let resp4=tipoPago.data.valor.info;
	let resp5=comprobante.data.valor.info;
	desbloquea();

	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12 p-0">
			<div class="card">
				<div class="card-body pt-1 px-3">
					<div id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>${ idVenta}</span>
						<span class='oculto muestraNombre'></span>

						<div class="row">
							<div class="form-group col-md-12">
								<label>Cliente (*)</label>
								<select name="cliente" class="form-control muestraMensaje" id="select2Cliente">
									<option value="">Select...</option>`;
									for(var i=0;i<resp3.length;i++){
										if(resp3[i].ES_VIGENTE==1){
									listado+=`<option value="${resp3[i].ID_CLIENTE}">${resp3[i].NUMERO_DOCUMENTO+" - "+resp3[i].APELLIDO_PATERNO+" "+resp3[i].APELLIDO_MATERNO+" "+resp3[i].NOMBRE}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-5">
								<div class="btn-group" role="group">`;
									for(var i=0;i<resp4.length;i++){
										if(resp4[i].ES_VIGENTE==1){
									listado+=`<button type="button" class="btn btn-outline-success tipo_pago" data-pago="${resp4[i].ID_PARAMETRO_DETALLE}">
												${resp4[i].DESCRIPCIONDETALLE}
											</button>`;
										}
									}
						listado+=`</div>
								<div id="pagoVacio" class="vacio oculto ">¡Dato obligatorio!</div>
							</div>
							<div class="form-group col-2 text-center">
								<label><strong>PAGA CON:</strong></label>
								<input name="pagacon" autocomplete="off" maxlength="10" type="tel" class="form-control p-1 focus tamano text-center" placeholder="Ingrese pago" value="0.00">
								<span class="vuelto oculto">0.00</span>
							</div>
							<div class="form-group col-5 text-end">
								<div class="btn-group" role="group">`;
									for(var i=0;i<resp5.length;i++){
										if(resp5[i].ES_VIGENTE==1){
									listado+=`<button type="button" class="btn btn-outline-secondary tipo_comprobante" data-comprobante="${resp5[i].ID_COMPROBANTE}">
												${resp5[i].TIPO_DOCUMENTO}
											</button>`;
										}
									}
						listado+=`</div>
								<div id="comprobanteVacio" class="vacio oculto">¡Dato obligatorio!</div>
							</div>
						</div>
						<div  id="${tabla}Info" class="pb-0 pt-2 pr-3 pl-3">
									<div class="text-right d-flex justify-content-between">
										<h4>TOTAL: S/. <strong><span class="totalVenta">${parseFloat(totalVenta).toFixed(2)}</span></strong></h4>
										<h4>DESCUENTO: S/. <strong><span class="totalDescuento">${parseFloat(totalDescuento).toFixed(2)}</span></strong></h4>
									</div>
									<div class="row">
										<div class="form-group col-6">
											${borrar()}
										</div>
										<div class="form-group col-6">
											${venta()}
										</div>
									</div>
								</div>
						<div class="row">
							<div class="col-12">
								<div  id="${tabla}Barra" class="pb-0 pt-2 pr-3 pl-3">
									<div class="row">
										<div class="form-group col-6">
											<label>Codigo de barra</label>
											<input id="codigoBarra" name="codigoBarra" autocomplete="off" maxlength="10" type="text" class="form-control p-1" placeholder="Busque el producto">
										</div>
										<div class="form-group col-md-6">
											<label>Producto</label>
											<input id="autocompletaProd" name="autocompletaProd" autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Busque el producto">
											<input type="hidden" name="idProductoSucursal" id="idProductoSucursal">
										</div>
									</div>
								</div>
								<div class="card-content collapse show">
									<div class="card-body card-dashboard p-0">
										<div class="table-responsive">
											<table id="${tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
												<thead>
													<tr>
														<th>Producto</th>
														<th>P. Venta</th>
														<th>Cantidad</th>
														<th>Total</th>
														<th class="nosort nosearch"></th>
													</tr>
												</thead>
												<tbody>`;
													for(var i=0;i<resp.length;i++){
										listado+=`<tr id="${ resp[i].ID_DETALLE }">
														<td>
															<div class="nombre muestraMensaje">
																<span class="badge bg-primary">${ resp[i].CODIGO_PRODUCTO}</span> ${resp[i].NOMBRE }
															</div>
														</td>
														<td>
															<div class="precio">${ parseFloat(resp[i].PRECIO_VENTA).toFixed(2) }</div>
															<div class="descuento"><span class="badge bg-danger">${ parseFloat(resp[i].DESCUENTO).toFixed(2)}</span></div>
														</td>
														<td>
															<input id="spinner${resp[i].ID_DETALLE}" class="mispinner cantidad focus" type="number" value="${ resp[i].CANTIDAD}" min="1" max="100" step="1" class="form-control">
														</td>
														<td>
															<div class="total">${ parseFloat(resp[i].MONTO_TOTAL).toFixed(2) }</div>
														</td>
														<td>
															${elimina()}
														</td>
													</tr>`;
													}
									listado+=`</tbody>
											</table>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="form-group col-12">
										<label>Comentario</label>
										<textarea  rows="3" autocomplete="off" class="form-control p-1" maxlength="500" name="comentario" placeholder="Ingrese el comentario"></textarea>
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
		
	$("input[type='number']").inputSpinner();

	$('[data-toggle="tooltip"]').tooltip();

	$('#ventaTabla_length').addClass('oculto');
	$('#ventaTabla_info').addClass('oculto');
	$('#ventaTabla_filter').addClass('oculto');

	$(".select2").select2({
		dropdownAutoWidth: true,
		width: '100%',
		placeholder: "Select...",
	});
	$("#select2Cliente").select2({
		//allowClear: true,
		dropdownAutoWidth: true,
		width: '100%',
		placeholder: "Select...",
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

	$('.datepicker').datepicker({
		language: 'es',
		changeMonth: true,
		changeYear: true,
		todayHighlight: true,
		endDate: new Date(),
		autoclose: true
	});

	let objeto={
		tabla:tabla,
		id:$('#'+tabla+' span.muestraId').text(),
		barra:$("#"+tabla+"Barra input[name='codigoBarra']"),
		cliente:$('#'+tabla+' select[name=cliente]'),
		comentario:$('#'+tabla+' textarea[name=comentario]'),
		pagacon:$('#'+tabla+' input[name=pagacon]'),
		sesId:verSesion()
	}
	$("#"+tabla+" input[name='codigoBarra']").focus();
	eventosVenta(objeto);
}

function focusBarra(elemento){
	elemento.focus();
	elemento.val('');
}

function eventosVenta(objeto){
	focusInput();
	$('#autocompletaProd').autocomplete({
		source: async function(request, response){
			$.ajax({
				url:"/autocompleta/producto",
				type: "POST",
				dataType: "json",
				data:{
					producto:request.term,
					idProveedor:0,
					tipo:'autocompletaventa',
					sesId:verSesion(),
					token:verToken()
				},
				success: function(data){
					let datos=data.valor.info;
					response( $.map( datos, function( item ){
						return {
							idVenta: objeto.id,
							idProducto: item.ID_PRODUCTO,
							codigo: item.CODIGO_PRODUCTO,
							nombre: item.NOMBRE,
							cantidad: 1,
							tabla: objeto.tabla,
							label: '<strong>Codigo:</strong> '+item.CODIGO_PRODUCTO+"<br><strong>Producto: </strong>"+item.NOMBRE+"<br><strong>Stock: </strong>"+item.STOCK,
							value: '<strong>Codigo:</strong> '+item.CODIGO_PRODUCTO+"<br><strong>Producto: </strong>"+item.NOMBRE+"<br><strong>Stock: </strong>"+item.STOCK,
							sesId: verSesion()
						}
					}));
				},
			});
		},
		minLength:3,
		select:function(event,ui){
			agregaVenta(ui.item);
			$(this).val(''); 
			return false;
		}	
	}).data("ui-autocomplete")._renderItem = function(ul, item){
		return $("<li>")
			.append("<div>" + item.label + "</div>")
			.appendTo(ul);
	};

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

	$('.btn-group button').off('click');
	$('.btn-group button').on('click', function() {
        const $grupoBotones = $(this).closest('.btn-group');
        $grupoBotones.find('button').removeClass('active');
        $(this).addClass('active');
		$grupoBotones.siblings('.vacio').addClass('oculto');
		if ($(this).hasClass('tipo_pago')) {
			let valorPago = $(this).data('pago');
			if(valorPago ==2512){
				objeto.pagacon.val('0.00');
			}
		}
    });

	$('#'+objeto.tabla).off( 'keyup');
    $('#'+objeto.tabla).on( 'keyup','textarea',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='comentario'){
			comentarioRegex(elemento);
		}
	});

    $('#'+objeto.tabla).on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
	});

	$('#'+objeto.tabla).on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='pagacon'){
			let total= $("#"+objeto.tabla+"Info .totalVenta").text();
			decimalRegex(elemento);
			resetCero(elemento);
			mostrarVuelto({total:total,pagacon:objeto.pagacon.val(),tabla:objeto.tabla})
		}
	});

	$('#'+objeto.tabla).off( 'keypress');
	$('#'+objeto.tabla).on( 'keypress', 'input[name=pagacon],textarea[name=comentario]', function (e) {
		if (e.which == 13) {
			e.preventDefault();
			objeto.total= $("#"+objeto.tabla+"Info .totalVenta").text();
			objeto.totalDescuento= $("#"+objeto.tabla+"Info .totalDescuento").text();
			objeto.tipoPago=$('#'+objeto.tabla+' .tipo_pago.active').data('pago');
			objeto.comprobante=$('#'+objeto.tabla+' .tipo_comprobante.active').data('comprobante');
			if(objeto.total>0){
				validaFormularioPago(objeto);
			}else{
				focusBarra(objeto.barra);
				mensajeSistema('¡No hay productos para cerrar la venta!')
			}
		}
	});

	$('#'+objeto.tabla+'Info').off( 'click');
	$('#'+objeto.tabla+'Info').on( 'click','button[name=btnVenta]',function(){//pagos
		objeto.total= $("#"+objeto.tabla+"Info .totalVenta").text();
		objeto.totalDescuento= $("#"+objeto.tabla+"Info .totalDescuento").text();
		objeto.tipoPago=$('#'+objeto.tabla+' .tipo_pago.active').data('pago');
		objeto.comprobante=$('#'+objeto.tabla+' .tipo_comprobante.active').data('comprobante');
		if(objeto.total>0){
			validaFormularioPago(objeto);
		}else{
			focusBarra(objeto.barra);
			mensajeSistema('¡No hay productos para cerrar la venta!')
		}
	});

	$('#'+objeto.tabla+'Info').on( 'click','button[name=btnBorrar]',function(){//borra venta
		objeto.total= $("#"+objeto.tabla+"Info .totalVenta").text();
		focusBarra(objeto.barra);
		if(objeto.total>0){
			ventaElimina(objeto);
		}else{
			mensajeSistema('¡No hay productos para quitar de la venta!')
		}
	});

	$('#'+objeto.tabla+'Barra').off( 'keypress');
	$('#'+objeto.tabla+'Barra').on( 'keypress', 'input[name=codigoBarra]', function (e) {
		objeto.pagacon.val('0.00');
		let $inputBarra = $(this);
		if (e.which == 13) {
			e.preventDefault();
			let producto=$inputBarra.val();
			if(producto!==''){
				ventaBusca({idVenta:objeto.id,producto:producto,tabla:objeto.tabla});
				focusBarra(objeto.barra);
			}
		}
	});

	let timeouts = {};
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td button.btn-increment',function(){//aumenta
		objeto.pagacon.val('0.00');
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let precio=evento.find("td div.precio").text();
		let descuento=evento.find("td div.descuento").text();
		let cantidad=$('input#spinner'+id).val();
		let total=(precio-descuento)*cantidad;
		$('#'+objeto.tabla+'Tabla tbody tr#'+id+' .total').text(parseFloat(total).toFixed(2));

		if (timeouts[id]) {
			clearTimeout(timeouts[id]);
		}

		timeouts[id] = setTimeout(function() {
			actualizaCantidad({id:id,cantidad:cantidad,descuento:descuento,tabla:objeto.tabla});
			delete timeouts[id];
		}, 500);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td button.btn-decrement ',function(){//disminuye
		objeto.pagacon.val('0.00');
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let precio=evento.find("td div.precio").text();
		let descuento=evento.find("td div.descuento").text();
		let cantidad=$('input#spinner'+id).val();
		let total=(precio-descuento)*cantidad;
		$('#'+objeto.tabla+'Tabla tbody tr#'+id+' .total').text(parseFloat(total).toFixed(2));

		if (timeouts[id]) {
			clearTimeout(timeouts[id]);
		}

		timeouts[id] = setTimeout(function() {
			actualizaCantidad({id:id,cantidad:cantidad,descuento:descuento,tabla:objeto.tabla});
			delete timeouts[id];
		}, 500);
	});

	$('#'+objeto.tabla+'Tabla tbody').off('keypress keyup change');
	$('#'+objeto.tabla+'Tabla tbody').on( 'keypress keyup change','td input.mispinner',function(e){//escribe
		objeto.pagacon.val('0.00');
		if (e.which < 48 || e.which > 57) {
			e.preventDefault();
		}
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let cantidad=$("#spinner"+id+"\\:input_spinner");
		let precio=evento.find("td div.precio").text();
		let descuento=evento.find("td div.descuento").text();
		let cantidadFinal=(cantidad.val()=='' || cantidad.val()==0)?1:cantidad.val();
		(cantidad.val()=='' || cantidad.val()==0)?cantidad.val(1):cantidad.val();
		let total=(precio-descuento)*cantidadFinal;
		$('#'+objeto.tabla+'Tabla tbody tr#'+id+' .total').text(parseFloat(total).toFixed(2));

		if (timeouts[id]) {
			clearTimeout(timeouts[id]);
		}

		timeouts[id] = setTimeout(function() {
			actualizaCantidad({id:id,cantidad:cantidad.val(),descuento:descuento,tabla:objeto.tabla});
			delete timeouts[id];
		}, 500);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		focusBarra(objeto.barra);
		ventaEliminaDetalle({id:id,nombre:nombre,tabla:objeto.tabla});
	});

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

async function actualizaCantidad(objeto){
	let body={
		id: objeto.id,
		cantidad: objeto.cantidad,
		comentario: '',
		descuento:objeto.descuento,
		sesId: verSesion()
	};
	try {
		let edita = await axios.put("/api/"+objeto.tabla+"/detalle/editar/"+objeto.id,body,{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});

		resp=edita.data.valor;
		$("#"+objeto.tabla+"Info .totalVenta").text(parseFloat(resp.info.TOTAL).toFixed(2));
		$("#"+objeto.tabla+"Info .totalDescuento").text(parseFloat(resp.info.DESCUENTOTOTAL).toFixed(2));
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
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
				idProducto: resp.ID_PRODUCTO,
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

function mostrarVuelto(objeto){
	if(parseFloat(objeto.pagacon)>=parseFloat(objeto.total)){
		let vuelto=parseFloat(objeto.pagacon - objeto.total).toFixed(2);
		$('#'+objeto.tabla+' span.vuelto').text(vuelto);
	}else{
		$('#'+objeto.tabla+' span.vuelto').text('0.00');
	}
}

function validaFormularioPago(objeto){
	validaVacioSelect(objeto.cliente);
	if(objeto.tipoPago===undefined){
		$('#pagoVacio').removeClass('oculto');
	}
	if(objeto.comprobante===undefined){
		$('#comprobanteVacio').removeClass('oculto')
	}
	if(objeto.cliente.val()=="" || objeto.tipoPago===undefined || objeto.comprobante===undefined){
		return false;
	}else{
		enviaFormularioPago(objeto);
	}
}

function enviaFormularioPago(objeto){
	let vuelto=$('#'+objeto.tabla+' span.vuelto').text();
	confirm(`¡El vuelto es: <span class="tamano">S/.${vuelto}</span>!`,function(){
		return false;
	},async function(){
		bloquea();
		let body={
			id:objeto.id,
			cliente:objeto.cliente.val(),
			tipoPago:objeto.tipoPago,
			comprobante:objeto.comprobante,
			comentario:objeto.comentario.val(),
			descuento:objeto.totalDescuento,
			sesId:verSesion()
		};
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
			`<div class="estadoTachado nombre muestraMensaje"><span class="badge bg-primary">${ resp.info.CODIGO}</span> ${resp.info.PRODUCTO }</div>`,
			`<div class="estadoTachado precio">${parseFloat(resp.info.PRECIO_VENTA).toFixed(2)}</div>
			<div class="descuento"><span class="badge bg-danger">${ parseFloat(resp.info.DESCUENTO).toFixed(2)}</span></div>`,
			`<input id="spinner${resp.info.ID_DETALLE}" class="mispinner cantidad" type="number" value="${ resp.info.CANTIDAD}" min="1" max="100" step="1" class="form-control">`,
			`<div class="estadoTachado total">${parseFloat(resp.info.MONTO_TOTAL).toFixed(2)}</div>`,
			elimina()
		] ).draw( false ).node();
		$( rowNode ).attr('id',resp.info.ID_DETALLE);
		$("#"+objeto.tabla+"Info .totalVenta").text(parseFloat(resp.info.TOTAL).toFixed(2));
		$("#"+objeto.tabla+"Info .totalDescuento").text(parseFloat(resp.info.DESCUENTO_TOTAL).toFixed(2));
		$("input[type='number']").inputSpinner();
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

