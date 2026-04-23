//FUNCIONES
$(document).ready(function() {
	try {
		vistaCompra();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaCompra(){
	bloquea();
	let tabla="compra";
	let idCompra=0;
	let totalCompra=0;
	let lista;
	let resp;
	const busca =  await axios.get('/api/'+tabla+'/buscar/0/'+verSesion(),{ 
		headers:{authorization: `Bearer ${verToken()}`} 
	});

	if(busca.data.valor.info!==undefined){
		idCompra=busca.data.valor.info.ID_COMPRA;
		totalCompra=(busca.data.valor.info.TOTAL===null)?0:busca.data.valor.info.TOTAL;
	}else{
		crearCompra({idCompra:idCompra,tabla:tabla,accion:'crea'});
		return false;
	}

	lista= await axios.get('/api/'+tabla+'/detalle/listar/'+idCompra+'/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});

	resp=lista.data.valor.info;

	desbloquea();


	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<div id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>${ idCompra}</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient py-1"><i class="las la-coins"></i> COMPRA DIRECTA</div>
							<div class="row">
								<div class="col-12">
									<div  id="${tabla}Info" class="pb-0 pt-2 pr-3 pl-3">
										<div class="text-right d-flex justify-content-between">
											<h4>TOTAL: S/. <span class="totalCompra">${parseFloat(totalCompra).toFixed(2)}</span></h4>
											<span>${borrar2()+compra()}</span>
										</div>
										<div class="row">
											<div class="form-group col-md-12">
												<label>Producto</label>
												<input id="autocompletaProd" name="autocompletaProd" autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Busque el producto">
												<input type="hidden" name="idProductoSucursal" id="idProductoSucursal">
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
															<th>P. Compra</th>
															<th>P. Venta</th>
															<th>Cantidad</th>
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
																<div class="precioCompra">${ parseFloat(resp[i].PRECIO_COMPRA).toFixed(4) }</div>
                                                                <div><span class="precioCompra2 badge bg-primary">${ (resp[i].PRECIO_COMPRA==resp[i].PRECIO_COMPRA2)?'':parseFloat(resp[i].PRECIO_COMPRA2).toFixed(4) }</span></div>
															</td>
															<td>
																<div class="precioVenta">${ parseFloat(resp[i].PRECIO_VENTA_FINAL).toFixed(2) }</div>
                                                                <div><span class="precioVenta2 badge bg-primary">${ (resp[i].PRECIO_VENTA==resp[i].PRECIO_VENTA2)?'':parseFloat(resp[i].PRECIO_VENTA2).toFixed(2) }</span></div>
															</td>
															<td>
																<div class="cantidad">${ resp[i].CANTIDAD }</div>
															</td>
															<td>
																<div class="total">${ parseFloat(resp[i].MONTO_TOTAL).toFixed(2) }</div>
															</td>
															<td>
																${decide()+modifica()+elimina()}
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
	</div>`;
		
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
		todayHighlight: true,
		endDate: new Date(),
		autoclose: true
	});

	//$("#"+tabla+" span#botonGuardar").text('Crear');
	let objeto={
		tabla:tabla
	}
	eventosCompra(objeto);
}


function eventosCompra(objeto){
	$('#autocompletaProd').autocomplete({
		source: async function(request, response){
			let id=$('#'+objeto.tabla+' span.muestraId').text()
			$.ajax({
				url:"/autocompleta/producto",
				type: "POST",
				dataType: "json",
				data:{
					producto:request.term,
					tipo:'autocompletaVenta2',
					sesId:verSesion(),
					token:verToken()
				},
				success: function(data){
					let datos=data.valor.info;
					response( $.map( datos, function( item ){
						return objeto={
							idCompra:id,
							idProducto:	item.ID_PRODUCTO,
							codigo:	item.CODIGO_PRODUCTO,
							nombre:	item.NOMBRE,
							cantidad:1,
							tabla:objeto.tabla,
							label: '<strong>Codigo:</strong> '+item.CODIGO_PRODUCTO+"<br><strong>Producto: </strong>"+item.NOMBRE+"<br><strong>Stock: </strong>"+item.STOCK,
							value: '<strong>Codigo:</strong> '+item.CODIGO_PRODUCTO+"<br><strong>Producto: </strong>"+item.NOMBRE+"<br><strong>Stock: </strong>"+item.STOCK,
						}
					}));
				},
			});
		},
		minLength:3,
		select:function(event,ui){
			agregaCompra(ui.item);
			$(this).val(''); 
			return false;
		}	
	}).data("ui-autocomplete")._renderItem = function(ul, item){
		return $("<li>")
			.append("<div>" + item.label + "</div>")
			.appendTo(ul);
	};

	$('#'+objeto.tabla+'Info').off( 'click');
	$('#'+objeto.tabla+'Info').on( 'click','button[name=btnCompra]',function(){//compra
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text();
		objeto.total= $("#"+objeto.tabla+"Info .totalCompra").text();
		let pcompra=verificarPreciosDeCompraCero({tabla:objeto.tabla});
		if(pcompra){
			mensajeSistema('¡Hay productos con precio de compra en CERO.!');
		}else if(objeto.total>0){
			procesaFormularioPago(objeto);
		}else{
			mensajeSistema('¡No hay productos para cerrar la compra!')
		}
	});

	$('#'+objeto.tabla+'Info').on( 'click','button[name=btnBorrar]',function(){//borra compra
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text();
		objeto.total= $("#"+objeto.tabla+"Info .totalCompra").text();
		if(objeto.total>0){
			compraElimina(objeto);
		}else{
			mensajeSistema('¡No hay productos para quitar de la compra!')
		}
	});

	$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.edita',function(){//edita
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		objeto.id=id;
		objeto.nombreEdit=nombre;
		compraEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.decide',function(){//decidir
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		objeto.id=id;
		objeto.nombreEdit=nombre;
		compraDecide(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		compraEliminaDetalle({id:id,nombre:nombre,tabla:objeto.tabla});
	});
}

function verificarPreciosDeCompraCero(objeto) {
	let hayPrecioCero = false;
	$('#'+objeto.tabla+'Tabla td .precioCompra').each(function() {
		let precioTexto = $(this).text().trim();
		let precioNumero = parseFloat(precioTexto);
		if (precioNumero === 0 || isNaN(precioNumero)) {
			hayPrecioCero = true;
			return false;
		}
	});
	return hayPrecioCero;
}

async function agregaNuevoProveedor(objeto){
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
		nombre:'',
		razon:objeto.razonSocial,
		ruc: numero,
		direccion:(objeto.direccion==null)?'':objeto.direccion,
		fijo:'',
		celular:'', 
		email:'',
		sesId:verSesion()
	}
	let crea = await axios.post("/api/proveedor/crear",body,{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	desbloquea();
	let resp=crea.data.valor.info;
	let idProveedor=resp.ID_PROVEEDOR;
	let numeroProveedor=resp.RUC;
	let nombreProveedor=resp.RAZON_SOCIAL;

	const nuevoProveedor = new Option(numeroProveedor+' - '+nombreProveedor, idProveedor, true, true);
                
	$('#select2Proveedor').append(nuevoProveedor);
	$('#select2Proveedor').val(idProveedor).trigger('change');

}

async function procesaFormularioPago(objeto){
	bloquea();
	try {
		const busca =  await axios.get('/api/compra/buscar/0/'+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});

		const tipoPago =  await axios.get("/api/parametro/detalle/listar/0/TIPA/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});

		proveedor =  await axios.get("/api/proveedor/listar/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		const comprobante =  await axios.get("/api/comprobante/listar/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
	

		desbloquea();
		const resp=busca.data.valor.info;
		const resp2=proveedor.data.valor.info;
		const resp3=tipoPago.data.valor.info;
		const resp4=comprobante.data.valor.info;
		let listado=`
		<form id="pago">
			<h4>TOTAL: S/. <span class="totalCompra">${parseFloat(resp.TOTAL).toFixed(2)}</span></h4>
			<div class="row">
				<div class="form-group col-md-8">
					<label>Proveedor</label>
					<select name="proveedor" class="form-control" id="select2Proveedor">
						<option value="">Select...</option>`;
						for(var i=0;i<resp2.length;i++){
							if(resp2[i].ES_VIGENTE==1){
						listado+=`<option value="${resp2[i].ID_PROVEEDOR}">${resp2[i].RUC+" - "+resp2[i].RAZON_PROVEEDOR}</option>`;
							}
						}
			listado+=`</select>
						<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
				<div class="form-group col-md-4">
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
			</div>
			<div class="row">
				<div class="form-group col-md-6">
					<label>Comprobante (*)</label>
					<select name="comprobante" class="form-control select2">
						<option value="">Select...</option>`;
						for(var i=0;i<resp4.length;i++){
							if(resp4[i].ES_VIGENTE==1 && (resp4[i].ABREVIATURA=='FT' || resp4[i].ABREVIATURA=='BV')){
						listado+=`<option value="${resp4[i].ID_COMPROBANTE}">${resp4[i].TIPO_DOCUMENTO}</option>`;
							}
						}
			listado+=`</select>
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
				<div class="form-group col-md-3">
					<label>Serie (*)</label>
					<input name="serie" maxlength="10" autocomplete="off" type="text" class="form-control" placeholder="AAA-000">
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
				<div class="form-group col-md-3">
					<label>Número (*)</label>
					<input name="numero" maxlength="10" autocomplete="off" type="text" class="form-control" placeholder="Ingrese el numero">
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
			</div>
			<div class="row">
				<div class="form-group col-md-12">
					<label>Comentario (*)</label>
					<textarea  rows="3" autocomplete="off" class="form-control p-1" maxlength="500" name="comentario" placeholder="Ingrese el comentario"></textarea>
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
			</div>
			<div class="form-section p-0"></div>
			<div class="col-md-12 pl-0 pr-0 text-center">
				${cancela()+guarda()}
			</div>
			<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
		</form>`;
		mostrar_general1({titulo:'DETALLE PAGO',nombre:objeto.nombreMsg,msg:listado,ancho:600});
		$(".select2").select2({
			dropdownAutoWidth: true,
			width: '100%',
			placeholder: "Select...",
			dropdownParent: $('#general1')
		});

		$("#select2Proveedor").select2({
			//allowClear: true,
			dropdownAutoWidth: true,
			dropdownParent: $('#general1'),
			width: '100%',
			placeholder: "Select...",
			tags: true,
			createTag: function (params) {
				// params.term es el DNI/RUC que el usuario escribió
				const documento = params.term;
				const tipo = identificarTipoDocumento(documento);

				// 1. Recorrer las opciones ya existentes en el Select2
					let exists = false;
					$('#select2Proveedor option').each(function() {
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
			tipoPago:$('#pago select[name=tipoPago]'),
			comentario:$('#pago textarea[name=comentario]'),
			proveedor:$('#pago select[name=proveedor]'),
			comprobante:$('#pago select[name=comprobante]'),
			serie:$('#pago input[name=serie]'),
			numero:$('#pago input[name=numero]'),
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
	$('#'+objeto.tabla+' div').off( 'change');
    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);		
	});

	$('#select2Proveedor').on('select2:select', async function (e) {
		var data = e.params.data;
		if (data.id && data.id.startsWith('NUEVO_')) {
			const partes = data.id.split('_'); 
			const tipoDocumento = partes[1].toLowerCase(); // 'DNI' o 'RUC'
			const numeroDocumento = partes[2]; // El número

			// Deseleccionar el tag y consultar
        	$('#select_cliente').val(null).trigger('change'); 
			let cliente=await consultarReniecSunat({tipo:tipoDocumento, documento:numeroDocumento});
			
			agregaNuevoProveedor(cliente);
		}
	});

	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','textarea',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" textarea[name="+name+"]");
		if(name=='comentario'){
			comentarioRegex(elemento);
		}
	});

	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='serie'){
			serieRegex(elemento);
		}else if(name=='numero'){
			documentoRegex(elemento);
		}
		validaVacio(elemento);
	});


	$('#'+objeto.tabla).off( 'click');
	$('#'+objeto.tabla).on( 'click','button[name=btnGuarda]',function(){//pago
		validaFormularioPago(objeto);
	});
}

function validaFormularioPago(objeto){	
	validaVacioSelect(objeto.tipoPago);
	validaVacioSelect(objeto.proveedor);
	validaVacio(objeto.serie);
	validaVacio(objeto.numero);
	validaVacioSelect(objeto.comprobante);
	if(objeto.tipoPago.val()=="" || objeto.proveedor.val()=="" || objeto.serie.val()=="" || objeto.numero.val()=="" || objeto.comprobante.val()==""){
		return false;
	}else{
		enviaFormularioPago(objeto);
	}
}

function enviaFormularioPago(objeto){
	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	
	confirm("¡Se cerrará la compra!",function(){
		return false;
	},async function(){
		bloquea();
		let body=fd;
		try {
			let edita = await axios.put("/api/compra/editar2/"+objeto.id,body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});

			desbloquea();
			$("#general1").modal("hide");
			resp=edita.data.valor;
			if(resp.info.EXISTE_SERIE==0){
				mensajeSistema('¡No se ha registrado el documento (comprobante) para realizar esta transacción!');
			}else{
				if(resp.resultado){
					vistaCompra();
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					mensajeSistema(resp.mensaje);
				}
			}
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
    });
}

//COMPRA
async function crearCompra(objeto){
	bloquea();
	let body={
		idCompra:objeto.idCompra,
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
			vistaCompra();
		}else{
			mensajeSistema(resp.mensaje);
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function agregaCompra(objeto){
	bloquea();
	try{
		let body={
			idProducto:objeto.idProducto,
			codigo: objeto.codigo,
			nombre: objeto.nombre,
			precioVenta: 0,
			precioCompra: 0,
			cantidad: objeto.cantidad,
			tabla: objeto.tabla,
			idCompra: objeto.idCompra,
			sesId: verSesion()
		}
		crea = await axios.post("/api/"+objeto.tabla+"/detalle/crear",body,{ 
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
			`<div class="estadoTachado precioCompra">${parseFloat(resp.info.PRECIO_COMPRA).toFixed(4)}</div><div><span class="precioCompra2 badge bg-primary"></span></div>`,
			`<div class="estadoTachado precioVenta">${parseFloat(resp.info.PRECIO_VENTA_FINAL).toFixed(2)}</div><div><span class="precioVenta2 badge bg-primary"></span></div>`,
			`<div class="estadoTachado cantidad">${resp.info.CANTIDAD}</div>`,
			`<div class="estadoTachado total">${parseFloat(resp.info.MONTO_TOTAL).toFixed(2)}</div>`,
			decide()+modifica()+elimina()
		] ).draw( false ).node();
		$( rowNode ).attr('id',resp.info.ID_DETALLE);
		$("#"+objeto.tabla+"Info .totalCompra").text(parseFloat(resp.info.TOTAL).toFixed(2));
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function compraEdita(objeto){
	bloquea();
	try {
		const producto= await axios.get("/api/compra/detalle/buscar/"+objeto.id+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		desbloquea();
		const resp=producto.data.valor.info;
		let listado=`
		<form id="${objeto.tabla}">
			<div class="row">
				<div class="form-group col-md-4">
					<label>P. Compra (*)</label>
					<input name="precioCompra" autocomplete="off" maxlength="10" type="tel" class="form-control p-1 focus" placeholder="Ingrese el precio compra" value="${parseFloat(resp.PRECIO_COMPRA).toFixed(4)}">
					<div class="vacio oculto">¡Campo obligatorio!</div>
				</div>
				<div class="form-group col-md-4">
					<label>P. Venta (*)</label>
					<input name="precioVenta" autocomplete="off" maxlength="10" type="tel" class="form-control p-1 focus" placeholder="Ingrese el precio venta" value="${parseFloat(resp.PRECIO_VENTA_FINAL).toFixed(2)}">
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
		mostrar_general1({titulo:'DETALLE DE PRODUCTO',nombre:objeto.nombreEdit,msg:listado,ancho:600});
		focusInput();
		procesaDetalleCompra(objeto);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function compraDecide(objeto){
	bloquea();
	try {
		const producto= await axios.get("/api/compra/detalle/buscar/"+objeto.id+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		desbloquea();
		const resp=producto.data.valor.info;
        let compraAnt = parseFloat(resp.PRECIO_COMPRA2) || 0; // 4 decimales desde la DB
        let ventaAnt = parseFloat(resp.PRECIO_VENTA2) || 0; // 2 decimales desde la DB

        let compraNueva = parseFloat(resp.PRECIO_COMPRA) || 0;
        let ventaNueva = parseFloat(resp.PRECIO_VENTA) || 0;

        let margenActual, nuevoMargen, diff, simbolo, color, precioFinalParaCliente,margenParaBotonAzul;

        if (ventaAnt > 0) {
            margenActual= ((ventaAnt - compraAnt) / ventaAnt) * 100; //lo que se gana actualmente
            nuevoMargen= ((ventaAnt - compraNueva) / ventaAnt) * 100; //lo que se ganaria 
            margenParaBotonAzul = margenActual;

            let factorMargenOriginal = (ventaAnt - compraAnt) / ventaAnt;
            let nuevoPrecioSugerido = compraNueva / (1 - factorMargenOriginal);
            precioFinalParaCliente = Math.ceil(nuevoPrecioSugerido * 100) / 100;

            diff = (nuevoMargen - margenActual).toFixed(2);
            simbolo = diff > 0 ? "+" : ""; // Ponemos el + si es positivo
            color = diff > 0 ? "text-success" : "text-danger"; // Verde si ganas, rojo si pierdes
        }else{
            margenActual = 0;
            nuevoMargen = 0;
            margenParaBotonAzul=30;
            diff = "0.00";
            simbolo = "";
            color = "text-muted";
            let sugeridoInicial = compraNueva / (1 - (margenParaBotonAzul / 100));
            precioFinalParaCliente = Math.ceil(sugeridoInicial * 100) / 100;
        }

        let margenProyectado = ventaNueva > 0 ? ((ventaNueva - compraNueva) / ventaNueva) * 100 : 0; //lo que se proyecta
        objeto.compraNueva=compraNueva

        let tituloBotonAzul = (ventaAnt > 0) ? "Mantener Margen Actual" : "Sugerir Margen Base";
        let tituloBotonAzul2 = (ventaAnt > 0) ? "Seguirás ganando" : "Ganancia estimada";
		let listado=`
		<form id="${objeto.tabla}Decide">
            <div class="alert alert-primary">
                <strong>Margen Actual:</strong> ${margenActual.toFixed(2)}% | 
                <strong>Nuevo Margen:</strong> ${nuevoMargen.toFixed(2)}% | 
                <strong>Variación:</strong> <span class="${color}">${simbolo}${diff}%</span>
            </div>
            
            <div class="row text-center mt-3 g-3"> <div class="col-md-6">
                <button type="button" id="btnMantenerVenta" class="btn btn-outline-secondary w-100 py-2" data-precio="${ventaAnt.toFixed(2)}">
                    Mantener Venta Anterior<br>
                    <strong>S/ ${ventaAnt.toFixed(2)}</strong><br>
                    <small>(Ganarás ${nuevoMargen.toFixed(2)}%)</small>
                </button>
            </div>

            <div class="col-md-6">
                <button type="button" id="btnPrecioCompra" class="btn btn-info w-100 py-2 text-white" data-precio="${ventaNueva.toFixed(2)}">
                    Precio Sugerido en Compra<br>
                    <strong>S/ ${ventaNueva.toFixed(2)}</strong><br>
                    <small>(Ganarás ${margenProyectado.toFixed(2)}%)</small>
                </button>
            </div>

            <div class="col-md-6">
                <button type="button" id="btnMantenerMargen" class="btn btn-primary w-100 py-2" data-precio="${parseFloat(precioFinalParaCliente).toFixed(2)}">
                    ${tituloBotonAzul}<br>
                    <strong>S/ ${parseFloat(precioFinalParaCliente).toFixed(2)}</strong><br>
                    <small>(${tituloBotonAzul2+" "+margenParaBotonAzul.toFixed(2)}%)</small>
                </button>
            </div>

            <div class="col-md-6">
                <div class="input-group" style="height: 80%;">
                    <input type="tel" id="precioManual" autocomplete="off" class="form-control" placeholder="Precio Manual">
                    <button style="height: 80%; type="button" id="btnAplicarManual" class="btn btn-success">Aplicar</button>
                </div>
                <div id="feedbackManual" class="fw-bold mt-1" style="font-size: 0.85rem;"></div>
            </div>
        </form>`;
		mostrar_general1({titulo:'DECIDIR PRECIOS DE VENTA',nombre:objeto.nombreEdit,msg:listado,ancho:600});
		focusInput();

        procesaDecideCompra(objeto);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function procesaDecideCompra(objeto){
    $('#'+objeto.tabla+'Decide').off( 'click');
	$('#'+objeto.tabla+'Decide').on( 'click','button',function(){
        let precioSeleccionado;
        if($(this).attr('id') == 'btnAplicarManual'){
            precioSeleccionado = $('#precioManual').val();
        } else {
            // Si es cualquiera de los otros 3 botones
            precioSeleccionado = $(this).data('precio');
        }

        if(precioSeleccionado > 0){
            objeto.precio=precioSeleccionado;
            enviaNuevoPrecioVenta(objeto);
        }
	});

    $('#'+objeto.tabla+'Decide').off( 'keyup');
    $('#'+objeto.tabla+'Decide').on( 'keyup','#precioManual',function(){
        decimalRegex($(this));
        let precioM = parseFloat($(this).val());
        let costoN = parseFloat(objeto.compraNueva); // El costo de la compra actual

        if (precioM > 0 && precioM > costoN) {
            let margenM = ((precioM - costoN) / precioM) * 100;
            $('#feedbackManual').html(`Margen: <span class="text-success">${margenM.toFixed(2)}%</span>`);
        } else if (precioM <= costoN) {
            $('#feedbackManual').html(`<span class="text-danger">¡Precio menor o igual al costo!</span>`);
        } else {
            $('#feedbackManual').empty();
        }
    });
}

function enviaNuevoPrecioVenta(objeto){
    confirm("¡Esta seguro de modificar el precio de venta para: "+objeto.nombreEdit+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body={
            id:objeto.id,
            comentario:objeto.precio, //se envia el precio
            tabla:'nuevoPrecio',
            abrevBoton:'',
            sesId:verSesion()
        };
		try {
			let edita = await axios.put("/api/"+objeto.tabla+"/detalle/precio/"+objeto.id,body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});

			desbloquea();
			$("#general1").modal("hide");
			$("#contenidoGeneral1").html('');
			$("#subtituloGeneral1").html('');
			resp=edita.data.valor;
			if(resp.resultado){
				//$("#"+objeto.tabla+"Tabla #"+objeto.id+" .precioVenta").text(parseFloat(resp.info.PRECIO_VENTA_FINAL).toFixed(2));
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

function procesaDetalleCompra(objeto){
	let precioCompra=$('#'+objeto.tabla+' input[name=precioCompra]');
	let precioVenta=$('#'+objeto.tabla+' input[name=precioVenta]');
	let cantidad=$('#'+objeto.tabla+' input[name=cantidad]');
	let comentario=$('#'+objeto.tabla+' input[name=comentario]');

	let elementos={
		precioCompra:precioCompra,
		precioVenta:precioVenta,
		cantidad:cantidad,
		comentario:comentario,
		tabla:objeto.tabla,
		id:objeto.id,
		nombreMsg:objeto.nombreEdit
	}

	eventoDetalleCompra(elementos);
}

function eventoDetalleCompra(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='precioCompra' || name=='precioVenta'){
			decimalRegex(elemento);
			validaVacio(elemento);
		}else if(name=='cantidad'){
			numeroRegex(elemento);
			validaVacio(elemento);
		}
	});

    $('#'+objeto.tabla+' div').on( 'keyup','textarea',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" textarea[name="+name+"]");
		if(name=='comentario'){
			comentarioRegex(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		validaFormularioDetalleCompra(objeto)
	});
}

function validaFormularioDetalleCompra(objeto){	
	validaVacio(objeto.precioCompra);
	validaVacio(objeto.precioVenta);
	validaVacio(objeto.cantidad);
	
	if(objeto.precioCompra.val()=="" || objeto.precioVenta.val()=="" || objeto.cantidad.val()==""){
		return false;
	}else{
		enviaFormularioDetalleCompra(objeto);
	}
}

function enviaFormularioDetalleCompra(objeto){
	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	
	confirm("¡Se modificará el producto: "+objeto.nombreMsg+"!",function(){
		return false;
	},async function(){
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
			resp=edita.data.valor;
			if(resp.resultado){
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .precioCompra").text(parseFloat(resp.info.PRECIO_COMPRA).toFixed(4));
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .precioVenta").text(parseFloat(resp.info.PRECIO_VENTA).toFixed(2));
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .cantidad").text(resp.info.CANTIDAD);
				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .total").text(parseFloat(resp.info.MONTO_TOTAL).toFixed(2));
				$("#"+objeto.tabla+"Info .totalCompra").text(parseFloat(resp.info.TOTAL).toFixed(2));

                if(resp.info.PRECIO_COMPRA2===null){
                    $("#"+objeto.tabla+"Tabla #"+objeto.id+" .precioCompra2").text('');
                }else{
                    $("#"+objeto.tabla+"Tabla #"+objeto.id+" .precioCompra2").text(parseFloat(resp.info.PRECIO_COMPRA2).toFixed(4));
                }
				if(resp.info.PRECIO_VENTA2===null){
                    $("#"+objeto.tabla+"Tabla #"+objeto.id+" .precioVenta2").text('');
                }else{
                    $("#"+objeto.tabla+"Tabla #"+objeto.id+" .precioVenta2").text(parseFloat(resp.info.PRECIO_VENTA2).toFixed(2));
                }
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

function compraEliminaDetalle(objeto){
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
				let total=(resp.info.TOTAL===null)?0:resp.info.TOTAL;
				$("#"+objeto.tabla+"Info .totalCompra").text(parseFloat(total).toFixed(2));
				$('#autocompletaProd').val(''); 
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

function compraElimina(objeto){
	confirm("¡Eliminará toda la compra!",function(){
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
				vistaCompra();
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


