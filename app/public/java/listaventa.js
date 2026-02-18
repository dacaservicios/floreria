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

	let ventas= await axios.get('/api/'+tabla+'/inicio/listar/'+verSesion()+"/reporteVentasPorFecha",{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		}
	});

	let resp2=ventas.data.valor.info;
	desbloquea();

	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12 p-0">
			<div class="card">
				<div class="card-body pt-1 px-3">
					<div id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
					    <div class="card-header tx-medium bd-0 tx-white bg-primary-gradient py-1"><i class="las la-shopping-cart"></i> LISTA DE VENTAS</div>
					</div>		
                        <div class="row pt-3">
                            <div class="col-12">
                                <div class="card-content collapse show">
                                    <div class="card-body card-dashboard">
                                        <div class="table-responsive">
                                            <table id="${tabla}Tabla" class="pt-3 table table-striped text-center">
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
                                                            <div class="fechaVenta">${ moment.parseZone(resp2[i].FECHA_VENTA).format('DD/MM/YYYY  HH:mm:ss') }</div>
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
		`;
		
	$("#cuerpoPrincipal").html(listado);
	tooltip();

	$('#'+tabla+'Tabla').DataTable(valoresTabla);

	$('[data-toggle="tooltip"]').tooltip();

	let objeto={
		tabla:tabla,
		sesId:verSesion()
	}

	eventosVenta(objeto);
}

function eventosVenta(objeto){
	$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		focusBarra(objeto.barra);
		ventaEliminaDetalle({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.detalle',function(){//detalle
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

