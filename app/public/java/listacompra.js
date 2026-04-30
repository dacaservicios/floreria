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
													let estados;
													if(resp3[i].ABREVIATURA=='POIG' && verNivel()==14){
														estados=recibido()+rechazado();
													}else if(resp3[i].ABREVIATURA=='RCHA' && (verNivel()==14 || verNivel()==15)){
														estados='';
													}else if(resp3[i].ABREVIATURA=='RECB' && verNivel()==14){
														estados=ingresado();
													}else{
														estados='';
													}

                                    listado+=`<tr id="${ resp3[i].ID_COMPRA }">
                                                    <td>
                                                        <div class="tipoDocumento">${ resp3[i].TIPO_DOCUMENTO}</div>
                                                        <div class="serie cursor"><span class="badge bg-primary">${ resp3[i].SERIE+" - "+resp3[i].NUMERO_DOCUMENTO }</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="fechaCompra">${ moment(resp3[i].FECHA_COMPRA).format('DD/MM/YYYY  HH:mm:ss') }</div>
                                                    </td>
                                                    <td>
                                                        <div class="proveedor">${ resp3[i].RAZON}</div>
                                                    </td>
                                                    <td>
                                                        <div class="total">${ parseFloat(resp3[i].TOTAL).toFixed(2) }</div>
                                                    </td>
                                                    <td>
                                                        <div class="usuario">${ resp3[i].USUARIO}</div>
														<div class="abreviatura oculto">${ resp3[i].ABREVIATURA}</div>
                                                    </td>
                                                    <td>
                                                        <div class="estado"><span class="badge bg-${resp3[i].COLOR}">${ resp3[i].DESCRIPCION}</span></div>
                                                    </td>
                                                    <td>
                                                        ${historial()+"<span class='estadosMov'>"+estados+"</span>"}
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

	$('#'+tabla+'Tabla').DataTable(valoresTabla);

	tooltip();
	$('[data-toggle="tooltip"]').tooltip();

	let objeto={
		tabla:tabla,
		idCompra:$('#'+tabla+' span.muestraId').text()
	}
	
	eventosListaCompra(objeto);
}

function eventosListaCompra(objeto){
	$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.verbo',function(){//recibido/rechazado/atencion/enviado
		let evento=$(this).parents("tr");
		objeto.verbo=$(this).attr('verbo');
		objeto.abrevBoton=$(this).attr('abrev');
    	objeto.id=evento.attr('id');
		objeto.nombre=evento.find("td div.tipoDocumento").text()+": "+evento.find("td div.serie").text();
		objeto.sesId=verSesion();
		objeto.comentario='';
		if(objeto.abrevBoton=='RCHA'){
			modalCompraRechazado(objeto);
		}else if(objeto.abrevBoton=='IGSD'){
			modalCompraIngresado(objeto);
		}else{
			enviaCompraEstado(objeto);
		}
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td .serie',function(){//detalle
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

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.historial',function(){//historial
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
		compraHistorial(objeto2);
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


async function compraHistorial(objeto){
	bloquea();
	try {
		lista= await axios.get('/api/compra/historial/listar/'+objeto.id+'/'+verSesion(),{
			headers: 
			{ 
				authorization: `Bearer ${verToken()}`
			} 
		});
		
		resp=lista.data.valor.info;
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
											<th>Documento</th>
											<th>Serie-Numero</th>
											<th>Fecha</th>
											<th>Comentario</th>
											<th>Estado</th>
										</tr>
									</thead>
									<tbody>`;
										for(var i=0;i<resp.length;i++){
								listado+=`<tr id="${ resp[i].ID_HISTORIAL_COMPRA }">
											<td>
												<div class="documento">${ resp[i].DOCUMENTO}</div>
											</td>
											<td>
												<div class="serieNumero">${ resp[i].SERIE_DOCUMENTO+" - "+resp[i].NRO_DOCUMENTO }</div>
											</td>
											<td>
												<div class="fecha">${ moment(resp[i].FECHA_ESTADO).format('DD/MM/YYYY HH:mm:ss') }</div>
											</td>
											<td>
												<div class="comentario">${ resp[i].COMENTARIO }</div>
											</td>
											<td>
												<div class="estado">${ resp[i].ESTADO }</div>
											</td>
										</tr>`;
										}
						listado+=`
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>`;
		mostrar_general1({titulo:'HISTORIAL DE COMPRA',nombre:objeto.nombreEdit,msg:listado,ancho:600});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function modalCompraRechazado(objeto){
	let listado=`
	<form id="${objeto.tabla}Rechazado">
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
	mostrar_general1({titulo:'RECHAZADO',nombre:objeto.nombreMsg,msg:listado,ancho:400});

	eventosCompraRechazado(objeto);
}

async function modalCompraIngresado(objeto){
	const comprobante =  await axios.get("/api/comprobante/listar/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
	const resp4=comprobante.data.valor.info;
	let listado=`
	<form id="${objeto.tabla}Ingresado">
		<div class="row">
			<div class="form-group col-md-12">
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
		</div>
		<div class="row">
			<div class="form-group col-md-6">
				<label>Serie (*)</label>
				<input name="serie" maxlength="10" autocomplete="off" type="text" class="form-control" placeholder="Ingrese la serie">
				<div class="vacio oculto">¡Campo obligatorio!</div>
			</div>
			<div class="form-group col-md-6">
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
	mostrar_general1({titulo:'INGRESADO',nombre:objeto.nombreMsg,msg:listado,ancho:400});

	$(".select2").select2({
		placeholder:'Select...',
		dropdownAutoWidth: true,
		width: '100%'
	});

	eventosCompraIngresado(objeto);
}

