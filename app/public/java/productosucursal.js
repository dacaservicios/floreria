//FUNCIONES
$(document).ready(function() {
	try {
		vistaProductoSucursal();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaProductoSucursal(){
	bloquea();
	let tabla="productosucursal";
	const lista= await axios.get('/api/'+tabla+'/listar/0/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});

	const producto =  await axios.get("/api/producto/listar/0/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});

	const proveedor =  await axios.get("/api/proveedor/listar/0/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});

	desbloquea();
	const resp=lista.data.valor.info;
	const resp2=producto.data.valor.info;
	const resp3=proveedor.data.valor.info;

	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-shopping-cart"></i> STOCK INICIAL</div>
						<div class="row pt-3">
							<div class="form-group col-md-6">
								<label>Producto (*)</label>
								<select name="producto" class="form-control select2 muestraMensaje">
									<option value="">Select...</option>`;
									for(var i=0;i<resp2.length;i++){
										if(resp2[i].ES_VIGENTE==1){
									listado+=`<option value="${resp2[i].ID_PRODUCTO}">${resp2[i].CODIGO_PRODUCTO+" - "+resp2[i].NOMBRE}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-6">
								<label>Proveedor (*)</label>
								<select name="proveedor" class="form-control select2">
									<option value="">Select...</option>`;
									for(var i=0;i<resp3.length;i++){
										if(resp2[i].ES_VIGENTE==1){
									listado+=`<option value="${resp3[i].ID_PROVEEDOR}">${resp3[i].RAZON_PROVEEDOR+" - "+resp3[i].RUC}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-4">
								<label>Stock inicial (*)</label>
								<input name="stock" autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Ingrese el stock">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-4">
								<label>P. Compra (*)</label>
								<input name="precioCompra" autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Ingrese el p. compra">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-4">
								<label>P. Venta (*)</label>
								<input name="precioVenta" autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Ingrese el p. venta">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="pt-3 col-md-12 pl-0 pr-0 text-center">
							${limpia()+guarda()}
						</div>
						<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
					</form>
					<hr class="border border-primary">
					<div class="table-responsive">
						<table id="${tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
							<thead>
								<tr>
									<th style="width: 10%;">Código</th>
									<th style="width: 30%;">Nombre</th>
									<th style="width: 10%;">Stock Ini.</th>
									<th style="width: 10%;">Stock</th>
									<th style="width: 15%;">P. Compra</th>
									<th style="width: 15%;">P. Venta</th>
									<th style="width: 10%;" class="nosort nosearch">Acciones</th>
								</tr>
							</thead>
							<tbody>`;
							let mestado;
							for(let i=0;i<resp.length;i++){
								if(resp[i].ES_VIGENTE==1){
									mestado='';
								}else{
									mestado='tachado';
								}
					listado+=`<tr id="${resp[i].ID_PRODUCTO_SUCURSAL}" >
									<td>
										<div class="estadoTachado codigo ${mestado}">${ resp[i].CODIGO_PRODUCTO }</div>
									</td>
									<td>
										<div class="estadoTachado nombre muestraMensaje ${mestado}">${resp[i].NOMBRE}</div>
										<div class="estadoTachado proveedor ${mestado}"><span class="badge bg-primary">${resp[i].RAZON_PROVEEDOR+" - "+resp[i].RUC}</span></div>
									</td>
									<td>
										<div class="estadoTachado stockInicial ${mestado}">${ resp[i].STOCK_INICIAL }</div>
									</td>
									<td>
										<div class="estadoTachado stock ${mestado}">${ resp[i].STOCK }</div>
									</td>
									<td>
										<div class="estadoTachado precioCompra ${mestado}">${parseFloat(resp[i].PRECIO_COMPRA).toFixed(2)}</div>
									</td>
									<td>
										<div class="estadoTachado precioVenta ${mestado}">${parseFloat(resp[i].PRECIO_VENTA).toFixed(2)}</div>
									</td>
									<td>
										${estado()/*+modifica()+elimina()*/}
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
		width: '100%'
	});
	$("#"+tabla+" span#botonGuardar").text('Crear');
	$('#'+tabla+'Tabla').DataTable(valoresTabla);
	let objeto={
		producto:$('#'+tabla+' select[name=producto]'),
		proveedor:$('#'+tabla+' select[name=proveedor]'),
		stock:$('#'+tabla+' input[name=stock]'),
		stockInicial:$('#'+tabla+' input[name=stockInicial]'),
		precioCompra:$('#'+tabla+' input[name=precioCompra]'),
		precioVenta:$('#'+tabla+' input[name=precioVenta]'),
		tabla:tabla,
	}
	eventosProductoSucursal(objeto);
}

function eventosProductoSucursal(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='precioCompra' || name=='precioVenta' || name=='stock' || name=='stockInicial'){
			validaVacio(elemento);
			decimalRegex(elemento);
		}
	});

	$('#'+objeto.tabla+' div').off( 'change');
    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioProductoSucursal(objeto)
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		limpiaTodo(objeto.tabla);
	});

	$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.edita',function(){//edita
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		objeto.id=id;
		objeto.nombreEdit=nombre;
		productoSucursalEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		productoSucursalEstado({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		productoSucursalElimina({id:id,nombre:nombre,tabla:objeto.tabla});
	});
}

