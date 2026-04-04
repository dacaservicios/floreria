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

	desbloquea();
	const resp=lista.data.valor.info;
	const resp2=producto.data.valor.info;

	const idsEnSucursal = resp.map(producto => producto.ID_PRODUCTO);
	const setIdsExcluidos = new Set(idsEnSucursal);
	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient py-1"><i class="las la-shopping-cart"></i> PRODUCTO x TIENDA</div>	
						<form id="${tabla}" class="needs-validation" novalidate>
							<span class='oculto muestraId'>0</span>
							<span class='oculto muestraNombre'></span>
							<div class="row pt-3">
								<div class="form-group col-md-12">
									<label>Producto (*)</label>
									<span id="idElementoEditar" class="oculto"></span>
									<select name="producto" class="form-control select2 muestraMensaje" id="elementoSeleccionado">
										<option value="">Select...</option>`;
										for(var i=0;i<resp2.length;i++){
											if(resp2[i].ES_VIGENTE==1 && !setIdsExcluidos.has(resp2[i].ID_PRODUCTO)){
                                                let compuesto = (resp2[i].ES_COMPUESTO==1) ? '(Compuesto)' : '';
										listado+=`<option value="${resp2[i].ID_PRODUCTO}">${resp2[i].CODIGO_PRODUCTO+" - "+resp2[i].NOMBRE+" "+compuesto}</option>`;
											}
										}
							listado+=`</select>
									<div class="vacio oculto">¡Campo obligatorio!</div>
								</div>
							</div>
							<div class="row">
								<div class="form-group col-md-4">
									<label>Stock mínimo (*)</label>
									<input name="stockMin" autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Ingrese el stock">
									<div class="vacio oculto">¡Campo obligatorio!</div>
								</div>
								<div class="form-group col-md-4">
									<label>P. Venta (*)</label>
									<input name="precioVenta" autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Ingrese el p. venta">
									<div class="vacio oculto">¡Campo obligatorio!</div>
								</div>
								<div class="form-group col-md-4">
									<label>Descuento</label>
									<input name="descuento" autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Ingrese el dscuento">
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
										<th style="width: 45%;">Nombre</th>
										<th style="width: 10%;">Stock min.</th>
										<th style="width: 10%;">Stock actual</th>
										<th style="width: 15%;">P. Venta</th>
										<th style="width: 15%;">Descuento</th>
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
                                            <div><span class="compuesto badge bg-primary">${(resp[i].ES_COMPUESTO==1)?'Compuesto':''}</span></div>
										</td>
										<td>
											<div class="estadoTachado stockMin ${mestado}">${ resp[i].STOCK_MINIMO }</div>
										</td>
										<td>
											<div class="estadoTachado stock ${mestado}">${ resp[i].STOCK_ACTUAL }</div>
										</td>
										<td>
											<div class="estadoTachado precioVenta ${mestado}">${parseFloat(resp[i].PRECIO_VENTA).toFixed(2)}</div>
										</td>
										<td>
											<div class="estadoTachado descuento ${mestado}">${parseFloat(resp[i].DESCUENTO).toFixed(2)}</div>
										</td>
										<td>
											${estado()+modifica()}
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
		stockMin:$('#'+tabla+' input[name=stockMin]'),
		precioVenta:$('#'+tabla+' input[name=precioVenta]'),
		descuento:$('#'+tabla+' input[name=descuento]'),
		tabla:tabla,
	}
	eventosProductoSucursal(objeto);
}