function eventosCompraIngresado(objeto){
$('#'+objeto.tabla+'Ingresado div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','textarea',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" textarea[name="+name+"]");
		validaVacio(elemento);
	});

	$('#'+objeto.tabla+'Ingresado div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		validaVacio(elemento);
		if(name=='serie'){
			comprobanteRegex(elemento);
		}else if(name='numero'){
			numeroRegex(elemento);
		}
	});

	$('#'+objeto.tabla+'Ingresado div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
	});

	$('#'+objeto.tabla+'Ingresado div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.comprobante=$('#'+objeto.tabla+'Ingresado select[name=comprobante]');
		objeto.serie=$('#'+objeto.tabla+'Ingresado input[name=serie]');
		objeto.numero=$('#'+objeto.tabla+'Ingresado input[name=numero]');
		objeto.comentario=$('#'+objeto.tabla+'Ingresado textarea[name=comentario]');
		validaCompraIngresado(objeto)
	});
}

function eventosCompraRechazado(objeto){
$('#'+objeto.tabla+'Rechazado div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','textarea',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" textarea[name="+name+"]");
		validaVacio(elemento);
	});

	$('#'+objeto.tabla+'Rechazado div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.comentario= $("#"+objeto.tabla+"Rechazado textarea[name=comentario]");
		validaCompraRechazado(objeto)
	});
}

function validaCompraIngresado(objeto){
	validaVacioSelect(objeto.comprobante);
	validaVacio(objeto.serie);
	validaVacio(objeto.numero);

	if(objeto.comprobante.val()=="" || objeto.serie.val()=="" || objeto.numero.val()==""){
		return false;
	}else{
		enviaCompraEstado(objeto);
	}
}

function validaCompraRechazado(objeto){	
	validaVacio(objeto.comentario);

	if(objeto.comentario.val()==""){
		return false;
	}else{
		enviaCompraEstado(objeto);
	}
}

function enviaCompraEstado(objeto){
	$("#general1").modal("hide");
	$("#contenidoGeneral1").html('');
	$("#subtituloGeneral1").html('');
	confirm("Va a "+objeto.verbo+": "+objeto.nombre+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body;

		try {
			if(objeto.abrevBoton=='IGSD'){
				body={
					id:objeto.id,
					idDetalle:objeto.comprobante.val(),
					dato1:0,
					dato2:objeto.serie.val(),
					dato3:objeto.numero.val(),
					dato4:objeto.comentario.val(),
					dato5:objeto.abrevBoton,
					tabla:objeto.tabla,
					sesId:verSesion()
				}
			}else{
				body={
					id:objeto.id,
					idDetalle:0,
					dato1:0,
					dato2:0,
					dato3:0,
					dato4:(objeto.abrevBoton=='RECB')?'':objeto.comentario.val(),
					dato5:objeto.abrevBoton,
					tabla:objeto.tabla,
					sesId:verSesion()
				}
			}
			const estado = await axios.put("/api/"+objeto.tabla+"/estado2/"+objeto.id,body,{ 
					headers:{authorization: `Bearer ${verToken()}`} 
				});

			desbloquea();
			resp=estado.data.valor;
			if(resp.info.EXISTE_SERIE==0){
				mensajeSistema('¡No se ha registrado el documento (comprobante) para realizar esta transacción!');
			}else{
				if(resp.resultado){
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estado").html(`<span class="badge bg-${resp.info.COLOR}">${resp.info.DESCRIPCION}</span>`);
					if(objeto.abrevBoton=='RECB' && verNivel()==14){
						$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadosMov").html(ingresado());
					}else if(objeto.abrevBoton=='RCHA' && (verNivel()==14 || verNivel()==15)){
						$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadosMov").html('');
						$("#"+objeto.tabla+"Tabla #"+objeto.id+" .comentario").text(resp.info.COMENTARIO);
					}else if(objeto.abrevBoton=='IGSD' && verNivel()==14){
						$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadosMov").html('');
					}else{
						$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadosMov").html('');
					}
					tooltip();
					$('[data-toggle="tooltip"]').tooltip();
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