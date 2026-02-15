//FUNCIONES
$(document).ready(function() {
	try {
		vistaPedido();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaPedido(){
	bloquea();
	let tabla="pedido";
	let lista;
	let resp;
	let idPedido=0;
	const busca =  await axios.get('/api/'+tabla+'/buscar/0/'+verSesion(),{ 
		headers:{authorization: `Bearer ${verToken()}`} 
	});

	if(busca.data.valor.info!==undefined){
		idPedido=busca.data.valor.info.ID_PEDIDO;
	}else{
		crearPedido({idPedido:idPedido,tabla:tabla,accion:'crea'});
		return false;
	}

	lista= await axios.get('/api/'+tabla+'/detalle/listar/'+idPedido+'/'+verSesion(),{
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
						<span class='oculto muestraId'>${ idPedido}</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient py-1"><i class="las la-coins"></i> PEDIDO A ALMACEN</div>
							<div class="row">
								<div class="col-12">
									<div  id="${tabla}Info" class="pb-0 pt-2 pr-3 pl-3">
										<div class="text-right d-flex justify-content-between">
											<h4></h4>
											<span>${borrar2()+pedido()}</span>
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
															<th>Cantidad</th>
															<th>Comentario</th>
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
																<div class="cantidad">${ parseFloat(resp[i].CANTIDAD).toFixed(2) }</div>
															</td>
															<td>
																<div class="comentario">${ (resp[i].OBSERVACION===null)?'':resp[i].OBSERVACION }</div>
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
					</div>
				</div>
			</div>
		</div>
	</div>`;
		
	$("#cuerpoPrincipal").html(listado);
	$('#'+tabla+'Tabla').DataTable(valoresTabla);
	
	tooltip();
	$('[data-toggle="tooltip"]').tooltip();
	
	let objeto={
		tabla:tabla
	}

	eventosPedido(objeto);
}


function eventosPedido(objeto){
	$('#autocompletaProd').autocomplete({
		source: async function(request, response){
			let id=$('#'+objeto.tabla+' span.muestraId').text()
			$.ajax({
				url:"/autocompleta/producto",
				type: "POST",
				dataType: "json",
				data:{
					producto:request.term,
					tipo:'autocompletaPedido',
					sesId:verSesion(),
					token:verToken()
				},
				success: function(data){
					let datos=data.valor.info;
					response( $.map( datos, function( item ){
						return objeto={
							idPedido:id,
							idProducto:	item.ID_PRODUCTO,
							stock:	item.STOCK,
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
			agregaPedido(ui.item);
			$(this).val(''); 
			return false;
		}	
	}).data("ui-autocomplete")._renderItem = function(ul, item){
		return $("<li>")
			.append("<div>" + item.label + "</div>")
			.appendTo(ul);
	};
	
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
			numeroRegexSinCero(elemento);
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').off( 'change');
	$('#'+objeto.tabla+' div').on( 'change','input[type=fecha]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='fechaPedido'){
			validaVacio(elemento);
		}
	});

    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
		if(name=='proveedor'){
			$('#autocompletaProd').val('').attr('disabled',false);
			$('#idProductoSucursal').val('');
		}
	});

	$('#'+objeto.tabla+'Info').off( 'click');
	$('#'+objeto.tabla+'Info').on( 'click','button[name=btnPedido]',function(){//pedido
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text();
		objeto.total= $("#"+objeto.tabla+"Tabla tbody tr td.dataTables_empty").length;
		if(objeto.total==0){
			procesaFormularioPedido(objeto);
		}else{
			mensajeSistema('¡No hay productos para cerrar la pedido!')
		}
	});

	$('#'+objeto.tabla+'Info').on( 'click','button[name=btnBorrar]',function(){//borra pedido
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text();
		objeto.total= $("#"+objeto.tabla+"Tabla tbody tr td.dataTables_empty").length;
		if(objeto.total==0){
			pedidoElimina(objeto);
		}else{
			mensajeSistema('¡No hay productos para quitar de la pedido!')
		}
	});

	$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.edita',function(){//edita
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		objeto.id=id;
		objeto.nombreEdit=nombre;
		pedidoEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		pedidoEliminaDetalle({id:id,nombre:nombre,tabla:objeto.tabla});
	});
}


//PAGOS
async function procesaFormularioPedido(objeto){
	bloquea();
	try {
		const usuario =  await axios.get('/api/usuario/buscar/'+verSesion()+'/'+verSesion(),{ 
			headers:{authorization: `Bearer ${verToken()}`} 
		});

		desbloquea();
		const resp2=usuario.data.valor.info;
		let listado=`
		<form id="pedido">
			<div class="row">
				<div class="form-group col-md-12">
					<label>Usuario</label>
					<input name="usuario" disabled maxlength="10" autocomplete="off" type="text" class="form-control" placeholder="Ingrese el usuario" value="${resp2.APELLIDO_PATERNO+ " "+resp2.APELLIDO_MATERNO+ " "+resp2.NOMBRE}">
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
		mostrar_general1({titulo:'PEDIDO',nombre:objeto.nombreMsg,msg:listado,ancho:400});

		let objeto2={
			comentario:$('#pedido textarea[name=comentario]'),
			tabla:'pedido',
			id:objeto.id
		}

		eventosFormularioPedido(objeto2);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function eventosFormularioPedido(objeto){
    $('#'+objeto.tabla+' div').on( 'keyup','textarea',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" textarea[name="+name+"]");
		if(name=='comentario'){
			comentarioRegex(elemento);
		}
	});


	$('#'+objeto.tabla).off( 'click');
	$('#'+objeto.tabla).on( 'click','button[name=btnGuarda]',function(){//pedido
		enviaFormularioPedido(objeto);
	});
}

function enviaFormularioPedido(objeto){
	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	
	confirm("¡Se cerrará la pedido!",function(){
		return false;
	},async function(){
		bloquea();
		let body=fd;
		try {
			let edita = await axios.put("/api/pedido/editar/"+objeto.id,body,{ 
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
					vistaPedido();
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

//PEDIDO
async function crearPedido(objeto){
	bloquea();
	let body={
		idPedido:objeto.idPedido,
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
			vistaPedido();
		}else{
			mensajeSistema(resp.mensaje);
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function agregaPedido(objeto){
	bloquea();
	try{
		let body={
			idProducto:objeto.idProducto,
			cantidad: objeto.cantidad,
			idPedido: objeto.idPedido,
			sesId: verSesion()
		}
		crea = await axios.post("/api/"+objeto.tabla+"/detalle/crear",body,{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		desbloquea();
		resp=crea.data.valor;
		if(resp.info.STOCK_OK==0){
			mensajeSistema('¡No existe el stock suficiente para este producto!');
		}else{
			let t = $('#'+objeto.tabla+'Tabla').DataTable();
			let rowNode =t.row.add( [
				`<div class="estadoTachado codigo">${resp.info.CODIGO}</div>`,
				`<div class="estadoTachado nombre muestraMensaje">${resp.info.PRODUCTO}</div>`,
				`<div class="estadoTachado cantidad">${resp.info.CANTIDAD}</div>`,
				`<div class="estadoTachado comentario">${(resp.info.OBSERVACION===null)?'':resp.info.OBSERVACION}</div>`,
				modifica()+elimina()
			] ).draw( false ).node();
			$( rowNode ).attr('id',resp.info.ID_DETALLE);
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function pedidoEdita(objeto){
	bloquea();
	try {
		const producto= await axios.get("/api/pedido/detalle/buscar/"+objeto.id+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		desbloquea();
		const resp=producto.data.valor.info;
		let listado=`
		<form id="${objeto.tabla}">
			<div class="row">
				<div class="form-group col-md-12">
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
		mostrar_general1({titulo:'DETALLE DE PEDIDO',nombre:objeto.nombreEdit,msg:listado,ancho:400});
		focusInput();
		procesaDetallePedido(objeto);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function procesaDetallePedido(objeto){
	let cantidad=$('#'+objeto.tabla+' input[name=cantidad]');
	let comentario=$('#'+objeto.tabla+' input[name=comentario]');

	let elementos={
		cantidad:cantidad,
		comentario:comentario,
		tabla:objeto.tabla,
		id:objeto.id,
		nombreMsg:objeto.nombreEdit
	}

	eventoDetallePedido(elementos);
}

function eventoDetallePedido(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='cantidad'){
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
		validaFormularioDetallePedido(objeto)
	});
}

function validaFormularioDetallePedido(objeto){	
	validaVacio(objeto.cantidad);

	if(objeto.cantidad.val()==""){
		return false;
	}else{
		enviaFormularioDetallePedido(objeto);
	}
}

function enviaFormularioDetallePedido(objeto){
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

			resp=edita.data.valor;
			$("#general1").modal("hide");
			$("#contenidoGeneral1").html('');
			$("#subtituloGeneral1").html('');
			if(resp.info.STOCK_OK==0){
				mensajeSistema('¡No existe el stock suficiente para este producto!');
			}else{				
				if(resp.resultado){
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .cantidad").text(resp.info.CANTIDAD);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .comentario").text((resp.info.OBSERVACION===null)?'':resp.info.OBSERVACION);					
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

function pedidoEliminaDetalle(objeto){
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
				$("#"+objeto.tabla+"Info .totalPedido").text(parseFloat(total).toFixed(2));
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

function pedidoElimina(objeto){
	confirm("¡Eliminará toda la pedido!",function(){
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
				vistaPedido();
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