function eventosProductoSucursal(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='precioVenta'){
			validaVacio(elemento);
			decimalRegex(elemento);
		}else if(name=='stockMin'){
			numeroRegex(elemento);
			validaVacio(elemento);
		}else if(name=='descuento'){
			decimalRegex(elemento);
		}
	});

	$('#'+objeto.tabla+' div').off( 'change');
    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
        quitaValidacion(objeto.stockMin);
		validaVacioSelect(elemento);
        if(name=='producto'){
            let texto = elemento.find("option:selected").text();
            if (texto.includes("Compuesto")) {
                objeto.stockMin.val(0).prop("readonly", true);
                validaVacio(objeto.stockMin);
            }else{
                objeto.stockMin.val('').prop("readonly", false);
            }
        }
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioProductoSucursal(objeto)
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		let idProducto=$('#idElementoEditar').text();
		quitaElemento({id:idProducto, tabla:objeto.tabla});
		quitaValidacionTodo(objeto.tabla);
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
	let idProducto=$('#idElementoEditar').text();
	quitaElemento({id:idProducto, tabla:objeto.tabla});

	$("#"+objeto.tabla+" span.muestraId").text(objeto.id);
	$("#"+objeto.tabla+" span.muestraNombre").text(objeto.nombreEdit);
	$("#"+objeto.tabla+" span#botonGuardar").text('Modificar');
	
	bloquea();
	const busca= await axios.get('/api/'+objeto.tabla+'/buscar/'+objeto.id+'/'+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		}
	});
	desbloquea();
	const resp=busca.data.valor.info;
	objeto.precioVenta.val(parseFloat(resp.PRECIO_VENTA).toFixed(2));
	objeto.descuento.val(parseFloat(resp.DESCUENTO).toFixed(2));

	if ($('#elementoSeleccionado').find('option[value="' + resp.ID_PRODUCTO + '"]').length === 0) {
		$('#idElementoEditar').text(resp.ID_PRODUCTO);
        let nuevaOpcion = new Option(resp.CODIGO_PRODUCTO+" - "+resp.NOMBRE, resp.ID_PRODUCTO, false, false);
        $('#elementoSeleccionado').append(nuevaOpcion).trigger('change');
		$('#elementoSeleccionado').val(resp.ID_PRODUCTO).trigger('change.select2');
		$('#elementoSeleccionado').on('select2:opening', function(e) {
			e.preventDefault();
		});
    }
    if(resp.ES_COMPUESTO==1){
        objeto.stockMin.val(0).prop("readonly", true);
    }else{
	    objeto.stockMin.val(resp.STOCK_MINIMO);
    }
	quitaValidacionTodo(objeto.tabla)
	
}

function validaFormularioProductoSucursal(objeto){	
	validaVacio(objeto.precioVenta);
	validaVacio(objeto.stockMin);
	validaVacioSelect(objeto.producto);

	if(objeto.precioVenta.val()=="" ||  objeto.stockMin.val()=="" || objeto.producto.val()==""){
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
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .stockMin").text(resp.info.STOCK_MINIMO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .precioVenta").text(parseFloat(resp.info.PRECIO_VENTA).toFixed(2));
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .descuento").text(parseFloat(resp.info.DESCUENTO).toFixed(2));
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
					
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						`<div class="estadoTachado codigo">${resp.info.CODIGO_PRODUCTO}</div>`,
						`<div class="estadoTachado producto muestraMensaje">${resp.info.NOMBRE_PRODUCTO}</div><div><span class="compuesto badge bg-primary">${(resp.info.ES_COMPUESTO==1)?'Compuesto':''}</span></div>`,
						`<div class="estadoTachado stockMin">${resp.info.STOCK_MINIMO}</div>`,
						`<div class="estadoTachado stock">0</div>`,
						`<div class="estadoTachado precioVenta">${parseFloat(resp.info.PRECIO_VENTA).toFixed(2)}</div>`,
						`<div class="estadoTachado descuento">${parseFloat(resp.info.DESCUENTO).toFixed(2)}</div>`,
						estado()+modifica()
					] ).draw( false ).node();
					$( rowNode ).attr('id',resp.info.ID_PRODUCTO_SUCURSAL);
				
					//success("Creado","¡Se ha creado el registro: "+dato+"!");
				}
				
				quitaElemento({id:resp.info.ID_PRODUCTO, tabla:objeto.tabla})
				quitaValidacionTodo(objeto.tabla);
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