//FUNCIONES
$(document).ready(function() {
	try {
		vistaListadelivery();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaListadelivery(){
	bloquea();
	let tabla="delivery";

	delivery= await axios.get('/api/'+tabla+'/inicio/listar/'+verSesion()+"/reporteDeliverysPorFecha",{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});

	desbloquea();
	const resp3=delivery.data.valor.info;
	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<div id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient py-1"><i class="las la-shopping-cart"></i> LISTA DE DELIVERYS</div>
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
                                                    <th>Fecha delivery</th>
                                                    <th>Usuario</th>
                                                    <th>Estado</th>
                                                    <th class="nosort nosearch">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>`;
                                                for(var i=0;i<resp3.length;i++){
													let estados;
													if(resp3[i].ABREVIATURA=='SOLI' && verNivel()==14){
														estados=recibido()+rechazado();
													}else if(resp3[i].ABREVIATURA=='RCHA' ||resp3[i].ABREVIATURA=='DETO'){
														estados='';
													}else if(resp3[i].ABREVIATURA=='RECB' && verNivel()==14){
														estados=atendido();
													}else if(resp3[i].ABREVIATURA=='ENAT' && verNivel()==14){
														estados=enviado();
													}else if(resp3[i].ABREVIATURA=='EVIA' && verNivel()==15){
														estados=entregado()+devuelto();
													}else{
														estados='';
													}
                                    listado+=`<tr id="${ resp3[i].ID_DELIVERY }">
                                                    <td>
                                                        <div class="tipoDocumento">${ resp3[i].TIPO_DOCUMENTO}</div>
                                                        <div class="serie cursor"><span class="badge bg-primary">${ resp3[i].SERIE+" - "+resp3[i].NUMERO_DOCUMENTO }</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="fechaDelivery">${ moment(resp3[i].FECHA_DELIVERY).format('DD/MM/YYYY  HH:mm:ss') }</div>
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
		tabla:tabla
	}
	
	eventosListaDelivery(objeto);
}

function eventosListaDelivery(objeto){
	$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.verbo',function(){//recibido/rechazado/atencion/enviado
		let evento=$(this).parents("tr");
		objeto.verbo=$(this).attr('verbo');
		objeto.abrevBoton=$(this).attr('abrev');
    	objeto.id=evento.attr('id');
		objeto.nombre=evento.find("td div.tipoDocumento").text()+": "+evento.find("td div.serie").text();
		objeto.sesId=verSesion();
		objeto.comentario='';
		if(objeto.abrevBoton=='RCHA' || objeto.abrevBoton=='DETO'){
			modalDeliveryRechazado(objeto);
		}else{
			enviaDeliveryEstado(objeto);
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
		deliveryDetalle(objeto2);
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
		deliveryHistorial(objeto2);
	});

}

async function deliveryDetalle(objeto){
	bloquea();
	try {
		lista= await axios.get('/api/'+objeto.tabla+'/detalle/listar/'+objeto.id+'/'+verSesion(),{
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
								<table id='${objeto.tabla}DetalleTabla' class="pt-3 table table-striped text-center">
									<thead>
										<tr>
											<th>Código</th>
											<th>Producto</th>
											<th>Cantidad</th>
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
		mostrar_general1({titulo:'DETALLE DE DELIVERY',nombre:objeto.nombreEdit,msg:listado,ancho:500});

	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function deliveryHistorial(objeto){
	bloquea();
	try {
		lista= await axios.get('/api/delivery/historial/listar/'+objeto.id+'/'+verSesion(),{
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
								listado+=`<tr id="${ resp[i].ID_HISTORIAL_DELIVERY }">
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
		mostrar_general1({titulo:'HISTORIAL DE DELIVERY',nombre:objeto.nombreEdit,msg:listado,ancho:600});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function modalDeliveryRechazado(objeto){
	let tituloTipo=(objeto.abrevBoton=='RCHA')?'RECHAZADO':'DEVUELTO';
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
	mostrar_general1({titulo:tituloTipo,nombre:objeto.nombreMsg,msg:listado,ancho:400});

	eventosDeliveryRechazado(objeto);
}

function eventosDeliveryRechazado(objeto){
$('#'+objeto.tabla+'Rechazado div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','textarea',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" textarea[name="+name+"]");
		validaVacio(elemento);
	});

	$('#'+objeto.tabla+'Rechazado div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.comentario= $("#"+objeto.tabla+"Rechazado textarea[name=comentario]");
		validaDeliveryRechazado(objeto)
	});
}

function validaDeliveryRechazado(objeto){	
	validaVacio(objeto.comentario);

	if(objeto.comentario.val()==""){
		return false;
	}else{
		enviaDeliveryEstado(objeto);
	}
}

function enviaDeliveryEstado(objeto){
	$("#general1").modal("hide");
	$("#contenidoGeneral1").html('');
	$("#subtituloGeneral1").html('');
	confirm("Va a "+objeto.verbo+": "+objeto.nombre+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body=objeto

		try {
			body={
				id:objeto.id,
				idDetalle:0,
				dato1:0,
				dato2:0,
				dato3:0,
				dato4:(objeto.abrevBoton=='RCHA' || objeto.abrevBoton=='DETO')?objeto.comentario.val():'',
				dato5:objeto.abrevBoton,
				tabla:objeto.tabla,
				sesId:verSesion()
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
						$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadosMov").html(atendido());
					}else if(objeto.abrevBoton=='RCHA' || objeto.abrevBoton=='DETO'){
						$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadosMov").html('');
						$("#"+objeto.tabla+"Tabla #"+objeto.id+" .comentario").text(resp.info.COMENTARIO);
					}else if(objeto.abrevBoton=='ENAT' && verNivel()==14){
						$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadosMov").html(enviado());
					}else if(objeto.abrevBoton=='EVIA' && verNivel()==14){
						$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadosMov").html('');
					}else{
						$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadosMov").html('');
					}

					tooltip();
					$('[data-toggle="tooltip"]').tooltip();
					//success("Estado","¡Se ha cambiado el estado del registro: "+objeto.nombre+"!");
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