async function productoSucursalEdita(objeto){
	$("#"+objeto.tabla+" span.muestraId").text(objeto.id);
	$("#"+objeto.tabla+" span.muestraNombre").text(objeto.nombreEdit);
	$("#"+objeto.tabla+" span#botonGuardar").text('Modificar');
	quitaValidacionTodo(objeto.tabla)
	bloquea();
	const busca= await axios.get('/api/'+objeto.tabla+'/buscar/'+objeto.id+'/'+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		}
	});
	desbloquea();
	const resp=busca.data.valor.info;
	objeto.stockInicial.val(resp.STOCK_INICIAL);
	objeto.stock.val(resp.STOCK);
	objeto.precioCompra.val(parseFloat(resp.PRECIO_COMPRA).toFixed(2));
	objeto.precioVenta.val(parseFloat(resp.PRECIO_VENTA).toFixed(2));
	objeto.producto.val(resp.ID_PRODUCTO).trigger('change.select2');
	objeto.proveedor.val(resp.ID_PROVEEDOR).trigger('change.select2');
}

function validaFormularioProductoSucursal(objeto){	
	validaVacio(objeto.precioCompra);
	validaVacio(objeto.precioVenta);
	validaVacio(objeto.stockInicial);
	validaVacio(objeto.stock);
	validaVacioSelect(objeto.producto);
	validaVacioSelect(objeto.proveedor);

	if(objeto.precioCompra.val()=="" || objeto.precioVenta.val()=="" || objeto.stockInicial.val()=="" ||  objeto.stock.val()=="" || objeto.producto.val()=="" || objeto.proveedor.val()==""){
		return false;
	}else{
		enviaFormularioProductoSucursal(objeto);
	}
}

function enviaFormularioProductoSucursal(objeto){
	let dato=(objeto.id==0)?muestraMensaje({tabla:objeto.tabla}):objeto.nombreMsg;
	let verbo=(objeto.id==0)?'Creará':'Modificará';

	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	
	confirm("¡"+verbo+" el registro: "+dato+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body=fd;
		try {
			let creaEdita;
			if(objeto.id==0){
				creaEdita = await axios.post("/api/"+objeto.tabla+"/crear",body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
			}else{
				creaEdita = await axios.put("/api/"+objeto.tabla+"/editar/"+objeto.id,body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
			}
			desbloquea();
			resp=creaEdita.data.valor;
			if(resp.resultado){
				if(objeto.id>0){
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .producto").text(resp.info.NOMBRE_PRODUCTO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .proveedor").html(`<span class="badge bg-primary">${resp.info.RAZON_PROVEEDOR+" - "+resp.info.RUC}</span>`);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .stock").text(resp.info.STOCK);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .precioCompra").text(parseFloat(resp.info.PRECIO_COMPRA).toFixed(2));
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .precioVenta").text(parseFloat(resp.info.PRECIO_VENTA).toFixed(2));
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
					
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						`<div class="estadoTachado codigo">${resp.info.CODIGO_PRODUCTO}</div>`,
						`<div class="estadoTachado producto muestraMensaje">${resp.info.NOMBRE_PRODUCTO}</div>
						<div class="estadoTachado proveedor"><span class="badge bg-primary">${resp.info.RAZON_PROVEEDOR+" - "+resp.info.RUC}</span>`,
						`<div class="estadoTachado stockInicial">${resp.info.STOCK}</div>`,
						`<div class="estadoTachado stock">${resp.info.STOCK}</div>`,
						`<div class="estadoTachado precioCompra">${parseFloat(resp.info.PRECIO_COMPRA).toFixed(2)}</div>`,
						`<div class="estadoTachado precioVenta">${parseFloat(resp.info.PRECIO_VENTA).toFixed(2)}</div>`,
						estado()/*+modifica()+elimina()*/
					] ).draw( false ).node();
					$( rowNode ).attr('id',resp.info.ID_PRODUCTO_SUCURSAL);
					
					//success("Creado","¡Se ha creado el registro: "+dato+"!");
				}
				limpiaTodo(objeto.tabla);
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

function productoSucursalElimina(objeto){
	confirm("¡Eliminará el registro: "+objeto.nombre+"!",function(){
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
				let  elimina=$('#'+objeto.tabla+'Tabla').DataTable();
				$('#'+objeto.tabla+'Tabla #'+objeto.id).closest('tr');
				elimina.row($('#'+objeto.tabla+'Tabla #'+objeto.id)).remove().draw(false); 
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

function productoSucursalEstado(objeto){
	confirm("¡Cambiará el estado del registro: "+objeto.nombre+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body={
		}
		try {
			const estado = await axios.put("/api/"+objeto.tabla+"/estado/"+objeto.id,body,{ 
				headers:{authorization: `Bearer ${verToken()}`} 
			});
			desbloquea();
			resp=estado.data.valor;
			if(resp.resultado){
				let estado=(resp.info.ESTADO==0)?'tachado':'';

				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadoTachado").removeClass('tachado');

				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadoTachado").addClass(estado);

				//success("Estado","¡Se ha cambiado el estado del registro: "+objeto.nombre+"!");
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