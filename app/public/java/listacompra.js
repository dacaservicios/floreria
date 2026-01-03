//FUNCIONES
$(document).ready(function() {
	try {
		vistaListacompra();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaListacompra(){
	bloquea();
	let tabla="compra";

	compras= await axios.get('/api/'+tabla+'/inicio/listar/'+verSesion()+"/reporteComprasPorFecha",{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});

	desbloquea();
	const resp3=compras.data.valor.info;

	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<div id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient py-1"><i class="las la-shopping-cart"></i> LISTA DE COMPRAS</div>
					</div>
                    <div class="row">
                        <div class="col-12">
                            <div class="card-content collapse show">
                                <div class="card-body card-dashboard">
                                    <div class="table-responsive">
                                        <table id="${tabla}Tabla" class="table table-striped text-center">
                                            <thead>
                                                <tr>
                                                    <th>Tipo documento</th>
                                                    <th>Fecha compra</th>
                                                    <th>Proveedor</th>
                                                    <th>Total</th>
                                                    <th>Usuario</th>
                                                    <th>Estado</th>
                                                    <th class="nosort nosearch">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>`;
                                                for(var i=0;i<resp3.length;i++){
                                    listado+=`<tr id="${ resp3[i].ID_COMPRA }">
                                                    <td>
                                                        <div class="tipoDocumento">${ resp3[i].TIPO_DOCUMENTO}</div>
                                                        <div class="serie"><span class="badge bg-primary">${ resp3[i].SERIE+" - "+resp3[i].NUMERO_DOCUMENTO }</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="fechaCompra">${ moment(resp3[i].FECHA_COMPRA).format('DD/MM/YYYY') }</div>
                                                    </td>
                                                    <td>
                                                        <div class="proveedor">${ resp3[i].RAZON}</div>
                                                        <div class="comentario badge bg-secondary">${ resp3[i].COMENTARIO }</div>
                                                    </td>
                                                    <td>
                                                        <div class="total">${ parseFloat(resp3[i].TOTAL).toFixed(2) }</div>
                                                    </td>
                                                    <td>
                                                        <div class="usuario">${ resp3[i].USUARIO}</div>
                                                    </td>
                                                    <td>
                                                        <div class="estado"><span class="badge bg-${resp3[i].COLOR}">${ resp3[i].DESCRIPCION}</span></div>
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
		tabla:tabla,
		idCompra:$('#'+tabla+' span.muestraId').text()
	}
	
	eventosProductosucursal(objeto);
}

function eventosProductosucursal(objeto){
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		productosucursalEstado({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		productosucursalElimina({id:id,nombre:nombre,tabla:objeto.tabla});
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
		compraDetalle(objeto2);
	});
}

async function compraDetalle(objeto){
	bloquea();
	try {
		lista= await axios.get('/api/compra/detalle/listar/'+objeto.id+'/'+verSesion(),{
			headers: 
			{ 
				authorization: `Bearer ${verToken()}`
			} 
		});
		lista2= await axios.get('/api/compra/buscar/totales/'+objeto.id+'/'+verSesion(),{
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
								<table id='detalleTablaCompra' class="pt-3 table table-striped text-center">
									<thead>
										<tr>
											<th>Código</th>
											<th>Producto</th>
											<th>P. Compra</th>
											<th>Cantidad</th>
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
												<div class="precio">${ parseFloat(resp[i].PRECIO_COMPRA).toFixed(2) }</div>
											</td>
											<td>
												<div class="cantidad">${ parseFloat(resp[i].CANTIDAD).toFixed(2) }</div>
											</td>
											<td>
												<div class="total">${ parseFloat(resp[i].MONTO_TOTAL).toFixed(2) }</div>
											</td>
										</tr>`;
										}
						listado+=`
										<tr>
											<td colspan='3'></td>
											<td><strong>DESCUENTO</strong></td>
											<td>
												<div class="descuento">${parseFloat(resp2.DESCUENTO).toFixed(2)}</div>
											</td>
										</tr>
										<tr>
											<td colspan='3'></td>
											<td><strong>SUBTOTAL</strong></td>
											<td>
												<div class="subtotal">${parseFloat(resp2.SUBTOTAL).toFixed(2)}</div>
											</td>
										</tr>
										<tr>
											<td colspan='3'></td>
											<td><strong>IGV ${resp2.IGV*100+'%'}</strong></td>
											<td>
												<div class="igv">${parseFloat(resp2.IMPUESTO).toFixed(2)}</div>
											</td>
										</tr>
										<tr>
											<td colspan='3'></td>
											<td><strong>TOTAL</strong></td>
											<td>
												<div class="total">${parseFloat(resp2.TOTAL).toFixed(2)}</div>
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
		mostrar_general1({titulo:'DETALLE DE COMPRA',nombre:objeto.nombreEdit,msg:listado,ancho:600});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}