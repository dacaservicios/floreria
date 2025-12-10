//FUNCIONES

$(document).ready(async function() {
	bloquea();
	let tabla="pedido";
	try {
		const boton= await axios.get('/api/acceso/privilegio/56/'+verSesion(),{
			headers: 
			{ 
				authorization: `Bearer ${verToken()}`
			} 
		});
		const lista =  await axios.get("/api/"+tabla+"/listar/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
	
		const usuario = await axios.get("/api/usuario/buscar/"+verSesion()+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
		} 
		});
		desbloquea();
		const resp=boton.data.valor.botones;
		const resp2=lista.data.valor.info;
		const resp3=usuario.data.valor.info;
		let vacio=[];
		if(lista.data.valor.info.length==0){
			vacio.push(0);
			vacio.push(0);
		}else{
			vacio.push(lista.data.valor.info[0].CANT_MESA);
			vacio.push(lista.data.valor.info[0].CANT_DELIVERY);
		}
		const cantidad=vacio;

		let listado=`
		<section id="button-group-sizes">
			<div class="row">
				<div class="col-12">
					<div class="card">
						<div class="row">
							<div class="col-6">
								<h4 class="h4 form-section pl-3 pr-3 pt-2 text-left">
									<i class="las la-file-invoice"></i>
									PEDIDO
								</h4>
							</div>
							<div class="form-check form-switch col-6">
								<h4 id="impresionPedido" class="d-flex justify-content-end align-items-center pt-2 pr-3">
									<input type="hidden" id="activaImpresion" value="${resp3.IMPRESORA}">
									<input type="checkbox" id="chkImpresion" name="chkImpresion" class="form-check-input mr-2 cursor" role="switch">
									<strong> IMPRESORA</strong>
								</h4>
							</div>
						</div>
						<section>
							${pedidoCrea({tabla:tabla, resp:resp,resp2:resp2})}
						</section>
					</div>
				</div>
			</div>
		</section>`;
		if(java==1){
			$("#cuerpoPrincipal").html(listado);
		}

        if(cantidad[0]>0 || cantidad[1]>0){
            if(cantidad[0]>0){
                var pedidoMesa = {
                    valueNames: [ 'id1', 'comensal1', 'usuario1', 'fecha1' ]
                };
                mesaList = new List('listaTodoMesa', pedidoMesa);
            }
            if(cantidad[1]>0){
                var pedidoDelivery = {
                    valueNames: [ 'id2','comensal2', 'usuario2','fecha2' ]
                };
                deliveryList = new List('listaTodoDelivery', pedidoDelivery);
            }
        }

		$('[data-toggle="tooltip"]').tooltip();
		if($('#activaImpresion').val()==1){
			$('#impresionPedido input[name=chkImpresion]').trigger('click');
		}

		$('#'+tabla).off( 'click');
		$('#impresionPedido').on( 'click','input[name=chkImpresion]',function(){
			if ($(this).is(':checked') ) {
				guardaImpresion(1);
			}else{
				guardaImpresion(0);
			}
		});

		inicia=setInterval(actualizaFechaPedido,60*1000);

		$('#'+tabla+'Inicio #mesa').off( 'click');
		$('#'+tabla+'Inicio #mesa').on( 'click', 'button[name=btnMesa]', function () {
			let idSubMenu=$('#'+tabla+'Inicio').find('span.muestraSubmenu').text();
			let nombreSubmenu=$('#'+tabla+'Inicio').find('span.muestraModulo').text();
			modalLinkPedidoZona({esDelivery:0,id:0,nombre:0,nombreSubmenu:nombreSubmenu,idSubMenu:idSubMenu,tabla:tabla,accion:'crea',orden:0,ancho:600,titulo:'SELECCIONAR ZONA Y MESA',resp:resp});
		});

		$('#'+tabla+'Inicio #llevar').off( 'click');
		$('#'+tabla+'Inicio #llevar').on( 'click', 'button[name=btnLlevar]', function () {
			let idSubMenu=$('#'+tabla+'Inicio').find('span.muestraSubmenu').text();
			let nombreSubmenu=$('#'+tabla+'Inicio').find('span.muestraModulo').text();
			modalLinkPedidoDelivery({esDelivery:1,id:0,nombre:0,nombreSubmenu:nombreSubmenu,idSubMenu:idSubMenu,tabla:tabla,accion:'crea',orden:0,ancho:600,titulo:'SELECCIONAR CLIENTE',resp:resp});
		});
		
		$('#'+tabla+'Inicio #listaTodoMesa').off( 'click');
		$('#'+tabla+'Inicio #listaTodoMesa').on( 'click', 'div.opcionesMesa div i', function () {
			let id=$(this).parent().siblings('input[name=mesaId]').val();
			let esEliminable=$(this).parent().siblings('input[name=esEliminable]').val();
			//let estadoVentaId=$(this).parent().siblings('input[name=estadoVentaId]').val();
			let nombreSubmenu=$('#'+tabla+'Inicio span.muestraModulo').text();
			let idSubMenu=$('#'+tabla+'Inicio span.muestraSubmenu').text();
			let nombre=$('#'+tabla+'Inicio #zonaMesa'+id).text();

			if($(this).hasClass('elimina')){
				if(esEliminable==2){
					mensajeSistema('¡No se puede eliminar el pedido del lugar '+nombre+', existen productos ya atendidos!');
				}else if(esEliminable==1){
					enviarComandaEliminado({esDelivery:0,id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,orden:id,tabla:tabla,accion:'elimina',resp:resp});
				}else{
					verificaSesion('O', idSubMenu,3,function( ){//ELIMINA
						eliminaPedido({esDelivery:0,id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,orden:id,tabla:tabla,accion:'elimina',resp:resp});
					});
				}
			}else if($(this).hasClass('edita')){
				verificaSesion('O', idSubMenu,2,function( ){//EDITA
					modalLinkPedidoZona({esDelivery:0,id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,tabla:tabla,accion:'edita',orden:id,ancho:600,titulo:'MODIFICAR ZONA Y MESA',resp:resp});
				});
			}else if($(this).hasClass('detalle')){
				verificaSesion('O', idSubMenu,11,function( ){//DETALLE
					modalLinkPedidoDetalle({esDelivery:0,id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,tabla:tabla,accion:'Detalle',orden:id,ancho:600,titulo:'DETALLE PEDIDO POR MESA',resp:resp,tipo:'pedido'});
				});
			}else if($(this).hasClass('paga')){
				verificaSesion('O', idSubMenu,18,function( ){//PAGA
					modalLinkPedidoDetallePago({esDelivery:0,id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,tabla:tabla,accion:'Paga',orden:id,ancho:600,titulo:'PAGAR PEDIDO POR MESA',resp:resp,tipo:'pedido'});
				});
			}
		});

		$('#'+tabla+'Inicio #listaTodoDelivery').off( 'click');
		$('#'+tabla+'Inicio #listaTodoDelivery').on( 'click', 'div.opcionesDelivery div i', function () {
			let esEliminable=$(this).parent().siblings('input[name=esEliminable]').val();
			//let estadoVentaId=$(this).parent().siblings('input[name=estadoVentaId]').val();
			let id=$(this).parent().siblings('input[name=deliveryId]').val();
			let nombreSubmenu=$('#'+tabla+'Inicio span.muestraModulo').text();
			let idSubMenu=$('#'+tabla+'Inicio span.muestraSubmenu').text();
			let nombre=$('#'+tabla+'Inicio #cliente'+id).text();

			if($(this).hasClass('elimina')){
				if(esEliminable==2){
					mensajeSistema('¡No se puede eliminar el pedido del cliente '+nombre+', existen productos ya atendidos!');
				}else if(esEliminable==1){
					enviarComandaEliminado({esDelivery:1,id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,orden:id,tabla:tabla,accion:'elimina',resp:resp});
				}else{
					verificaSesion('O', idSubMenu,3,function( ){//ELIMINA
						eliminaPedido({esDelivery:1,id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,orden:id,tabla:tabla,accion:'elimina',resp:resp});
					});
				}
			}else if($(this).hasClass('edita')){
				verificaSesion('O', idSubMenu,2,function( ){//EDITA
					modalLinkPedidoDelivery({esDelivery:1,id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,tabla:tabla,accion:'edita',orden:id,ancho:600,titulo:'MODIFICAR CLIENTE',resp:resp});
				});
			}else if($(this).hasClass('detalle')){
				verificaSesion('O', idSubMenu,11,function( ){//DETALLE
					modalLinkPedidoDetalle({esDelivery:1,id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,tabla:tabla,accion:'Detalle',orden:id,ancho:600,titulo:'DETALLE PEDIDO POR LLEVAR',resp:resp,tipo:'pedido'});
				});
			}else if($(this).hasClass('paga')){
				verificaSesion('O', idSubMenu,18,function( ){//PAGA
					modalLinkPedidoDetallePago({esDelivery:1,id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,tabla:tabla,accion:'Paga',orden:id,ancho:600,titulo:'PAGAR PEDIDO PARA LLEVAR',resp:resp,tipo:'pedido'});
				});
			}
		});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

function pedidoCrea(objeto){
	try{
		const edita=(objeto.resp.includes('Edita'))?`
			<div class="col d-flex justify-content-center align-items-center">
				<i class="cursor las la-exchange-alt la-2x pt-1 edita" data-toggle="tooltip" data-placement="top" title="Editar"></i>
			</div>`:'';
		const detalle=(objeto.resp.includes('Detalle'))?`
			<div class="col d-flex justify-content-center align-items-center">
				<i class="cursor las la-eye la-2x pt-1 detalle" data-toggle="tooltip" data-placement="top" title="Detalle"></i>
			</div>`:'';
		const paga=(objeto.resp.includes('Paga'))?`
			<div class="col d-flex justify-content-center align-items-center">
				<i class="cursor las la-cash-register la-2x pt-1 paga" data-toggle="tooltip" data-placement="top" title="Pagar"></i>
			</div>`:'';
		const elimina=(objeto.resp.includes('Elimina'))?`
			<div class="col d-flex justify-content-center align-items-center">
				<i class="cursor las la-trash la-2x pt-1 elimina"></i>
			</div>`:'';

		let msg=`<div id="${objeto.tabla}Inicio" class="pl-1 pr-1 pb-1">
			<span class='oculto muestraSubmenu'>56</span>
			<span class='oculto muestraModulo'>${objeto.tabla.toUpperCase()}</span>
			<ul class="nav nav-tabs">
				<li class="nav-item"  role="presentation">
					<button class="nav-link active" id="mesa-tab" data-bs-toggle="tab"  data-bs-target="#mesa"   type="button" role="tab" aria-controls="mesa" aria-selected="true"> PEDIDOS EN MESA</button>
				</li>
				<li class="nav-item" role="presentation">
					<a class="nav-link" id="llevar-tab" data-bs-toggle="tab"  data-bs-target="#llevar" type="button" role="tab" aria-controls="llevar" aria-selected="true"> PEDIDOS PARA LLEVAR</a>
				</li>
			</ul>
			<div class="tab-content" id="myTabContent">
				<div class="tab-pane fade show active" id="mesa" role="tabpanel" aria-labelledby="mesa-tab">
					<div class="row">
						<div class="col-md-12 pt-1">
							<button type='Mesa' name='btnMesa' class="w-100 btn mb-1 btn-primary btn-lg mesa"><i class="las la-concierge-bell"></i> Mesa</button>
						</div>
					</div>
					<div class="col-12 pt-1">
						<div class="card">
							<h4 class="form-section pl-3 pr-3 pt-2"><i class="las la-concierge-bell"></i> LISTA DE PEDIDOS EN MESA</h4>
							<div class="card-content collapse show">
								<div class="card-body" id="listaTodoMesa">
									<input type="text" class="search form-control round border-primary mb-1" placeholder="Buscar">
									<ul class="list-group list">`;
									for(var i=0;i<objeto.resp2.length;i++){
										if(objeto.resp2[i].ES_DELIVERY==0){
										msg+=`<li class="list-group-item border border-primary" id="${ 'mesa'+objeto.resp2[i].ID_VENTA}">
												<div class="row">
													<span class="id1 oculto">${ objeto.resp2[i].ID_VENTA}</span>
													<div class="col d-flex justify-content-center align-items-center mb-0">
														<i class="las la-utensils"></i>
														<h6 class="comensal1" id="zonaMesa${ objeto.resp2[i].ID_VENTA}">${ objeto.resp2[i].NOMBRE_ZONA+" - "+objeto.resp2[i].NOMBRE_MESA}</h6>
													</div>
													<div class="col d-flex justify-content-center align-items-center mb-0">
														<i class="las la-id-badge"></i>
														<h6 class="usuario1"  id="usuario1${ objeto.resp2[i].ID_VENTA}">${ objeto.resp2[i].PATERNO+" "+objeto.resp2[i].USUARIO}</h6>
													</div>
													<div class="col d-flex justify-content-center align-items-center mb-0">
														<i  class="las la-hourglass-half"></i>
														<h6 class="fecha1" id="fechaPedido${ objeto.resp2[i].ID_VENTA}">${ moment(objeto.resp2[i].FECHA_CREA).locale('es').fromNow()}</h6>
													</div>
												</div>
												<div class="row opcionesMesa">
													<div id="estado${objeto.resp2[i].ID_VENTA}" class="col d-flex justify-content-center align-items-center">
														<span class="badge badge-${objeto.resp2[i].DETALLE_ESTADO_VENTA}">${objeto.resp2[i].ESTADO_VENTA}</span>
													</div>
													${edita+detalle+paga+elimina}
													<input type="hidden" name="mesaId" value="${ objeto.resp2[i].ID_VENTA}">
													<input id="estadoVentaId${ objeto.resp2[i].ID_VENTA}" type="hidden" name="estadoVentaId" value="${ objeto.resp2[i].ID_ESTADO_VENTA}">
													<input id="esEliminable${ objeto.resp2[i].ID_VENTA}" type="hidden" name="esEliminable" value="${ objeto.resp2[i].ES_ELIMINABLE}">
													<input type="hidden" name="fechaVenta" value="${ objeto.resp2[i].ID_VENTA+'@'+objeto.resp2[i].FECHA_CREA}">
												</div>
											</li>`;
										} }
								msg+=`</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-pane fade" role="tabpanel"  id="llevar" aria-labelledby="llevar-tab">
					<div class="row">
						<div class="col-md-12 pt-1">
							<button type="Llevar" name='btnLlevar' class="w-100 btn mb-1 btn-success btn-lg llevar"><i class="las la-walking"></i> Para llevar</button>
						</div>
					</div>
					<div class="col-12 pt-1">
						<div class="card">
							<h4 class="form-section pl-3 pr-3 pt-2"><i class="las la-walking"></i> LISTA DE PEDIDOS PARA LLEVAR</h4>
							<div class="card-content collapse show">
								<div class="card-body" id="listaTodoDelivery">
									<input type="text" class="search form-control round border-success mb-1" placeholder="Buscar">
									<ul class="list-group list">`;
									for(var i=0;i<objeto.resp2.length;i++){
										if(objeto.resp2[i].ES_DELIVERY==1){
										msg+=`<li class="list-group-item border border-success" id="${ 'delivery'+objeto.resp2[i].ID_VENTA}">
												<div class="row">
													<span class="id2 oculto">${ objeto.resp2[i].ID_VENTA}</span>
													<div class="col d-flex justify-content-center align-items-center mb-0">
														<i class="las la-utensils"></i>
														<h6 class="comensal2" id="cliente${ objeto.resp2[i].ID_VENTA}">${ (objeto.resp2[i].APELLIDO_CLIENTE===null)?objeto.resp2[i].NOMBRE_CLIENTE:objeto.resp2[i].NOMBRE_CLIENTE+' '+objeto.resp2[i].APELLIDO_CLIENTE}</h6>
													</div>
													<div class="col d-flex justify-content-center align-items-center mb-0">
														<i class="las la-id-badge"></i>
														<h6 class="usuario2" id="usuario2${ objeto.resp2[i].ID_VENTA}">${ objeto.resp2[i].PATERNO+" "+objeto.resp2[i].USUARIO}</h6>
													</div>
													<div class="col d-flex justify-content-center align-items-center mb-0">
														<i  class="las la-hourglass-half"></i>
														<h6 class="fecha2" id="fechaPedido${ objeto.resp2[i].ID_VENTA}">${ moment(objeto.resp2[i].FECHA_CREA).locale('es').fromNow()}</h6>
													</div>
												</div>
												<div class="row opcionesDelivery">
													<div id="estado${ objeto.resp2[i].ID_VENTA}" class="col d-flex justify-content-center align-items-center">
														<span class="badge badge-${ objeto.resp2[i].DETALLE_ESTADO_VENTA}">${ objeto.resp2[i].ESTADO_VENTA}</span>
													</div>
													${edita+detalle+paga+elimina}
													<input type="hidden" name="deliveryId" value="${ objeto.resp2[i].ID_VENTA}">
													<input id="estadoVentaId${ objeto.resp2[i].ID_VENTA}" type="hidden" name="estadoVentaId" value="${ objeto.resp2[i].ID_ESTADO_VENTA}">
													<input id="esEliminable${ objeto.resp2[i].ID_VENTA}" type="hidden" name="esEliminable" value="${ objeto.resp2[i].ES_ELIMINABLE}">
													<input type="hidden" name="fechaVenta" value="${ objeto.resp2[i].ID_VENTA+'@'+objeto.resp2[i].FECHA_CREA}">
												</div>
											</li>`;
										} }
								msg+=`</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
		
		return msg;
	}catch (err) {
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}


function actualizaFechaPedido(){
	$('#pedidoInicio input[name=fechaVenta]').each(function(){
		let arr_pedido=$(this).val().split('@');
		let idVenta=arr_pedido[0];
		let fechaVenta=arr_pedido[1];
		socket.emit('actualizaFechaPedido',{
			idVenta:idVenta,
			fechaVenta:fechaVenta,
			sucursal:'S'+$("#sucursal").val()
		});
	});
}


async function modalLinkPedidoZona(objeto){
    bloquea();
	const cancela=(objeto.resp.includes('Cancela'))?`
		<button type='Cancela' name='btnCancela' class='mr-1 btn btn-secondary btn-md cancela'>
			<i class='la la-times'></i>
			<span class='p-1'>Cancelar</span>
		</button>`:'';
	const crea=(objeto.resp.includes('Crea'))?`
		<button type='Crea' name='btnGuarda' class='crud btn btn-primary btn-md crea'>
			<i class='la la-save'></i>
			<span class='p-1'>Guardar</span>
		</button>`:'';
	const edita=(objeto.resp.includes('Edita'))?`
		<button type='Edita' name='btnGuarda' class='crud btn btn-primary btn-md edita'>
			<i class='la la-save'></i>
			<span class='p-1'>Guardar</span>
		</button>`:'';
	try {
		let buscar;
		if(objeto.id==0){
			buscar =  await axios.get("/api/usuario/buscar/"+verSesion()+"/"+verSesion(),{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
		}else{
			buscar =  await axios.get("/api/pedido/buscar/"+objeto.id+"/"+verSesion(),{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
		}
		const pedido=buscar.data.valor.info;
		desbloquea();
		let msg=`
		<form id="${objeto.tabla}">
			<div class="row">
				<div class="col-12">
					<div class="card">
						<div class="card-content collapse show">
							<div class="card-body">
								<div class="row">
									<div class="form-group col-md-12 mb-0">
										<button type="Zona" name="btnZona" class="w-100 btn btn-primary zona"><i class="las la-map-marked-alt"></i> Selecciona la Zona</button>
										<div class=" text-center alert alert-info alert-dismissible mb-2" role="alert">
											<strong id="nombreZona">${(objeto.id==0)?'¡No ha selecciona la zona!':pedido.NOMBRE_ZONA}</strong>
										</div>
										<input name="zona" type="hidden" value="${(objeto.id==0)?'':pedido.ID_ZONA}"/>
									</div>
									<div class="form-group col-md-12 mb-0">
										<button type="Mesas" name="btnMesas" class="w-100 btn btn-secondary mesa"><i class="las la-utensils"></i> Seleccione la mesa</button>
										<div class=" text-center alert alert-info alert-dismissible mb-2" role="alert">
											<strong id="nombreMesa">${(objeto.id==0)?'¡No ha seleccionado la mesa!':pedido.NOMBRE_MESA}</strong>
										</div>
										<input name="mesa" id="mesas" type="hidden" value="${(objeto.id==0)?'':pedido.ID_MESA}"/>
									</div>
									<div class="form-group col-md-12 mb-0">`;
										if(objeto.id==0){
											if(pedido.ID_NIVEL==8 || pedido.ID_NIVEL==1){
											msg+=`<button type="Mozo" name="btnMozo" class="w-100 btn btn-success mozo"><i class="las la-user-edit"></i> Seleccione el mozo</button>
												<div class=" text-center alert alert-info alert-dismissible mb-2" role="alert">
													<strong id="nombreMozo">${pedido.APELLIDO_PATERNO+" "+pedido.NOMBRE1}</strong>
												</div>
												<input name="mozo" id="mozo" value="${pedido.ID_USUARIO}" type="hidden"/>`;
											}else if(pedido.ID_NIVEL==4){
											msg+=`<div class=" text-center alert alert-info alert-dismissible mb-2" role="alert">
													<strong id="nombreMozo"><${pedido.APELLIDO_PATERNO+" "+pedido.NOMBRE1}</strong>
												</div>
												<input name="mozo" id="mozo" value="${ pedido.ID_USUARIO}" type="hidden"/>`;
											}else{
											msg+=`<button type="Mozo" name="btnMozo" class="w-100 btn btn-success mozo"><i class="las la-user-edit"></i> Seleccione el mozo</button>
												<div class=" text-center alert alert-info alert-dismissible mb-2" role="alert">
													<strong id="nombreMozo">¡No ha seleccionado el mozo!</strong>
												</div>
												<input name="mozo" id="mozo" type="hidden"/>`;
											}
										}else{
											if(pedido.ID_NIVEL==4){
											msg+=`<div class=" text-center alert alert-info alert-dismissible mb-2" role="alert">
													<strong id="nombreMozo">${ pedido.APELLIDO_PATERNO+" "+pedido.NOMBRE1}</strong>
												</div>
												<input name="mozo" id="mozo" value="${ pedido.ID_MOZO}" type="hidden"/>`;
											}else{
											msg+=`<button type="Mozo" name="btnMozo" class="w-100 btn btn-success mozo"><i class="las la-user-edit"></i> Seleccione el mozo</button>
												<div class=" text-center alert alert-info alert-dismissible mb-2" role="alert">
													<strong id="nombreMozo">${ pedido.APELLIDO_PATERNO+" "+pedido.NOMBRE1}</strong>
												</div>
												<input name="mozo" id="mozo" value="${ pedido.ID_MOZO}" type="hidden"/>`;
											}
										}
								msg+=`</div>
								</div>
								<div class="form-section p-0"></div>
								<div class="col-md-12 pl-0 pr-0 text-center">
									${cancela}${(objeto.id==0)?crea:edita}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>`;
		desbloquea();
		mostrar_general1({titulo:objeto.titulo,msg:msg,ancho:objeto.ancho});
		seleccionaDatos(objeto);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function seleccionaDatos(objeto){
	$('#'+objeto.tabla).off( 'click');
	$('#'+objeto.tabla).on( 'click', 'button[name=btnZona]', function () {
		listarZonas(objeto);
	});

	$('#'+objeto.tabla).on( 'click', 'button[name=btnMesas]', function () {
		let idZona=$('#'+objeto.tabla+' input[name=zona]').val();
		if(idZona==''){
			info('¡Debe seleccionar una zona!');
		}else{
			listarMesaZona({idZona:idZona,tabla:objeto.tabla});
		}
	});

	$('#'+objeto.tabla).on( 'click', 'button[name=btnMozo]', function () {
		listarMozos(objeto);
	});

	$('#'+objeto.tabla).on( 'click', 'button[name=btnGuarda]', function () {
		let idOpcion=(objeto.accion=='crea')?4:5;
		verificaSesion('O',objeto.idSubMenu,idOpcion,function( ){//CREA  O MODIFICA
			let idZona=$('#'+objeto.tabla+' input[name=zona]');
			let idMozo=$('#'+objeto.tabla+' input[name=mozo]');
			let idMesa=$('#'+objeto.tabla+' input[name=mesa]');
			if(idMesa.val()>0 && idZona.val()>0 && idMozo.val()>0){
				crearPedido({id:objeto.id,idZona:idZona.val(),idMesa:idMesa.val(),idCliente:0, esDelivery:objeto.esDelivery, accion:objeto.accion, tabla:objeto.tabla,idMozo:idMozo.val()});
			}else{
				mensajeSistema('¡Debe seleccionar la zona, la mesa y el mozo para iniciar el pedido!');
			}
		});
	});
}

async function listarZonas(objeto){
	bloquea();
	try {
		const lista =  await axios.get("/api/zona/listar/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});

		const zona=lista.data.valor.info;
		let listado=`
		<div class="row text-center pr-2 pl-2" id="listaZonas">`;
			for(var i=0;i<zona.length;i++){
				if(zona[i].ES_VIGENTE==1){
			listado+=`<div class="col-md-3 mb-2 pl-1 pr-1">
						<div class="card cursor zonaId">
							<div class="card-body pl-1 pr-1">
								<div class="text-center">
									<h6 class="zonaNombre">${zona[i].NOMBRE}</h6>
								</div>
							</div>
							<input type="hidden" value="${zona[i].ID_ZONA}" name="zonaId">
						</div>
					</div>`
			} }
	listado+=`</div>`;
		desbloquea();
		mostrar_general2({titulo:'ZONAS',msg:listado,ancho:objeto.ancho});
		$('#listaZonas').off( 'click');
		$('#listaZonas').on( 'click', '.zonaId', function () {
			let idZona=$(this).find('input').val();
			let nombreZona=$(this).find('.zonaNombre').text();
			$('#'+objeto.tabla+' strong#nombreZona').text(nombreZona);
			$('#'+objeto.tabla+' input[name=zona]').val(idZona);

			$('#'+objeto.tabla+' strong#nombreMesa').text('¡No ha seleccionado la mesa!');
			$('#'+objeto.tabla+' input[name=mesa]').val('');
			$("#general2").modal("hide");
		});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function listarMesaZona(objeto){
	bloquea();
	try {
		const lista =  await axios.get("/api/mesa/detalle/listar/"+objeto.idZona+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});

		const mesaZona=lista.data.valor.info;
		let listado=`
		<div class="row text-center pr-2 pl-2" id="listaMesas">`;
			var cuenta=0;
			for(var i=0;i<mesaZona.length;i++){
				if(mesaZona[i].ES_VIGENTE==1 && mesaZona[i].ES_VISIBLE==1){
					cuenta++;
			listado+=`<div class="col-md-3 mb-2 pl-1 pr-1">
					<div class="card mb-0 cursor mesaId">
						<div class="card-body pl-1 pr-1">
							<div class="text-center">
								<h6 class="mesaNombre">${mesaZona[i].NOMBRE}</h6>
							</div>
						</div>
						<input type="hidden" value="${mesaZona[i].ID_MESA}" name="mesaId">
					</div>
				</div>`;
			} }
			if(cuenta==0){
	listado+=`<div class="alert alert-icon-right alert-info alert-dismissible mb-2" role="alert">
				<span class="alert-icon"><i class="la la-info-circle"></i></span>
				<strong>¡Esta zona no tiene mesas disponibles!</strong>
			</div>`;
			}
listado+=`</div>`;
		desbloquea();
		mostrar_general2({titulo:'MESAS',msg:listado,ancho:objeto.ancho});
		$('#listaMesas').off( 'click');
		$('#listaMesas').on( 'click', '.mesaId', function () {
			let idMesa=$(this).find('input').val();
			let nombreMesa=$(this).find('.mesaNombre').text();
			$('#'+objeto.tabla+' strong#nombreMesa').text(nombreMesa);
			$('#'+objeto.tabla+' input[name=mesa]').val(idMesa);
			$("#general2").modal("hide");
		});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
};


async function listarMozos(objeto){	
	bloquea();
	try {
		const lista =  await axios.get("/api/usuario/listar/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
		} 
		});

		const mozo=lista.data.valor.info;
		let listado=`
		<div class="row text-center pr-2 pl-2" id="listaMozos">`  
			for(var i=0;i<mozo.length;i++){
				if(mozo[i].ES_VIGENTE==1 && mozo[i].ID_NIVEL==4){
					if(objeto.accion=='crea' && i==0){
				listado+=`<div class="col-md-3 mb-2 pl-1 pr-1">
							<div class="card cursor mozoId">
								<div class="card-body pl-1 pr-1">
									<div class="text-center">
										<h6 class="mozoNombre">¡Automático!</h6>
									</div>
								</div>
								<input type="hidden" value="0" name="mozoId">
							</div>
						</div>`;
					}
			listado+=`<div class="col-md-3 mb-2 pl-1 pr-1">
						<div class="card cursor mozoId">
							<div class="card-body pl-1 pr-1">
								<div class="text-center">
									<h6 class="mozoNombre">${ mozo[i].APELLIDO_PATERNO+" "+mozo[i].NOMBRE1}</h6>
								</div>
							</div>
							<input type="hidden" value="${ mozo[i].ID_USUARIO}" name="mozoId">
						</div>
					</div>`
			} }
listado+=`</div>`;
		desbloquea();
		mostrar_general2({titulo:'MOZOS',msg:listado,ancho:objeto.ancho});
		$('#listaMozos').off( 'click');
		$('#listaMozos').on( 'click', '.mozoId', function () {
			let idMozo=$(this).find('input').val();
			let nombreMozo=$(this).find('.mozoNombre').text();
			$('#'+objeto.tabla+' strong#nombreMozo').text(nombreMozo);
			$('#'+objeto.tabla+' input[name=mozo]').val(idMozo);
			$("#general2").modal("hide");
		});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
};

async function modalLinkPedidoDelivery(objeto){
    bloquea();
	const cancela=(objeto.resp.includes('Cancela'))?`
		<button type='Cancela' name='btnCancela' class='mr-1 btn btn-secondary btn-md cancela'>
			<i class='la la-times'></i>
			<span class='p-1'>Cancelar</span>
		</button>`:'';
	const crea=(objeto.resp.includes('Crea'))?`
		<button type='Crea' name='btnGuarda' class='crud btn btn-primary btn-md crea'>
			<i class='la la-save'></i>
			<span class='p-1'>Guardar</span>
		</button>`:'';
	const edita=(objeto.resp.includes('Edita'))?`
		<button type='Edita' name='btnGuarda' class='crud btn btn-primary btn-md edita'>
			<i class='la la-save'></i>
			<span class='p-1'>Guardar</span>
		</button>`:'';
	try {
		let buscar;

		const lista =  await axios.get("/api/cliente/listar/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		if(objeto.id==0){
			buscar =  await axios.get("/api/usuario/buscar/"+verSesion()+"/"+verSesion(),{ 
				headers:{
					authorization: `Bearer ${verToken()}`
			} 
			});

		}else{
			buscar =  await axios.get("/api/pedido/buscar/"+objeto.id+"/"+verSesion(),{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
		}
		const pedido=buscar.data.valor.info;
		const cliente=lista.data.valor.info;

		desbloquea();
		let msg=`
		<form id="${objeto.tabla}">
			<div class="row">
				<div class="col-12">
					<div class="card">
						<div class="card-content collapse show">
							<div class="card-body">
								<div class="row">
									<div class="form-group col-md-12">
										<label>Cliente</label>
										<select name="cliente" class="form-control select2">`;
										if(objeto.id==0){
									msg+=`<option value="">Select...</option>`;
											for(var i=0;i<cliente.length;i++){
												if(cliente[i].ES_VIGENTE==1){
											msg+=`<option value="${cliente[i].ID_CLIENTE}">${ (cliente[i].APELLIDOS===null)?cliente[i].NOMBRE:cliente[i].NOMBRE+' '+cliente[i].APELLIDOS}</option>`;
												}
											} 
										}else{
									msg+=`<option value="${pedido.ID_CLIENTE}">${pedido.NOMBRE_CLIENTE}</option>`;
											for(var i=0;i<cliente.length;i++){
												if(cliente[i].ES_VIGENTE==1 && pedido.ID_CLIENTE!=cliente[i].ID_CLIENTE){
											msg+=`<option value="${cliente[i].ID_CLIENTE}">${(cliente[i].APELLIDOS===null)?cliente[i].NOMBRE:cliente[i].NOMBRE+' '+cliente[i].APELLIDOS}</option>`;
												}
											} 
										}
										
								msg+=`</select>
									</div>
									<div class="form-group col-md-12">`;
										if(objeto.id==0){
											if(pedido.ID_NIVEL==8 || pedido.ID_NIVEL==1){
											msg+=`<button type="Mozo" name="btnMozo" class="w-100 btn btn-success mozo"><i class="las la-user-edit"></i> Seleccione el mozo</button>
												<div class=" text-center alert alert-info alert-dismissible mb-2" role="alert">
													<strong id="nombreMozo">${ pedido.APELLIDO_PATERNO+" "+pedido.NOMBRE1}</strong>
												</div>
												<input name="mozo" id="mozo" value="${ pedido.ID_USUARIO}" type="hidden"/>`;
											}else if(pedido.ID_NIVEL==4){
											msg+=`<div class=" text-center alert alert-info alert-dismissible mb-2" role="alert">
													<strong id="nombreMozo">${ pedido.APELLIDO_PATERNO+" "+pedido.NOMBRE1}</strong>
												</div>
												<input name="mozo" id="mozo" value="${ pedido.ID_USUARIO}" type="hidden"/>`;
											}else{
											msg+=`<button type="Mozo" name="btnMozo" class="w-100 btn btn-success mozo"><i class="las la-user-edit"></i> Seleccione el mozo</button>
												<div class=" text-center alert alert-info alert-dismissible mb-2" role="alert">
													<strong id="nombreMozo">¡No ha seleccionado el mozo!</strong>
												</div>
												<input name="mozo" id="mozo" type="hidden"/>`;
											}
										}else{
											if(pedido.ID_NIVEL==4){
											msg+=`<div class=" text-center alert alert-info alert-dismissible mb-2" role="alert">
													<strong id="nombreMozo">${ pedido.APELLIDO_PATERNO+" "+pedido.NOMBRE1}</strong>
												</div>
												<input name="mozo" id="mozo" value="${ pedido.ID_MOZO}" type="hidden"/>`
											}else{
											msg+=`<button type="Mozo" name="btnMozo" class="w-100 btn btn-success mozo"><i class="las la-user-edit"></i> Seleccione el mozo</button>
												<div class=" text-center alert alert-info alert-dismissible mb-2" role="alert">
													<strong id="nombreMozo">${ pedido.APELLIDO_PATERNO+" "+pedido.NOMBRE1}</strong>
												</div>
												<input name="mozo" id="mozo" value="${ pedido.ID_MOZO}" type="hidden"/>`
											}
										}
								msg+=`</div>
								</div>
								<div class="row">
									<div class="form-group col-md-12 text-center" id="datoCliente">
										<button type="Cliente" name='btnCliente' class="btn mb-1 btn-primary btn-md btn-block cliente">
											<i class="las la-plus-circle"></i>
											Agregar nuevo cliente
										</button>
									</div>
								</div>
								<div class="form-section p-0"></div>
								<div class="col-md-12 pl-0 pr-0 text-center">
									${cancela}${(objeto.id==0)?crea:edita}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>`;
		desbloquea();
		mostrar_general1({titulo:objeto.titulo,msg:msg,ancho:objeto.ancho});
		$(".select2").select2({
			placeholder:'Select...',
			dropdownAutoWidth: true,
			width: '100%',
			dropdownParent: $('#general1')
		});
		if($('#jsPropio').html().includes('cliente.js')){
			$("#jsPropio script").last().remove();
		}
		java=0;
		$('#jsPropio').append("<script src='/java/cliente.js?"+moment().format('DDMMYYYYHHmmss')+"'></script>");
		buscarCliente(objeto);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function modalLinkPedidoDetalle(objeto){
    bloquea();
	const precuenta=(objeto.resp.includes('Precuenta'))?`
		<button type='Precuenta' name='btnPrecuenta' class='mr-1 btn btn-primary btn-md precuenta'>
			<i class="las la-calculator"></i>
			<span class='p-1'>Precuenta</span>
		</button>`:''
	const comanda=(objeto.resp.includes('Comanda'))?`
		<button type='Comanda' name='btnComanda' class='mr-1 btn btn-success btn-md comanda'>
			<i class="las la-print"></i>
			<span class='p-1'>Comandar</span>
		</button>`:''
	const cancela=(objeto.resp.includes('Cancela'))?`
		<button type='Cancela' name='btnCancela' class='btn btn-secondary btn-md cancela'>
			<i class='la la-times'></i>
			<span class='p-1'>Cancelar</span>
		</button>`:''
	const agrega=(objeto.resp.includes('Agrega'))?`
		<button type='Agrega' name='btnGuarda' class='crud btn btn-primary btn-md agrega'>
			<i class="las la-list-alt"></i>
			<span class='p-1'>Agregar</span>
		</button>`:''

	try{
		const lista =  await axios.get("/api/"+objeto.tabla+objeto.accion+"/listar/"+objeto.id+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
	
		const lista2 =  await axios.get("/api/"+objeto.tabla+"/buscar/"+objeto.id+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		const pedidoDetalle=lista.data.valor.info;
		const cabeceraPedido=lista2.data.valor.info;
		let msg=`
		<div class="row" id="${objeto.tabla+objeto.accion}">
			<div class="col-12">
				<div class="card mb-0">
					<h4 class="form-section pl-2 pr-2 pt-1">
						<div class="row">
							<div class="col-7 text-left">
								MONEDA: ${(cabeceraPedido.ABREVIATURA_MONEDA===null)?'':cabeceraPedido.ABREVIATURA_MONEDA} <i class="las la-coins"></i>  
							</div>
							<div id="iconoEstado" class="text-right ${ (cabeceraPedido.ES_ATENDIDO==1)?'col-2':'oculto'}">
								<i class="cursor las la-check-circle la-2x cambiaEstado"></i>
								<input class="idV" type="hidden" name="idVentaEstado" value="${ cabeceraPedido.ID_VENTA}">
							</div>
							<div id="columnaBoton" class="listaDetalleAgrega ${ (cabeceraPedido.ES_ATENDIDO==1)?'col-3':'col-5'} text-right">
								${agrega}
							</div>
							<span class="oculto" id="idEstadoVenta">${cabeceraPedido.ID_ESTADO_VENTA}</span>
							<span class="oculto" id="esAtendidoVenta">${cabeceraPedido.ES_ATENDIDO}</span>
						</div>
					</h4>
					<div class="card-content collapse show" id="listaDetalle">
						<span class='oculto muestraSubmenu'>${objeto.idSubMenu}</span>
						<span class='oculto muestraModulo'>${objeto.tabla}</span>`;
						if(pedidoDetalle.length>0){
						msg+=`<ul class="card-body pt-0 pb-0">`;
							let total=0;
							for(var i=0;i<pedidoDetalle.length;i++){
								total=total+pedidoDetalle[i].MONTO*pedidoDetalle[i].CANTIDAD;
								msg+=`<li class="list-group-item" id="pedido${ pedidoDetalle[i].ID_DETALLE}">
										<div class="row">
											<div class="col d-flex justify-content-center align-items-center">
												<div>
													<div><h6 class="text-center">${ pedidoDetalle[i].NOMBRE}</h6></div>
													<div><h6 class="salto text-center" id="comentario${ pedidoDetalle[i].ID_DETALLE}">${(pedidoDetalle[i].OBSERVACION===null)?'':pedidoDetalle[i].OBSERVACION}</h6></div>
												</div>
											</div>
											<div class="col text-center mb-0 d-flex justify-content-center align-items-center">
												<div>
													<div><h6 class="text-center" id="cantidad${ pedidoDetalle[i].ID_DETALLE}">${ pedidoDetalle[i].CANTIDAD} <span class="normal">${pedidoDetalle[i].ABREVIATURA_UNIDAD}</span></h6></div>
													<div><h4 id="montoCantidad${ pedidoDetalle[i].ID_DETALLE}">${ parseFloat(pedidoDetalle[i].MONTO*pedidoDetalle[i].CANTIDAD).toFixed(2)}</h4></div>
												</div>
											</div>
										</div>
										<div class="row opcionesDetalle">
											<div class="col d-flex justify-content-center align-items-center">
												<i class="cursor las la-comment la-2x comentario" data-toggle="tooltip" data-placement="top" title="Comentario"></i>
											</div>
											<div class="col d-flex justify-content-center align-items-center">
												<i class="cursor las la-list-ol la-2x cantidad" data-toggle="tooltip" data-placement="top" title="Cantidad"></i>
											</div>
											<div class="col d-flex justify-content-center align-items-center">
												<i class="cursor las la-coins la-2x precio" data-toggle="tooltip" data-placement="top" title="Precio"></i>
											</div>
											<div class="col d-flex justify-content-center align-items-center">
												<i class="cursor las la-trash la-2x elimina" data-toggle="tooltip" data-placement="top" title="Eliminar"></i>
											</div>
											<input type="hidden" name="quitaPedido" value="${ pedidoDetalle[i].ID_DETALLE}">
											<input type="hidden" class="agrupa${ pedidoDetalle[i].ES_ATENDIDO}" name="esAtendido" value="${ pedidoDetalle[i].ES_ATENDIDO}">
											<input type="hidden" name="nombreProducto" value="${ pedidoDetalle[i].NOMBRE}">
										</div>
									</li>`;
									} 
								msg+=`<li class="list-group-item pb-0 pt-0" id="totalPedido">
										<div class="row">
											<div class="col d-flex justify-content-center align-items-center"><h3><strong>TOTAL</strong></h3></div>
											<div class="col d-flex justify-content-center align-items-center">
												<div>
													<h2><strong id="totalPedidoFinalDetalle">${ parseFloat(total).toFixed(2)}</strong></h2>
												</div>
											</div>
										</div>
									</li>
							</ul>`;
						}else{
						msg+=`<ul class="card-body" >
								<div id="sinPedido" class="alert alert-icon-right alert-info alert-dismissible mb-1 mt-1" role="alert">
									<span class="alert-icon"><i class="la la-info-circle"></i></span>
									<strong>¡Aun no tiene pedidos registrados!</strong>
								</div>
							</ul>`;
						}
				msg+=`<hr>
						<div class="detallePedido col-md-12 pl-0 pr-0 pb-1 text-center">
							${precuenta+comanda+cancela}
						</div>
					</div>
				</div>
			</div>
		</div>`;
		desbloquea();
		mostrar_general1({titulo:objeto.titulo,msg:msg,ancho:objeto.ancho});
		$('[data-toggle="tooltip"]').tooltip();
		gestionarDetallePedido(objeto);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function modalLinkPedidoDetallePago(objeto){
    bloquea();
	const precuenta=(objeto.resp.includes('Precuenta'))?`
		<button type='Precuenta' name='btnPrecuenta' class='mr-1 btn btn-success btn-md precuenta'>
			<i class="las la-calculator"></i>
			<span class='p-1'>Precuenta</span>
		</button>`:''
	const cancela=(objeto.resp.includes('Cancela'))?`
		<button type='Cancela' name='btnCancela' class='btn btn-secondary btn-md cancela'>
			<i class='la la-times'></i>
			<span class='p-1'>Cancelar</span>
		</button>`:''
	const vender=(objeto.resp.includes('Venta'))?`
		<button type='Venta' name='btnVenta' class='crud btn btn-primary btn-md venta'>
			<i class="las la-file-invoice-dollar"></i>
			<span class='p-1'>Venta</span>
		</button>`:''						
	try{
		let body={
			id:objeto.id,
            sesId:verSesion(),
			token :verToken()
        }

		const query =  await axios.post("/consulta/modalLinkPedidoDetallePago",body);
		/*const lista =  await axios.get("/api/"+objeto.tabla+"detalle/listar/"+objeto.id+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
		} 
		});
		const lista3 =  await axios.get("/api/cliente/listar/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
		} 
		});
		const lista5 =  await axios.get("/api/"+objeto.tabla+"detalle/listar/pago/"+objeto.id+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
		} 
		});
		const lista6 =  await axios.get("/api/"+objeto.tabla+"detalle/buscar/pago/"+objeto.id+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
		} 
		});

		const pedidoDetalle=lista.data.valor.info;
		const cliente=lista3.data.valor.info;
		const pagos=lista5.data.valor.info;
		const venta=lista6.data.valor.info;*/

		const pedidoDetalle=query.data.pedidoDetalle;
		const cliente=query.data.cliente;
		const pagos=query.data.pagos;
		const venta=query.data.venta;

		let msg=`
		<div id="${objeto.tabla+objeto.accion}">`;
			if(venta.DOCUMENTOS>0){
				msg+=`<div class="alert alert-success" role="alert">
				Ha emitido ${venta.DOCUMENTOS_GENERADOS} documentos de ${venta.DOCUMENTOS}
			</div>`;
			}else if(venta.DOCUMENTOS===null){
				msg+=`<div class="alert alert-danger " role="alert">
				Usted tiene documentos ilimitados para enviar
			</div>`;
			}else{
				msg+=`<div class="alert alert-secondary " role="alert">
					No puede enviar documentos a sunat
				</div>`;
			}
	msg+=`<h4 class="form-section pl-2 pr-2 pt-1">MONEDA: ${(pedidoDetalle.length>0)?pedidoDetalle[0].ABREVIATURA_MONEDA:''} <i class="las la-coins"></i></h4>
			<div class="card">
				<div class="row">
					<div class="col text-center">
						<h2 class="text-bold-400"><span id="pagoTotal">${ parseFloat(venta.TOTAL-venta.DESCUENTO).toFixed(2)}</span></h2>
						<p class="color1Texto lighten-2 mb-0">Monto</p>
						<span class="oculto" id="idEstadoVenta">${venta.ID_ESTADO_VENTA}</span>
					</div>
					<div class="col text-center">
						<h2 class="text-bold-400"><span id="recibido">${parseFloat(venta.RECIBIDO).toFixed(2)}</span></h2>
						<p class="color2Texto lighten-2 mb-0">Recibido</p>
					</div>
					<div class="col text-center">
						<h2 class="text-bold-400"><span id="vuelto">${parseFloat(Math.abs(venta.VUELTO+venta.DESCUENTO)).toFixed(2)}</span></h2>
						<p id="textoVuelto" class="color3Texto lighten-2 mb-0">
							${(venta.VUELTO<0)?'Por pagar':'Vuelto'}
						</p>
					</div>
				</div>
			</div>
			<div class="row" >
				<div class="col-12">
					<div class="card">
						<div class="card-content collapse show">
							<div class="card-body pb-0">
								<div class="row">
									<div class="form-group col-5 pr-0">
										<div class="form-group col-md-12 mb-0">
											<button type="Tipodocumento" name="btnTipodocumento" class="w-100 btn btn-primary tipodocumento"><i class="las la-id-card-alt"></i> Tipo documento (*)</button>
											<div class=" text-center alert alert-info alert-dismissible p-0 mb-0" role="alert">
												<strong id="nombreTipoDocumento"><h6>-</h6></strong>
											</div>
											<input name="tipoDocumento" type="hidden"/>
											<div class="h8 validacion">¡Campo obligatorio!</div>
										</div>
									</div>
									<div class="form-group col-5 pr-0">
										<label>Cliente (*)</label>
										<select name="cliente" class="form-control select2">
											<option value="${(venta.ID_CLIENTE===null)?'':venta.ID_CLIENTE}">${ (venta.ID_CLIENTE===null)?'Select...':(venta.APELLIDOS===null)?venta.NOMBRE:venta.NOMBRE+' '+venta.APELLIDOS}</option>`;
											for(var i=0;i<cliente.length;i++){
												if(cliente[i].ES_VIGENTE==1 && venta.ID_CLIENTE!=cliente[i].ID_CLIENTE ){
												msg+=`<option value="${ cliente[i].ID_CLIENTE}">${ (cliente[i].APELLIDOS===null)?cliente[i].NOMBRE:cliente[i].NOMBRE+' '+cliente[i].APELLIDOS}</option>`;
												
												}
											}   
									msg+=`</select>
										<div class="h8 validacion">¡Campo obligatorio!</div>
									</div>
									<div class="form-group col-2 pt-2 d-flex justify-content-center align-items-center">
										<i id="agregaClientePago" data-toggle="tooltip" data-placement="top" title="Agregar cliente" class="cursor las la-plus-circle la-2x agrega"></i>
										<i id="editaClientePago" data-toggle="tooltip" data-placement="top" title="Modificar cliente" class="cursor las la-check-circle la-2x agrega"></i>
									</div>
								</div>
								<div class="row pl-2 pr-2">
									<div class="form-group col-3 pr-0">
										<label>Serie (*)</label>
										<input name="serie" readonly autocomplete="off" maxlength="10" type="text" class="form-control p-1" placeholder="Ingrese la serie">
										<div class="h8 validacion">¡Campo obligatorio!</div>
									</div>
									<div class="form-group col-4 pr-0">
										<label>Número (*)</label>
										<input name="numero" readonly autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Ingrese el número">
										<div class="h8 validacion">¡Campo obligatorio!</div>
									</div>
									<div class="form-group col-5 pr-0">
										<label>Fecha (*)</label>
										<div class="position-relative has-icon-left">
											<input name="fechaVenta" autocomplete="off" maxlength="10" type="date" class="form-control" placeholder="Seleccione la fecha" value="${ moment().format('YYYY-MM-DD')}">
											<div class="h8 validacion">¡Campo obligatorio!</div>
											<div class="form-control-position"><i class="ft-message-square"></i></div>
										</div>
									</div>
								</div>
								<div class="row pb-2 pl-2 pr-2">
									<label>Comentario</label>
									<textarea  rows="5" autocomplete="off" class="form-control p-1" maxlength="500" name="comentario" placeholder="Ingrese el comentario"></textarea>
								</div>
								<div class="row">
									<div class="form-group col-5 pr-0">
										<div class="form-group col-md-12 mb-0">
											<button type="Tipopago" name="btnTipopago" class="w-100 btn btn-primary tipopago"><i class="las la-id-card-alt"></i> Tipo pago (*)</button>
											<div class=" text-center alert alert-info alert-dismissible p-0 mb-0" role="alert">
												<strong id="nombreTipoPago"><h6>-</h6></strong>
											</div>
											<input name="tipoPago" type="hidden"/>
											<div class="h8 validacion">¡Campo obligatorio!</div>
										</div>
									</div>
									<div class="form-group col-5 pr-0">
										<label>Monto (*)</label>
										<input name="recibido" autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Ingrese lo recibido">
										<div class="h8 validacion">¡Campo obligatorio!</div>
									</div>
									<div class="form-group col-2 pt-2 d-flex justify-content-center align-items-center">
										<i id="agregaPago" class="cursor las la-plus-circle la-2x agrega" data-toggle="tooltip" data-placement="top" title="Pagos"></i>
									</div>
								</div>
								<div class="h8 text-center">(*) Los campos con asteriso son obligatorios.</div>
								<hr>
								<div class="row">
									<div class="col-12" id="pagosVenta">
										<ul class="card-body p-0">`;
											for(var p=0;p<pagos.length;p++){
										msg+=`<li id="pago${ pagos[p].ID_PAGO}" class="list-group-item pb-0 pt-0 bg-info text-white">
													<div class="row">
														<div id="descripcionTipoPago" class="col mb-0 d-flex justify-content-start align-items-center">
															${ pagos[p].DESCRIPCION}
														</div>
														<div id="montoTipoPago" class="col text-center mb-0 d-flex justify-content-center align-items-center">
															${ parseFloat(pagos[p].MONTO_RECIBIDO).toFixed(2)}
														</div>
														<div class="col text-center mb-0 d-flex justify-content-end align-items-center">
															<i class="cursor las la-trash la-2x elimina"></i>
														</div>
														<input type="hidden" name="quitaPago" value="${ pagos[p].ID_PAGO}">
													</div>
												</li>`;
											}
								msg+=`</ul>
									</div>
								</div>
								<div class="row d-flex justify-content-center align-items-center">
									<div class="form-group col-4 pr-0 h8">
										<strong>Ingrese un descuento:</strong>
									</div>
									<div class="form-group col-4 pr-0">
										<input name="descuento" autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Ingrese un descuento" value="0.00">
									</div>
									<div class="form-group col-2 pt-2 d-flex justify-content-center align-items-center">
										<i id="descuentoPago" class="cursor las la-plus-circle la-2x descuento"  data-toggle="tooltip" data-placement="top" title="Descuento"></i>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-12">
					<div class="card mb-0">
						<div class="card-content collapse show" id="listaDetalle">
							<span class='oculto muestraSubmenu'>${ objeto.idSubMenu}</span>
							<span class='oculto muestraModulo'>${ objeto.tabla}</span>
							<ul class="card-body listaPago pb-0">`;
								let total=0;
								for(var i=0;i<pedidoDetalle.length;i++){
									total=total+pedidoDetalle[i].MONTO*pedidoDetalle[i].CANTIDAD;
								msg+=`<li class="list-group-item pb-0 pt-0" id="pedido${ pedidoDetalle[i].ID_DETALLE}">
										<div class="row">
											<div class="col-9 mb-0  d-flex justify-content-start align-items-center">
												<div>
													<div><h6>${ pedidoDetalle[i].NOMBRE}</h6></div>
													<div><h6>${ pedidoDetalle[i].CANTIDAD} <span class="normal">${pedidoDetalle[i].ABREVIATURA_UNIDAD}</span></h6></div>
												</div>
											</div>
											<div class="col-3 text-center mb-0 d-flex justify-content-end align-items-center">
												<div>
													<h4>${ parseFloat(pedidoDetalle[i].MONTO*pedidoDetalle[i].CANTIDAD).toFixed(2)}</h4>
												</div>
											</div>
										</div>
									</li>`;
									}
								msg+=`<li class="list-group-item pb-0 pt-0" id="totalDescuento">
										<div class="row">
											<div class="col-9 d-flex justify-content-start align-items-center"><h5><strong>DESCUENTO</strong></h5></div>
											<div class="col-3 text-center mb-0 d-flex justify-content-end align-items-center">
												<div>
													<h4><strong id="totalDescuentoFinal">${ parseFloat(venta.DESCUENTO).toFixed(2)}</strong></h4>
												</div>
											</div>
										</div>
									</li>
									<li class="list-group-item pb-0 pt-0" id="totalPedido">
										<div class="row">
											<div class="col-9 d-flex justify-content-start align-items-center"><h3><strong>TOTAL</strong></h3></div>
											<div class="col-3 text-center mb-0 d-flex justify-content-end align-items-center">
												<div>
													<h2><strong id="totalPedidoFinal">${ parseFloat(total-venta.DESCUENTO).toFixed(2)}</strong></h2>
												</div>
											</div>
										</div>
									</li>
							</ul>
							<hr>
							<input id="sunat" type="hidden" name="sunat" value="0">
							<div class="detallePedido col-md-12 pl-0 pr-0 pb-1 text-center">
								${precuenta+cancela+vender}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
		desbloquea();
		mostrar_general1({titulo:objeto.titulo,msg:msg,ancho:objeto.ancho});
		$(".select2").select2({
			dropdownAutoWidth: true,
			width: '100%',
			placeholder: "Select...",
			dropdownParent: $('#general1')
		});
		$('[data-toggle="tooltip"]').tooltip();
		focusInput();//diego
		gestionarDetallePedidoPago(objeto);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function gestionarDetallePedidoPago(objeto){//diego
	if($('#jsPropio').html().includes('cliente.js')){
		$("#jsPropio script").last().remove();
	}
	java=0;
	$('#jsPropio').append("<script src='/java/cliente.js?"+moment().format('DDMMYYYYHHmmss')+"'></script>");
	let tipoPago=$('#'+objeto.tabla+objeto.accion+' input[name=tipoPago]');
	let montoRecibido=$('#'+objeto.tabla+objeto.accion+' input[name=recibido]');
	let tipoDocumento=$('#'+objeto.tabla+objeto.accion+' input[name=tipoDocumento]');
	let cliente=$('#'+objeto.tabla+objeto.accion+' select[name=cliente]');
	let descuento=$('#'+objeto.tabla+objeto.accion+' input[name=descuento]');
	let fechaVenta=$('#'+objeto.tabla+objeto.accion+' input[name=fechaVenta]');
	let comentario=$('#'+objeto.tabla+objeto.accion+' textarea[name=comentario]');
	let sunat=$('#'+objeto.tabla+objeto.accion+' input[name=sunat]');
	let session=$("#session");
	let elementos={
		idVenta:objeto.id,
		tipoPago:tipoPago,
		montoRecibido:montoRecibido,
		tipoDocumento:tipoDocumento,
		fechaVenta:fechaVenta,
		comentario:comentario,
		descuento:descuento,
		cliente:cliente,
		sunat:sunat,
		session:session
	}
	let resp;
	try{
		const boton= await axios.get('/api/acceso/privilegio/62/'+verSesion(),{
			headers: 
			{ 
				authorization: `Bearer ${verToken()}`
			} 
		});
		resp=boton.data.valor.botones;
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}

	decimalRegex(montoRecibido);
	decimalRegex(descuento);
	
	verificaElementoPago({objeto:objeto,elementos:elementos});
	$('#'+objeto.tabla+objeto.accion).off( 'click');
	$('#'+objeto.tabla+objeto.accion).on( 'click', 'button[name=btnTipodocumento]', function () {
		listarTipoDocumento(objeto);
	});
	$('#'+objeto.tabla+objeto.accion).on( 'click', 'button[name=btnTipopago]', function () {
		listarTipoPago(objeto);
	});

	$('#'+objeto.tabla+objeto.accion).on( 'click', 'i#agregaPago', function () {
		validaFormularioPago({objeto:objeto,elementos:elementos});
	});

	$('#'+objeto.tabla+objeto.accion).on( 'click', 'i#agregaClientePago', function () {
		modalLinkCliente({id:0,nombre:0,nombreSubmenu:'cliente',idSubMenu:62,tabla:'cliente',accion:'Crea',orden:0,ancho:600,titulo:'NUEVO CLIENTE',vista:'pedido',tipo:'pago',resp:resp});
	});

	$('#'+objeto.tabla+objeto.accion).on( 'click', 'i#editaClientePago', function () {
		let id_cliente=$('#'+objeto.tabla+objeto.accion+' select[name=cliente]').val();
		modalLinkCliente({id:id_cliente,nombre:0,nombreSubmenu:'cliente',idSubMenu:62,tabla:'cliente',accion:'Edita',orden:id_cliente,ancho:600,titulo:'EDITAR CLIENTE',vista:'pedido',tipo:'pago',resp:resp});
	});

	$('#'+objeto.tabla+objeto.accion).on( 'click', 'i#descuentoPago', function () {//diego
		let total=$('#'+objeto.tabla+objeto.accion+' span#totalPedidoFinal').text();
		if(parseFloat(descuento.val())>parseFloat(total)){
			mensajeSistema('¡El descuento no puede ser mayor al consumo!');
		}else{
			agregarDescuento({objeto:objeto,elementos:elementos});
		}
	});


	$('#'+objeto.tabla+objeto.accion).on( 'click', 'button[name=btnCancelaAtencion]', function () {
		eliminaAtencion(objeto);
	});
	
	$('#'+objeto.tabla+objeto.accion+' #listaDetalle .detallePedido').on( 'click', 'button[name=btnPrecuenta]', function () {
		verificaSesion('O',objeto.idSubMenu,38,function( ){//PRECUENTA
			if($("#idEstadoVenta").text()!=2506){
				mensajeSistema('¡Para imprimir la precuenta el pedido debe estar atendido!');
			}else if($("#totalPedidoFinal").text() == 0){
				mensajeSistema('¡No hay productos para imprimir la precuenta!');
			}else{
				//enviarPrecuenta(objeto);
				enviarPrecuenta({id:objeto.id,tabla:'pedido',accion:'paga',idDet:0});
			}
		});
	});

	$('#'+objeto.tabla+objeto.accion+' #pagosVenta').on( 'click', 'ul li i.elimina', function () {
		let id=$(this).parent().siblings('input[name=quitaPago]').val();
		let descripcionTipoPago=$(this).parent().siblings('#descripcionTipoPago').text();
		let montoTipoPago=$(this).parent().siblings('#montoTipoPago').text();
		eliminarPagoDetalle({id:id, tabla:objeto.tabla,descripcionTipoPago:descripcionTipoPago,montoTipoPago:montoTipoPago});
	});
}

function eliminaAtencion(objeto){
	confirm('¡Se eliminará la atención¡',function(){
		return false;
	},async function(){
		try {
			bloquea();

			const elimina = await axios.delete("/api/pedido/eliminar/atencion/"+objeto.id,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
			} 
			});

			const resp=elimina.data.valor;
			if(resp.resultado){
				success("Eliminado","¡Se ha eliminado la atención¡");

				vistaMenuSubMenu({tabla:'atencion',idSubMenu:objeto.idSubMenu});
			}else{
				mensajeSistema(resp.mensaje);
			}
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}	
	})
}

async function agregarDescuento(objeto){//diego
	bloquea();
	try{
		let body= {
			id:objeto.elementos.idVenta,
			descuento:objeto.elementos.descuento.val(),
			sesId:verSesion()
		}
		const editar = await axios.put("/api/pedido/descuento/"+objeto.elementos.idVenta,body,{ 
            headers:{
				authorization: `Bearer ${verToken()}`
			} 
        });
		desbloquea();
		const resp=editar.data.valor;
		if(resp.resultado){
			let descuento=(objeto.elementos.descuento.val()=='' || objeto.elementos.descuento.val()==0)?'0.00':objeto.elementos.descuento.val();
			$('#totalDescuentoFinal').text(parseFloat(descuento).toFixed(2));
			$('#totalPedidoFinal').text(parseFloat(resp.info.TOTAL).toFixed(2));

			objeto.elementos.descuento.val('0.00');
			$('#'+objeto.objeto.tabla+'Paga span#pagoTotal').text(parseFloat(resp.info.TOTAL).toFixed(2));
			$('#'+objeto.objeto.tabla+'Paga span#recibido').text(parseFloat(resp.info.MONTO_RECIBIDO).toFixed(2));
			$('#'+objeto.objeto.tabla+'Paga span#vuelto').text(parseFloat(Math.abs(resp.info.VUELTO)).toFixed(2));
			$('#'+objeto.objeto.tabla+'Paga p#textoVuelto').text((resp.info.VUELTO<0)?'Por pagar':'Vuelto');
			toastr.success('Se agregó un descuento de: S/.'+parseFloat(resp.info.DESCUENTO).toFixed(2), 'DESCUENTO',opcionesToast);
		}else{
			mensajeSistema(resp.mensaje);
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function listarTipoDocumento(objeto){//diego
	bloquea();
	try{
		const lista2 =  await axios.get("/api/serie/listar/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		const tipoDocumento=lista2.data.valor.info;
		let msg=`
		<div class="row text-center pr-2 pl-2" id="listaDocumentos">`;
			for(var i=0;i<tipoDocumento.length;i++){
				if(tipoDocumento[i].ES_VIGENTE==1){
				msg+=`<div class="col-md-3 mb-2 pl-1 pr-1">
						<div class="card cursor tipoDocumentoId">
							<div class="card-body pl-1 pr-1">
								<div class="text-center">
									<h6 class="tipoDocumentoNombre">${ tipoDocumento[i].TIPO_DOCUMENTO}</h6>
									<span class="serieDocumento oculto">${ tipoDocumento[i].SERIE.substring(0,1)}</span>
								</div>
							</div>
							<input type="hidden" value="${ tipoDocumento[i].ID_COMPROBANTE}" name="tipoDocumentoId">
						</div>
					</div>`;
			} }
	msg+=`</div>`;
		desbloquea();
		mostrar_general2({titulo:'TIPO DOCUMENTO',msg:msg,ancho:objeto.ancho});
		$('#listaDocumentos').off( 'click');
		$('#listaDocumentos').on( 'click', '.tipoDocumentoId', function () {
			let idTipoDocumento=$(this).find('input').val();
			let nombreDocumento=$(this).find('.tipoDocumentoNombre').text();
			let serieDocumento=$(this).find('.serieDocumento').text();
			$('#'+objeto.tabla+objeto.accion+' strong#nombreTipoDocumento').text(nombreDocumento);
			$('#'+objeto.tabla+objeto.accion+' input[name=tipoDocumento]').val(idTipoDocumento);
			$("#general2").modal("hide");
			quitaValidacion($('#'+objeto.tabla+objeto.accion+' input[name=tipoDocumento]'));
			muestraDocumentoVenta({tabla:objeto.tabla,accion:objeto.accion,id:idTipoDocumento});

			if(serieDocumento=='B' || serieDocumento=='F'){
				$('#sunat').val(1);
			}else{
				$('#sunat').val(0);
			}
		});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function muestraDocumentoVenta(objeto){
	bloquea();
	try{
		const buscar =  await axios.get("/api/"+objeto.tabla+"/muestra/documento/"+objeto.id+"/"+verSesion(),{ 
            headers:{
				authorization: `Bearer ${verToken()}`
			} 
        });
		const resp=buscar.data.valor;
		desbloquea();
		$('#'+objeto.tabla+objeto.accion+' input[name=serie]').val(resp.info.SERIE);
		$('#'+objeto.tabla+objeto.accion+' input[name=numero]').val(resp.info.NRO_DOCUMENTO);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function listarTipoPago(objeto){
	bloquea();
	try{
		const lista =  await axios.get("/api/parametro/detalle/listar/47/"+verSesion(),{ 
			headers:{authorization: `Bearer ${verToken()}`} 
		});

		const tipoPago=lista.data.valor.info;
		let msg=`
		<div class="row text-center pr-2 pl-2" id="listaPagos">`;
			for(var i=0;i<tipoPago.length;i++){
				if(tipoPago[i].ES_VIGENTE==1){
				msg+=`<div class="col-md-3 mb-2 pl-1 pr-1">
						<div class="card cursor tipoPagoId">
							<div class="card-body pl-1 pr-1">
								<div class="text-center">
									<h6 class="tipoPagoNombre">${tipoPago[i].DESCRIPCIONDETALLE}</h6>
								</div>
							</div>
							<input type="hidden" value="${tipoPago[i].ID_PARAMETRO_DETALLE}" name="tipoPagoId">
						</div>
					</div>`;
			} }
		msg+=`</div>`;
		
		desbloquea();
		mostrar_general2({titulo:'TIPO PAGO',msg:msg,ancho:objeto.ancho});
		$('#listaPagos').off( 'click');
		$('#listaPagos').on( 'click', '.tipoPagoId', function () {
			let idTipoPago=$(this).find('input').val();
			let nombrePago=$(this).find('.tipoPagoNombre').text();
			$('#'+objeto.tabla+objeto.accion+' strong#nombreTipoPago').text(nombrePago);
			$('#'+objeto.tabla+objeto.accion+' input[name=tipoPago]').val(idTipoPago);
			$("#general2").modal("hide");
			quitaValidacion($('#'+objeto.tabla+objeto.accion+' input[name=tipoPago]'));
		});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function verificaElementoPago(objeto){//diego
	$('#'+objeto.objeto.tabla+objeto.objeto.accion).off( 'change');
    $('#'+objeto.objeto.tabla+objeto.objeto.accion).on( 'change','select',function(){
		let name=$(this).attr("name");
		let tipo='select';
		enviaEventoPago({tabla:objeto.objeto.tabla,accion:objeto.objeto.accion,tipo:tipo,name:name,elementos:objeto.elementos});
	});

	$('#'+objeto.objeto.tabla+objeto.objeto.accion).on( 'change','input[type=date]',function(){
		let name=$(this).attr("name");
		let tipo='fecha';
		enviaEventoPago({tabla:objeto.objeto.tabla,accion:objeto.objeto.accion,tipo:tipo,name:name,elementos:objeto.elementos});
	});

	$('#'+objeto.objeto.tabla+objeto.objeto.accion).on( 'change','input[type=checkbox]',function(){
		let name=$(this).attr("name");
		let tipo='check';
		enviaEventoPago({tabla:objeto.objeto.tabla,accion:objeto.objeto.accion,tipo:tipo,name:name,elementos:objeto.elementos});
	});

	$('#'+objeto.objeto.tabla+objeto.objeto.accion).on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr("name");
		let tipo='tel';
		enviaEventoPago({tabla:objeto.objeto.tabla,accion:objeto.objeto.accion,tipo:tipo,name:name,elementos:objeto.elementos});
	});

	$('#'+objeto.objeto.tabla+objeto.objeto.accion).off( 'click');
	$('#'+objeto.objeto.tabla+objeto.objeto.accion).on( 'click', 'i#agregaPago', function () {
		validaFormularioPago(objeto);
	});

	$('#'+objeto.objeto.tabla+objeto.objeto.accion+' #listaDetalle .detallePedido').on( 'click', 'button[name=btnVenta]', function () {
		verificaSesion('O', objeto.objeto.idSubMenu,37,function( ){//VENTA
			validaFormularioCerrarVenta(objeto);
		});
	});
}

function enviaEventoPago(objeto){//diego
	if(objeto.tipo=='select'){
		let elementoInput=$("#"+objeto.tabla+objeto.accion+" select[name="+objeto.name+"]");
		validaVacioSelect(elementoInput);
	}else if(objeto.tipo=='tel'){
		if(objeto.name=='recibido'){
			let elementoInput=$("#"+objeto.tabla+objeto.accion+" input[name="+objeto.name+"]");
			validaVacio(elementoInput);
		}
	}else if(objeto.tipo=='fecha'){
		let elementoInput=$("#"+objeto.tabla+objeto.accion+" input[name="+objeto.name+"]");
		validaVacio(elementoInput);
	}
}

function validaFormularioPago(objeto){
	validaVacioSelect(objeto.elementos.tipoPago);
	validaVacio(objeto.elementos.montoRecibido);

	if(objeto.elementos.tipoPago.val()=="" || objeto.elementos.montoRecibido.val()==""){
		mensajeSistema(0);
	}else if($("#totalPedidoFinal").text() == 0){
		mensajeSistema('¡No hay consumo para agregar pagos!');
	}else if($("#idEstadoVenta").text()!=2506){
		mensajeSistema('¡Para agregar pagos el pedido debe estar atendido!');
	}else{
		agregarPagoPedido(objeto);
	}
}

function validaFormularioCerrarVenta(objeto){//diego
	validaVacio(objeto.elementos.tipoDocumento);
	validaVacioSelect(objeto.elementos.cliente);
	validaVacio(objeto.elementos.fechaVenta);

	if(objeto.elementos.tipoDocumento.val()=="" || objeto.elementos.cliente.val()==""){
		mensajeSistema(0);
	}else if($("#idEstadoVenta").text()!=2506){
		mensajeSistema('¡Para cerrar la venta el pedido debe estar atendido!');
	}else if($("#totalPedidoFinal").text() == 0){
		mensajeSistema('¡No hay productos para cerrar la venta!');
	}else if(parseFloat($("#pagoTotal").text()) > parseFloat($("#recibido").text())){
		mensajeSistema('¡Para cerrar la venta debe pagar toda la cuenta!');
	}else{
		verificaDocumentoCliente(objeto);
		//cerrarVenta(objeto);
	}
}

async function verificaDocumentoCliente(objeto){
	bloquea();
	try{
		const buscar= await axios.get("/api/cliente/buscar/"+objeto.elementos.cliente.val()+"/"+verSesion(),{ 
            headers:{
				authorization: `Bearer ${verToken()}`
			} 
        });

        const buscar2= await axios.get("/api/serie/buscar/"+objeto.elementos.tipoDocumento.val()+"/"+verSesion(),{ 
            headers:{
				authorization: `Bearer ${verToken()}`
			} 
        });
		desbloquea();
		let documentoCliente=buscar.data.valor.info.ABREVIATURA_DOCUMENTO;
        let numeroDocumento=buscar.data.valor.info.NUMERO_DOCUMENTO;
        let tipoDocumento=buscar2.data.valor.info.ABREVIATURA_COMPROBANTE;

		if(numeroDocumento===null){
			mensajeSistema('!El cliente no tiene registrado un número de documento¡');
        }else if((documentoCliente=='DNI' || documentoCliente=='CE' || documentoCliente=='OD' || documentoCliente=='PT') && (tipoDocumento=='FT' || tipoDocumento=='FTD')){
            mensajeSistema('!La factura necesita un RUC¡');
        }else if(documentoCliente=='RUC' && tipoDocumento=='BV'){
			mensajeSistema('!La boleta necesita un DNI');
        }else{
            cerrarVenta(objeto);
        }
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function crearPedido(objeto){
	let tipo=(objeto.esDelivery==0)?' EN MESA':' PARA LLEVAR';
	let accion=(objeto.accion=='crea')?'¡Se creará un nuevo pedido':' ¡Se modificará el pedido';

	confirm(accion+ tipo+'¡',function(){
		return false;
	},async function(){
        bloquea();
		let body={
			id:objeto.id,
			estadoVenta: 2504,
			idZona: objeto.idZona,
			idMesa: objeto.idMesa,
			idCliente: objeto.idCliente,
			idMozo:objeto.idMozo,
			esDelivery: objeto.esDelivery,
			sesId:verSesion()
		}
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
						
						authorization: `Bearer ${verToken()}`} 
				});
			}
			const resp=creaEdita.data.valor;
			desbloquea();
			$("#general1").modal("hide");
			if(resp.resultado){
				if(resp.info.MESA_DISPONIBLE==0){
					mensajeSistema('¡La mesa seleccionada ya fue ocupada!');
				}else{
					if(objeto.id>0){
						if(objeto.esDelivery==1){
							//$("#listaTodoDelivery #cliente"+resp.info.ID_VENTA).text(resp.info.CLIENTE);
							success("PEDIDO ACTUALIZADO","Pedido para: "+resp.info.CLIENTE);
						}else{
							//$("#listaTodoMesa #zonaMesa"+resp.info.ID_VENTA).text(resp.info.NOMBRE_ZONA+' - '+resp.info.NOMBRE_MESA);
							success("PEDIDO ACTUALIZADO","Pedido para: "+resp.info.NOMBRE_ZONA+' - '+resp.info.NOMBRE_MESA);
						}

						socket.emit('editaPedido',{
							esDelivery:objeto.esDelivery,
							CLIENTE:resp.info.CLIENTE,
							MOZO:resp.info.MOZO,
							MESA:resp.info.NOMBRE_ZONA+` - `+resp.info.NOMBRE_MESA,
							ID_VENTA:resp.info.ID_VENTA,
							sucursal: 'S'+$('#sucursal').val()
						});

					}else{
						socket.emit('creaPedidoCajeroAdministrador',{
							esDelivery:objeto.esDelivery,
							CLIENTE:resp.info.CLIENTE,
							MESA:resp.info.NOMBRE_ZONA+` - `+resp.info.NOMBRE_MESA,
							USUARIO:resp.info.USUARIO,
							ESTADO_VENTA:resp.info.ESTADO_VENTA,
							DETALLE_ESTADO_VENTA:resp.info.DETALLE_ESTADO_VENTA,
							ID_VENTA:resp.info.ID_VENTA,
							FECHA_VENTA:resp.info.FECHA_VENTA,
							cajeroAdministrador: 'CA'+$('#sucursal').val()
						});

						socket.emit('creaPedidoMozo',{
							esDelivery:objeto.esDelivery,
							CLIENTE:resp.info.CLIENTE,
							MESA:resp.info.NOMBRE_ZONA+` - `+resp.info.NOMBRE_MESA,
							USUARIO:resp.info.USUARIO,
							ESTADO_VENTA:resp.info.ESTADO_VENTA,
							DETALLE_ESTADO_VENTA:resp.info.DETALLE_ESTADO_VENTA,
							ID_VENTA:resp.info.ID_VENTA,
							FECHA_VENTA:resp.info.FECHA_VENTA,
							mozo: 'M'+resp.info.ID_MOZO
						});
						
					}
				}
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


function eliminaPedido(objeto){
	let textoInicial=(objeto.esDelivery==1)?'¡Se eliminará el pedido del cliente: ':'¡Se eliminará el pedido de la zona y mesa: ';
	let textoFinal=(objeto.esDelivery==1)?'¡Se eliminó el pedido del cliente: ':'¡Se eliminó el pedido de la zona y mesa: ';
	let lugar=(objeto.esDelivery==1)?'delivery':'mesa';

	confirm(textoInicial+objeto.nombre+'¡',function(){
		return false;
	},async function(){
        bloquea();
		try {
			const eliminar = await axios.delete("/api/"+objeto.tabla+"/eliminar/"+objeto.id,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			const resp=eliminar.data.valor;
			desbloquea();
			if(resp.resultado){
      
				success("eliminado",textoFinal+objeto.nombre);

				socket.emit('eliminaPedido',{
					id:objeto.id,
					tabla:objeto.tabla,
					lugar:lugar,
					esDelivery:objeto.esDelivery,
					mensaje:textoFinal+objeto.nombre,
					sucursal: 'S'+$('#sucursal').val()
				});
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


function buscarCliente(objeto){
	$('#'+objeto.tabla).off('change');
	$('#'+objeto.tabla).on( 'change', 'select[name=cliente]', function () {
		validaVacioSelect($(this));
	});

	$('#'+objeto.tabla).off('click');
	$('#'+objeto.tabla).on( 'click', 'button[name=btnMozo]', function () {
		listarMozos(objeto);
	});
;
	$('#'+objeto.tabla).on( 'click', 'button[name=btnGuarda]', function () {
		let idOpcion=(objeto.accion=='crea')?4:5;
		verificaSesion('O',objeto.idSubMenu,idOpcion,function( ){//CREA  O MODIFICA
			let idCliente=$('#'+objeto.tabla+' select[name=cliente]');
			let idMozo=$('#'+objeto.tabla+' input[name=mozo]');

			if(idCliente.val()>0 && idMozo.val()>0){
				crearPedido({id:objeto.id,idZona:0,idMesa:0,idCliente:idCliente.val(), esDelivery:objeto.esDelivery, accion:objeto.accion, tabla:objeto.tabla,idMozo:idMozo.val()});
			}else{
				mensajeSistema('¡Debe seleccionar el cliente y el mozo para iniciar el pedido!');
			}

			validaVacioSelect(idCliente);
		});
	});

	$('#'+objeto.tabla).on( 'click', 'button[name=btnCliente]', function () {
		verificaSesion('O',objeto.idSubMenu,4,async function( ){//CREA
			try{
				const boton= await axios.get('/api/acceso/privilegio/62/'+verSesion(),{
					headers: 
					{ 
						authorization: `Bearer ${verToken()}`
					} 
				});
				const resp=boton.data.valor.botones;
				modalLinkCliente({id:0,nombre:0,nombreSubmenu:'cliente',idSubMenu:62,tabla:'cliente',accion:'Crea',orden:0,ancho:600,titulo:'NUEVO CLIENTE',vista:'pedido',tipo:'nopago',resp:resp});
			}catch (err) {
				desbloquea();
				message=(err.response)?err.response.data.error:err;
				mensajeError(message);
			}
		});
	});
}


function gestionarDetallePedido(objeto){
	$('#'+objeto.tabla+objeto.accion+' #listaDetalle').off( 'click');
	$('#'+objeto.tabla+objeto.accion+' #listaDetalle').on( 'click', 'ul li div.opcionesDetalle i', function () {
    	let id=$(this).parent().siblings('input[name=quitaPedido]').val();
		let esAtendido=$(this).parent().siblings('input[name=esAtendido]').val();
		let nombreSubmenu=$('#'+objeto.tabla+objeto.accion+' #listaDetalle span.muestraModulo').text();
		let idSubMenu=$('#'+objeto.tabla+objeto.accion+' #listaDetalle span.muestraSubmenu').text();
		let nombre=$(this).parent().siblings('input[name=nombreProducto]').val();

		if($(this).hasClass('elimina')){
			/*if($("#nivel").val()==8 || $("#nivel").val()==1){
				eliminaPedidodetalle({id:id,esAtendido:esAtendido,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,orden:id,tabla:objeto.tabla,accion:'elimina', resp:objeto.resp});
			}else{*/
				if(esAtendido==2){
					mensajeSistema('¡No se puede eliminar productos, el pedido ya esta atendido!');
				}else if(esAtendido==1){
					enviarComandaDetalleEliminado({id:id,esAtendido:esAtendido,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,orden:id,tabla:objeto.tabla,accion:'elimina', resp:objeto.resp,esDelivery:objeto.esDelivery});
				}else{
					eliminaPedidodetalle({id:id,esAtendido:esAtendido,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,orden:id,tabla:objeto.tabla,accion:'elimina', resp:objeto.resp,esDelivery:objeto.esDelivery});
				}
			//}
		}

		if($(this).hasClass('comentario')){
			/*if($("#nivel").val()==8 || $("#nivel").val()==1){
				comentarioPedidodetalle({id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,orden:id,tabla:objeto.tabla,accion:'comentario',ancho:400, resp:objeto.resp});
			}else{*/
			if(objeto.tipo=='venta'){
				comentarioPedidodetalle({id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,orden:id,tabla:objeto.tabla,accion:'comentario',ancho:400, resp:objeto.resp,esDelivery:objeto.esDelivery});
			}else{
				if(esAtendido==1){
					mensajeSistema('¡No se puede agregar comentarios, el pedido ya esta ordenado!');
				}else if(esAtendido==2){
					mensajeSistema('¡No se puede agregar comentarios, el pedido ya esta atendido!');
				}else{
					comentarioPedidodetalle({id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,orden:id,tabla:objeto.tabla,accion:'comentario',ancho:400, resp:objeto.resp,esDelivery:objeto.esDelivery});
				}
			}
		}

		if($(this).hasClass('cantidad')){
			/*if($("#nivel").val()==8 || $("#nivel").val()==1){
				cantidadPedidodetalle({id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,orden:id,tabla:objeto.tabla,accion:'cantidad',ancho:400, resp:objeto.resp});
			}else{*/
			if(objeto.tipo=='venta'){
				cantidadPedidodetalle({id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,orden:id,tabla:objeto.tabla,accion:'cantidad',ancho:400, resp:objeto.resp,esDelivery:objeto.esDelivery});
			}else{
				if(esAtendido==1){
					mensajeSistema('¡No se puede agregar cantidades, el pedido ya esta ordenado!');
				}else if(esAtendido==2){
					mensajeSistema('¡No se puede agregar cantidades, el pedido ya esta atendido!');
				}else{
					cantidadPedidodetalle({id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,orden:id,tabla:objeto.tabla,accion:'cantidad',ancho:400, resp:objeto.resp,esDelivery:objeto.esDelivery});
				}
			}
		}

		if($(this).hasClass('precio')){
			if(objeto.tipo=='venta'){
				precioPedidodetalle({id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,orden:id,tabla:objeto.tabla,accion:'cantidad',ancho:400, resp:objeto.resp,esDelivery:objeto.esDelivery});
			}else{
				if(esAtendido==1){
					mensajeSistema('¡No se puede cambiar el precio, el pedido ya esta ordenado!');
				}else if(esAtendido==2){
					mensajeSistema('¡No se puede cambiar el precio, el pedido ya esta atendido!');
				}else{
					precioPedidodetalle({id:id,nombreSubmenu:nombreSubmenu,nombre:nombre,idSubMenu:idSubMenu,orden:id,tabla:objeto.tabla,accion:'cantidad',ancho:400, resp:objeto.resp,esDelivery:objeto.esDelivery});
				}
			}
		}
	});


	/*$('#'+objeto.tabla+objeto.accion+' #listaDetalle').on( 'click', 'div.detallePedido button.agrega', function () {
		verificaSesion('O',objeto.idSubMenu,13,function( ){//AGREGAR
			//if($("#idEstadoVenta").text()>2505){
				//mensajeSistema('¡No se puede agregar productos, el pedido ya esta atendido!');
			//}else{
				modalLinkProductoDetalle(objeto);
			//}
		});
	});*/

	$('#'+objeto.tabla+objeto.accion+' .listaDetalleAgrega').on( 'click', 'button.agrega', function () {
		verificaSesion('O',objeto.idSubMenu,13,function( ){//AGREGAR
			if(objeto.tipo=='venta'){
				modalLinkProductoDetalle(objeto);
			}else{
				if($("#idEstadoVenta").text()>2505){
					mensajeSistema('¡No se puede agregar productos, el pedido ya esta atendido!');
				}else{
					modalLinkProductoDetalle(objeto);
				}
			}
		});
	});

	$('#'+objeto.tabla+objeto.accion+' #listaDetalle').on( 'click', 'div.detallePedido button.comanda', function () {
		verificaSesion('O',objeto.idSubMenu,24,function( ){//COMANDAR
			if($("#totalPedidoFinalDetalle").length == 0){
				mensajeSistema('¡No hay productos para enviar a la comanda!')
			}else if($("#esAtendidoVenta").text()==1){
				mensajeSistema('¡No se puede enviar la comanda, el pedido ya esta ordenado!')
			}else if($("#esAtendidoVenta").text()==2){
				mensajeSistema('¡No se puede enviar la comanda, el pedido ya esta atendido!')
			}else{
				try{
					enviarComanda({id:objeto.id,nombreSubmenu:objeto.nombreSubmenu,nombre:objeto.nombre,idSubMenu:objeto.idSubMenu,orden:objeto.id,tabla:objeto.tabla,accion:objeto.accion,estadoVenta:2505,atendidoVenta:1, resp:objeto.resp});
				}catch (err) {
					message=(err.response)?err.response.data.error:err;
					mensajeError(message);
				}
			}
		});
	});

	$('#'+objeto.tabla+objeto.accion+' #listaDetalle .detallePedido').on( 'click', 'button[name=btnPrecuenta]', function () {
		verificaSesion('O',objeto.idSubMenu,38,function( ){//PRECUENTA
			if($("#totalPedidoFinal").text() == 0){
				mensajeSistema('¡No hay productos para imprimir la precuenta!');
			}else{
				//enviarPrecuenta(objeto);
				enviarPrecuenta({id:objeto.id,tabla:'pedido',accion:'paga',idDet:0});
			}
		});
	});

	$('#'+objeto.tabla+objeto.accion).off( 'click');
	$('#'+objeto.tabla+objeto.accion).on( 'click', 'div i.cambiaEstado', function () {
		let id=$(this).siblings('input.idV').val();
		if($("#idEstadoVenta").text()==2505){
			cambiaEstadoPedidoMozo({id:id,idEstado:2506})
		}
	});

	function cambiaEstadoPedidoMozo(objeto){
		confirm('¡Se cambiará al estado ATENDIDO',function(){
			return false;
		},async function(){
			bloquea();
			try {
				let body= {
					idP:objeto.id,
					idDet:objeto.idEstado,
					tipo:'estadoAtendido',
					sesId:verSesion(),
				}
				const estado = await axios.post("/api/pedidodetalle/estado/mozo",body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
				desbloquea();
				const resp=estado.data.valor.info;
				if(resp[0].ES_DELIVERY==0 || resp[0].ES_DELIVERY==1){
					$('#pedidoDetalle #iconoEstado').addClass('oculto').removeClass('col-2');
					$('#pedidoDetalle #columnaBoton').removeClass('col-3').addClass('col-5');
					$("#idEstadoVenta").text(2506)
					$("#esAtendidoVenta").text(2);
					$('#pedidoDetalle #listaDetalle .opcionesDetalle .agrupa1').val(2);
					$('#pedidoDetalle #listaDetalle .opcionesDetalle .agrupa1').removeClass('agrupa1').addClass('agrupa2');
				}else{
					$('#pedidoDetalle #iconoEstado').addClass('oculto').removeClass('col-2');
					$('#pedidoDetalle #columnaBoton').removeClass('col-3').addClass('col-5');
					$("#idEstadoVenta").text(2506)
					$("#esAtendidoVenta").text(2);
					$('#servicioDetalle #listaDetalle .opcionesDetalle .agrupa1').val(2);
					$('#servicioDetalle #listaDetalle .opcionesDetalle .agrupa1').removeClass('agrupa1').addClass('agrupa2');
				}
				
				socket.emit('actualizaEstadoPedidoMozo',{
					ES_DELIVERY:resp[0].ES_DELIVERY,
					ID_VENTA:resp[0].ID_VENTA,
					ESTADO_DETALLE:resp[0].ESTADO_DETALLE,
					ESTADO_VENTA:resp[0].ESTADO_VENTA,
					sucursal: 'S'+$('#sucursal').val()
				});
			}catch (err) {
				desbloquea();
				message=(err.response)?err.response.data.error:err;
				mensajeError(message);
			}
		});
	}

	async function modalLinkProductoDetalle(objeto){
		bloquea();
		try {
			const lista =  await axios.get("/api/categoria/listar/0/"+verSesion(),{ 
				headers:{
					authorization: `Bearer ${verToken()}`
			} 
			});
			desbloquea();
			const categoria=lista.data.valor.info;
			let msg=`
			<div class="row" id="${objeto.tabla}">
				<div class="col-12">
					<div id="bloqueCategoria">
						<div id="categoria" class="row pl-1 pr-1">`;
							for(var c=0;c<categoria.length;c++){
								if(categoria[c].ES_VIGENTE==1){
							msg+=`<div class="col-md-3 mb-2 pl-1 pr-1" id="cat${ categoria[c].ID_CATEGORIA}">
									<div class="card mb-0 cursor">
										<div class="card-body pl-1 pr-1">
											<div class="text-center">
												${categoria[c].NOMBRE}
											</div>
										</div>
									</div>
								</div>`;
							}}
					msg+=`</div>
						<div class="detalleProducto col-md-12 pl-0 pr-0 pb-1 text-center">
							<hr>
							<button type='Cancela' name='btnCancela' class='mr-1 btn btn-secondary btn-md cancela'>
								<i class='la la-times'></i>
								<span class='p-1'>Cancelar</span>
							</button>
						</div>
					</div>
					<div id="bloqueProducto" class="oculto">
						<div id="pedidoProductoDetalle" class="row pl-1 pr-1">
							
						</div>
						<div>
							<div class="detalleProducto col-md-12 pl-0 pr-0 pb-1 text-center">
								<hr>
								<button type='btnRegresa' name='btnRegresa' class='mr-1 btn btn-secondary btn-md regresa'>
									<i class="las la-arrow-circle-left"></i>
									<span class='p-1'>Regresar</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>`;
			mostrar_general2({titulo:objeto.titulo,nombre:objeto.nombre,msg:msg,ancho:objeto.ancho});
			$('#bloqueCategoria').on( 'click', '#categoria .mb-2', function () {
				let idCategoria=$(this).attr('id').replace('cat','');
				muestraProductos({idCategoria:idCategoria,tabla:objeto.tabla,id:objeto.id,esDelivery:objeto.esDelivery,actualiza:objeto.actualiza});
			});
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
	}
}

async function muestraProductos(objeto){
	bloquea();
	try{
		const lista =  await axios.get("/api/categoria/listar/producto/"+objeto.idCategoria+"/"+verSesion(),{ 
			headers:{authorization: `Bearer ${verToken()}`} 
		});
		const producto=lista.data.valor.info;
		let msg=`
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">`;
				if(producto.length>0){
				msg+=`<li class="breadcrumb-item active" aria-current="page">${producto[0].CATEGORIA}</li>`;
				}
		msg+=`</ol>
		</nav>
		<div class="col-12">
			<div class="productosTodos" id="productosTodos">
				<div class="row list p-0 listaProductos">`;
					for(var i=0;i<producto.length;i++){
						if(producto[i].ES_VIGENTE==1){
					msg+=`<div class="prod col-md-3 mb-2 pl-1 pr-1" id="producto${ producto[i].ID_PRODUCTO_SUCURSAL}">
							<div class="card mb-0 cursor">
								<div class="card-body pl-1 pr-1">
									<div class="text-center">
										<h6 class="productoNombre">${ producto[i].NOMBRE}</h6>`;
										if(objeto.esDelivery!=3){
										msg+=`<h6 class="stockProducto">${ producto[i].STOCK+" "+producto[i].ABREVIATURA_UNIDAD}</h6>`;
										}
								msg+=`</div>
									<div class="text-center">
										<h5>${ producto[i].ABREVIATURA_MONEDA+' '+parseFloat(producto[i].PRECIO).toFixed(2)}</h5>
									</div>
								</div>
							</div>
							<input type="hidden" value="${ producto[i].ID_PRODUCTO_SUCURSAL}" name="productoPedido">
							<input type="hidden" value="${ producto[i].PRECIO}" name="productoMonto">
							<input type="hidden" value="${ producto[i].STOCK}" name="cantProducto">
						</div>`;
					}}
			msg+=`</div>
			</div>
		</div>`;
		desbloquea();
		$('#bloqueCategoria').addClass('oculto');
		$('#bloqueProducto').removeClass('oculto');
		$('#pedidoProductoDetalle').html(msg);
		$('#bloqueProducto').on( 'click', 'button.regresa', function () {
			$('#bloqueProducto').addClass('oculto');
			$('#bloqueCategoria').removeClass('oculto');
		});

		seleccionaProducto(objeto);
			
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function seleccionaProducto(objeto){
	$('#'+objeto.tabla+'ProductoDetalle #productosTodos').off( 'click');
	$('#'+objeto.tabla+'ProductoDetalle #productosTodos').on( 'click', '.list .prod', function () {
		let idProductoSucursal=$(this).find('input[name=productoPedido]').val();
		let cantProducto=$(this).find('input[name=cantProducto]').val();
		let monto=$(this).find('input[name=productoMonto]').val();
		let producto=$(this).find('h6.productoNombre').text();
		if(cantProducto>0){
			//agregaDetallePedido({tabla:objeto.tabla,idVenta:objeto.id,idProductoSucursal:idProductoSucursal, monto:monto, accion:'crea', esDelivery:objeto.esDelivery,actualiza:objeto.actualiza})
			modalLinkCantidadComentario({tabla:objeto.tabla,idVenta:objeto.id,idProductoSucursal:idProductoSucursal, monto:monto, accion:'crea',idSubMenu:objeto.idSubMenu,producto:producto,esDelivery:objeto.esDelivery})
		}else{
			mensajeSistema('¡No hay stock para este producto!');
		}
	});
}

function modalLinkCantidadComentario(objeto){
    bloquea();
	try{
		let msg=`
		<form id="${objeto.tabla}detalleCantidadComentario">
			<div class="row">
				<div class="form-group col-md-12 text-center">
					<div class="btn-group btn-group-lg ">
						<button type="button" class="btn btn-danger alturaBoton pb-0 pt-0 menos">-</button>
						<input name="cantidad" type="text" maxlength="2" autocomplete="off" class="form-control text-center" value="0" />
						<button type="button" class="btn btn-primary alturaBoton pb-0 pt-0 mas">+</button>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="form-group col-md-12">
					<textarea  rows="5" autocomplete="off" class="form-control p-1 muestraMensaje" maxlength="500" name="comentario" placeholder="Ingrese el comentario"></textarea>
				</div>
			</div>
			<div class="form-section p-0"></div>
			<div class="col-md-12 pl-0 pr-0 text-center">
				<button type='Cancela' name='btnCancela' class='mr-1 btn btn-secondary btn-md cancela'>
					<i class='la la-times'></i>
					<span class='p-1'>Cancelar</span>
				</button>

				<button type='Crea' name='btnGuarda' class='crud btn btn-primary btn-md crea'>
					<i class='la la-save'></i>
					<span class='p-1'>Guardar</span>
				</button>
			</div>
		</form>`;
		desbloquea();
        mostrar_general3({titulo:'CANTIDAD / COMENTARIO',nombre:objeto.producto,msg:msg,ancho:500});
		enviaCantidadComentarioPedido(objeto);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function enviaCantidadComentarioPedido(objeto){
	let cantidad=$('#'+objeto.tabla+'detalleCantidadComentario input[name=cantidad]');
	let comentario=$('#'+objeto.tabla+'detalleCantidadComentario textarea[name=comentario]');
	numeroRegex(cantidad);
	comentarioRegex(comentario);
	$('#'+objeto.tabla+'detalleCantidadComentario').off('click');
	$('#'+objeto.tabla+'detalleCantidadComentario').on( 'click', 'button.menos', function () {
		if(cantidad.val()>0){
			cantidad.val(cantidad.val()-1);
		}
	});
	$('#'+objeto.tabla+'detalleCantidadComentario').on( 'click', 'button.mas', function () {
		if(cantidad.val()<100){
			cantidad.val(cantidad.val()-(-1));
		}
	});
	$('#'+objeto.tabla+'detalleCantidadComentario').on( 'click', 'button[name=btnGuarda]', function () {
		let cantidad=$('#'+objeto.tabla+'detalleCantidadComentario input[name=cantidad]');
		let comentario=$('#'+objeto.tabla+'detalleCantidadComentario textarea[name=comentario]');
		if(cantidad.val()>0){
			agregaDetallePedido(objeto, comentario.val(), cantidad.val());
		}else{
			info('¡Debe ingresar una cantidad!');
		}
	});
}


async function agregaDetallePedido(objeto, comentario, cantidad){
	bloquea();
	try{
		let body= {
			id:objeto.actualiza,
			idVenta:objeto.idVenta,
			idProductoSucursal:objeto.idProductoSucursal,
			cantidad:cantidad,
			comentario:comentario,
			monto:objeto.monto,
			sesId:verSesion()
		}
		const crear = await axios.post("/api/pedidodetalle/crear",body,{ 
            headers:{
				authorization: `Bearer ${verToken()}`
			} 
        });
		desbloquea();
		$("#general3").modal("hide");
		const resp=crear.data.valor;
		if(objeto.esDelivery==3){
			actualizaDetalleAtencion(objeto, resp)
		}else{
			actualizaDetallePedido(objeto, resp)
		}
		
		socket.emit('actualizaStockCarta',{
			esDelivery:objeto.esDelivery,
			tabla:objeto.tabla,
			ID_PRODUCTO_SUCURSAL:resp.info.ID_PRODUCTO_SUCURSAL,
			STOCK:resp.info.STOCK,
			ABREVIATURA_UNIDAD:resp.info.ABREVIATURA_UNIDAD,
			sucursal: 'S'+$('#sucursal').val()
		});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function actualizaDetallePedido(objeto, resp){
	if(resp.info.LOGICA=='crea'){
		$('#'+objeto.tabla+'Detalle #listaDetalle li#totalPedido').remove();
		$('#'+objeto.tabla+'Detalle #listaDetalle ul div#sinPedido').remove();
		$('#'+objeto.tabla+'Detalle #listaDetalle ul').append(`
		<li class="list-group-item" id="pedido`+resp.info.ID_DETALLE+`">
			<div class="row">
				<div class="col d-flex justify-content-center align-items-center">
					<div>
						<div><h6 class="text-center">`+resp.info.PRODUCTO+`</h6></div>
						<div><h6 class="salto text-center" id="comentario`+resp.info.ID_DETALLE+`">${(resp.info.OBSERVACION===null)?'':resp.info.OBSERVACION}</h6></div>
					</div>
				</div>
				<div class="col text-center d-flex justify-content-center align-items-center">
					<div>
						<div><h6 class="text-center" id="cantidad`+resp.info.ID_DETALLE+`">`+resp.info.CANTIDAD+` <span class='normal'>`+resp.info.ABREVIATURA_UNIDAD+`</span></h6></div>
						<div><h4 id="montoCantidad`+resp.info.ID_DETALLE+`">`+parseFloat(resp.info.MONTO).toFixed(2)+`</h4></div>
					</div>
				</div>
			</div>
			<div class="row opcionesDetalle">
				<div class="col d-flex justify-content-center align-items-center">
					<i class="cursor las la-comment la-2x comentario" data-toggle="tooltip" data-placement="top" title="Comentario"></i>
				</div>
				<div class="col d-flex justify-content-center align-items-center">
					<i class="cursor las la-list-ol la-2x cantidad" data-toggle="tooltip" data-placement="top" title="Cantidad"></i>
				</div>
				<div class="col d-flex justify-content-center align-items-center">
					<i class="cursor las la-coins la-2x precio" data-toggle="tooltip" data-placement="top" title="Precio"></i>
				</div>
				<div class="col d-flex justify-content-center align-items-center">
					<i class="cursor las la-trash la-2x elimina" data-toggle="tooltip" data-placement="top" title="Eliminar"></i>
				</div>
				<input type="hidden" name="quitaPedido" value="`+resp.info.ID_DETALLE+`">
				<input type="hidden" class="agrupa0" name="esAtendido" value="0">
				<input type="hidden" name="nombreProducto" value="`+resp.info.PRODUCTO+`">
			</div>
		</li>
		<li class="list-group-item pb-0 pt-0" id="totalPedido">
			<div class="row">
				<div class="col d-flex justify-content-start align-items-center"><h3><strong>TOTAL</strong></h3></div>
				<div class="col d-flex justify-content-center align-items-center">
					<div>
						<h2><strong id="totalPedidoFinalDetalle">`+parseFloat(resp.info.TOTAL).toFixed(2)+`</strong></h2>
					</div>
				</div>
			</div>
		</li>
		`);
		$("#esAtendidoVenta").text(0);
		$('#pedidoDetalle #iconoEstado').removeClass('col-2').addClass('oculto');
		$('#pedidoDetalle #columnaBoton').removeClass('col-3').addClass('col-5');
		toastr.success('Se agregó el producto: '+resp.info.PRODUCTO, 'PRODUCTO NUEVO',opcionesToast);
	}else if(resp.info.LOGICA=='edita'){
		$('#'+objeto.tabla+'Detalle #listaDetalle ul li div h6#cantidad'+resp.info.ID_DETALLE).html(resp.info.CANTIDAD+` <span class='normal'>`+resp.info.ABREVIATURA_UNIDAD+`</span>`);
		$('#'+objeto.tabla+'Detalle #listaDetalle ul li div h4#montoCantidad'+resp.info.ID_DETALLE).text(parseFloat(resp.info.MONTO).toFixed(2));

		$('#'+objeto.tabla+'Detalle #listaDetalle #totalPedidoFinalDetalle').text(parseFloat(resp.info.TOTAL).toFixed(2));

		toastr.success('Se aumento la cantidad del producto: '+resp.info.PRODUCTO, 'AUMENTO DE PEDIDO',opcionesToast);
	}
}

function actualizaDetalleAtencion(objeto, resp){
	if(resp.info.LOGICA=='crea'){
		$('#'+objeto.tabla+'Detalle #listaDetalle ul div#sinPedido').remove();
		$('#'+objeto.tabla+'Detalle #listaDetalle ul .listaDetalle').append(`
		<li class="list-group-item" id="pedido`+resp.info.ID_DETALLE+`">
			<div class="row">
				<div class="col d-flex justify-content-center align-items-center">
					<div>
						<div><h6 class="text-center">`+resp.info.PRODUCTO+`</h6></div>
						<div><h6 class="salto text-center" id="comentario`+resp.info.ID_DETALLE+`"></h6></div>
					</div>
				</div>
				<div class="col text-center d-flex justify-content-center align-items-center">
					<div>
						<div><h6 class="text-center" id="cantidad`+resp.info.ID_DETALLE+`">`+resp.info.CANTIDAD+` <span class='normal'>`+resp.info.ABREVIATURA_UNIDAD+`</span></h6></div>
						<div><h4 id="montoCantidad`+resp.info.ID_DETALLE+`">`+parseFloat(resp.info.MONTO).toFixed(2)+`</h4></div>
					</div>
				</div>
			</div>
			<div class="row opcionesDetalle">
				<div class="col d-flex justify-content-center align-items-center">
					<i class="cursor las la-comment la-2x comentario" data-toggle="tooltip" data-placement="top" title="Comentario"></i>
				</div>
				<div class="col d-flex justify-content-center align-items-center">
					<i class="cursor las la-list-ol la-2x cantidad" data-toggle="tooltip" data-placement="top" title="Cantidad"></i>
				</div>
				<div class="col d-flex justify-content-center align-items-center">
					<i class="cursor las la-coins la-2x precio" data-toggle="tooltip" data-placement="top" title="Precio"></i>
				</div>
				<div class="col d-flex justify-content-center align-items-center">
					<i class="cursor las la-trash la-2x elimina" data-toggle="tooltip" data-placement="top" title="Eliminar"></i>
				</div>
				<input type="hidden" name="quitaPedido" value="`+resp.info.ID_DETALLE+`">
				<input type="hidden" class="agrupa0" name="esAtendido" value="2">
				<input type="hidden" name="nombreProducto" value="`+resp.info.PRODUCTO+`">
			</div>
		</li>
		`);
		$('#'+objeto.tabla+'Detalle #listaDetalle #totalPedidoFinalDetalle').text(parseFloat(resp.info.TOTAL).toFixed(2));
		$('#'+objeto.tabla+'Inicio ul li.pestanaPagaPedido').html(`
			<a class="nav-link" id="pagar-tab" data-bs-toggle="tab"  data-bs-target="#pagar" type="button" role="tab" aria-controls="pagar" aria-selected="true"> PAGAR PEDIDO</a>
		`);
		$("#idEstadoVenta").text(2506);
		$("#esAtendidoVenta").text(2);
		toastr.success('Se agregó el producto: '+resp.info.PRODUCTO, 'PRODUCTO NUEVO',opcionesToast);
	}else if(resp.info.LOGICA=='edita'){
		$('#'+objeto.tabla+'Detalle #listaDetalle ul li div h6#cantidad'+resp.info.ID_DETALLE).html(resp.info.CANTIDAD+` <span class='normal'>`+resp.info.ABREVIATURA_UNIDAD+`</span>`);
		$('#'+objeto.tabla+'Detalle #listaDetalle ul li div h4#montoCantidad'+resp.info.ID_DETALLE).text(parseFloat(resp.info.MONTO).toFixed(2));

		$('#'+objeto.tabla+'Detalle #listaDetalle #totalPedidoFinalDetalle').text(parseFloat(resp.info.TOTAL).toFixed(2));

		toastr.success('Se aumento la cantidad del producto: '+resp.info.PRODUCTO, 'AUMENTO DE PEDIDO',opcionesToast);
	}
}

function eliminaPedidodetalle(objeto){
	confirm('¡Se eliminará el producto: '+objeto.nombre+'!',function(){
		return false;
	},async function(){
        bloquea();
		try{
			const eliminar = await axios.delete("/api/"+objeto.tabla+"detalle/eliminar/"+objeto.id,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			desbloquea();
			const resp=eliminar.data.valor;
			if(resp.resultado){
				if(objeto.esDelivery==3){
					eliminaDetalleAtencion(objeto, resp)
				}else{
					eliminaDetallePedido(objeto, resp)
				}
				socket.emit('actualizaStockCarta',{
					esDelivery:objeto.esDelivery,
					tabla:objeto.tabla,
					ID_PRODUCTO_SUCURSAL:resp.info.ID_PRODUCTO_SUCURSAL,
					STOCK:resp.info.STOCK_TOTAL,
					ABREVIATURA_UNIDAD:resp.info.UNIDAD,
					sucursal: 'S'+$('#sucursal').val()
				});
			}else{
				mensajeSistema(resp.mensaje);
			}
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
	})
}

function eliminaDetallePedido(objeto, resp){
	$('#'+objeto.tabla+'Detalle #listaDetalle #pedido'+objeto.orden).remove();
	if(resp.info.TOTAL===null){
		$('#'+objeto.tabla+'Detalle #listaDetalle ul').html(`
			<div id="sinPedido" class="alert alert-icon-right alert-info alert-dismissible mb-1 mt-1" role="alert">
				<span class="alert-icon"><i class="la la-info-circle"></i></span>
				<strong>¡Aun no tiene pedidos registrados!</strong>
			</div>
		`);
	}else{
		$('#'+objeto.tabla+'Detalle #listaDetalle #totalPedidoFinalDetalle').text(parseFloat(resp.info.TOTAL).toFixed(2));
	}
	$("#esAtendidoVenta").text(resp.info.ES_ATENDIDO);
	success("eliminado",'¡Se eliminó el producto: '+objeto.nombre+'!');
}

function eliminaDetalleAtencion(objeto, resp){
	$('#'+objeto.tabla+'Detalle #listaDetalle #pedido'+objeto.orden).remove();
	$('#'+objeto.tabla+'Producto ul.listaProductos li#producto'+resp.info.ID_PRODUCTO_SUCURSAL+' h6.stockProducto').text(resp.info.STOCK_TOTAL+' '+resp.info.UNIDAD);

	if(resp.info.TOTAL===null){
		$('#'+objeto.tabla+'Detalle #listaDetalle ul .listaDetalle').html(`
			<div id="sinPedido" class="alert alert-icon-right alert-info alert-dismissible mb-1 mt-1" role="alert">
				<span class="alert-icon"><i class="la la-info-circle"></i></span>
				<strong>¡Aun no tiene pedidos registrados!</strong>
			</div>
		`);
		$('#'+objeto.tabla+'Inicio .opcionesDelivery #estado'+resp.info.ID_VENTA).html(`<span class="badge badge-info">Iniciado</span>`);
		$('#'+objeto.tabla+'Detalle #idEstadoVenta').text(2504)
		$('#'+objeto.tabla+'Detalle #esAtendidoVenta').text(0);
		$('#'+objeto.tabla+'Detalle #listaDetalle #totalPedidoFinalDetalle').text('0.00');

		$('#'+objeto.tabla+'Inicio ul li.pestanaPagaPedido').html('')
	}else{
		$('#'+objeto.tabla+'Detalle #listaDetalle #totalPedidoFinalDetalle').text(parseFloat(resp.info.TOTAL).toFixed(2));
	}
	$("#esAtendidoVenta").text(resp.info.ES_ATENDIDO);
	success("eliminado",'¡Se eliminó el producto: '+objeto.nombre+'!');
}

function enviarComanda(objeto){
	confirm('¡Se enviará la impresión del pedido!',function(){
		return false;
	},async function(){
		bloquea();
		try {
			let body={
				idP:objeto.id,
				idDet:objeto.estadoVenta,
				tabla:objeto.tabla,
				idSubMenu:objeto.idSubMenu,
				nombre: objeto.nombre,
				tipo:'imprimirComanda',
				sesId:verSesion()
			}
			const comanda =  await axios.post("/api/"+objeto.tabla+"detalle/comanda",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});

			const resp=comanda.data.valor;

			desbloquea();

			if($('#impresionGeneral').val()==1){
				fetch('http://localhost:4444/api/impresion/comanda', {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(resp)
				})
				.then(function(response) {
					response.json()
					.then(function(data){

						if(data.valor.cocina=='error'){
							toastr.error('¡No se pudo imprimir, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - COCINA',opcionesToast);
						}else if(data.valor.cocina=='ok'){
							cambiarEstadoEsAtendido(objeto);
							//toastr.success('Se envió pedido a la cocina','PEDIDO ORDENADO - COCINA',opcionesToast);
						}else if(data.valor.cocina=='ko'){
							toastr.error('¡La impresora esta apagada, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - COCINA',opcionesToast);
						}

						if(data.valor.bar=='error'){
							toastr.error('¡No se pudo imprimir, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - BAR',opcionesToast);
						}else if(data.valor.bar=='ok'){
							cambiarEstadoEsAtendido(objeto);
							//toastr.success('Se envió pedido al bar','PEDIDO ORDENADO - BAR',opcionesToast);
						}else if(data.valor.bar=='ko'){
							toastr.error('¡La impresora esta apagada, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - BAR',opcionesToast);
						}

						if(data.valor.horno=='error'){
							toastr.error('¡No se pudo imprimir, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - HORNO',opcionesToast);
						}else if(data.valor.horno=='ok'){
							cambiarEstadoEsAtendido(objeto);
							//toastr.success('Se envió pedido al horno','PEDIDO ORDENADO - HORNO',opcionesToast);
						}else if(data.valor.horno=='ko'){
							toastr.error('¡La impresora esta apagada, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - HORNO',opcionesToast);
						}
					});
				})
				.catch(function(err) {
					console.log(err);
					console.log('error en la impresion');
				});
			}else{
				cambiarEstadoEsAtendido(objeto);
				//toastr.success('Se envió pedido a las areas','PEDIDO ORDENADO',opcionesToast);
			}
			/*let esDelivery=(resp[0].ES_DELIVERY==1)?'opcionesDelivery':'opcionesMesa'
			$('#pedido .'+esDelivery+' #estado'+resp[0].ID_VENTA).html(`<span class="badge badge-`+resp[0].DETALLE_ESTADO_VENTA+`">`+resp[0].ESTADO_VENTA+`</span>`);
			$('#pedidoDetalle #iconoEstado').removeClass('oculto').addClass('col-2');
			$('#pedidoDetalle #columnaBoton').removeClass('col-5').addClass('col-3');
			$("#idEstadoVenta").text(2505);
			$("#esAtendidoVenta").text(1);
			$('#pedidoDetalle #listaDetalle .opcionesDetalle .agrupa0').val(1);
			$('#pedidoDetalle #listaDetalle .opcionesDetalle .agrupa0').removeClass('agrupa0').addClass('agrupa1');
			cambiarEstadoEsAtendido(objeto);*/
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
	});
}


function enviarComandaEliminado(objeto){
	let textoInicial=(objeto.esDelivery==1)?'¡Se eliminará el pedido del cliente: ':'¡Se eliminará el pedido de la zona y mesa: ';
	let textoFinal=(objeto.esDelivery==1)?'¡Se envio comanda eliminada del cliente: ':'¡Se envio comanda eliminada de la zona y mesa: ';

	confirm(textoInicial+objeto.nombre+'¡',function(){
		return false;
	},async function(){
		bloquea();
		try {
			let body={
				idP:objeto.id,
				idDet:0,	
				tabla:objeto.tabla,
				idSubMenu:objeto.idSubMenu,
				nombre: objeto.nombre,
				tipo:'imprimirEliminaComanda',
				sesId:verSesion(),
			}

			const comanda =  await axios.post("/api/"+objeto.tabla+"detalle/comanda",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});

			const resp=comanda.data.valor;

			desbloquea();
			if($('#impresionGeneral').val()==1){
				fetch('http://localhost:4444/api/impresion/comanda', {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(resp)
				})
				.then(function(response) {
					response.json()
					.then(function(data){
						/*if(data.valor=='error'){
							toastr.error('¡No se pudo imprimir, revise su impresora!','PROBLEMA CON LA IMPRESIÓN',opcionesToast);
						}else if(data.valor=='ok'){
							eliminaPedidoComanda(objeto);
							toastr.success(textoFinal+' '+objeto.nombre+' anulado', 'PEDIDO ELIMINADO',opcionesToast);
						}else if(data.valor=='ko'){
							toastr.error('¡La impresora esta apagada, revise su impresora!','PROBLEMA CON LA IMPRESIÓN',opcionesToast);
						}*/
						if(data.valor.cocina=='error'){
							toastr.error('¡No se pudo imprimir, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - COCINA',opcionesToast);
						}else if(data.valor.cocina=='ok'){
							eliminaPedidoComanda(objeto);
							toastr.warning(textoFinal+' '+objeto.nombre+' anulado', 'PEDIDO ELIMINADO',opcionesToast);
						}else if(data.valor.cocina=='ko'){
							toastr.error('¡La impresora esta apagada, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - COCINA',opcionesToast);
						}

						if(data.valor.bar=='error'){
							toastr.error('¡No se pudo imprimir, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - BAR',opcionesToast);
						}else if(data.valor.bar=='ok'){
							eliminaPedidoComanda(objeto);
							toastr.warning(textoFinal+' '+objeto.nombre+' anulado', 'PEDIDO ELIMINADO',opcionesToast);
						}else if(data.valor.bar=='ko'){
							toastr.error('¡La impresora esta apagada, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - BAR',opcionesToast);
						}

						if(data.valor.horno=='error'){
							toastr.error('¡No se pudo imprimir, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - HORNO',opcionesToast);
						}else if(data.valor.horno=='ok'){
							eliminaPedidoComanda(objeto);
							toastr.warning(textoFinal+' '+objeto.nombre+' anulado', 'PEDIDO ELIMINADO',opcionesToast);
						}else if(data.valor.horno=='ko'){
							toastr.error('¡La impresora esta apagada, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - HORNO',opcionesToast);
						}
					});
					//eliminaPedidoComanda(objeto);
					//toastr.success(textoFinal+' '+objeto.nombre+' anulado', 'PEDIDO ELIMINADO');
				})
				.catch(function(err) {
					console.log(err);
					console.log('error en la impresion');
				});
			}else{
				eliminaPedidoComanda(objeto);
				toastr.warning(textoFinal+' '+objeto.nombre+' anulado', 'PEDIDO ELIMINADO',opcionesToast);
			}
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}	
	});
}

function enviarComandaDetalleEliminado(objeto){
	confirm('¡Se eliminara el pedido '+objeto.nombre+'!',function(){
		return false;
	},async function(){
		bloquea();
		try {
			let body={
				idP:objeto.id,
				idDet:0,	
				tabla:objeto.tabla,
				idSubMenu:objeto.idSubMenu,
				nombre: objeto.nombre,
				tipo:'imprimirEliminaDetalleComanda',
				sesId:verSesion(),
			}

			const comanda =  await axios.post("/api/"+objeto.tabla+"detalle/eliminar/comanda",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});

			const resp=comanda.data.valor;
			desbloquea();
			if($('#impresionGeneral').val()==1){
				fetch('http://localhost:4444/api/impresion/eliminacomanda', {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
						},
					body: JSON.stringify(resp)
				})
				.then(function(response) {
					response.json()
					.then(function(data){
						if(data.valor.cocina=='error'){
							toastr.error('¡No se pudo imprimir, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - COCINA',opcionesToast);
						}else if(data.valor.cocina=='ok'){
							eliminaPedidodetalleComanda(objeto);
							toastr.success('Se envio comanda con producto '+objeto.nombre+' anulado', 'PRODUCTO ELIMINADO',opcionesToast);
						}else if(data.valor.cocina=='ko'){
							toastr.error('¡La impresora esta apagada, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - COCINA',opcionesToast);
						}

						if(data.valor.bar=='error'){
							toastr.error('¡No se pudo imprimir, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - BAR',opcionesToast);
						}else if(data.valor.bar=='ok'){
							eliminaPedidodetalleComanda(objeto);
							toastr.success('Se envio comanda con producto '+objeto.nombre+' anulado', 'PRODUCTO ELIMINADO',opcionesToast);
						}else if(data.valor.bar=='ko'){
							toastr.error('¡La impresora esta apagada, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - BAR',opcionesToast);
						}

						if(data.valor.horno=='error'){
							toastr.error('¡No se pudo imprimir, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - HORNO',opcionesToast);
						}else if(data.valor.horno=='ok'){
							eliminaPedidodetalleComanda(objeto);
							toastr.success('Se envio comanda con producto '+objeto.nombre+' anulado', 'PRODUCTO ELIMINADO',opcionesToast);
						}else if(data.valor.horno=='ko'){
							toastr.error('¡La impresora esta apagada, revise su impresora!','PROBLEMA CON LA IMPRESIÓN - HORNO',opcionesToast);
						}
					});
					//eliminaPedidodetalleComanda(objeto);
					//toastr.success('Se envio comanda con producto '+objeto.nombre+' anulado', 'PRODUCTO ELIMINADO');
				})
				.catch(function(err) {
					console.log(err);
					console.log('error en la impresion');
				});
			}else{
				eliminaPedidodetalleComanda(objeto);
				toastr.warning('Se envio comanda con producto '+objeto.nombre+' anulado', 'PRODUCTO ELIMINADO',opcionesToast);
			}
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}	
	});
}


async function eliminaPedidoComanda(objeto){
	let textoFinal=(objeto.esDelivery==1)?'¡Se eliminó el pedido del cliente: ':'¡Se eliminó el pedido de la zona y mesa: ';
	let lugar=(objeto.esDelivery==1)?'delivery':'mesa';
	bloquea();
	try {
		const eliminar = await axios.delete("/api/"+objeto.tabla+"/eliminar/"+objeto.id,{ 
            headers:{
				authorization: `Bearer ${verToken()}`
			} 
        });
		desbloquea();
		const resp=eliminar.data.valor;


		if(resp.resultado){
			//$('#'+objeto.tabla+' #'+lugar+objeto.id).remove();
			
			/*if(objeto.esDelivery==0){
				mesaList.remove('id1', objeto.id);
			}else{
				deliveryList.remove('id2', objeto.id);
			}*/
			success("eliminado",textoFinal+' '+objeto.nombre+'!');

			socket.emit('eliminaPedido',{
				id:objeto.id,
				tabla:objeto.tabla,
				lugar:lugar,
				esDelivery:objeto.esDelivery,
				mensaje:textoFinal+objeto.nombre,
				sucursal: 'S'+$('#sucursal').val()
			});
		}else{
			mensajeSistema(resp.mensaje);
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}	
}


async function eliminaPedidodetalleComanda(objeto){
	bloquea();
	try {
		const eliminar = await axios.delete("/api/pedidodetalle/eliminar/"+objeto.id,{ 
            headers:{
				authorization: `Bearer ${verToken()}`
		} 
        });
		const resp=eliminar.data.valor;
		desbloquea();

		if(resp.resultado){
			$('#'+objeto.tabla+'Detalle #listaDetalle #pedido'+objeto.orden).remove();

			if(resp.info.TOTAL===null){
				$('#'+objeto.tabla+'Detalle #listaDetalle ul').html(`
					<div id="sinPedido" class="alert alert-icon-right alert-info alert-dismissible mb-1 mt-1" role="alert">
						<span class="alert-icon"><i class="la la-info-circle"></i></span>
						<strong>¡Aun no tiene pedidos registrados!</strong>
					</div>
				`);
				cambiarEstadoEsAtendido({id:resp.info.ID_VENTA,nombreSubmenu:objeto.nombreSubmenu,idSubMenu:objeto.idSubMenu,orden:resp.info.ID_VENTA,tabla:objeto.tabla,estadoVenta:2504,atendidoVenta:0, resp:objeto.resp});
			}else{
				$('#'+objeto.tabla+'Detalle #listaDetalle #totalPedidoFinal').text(parseFloat(resp.info.TOTAL).toFixed(2));
			}
		
			success("eliminado",'¡Se eliminó el producto: '+objeto.nombre+'!');
		}else{
			mensajeSistema(resp.mensaje);
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}	
}


async function cambiarEstadoEsAtendido(objeto){
	bloquea();
	try {
		let body={
			idP:objeto.id,
			idDet:objeto.atendidoVenta,
			tabla:objeto.tabla,
			idSubMenu:objeto.idSubMenu,
			nombre: objeto.nombre,
			tipo:'estadoEsAtendido',
			sesId:verSesion()
		}
		const comanda =  await axios.post("/api/"+objeto.tabla+"detalle/esatendido",body,{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});

		const resp=comanda.data.valor.info;
		desbloquea();

		if(objeto.atendidoVenta==1){
			$('#pedidoDetalle #iconoEstado').removeClass('oculto').addClass('col-2');
			$('#pedidoDetalle #columnaBoton').removeClass('col-5').addClass('col-3');
			$("#idEstadoVenta").text(objeto.estadoVenta);
			$("#esAtendidoVenta").text(1);
			$('#pedidoDetalle #listaDetalle .opcionesDetalle .agrupa0').val(1);
			$('#pedidoDetalle #listaDetalle .opcionesDetalle .agrupa0').removeClass('agrupa0').addClass('agrupa1');
		}else{
			$('#pedidoDetalle #iconoEstado').removeClass('col-2').addClass('oculto');
			$('#pedidoDetalle #columnaBoton').removeClass('col-3').addClass('col-5');
			$("#idEstadoVenta").text(objeto.estadoVenta);
			$("#esAtendidoVenta").text(0);
		}

		socket.emit('actualizaEstadoPedido',{
			ES_DELIVERY:resp[0].ES_DELIVERY,
			ID_VENTA:resp[0].ID_VENTA,
			DETALLE_ESTADO_VENTA:resp[0].DETALLE_ESTADO_VENTA,
			ESTADO_VENTA:resp[0].ESTADO_VENTA,
			ID_ESTADO_VENTA:resp[0].ID_ESTADO_VENTA,
			ES_ELIMINABLE:resp[0].ES_ELIMINABLE,
			sucursal: 'S'+$('#sucursal').val()
		});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}	
}

async function comentarioPedidodetalle(objeto){
    bloquea();
	try{
		const cancela=(objeto.resp.includes('Cancela'))?`
			<button type='Cancela' name='btnCancela' class='mr-1 btn btn-secondary btn-md cancela'>
				<i class='la la-times'></i>
				<span class='p-1'>Cancelar</span>
			</button>`:'';
		const crea=(objeto.resp.includes('Crea'))?`
			<button type='Crea' name='btnGuarda' class='crud btn btn-primary btn-md crea'>
				<i class='la la-save'></i>
				<span class='p-1'>Guardar</span>
			</button>`:'';
		const buscar= await axios.get("/api/pedidodetalle/buscar/"+objeto.id+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		const comentario=buscar.data.valor.info;
		let msg=`
		<form id="${objeto.tabla}detalleComentario">
			<div class="row">
				<div class="form-group col-md-12">
					<label>Comentario</label>
					<textarea  rows="5" autocomplete="off" class="form-control p-1 muestraMensaje" maxlength="500" name="comentario" placeholder="Ingrese el comentario">${(comentario.OBSERVACION===null)?'':comentario.OBSERVACION }</textarea>
				</div>
			</div>
			<div class="form-section p-0"></div>
			<div class="col-md-12 pl-0 pr-0 text-center">
				${cancela+crea}
			</div>
		</form>`;

		desbloquea();
		mostrar_general2({titulo:'COMENTARIO',msg:msg,nombre:objeto.nombre,ancho:objeto.ancho});
		enviaComentarioPedido(objeto)
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function cantidadPedidodetalle(objeto){
    bloquea();
	try{
		const cancela=(objeto.resp.includes('Cancela'))?`
			<button type='Cancela' name='btnCancela' class='mr-1 btn btn-secondary btn-md cancela'>
				<i class='la la-times'></i>
				<span class='p-1'>Cancelar</span>
			</button>`:'';
		const crea=(objeto.resp.includes('Crea'))?`
			<button type='Crea' name='btnGuarda' class='crud btn btn-primary btn-md crea'>
				<i class='la la-save'></i>
				<span class='p-1'>Guardar</span>
			</button>`:'';

		const buscar= await axios.get("/api/"+objeto.tabla+"detalle/buscar/"+objeto.id+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		desbloquea();
		const cantidad=buscar.data.valor.info;
		let msg=`
		<form id="${objeto.tabla}detalleCantidad">
			<div class="row">
				<div class="form-group col-md-12 text-center">
					<div class="btn-group btn-group-lg ">
						<button type="button" class="btn btn-danger alturaBoton pb-0 pt-0 menos">-</button>
						<input name="cantidad" readonly type="text" maxlength="3" autocomplete="off" class="form-control text-center" value="${cantidad.CANTIDAD }" />
						<button type="button" class="btn btn-primary alturaBoton pb-0 pt-0 mas">+</button>
					</div>
				</div>
			</div>
			<div class="form-section p-0"></div>
			<div class="col-md-12 pl-0 pr-0 text-center">
				${cancela+crea}
			</div>
		</form>`;
		mostrar_general2({titulo:'CANTIDAD',msg:msg,nombre:objeto.nombre,ancho:objeto.ancho});
		enviaCantidadPedido(objeto)
    }catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}


async function precioPedidodetalle(objeto){
    bloquea();
	try{
		const cancela=(objeto.resp.includes('Cancela'))?`
			<button type='Cancela' name='btnCancela' class='mr-1 btn btn-secondary btn-md cancela'>
				<i class='la la-times'></i>
				<span class='p-1'>Cancelar</span>
			</button>`:'';
		const crea=(objeto.resp.includes('Crea'))?`
			<button type='Crea' name='btnGuarda' class='crud btn btn-primary btn-md crea'>
				<i class='la la-save'></i>
				<span class='p-1'>Guardar</span>
			</button>`:'';

		const buscar= await axios.get("/api/"+objeto.tabla+"detalle/buscar/"+objeto.id+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		const cantidad=buscar.data.valor.info;
		let msg=`
		<form id="${objeto.tabla}detallePrecio">
			<div class="row">
				<div class="form-group col-md-12 text-center">
					<div class="btn-group btn-group-lg ">
						<input name="monto" type="text" maxlength="10" autocomplete="off" class="form-control text-center" value="${ parseFloat(cantidad.MONTO).toFixed(2) }" />
					</div>
				</div>
			</div>
			<div class="form-section p-0"></div>
			<div class="col-md-12 pl-0 pr-0 text-center">
				${cancela+crea}
			</div>
		</form>`;
		desbloquea();
		mostrar_general2({titulo:'PRECIO',msg:msg,nombre:objeto.nombre,ancho:objeto.ancho});
		focusInput();
		enviaPrecioPedido(objeto)
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function enviaCantidadPedido(objeto){
	let cantidad=$('#'+objeto.tabla+'detalleCantidad input[name=cantidad]');
	numeroRegex(cantidad);
	$('#'+objeto.tabla+'detalleCantidad').off('click');
	$('#'+objeto.tabla+'detalleCantidad').on( 'click', 'button.menos', function () {
		if(cantidad.val()>0){
			cantidad.val(cantidad.val()-1);
		}
	});
	$('#'+objeto.tabla+'detalleCantidad').on( 'click', 'button.mas', function () {
		if(cantidad.val()<100){
			cantidad.val(cantidad.val()-(-1));
		}
	});
	$('#'+objeto.tabla+'detalleCantidad').on( 'click', 'button[name=btnGuarda]', function () {
		if(cantidad.val()>0){
			agregaCantidadPedido(objeto, cantidad.val());
		}else{
			info('¡Debe ingresar una cantidad!');
		}
	});
}

function enviaPrecioPedido(objeto){
	let monto=$('#'+objeto.tabla+'detallePrecio input[name=monto]');
	decimalRegex(monto);
	$('#'+objeto.tabla+'detallePrecio').on( 'click', 'button[name=btnGuarda]', function () {
		if(monto.val()>0){
			agregaPrecioPedido(objeto, monto.val());
		}else{
			info('¡Debe ingresar un precio!');
		}
	});
}

function enviaComentarioPedido(objeto){
	$('#'+objeto.tabla+'detalleComentario').off('click');
	$('#'+objeto.tabla+'detalleComentario').on( 'click', 'button[name=btnGuarda]', function () {
		let comentario=$('#'+objeto.tabla+'detalleComentario textarea[name=comentario]').val();
		agregaComentarioPedido(objeto, comentario);
	});
}


async function agregaComentarioPedido(objeto,comentario){
	bloquea();
	try{
		let body={
			id:objeto.id,
			idVenta:0,
			idProductoSucursal:0,
			cantidad:0,
			comentario:comentario,
			monto:0,
			sesId:verSesion()
		}
		const editar = await axios.put("/api/"+objeto.tabla+"detalle/editar/"+objeto.id,body,{ 
            headers:{
				authorization: `Bearer ${verToken()}`
		} 
        });

		const resp=editar.data.valor;
		desbloquea();
		$("#general2").modal("hide");
		$('#'+objeto.tabla+'Detalle #listaDetalle ul li div h6#comentario'+resp.info.ID_DETALLE).html(resp.info.OBSERVACION);
		toastr.success('Se agregó un comentario: '+comentario, 'COMENTARIO',opcionesToast);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function agregaCantidadPedido(objeto,cantidad){
	bloquea();
	try{
		let body={
			id:objeto.id,
			idVenta:0,
			idProductoSucursal:0,
			cantidad:cantidad,
			comentario:'',
			monto:0,
			sesId:verSesion()
		}
		const editar = await axios.put("/api/"+objeto.tabla+"detalle/editar/"+objeto.id,body,{ 
            headers:{
				authorization: `Bearer ${verToken()}`
		} 
        });

		const resp=editar.data.valor;
		desbloquea();
		$("#general2").modal("hide");
		$('#'+objeto.tabla+'Detalle #listaDetalle ul li div h6#cantidad'+resp.info.ID_DETALLE).html(resp.info.CANTIDAD+` <span class='normal'>`+resp.info.ABREVIATURA_UNIDAD+`</span>`);
		$('#'+objeto.tabla+'Detalle #listaDetalle ul li div h4#montoCantidad'+resp.info.ID_DETALLE).text(parseFloat(resp.info.MONTO).toFixed(2));

		$('#'+objeto.tabla+'Detalle #listaDetalle #totalPedidoFinalDetalle').text(parseFloat(resp.info.TOTAL).toFixed(2));

		toastr.success('Se cambió la cantidad: '+cantidad, 'CANTIDAD DEL PEDIDO',opcionesToast);

		socket.emit('actualizaStockCarta',{
			esDelivery:objeto.esDelivery,
			tabla:objeto.tabla,
			ID_PRODUCTO_SUCURSAL:resp.info.ID_PRODUCTO,
			STOCK:resp.info.STOCK,
			ABREVIATURA_UNIDAD:resp.info.ABREVIATURA_UNIDAD,
			sucursal: 'S'+$('#sucursal').val()
		});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function agregaPrecioPedido(objeto,monto){
	bloquea();
	try{
		let body={
			id:objeto.id,
			idVenta:0,
			idProductoSucursal:0,
			cantidad:0,
			comentario:'',
			monto:monto,
			sesId:verSesion()
		}
		const editar = await axios.put("/api/"+objeto.tabla+"detalle/editar/"+objeto.id,body,{ 
            headers:{
				authorization: `Bearer ${verToken()}`
		} 
        });

		const resp=editar.data.valor;
		desbloquea();
		$("#general2").modal("hide");
		$('#'+objeto.tabla+'Detalle #listaDetalle ul li div h4#montoCantidad'+resp.info.ID_DETALLE).text(parseFloat(resp.info.MONTO).toFixed(2));

		$('#'+objeto.tabla+'Detalle #listaDetalle #totalPedidoFinalDetalle').text(parseFloat(resp.info.TOTAL).toFixed(2));

		toastr.success('Se cambió el monto: S/.'+parseFloat(monto).toFixed(2)+' DEL PEDIDO',opcionesToast);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}


async function agregarPagoPedido(objeto){
	bloquea();
	try{
		let body={
			id:0,
			idVenta:objeto.elementos.idVenta,
			tipoPago:objeto.elementos.tipoPago.val(),
			montoRecibido:objeto.elementos.montoRecibido.val(),
			sesId:verSesion()
		}
		const pagar = await axios.post("/api/pedidodetalle/pagar",body,{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});

		const resp=pagar.data.valor;
		desbloquea();
		if(resp.resultado){
			$('#'+objeto.objeto.tabla+'Paga #pagosVenta ul').append(`
				<li id="pago`+resp.info.ID_PAGO+`" class="list-group-item pb-0 pt-0 bg-info text-white">
					<div class="row">
						<div id="descripcionTipoPago" class="col mb-0 d-flex justify-content-start align-items-center">
							`+resp.info.TIPO_PAGO+`
						</div>
						<div id="montoTipoPago" class="col text-center mb-0 d-flex justify-content-center align-items-center">
							`+parseFloat(resp.info.MONTO).toFixed(2)+`
						</div>
						<div class="col text-center mb-0 d-flex justify-content-end align-items-center">
							<i class="cursor las la-trash la-2x elimina"></i>
						</div>
						<input type="hidden" name="quitaPago" value="`+resp.info.ID_PAGO+`">
					</div>
				</li>
			`);
			$('#'+objeto.objeto.tabla+'Paga span#recibido').text(parseFloat(resp.info.MONTO_RECIBIDO).toFixed(2));
			$('#'+objeto.objeto.tabla+'Paga span#vuelto').text(parseFloat(Math.abs(resp.info.VUELTO)).toFixed(2));
			$('#'+objeto.objeto.tabla+'Paga p#textoVuelto').text((resp.info.VUELTO<0)?'Por pagar':'Vuelto');
			objeto.elementos.montoRecibido.val('');
			//objeto.elementos.tipoPago.val('').change();
			quitaValidacion(objeto.elementos.montoRecibido);
			quitaValidacionSelect(objeto.elementos.tipoPago);

			toastr.success('Se agregó un pago '+resp.info.TIPO_PAGO+' por: '+parseFloat(resp.info.MONTO).toFixed(2), 'NUEVO PAGO',opcionesToast);
		}else{
			mensajeSistema(resp.mensaje);
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}


function eliminarPagoDetalle(objeto){//diego
	confirm('¡Se eliminará el pago: '+objeto.descripcionTipoPago+'!',function(){
		return false;
	},async function(){
        bloquea();
		try{
			const eliminar = await axios.delete("/api/pedidodetalle/eliminar/pago/"+objeto.id,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			desbloquea();
			const resp=eliminar.data.valor;
			if(resp.resultado){
				$('#'+objeto.tabla+'Paga #pagosVenta #pago'+objeto.id).remove();
				$('#'+objeto.tabla+'Paga span#pagoTotal').text(parseFloat(resp.info.TOTAL).toFixed(2));
				$('#'+objeto.tabla+'Paga span#recibido').text(parseFloat(resp.info.MONTO_RECIBIDO).toFixed(2));
				$('#'+objeto.tabla+'Paga span#vuelto').text(parseFloat(Math.abs(resp.info.VUELTO)).toFixed(2));
				
				toastr.warning('Se elimino el pago '+objeto.descripcionTipoPago+' por: '+parseFloat(objeto.montoTipoPago).toFixed(2), 'QUITA PAGO',opcionesToast);
			}else{
				mensajeSistema(resp.mensaje);
			}
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
	})
}


function enviarPrecuenta(objeto){
	confirm('¡Se enviará la impresión del pedido!',function(){
		return false;
	},async function(){
		bloquea();
		try{
			let body={
				idP:objeto.id,
				idDet:objeto.idDet,	
				tabla:objeto.tabla,
				/*idSubMenu:objeto.idSubMenu,
				nombre: objeto.nombre,*/
				tipo:'imprimirPrecuenta',
				sesId:verSesion()
			}
			const comanda =  await axios.post("/api/"+objeto.tabla+"detalle/precuenta",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
	
			const resp=comanda.data.valor;
				
			desbloquea();
			if($('#impresionGeneral').val()==1){
				fetch('http://localhost:4444/api/impresion/precuenta', {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(resp)
				})
				.then(function(response) {
					response.json()
					.then(function(data){
						if(data.valor=='error'){
							toastr.error('¡No se pudo imprimir, revise su impresora!','PROBLEMA CON LA IMPRESIÓN',opcionesToast);
						}else if(data.valor=='ok'){
							toastr.success('Se imprimió precuenta', 'DETALLE DE CONSUMO',opcionesToast);
						}else if(data.valor=='ko'){
							toastr.error('¡La impresora esta apagada, revise su impresora!','PROBLEMA CON LA IMPRESIÓN',opcionesToast);
						}
					});
					//toastr.success('Se imprimió precuenta', 'detalle de consumo');
				})
				.catch(function(err) {
					console.log(err);
					console.log('error en la impresion');
				});
			}else{
				toastr.success('Se imprimió precuenta', 'DETALLE DE CONSUMO',opcionesToast);
			}
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
	});
}


function cerrarVenta(objeto){//diego
	let enviaSunat=(objeto.elementos.sunat.val()==1)?' y se enviará a SUNAT!':'!';
	confirm('¡Se cerrará el pedido'+enviaSunat,function(){
		return false;
	},async function(){
		bloquea();
		try{
			let body={
				id:objeto.elementos.idVenta,
				idEstado:2507,
				idCliente:objeto.elementos.cliente.val(),
				tipoDocumento:objeto.elementos.tipoDocumento.val(),
				sunat:objeto.elementos.sunat.val(),
				fechaVenta:objeto.elementos.fechaVenta.val(),
				comentario:objeto.elementos.comentario.val(),
				descuento:objeto.elementos.descuento.val(),
				tipo:'cerrarVenta',
				sesId:verSesion()
			}
			const venta =  await axios.put("/api/pedido/venta/"+objeto.elementos.idVenta,body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
	
			const resp=venta.data.valor;
			//desbloquea();
			if(resp.info.ES_DELIVERY==3){
				if(objeto.elementos.sunat.val()==0){
					success('Venta cerrada','¡Se cerró la venta:\nDocumento: '+resp.info.TIPO_DOCUMENTO+'\nSerie: '+resp.info.SERIE_DOCUMENTO+'\nNro documento: '+resp.info.NRO_DOCUMENTO+'!');
					vistaMenuSubMenu({tabla:'atencion',idSubMenu:75});
				}else if(objeto.elementos.sunat.val()==1){
					if(resp.info.DOCUMENTOS===null || resp.info.DOCUMENTOS - resp.info.DOCUMENTOS_GENERADOS>0){
						enviarFacturacion(objeto,resp);
					}else{
						vistaMenuSubMenu({tabla:'atencion',idSubMenu:75});
					}
				}
			}else{
				desbloquea();
				$("#general1").modal("hide");

				let esDelivery=(resp.info.ES_DELIVERY==1)?'listaTodoDelivery':'listaTodoMesa';
				let esTipo=(resp.info.ES_DELIVERY==1)?'delivery':'mesa';

				socket.emit('cerrarVenta',{
					esDelivery:esDelivery,
					tipo:resp.info.ES_DELIVERY,
					ID_VENTA:resp.info.ID_VENTA,
					esTipo:esTipo,
					sucursal: 'S'+$('#sucursal').val()
				});

				enviarCaja(objeto);
				if(objeto.elementos.sunat.val()==1){
					if(resp.info.DOCUMENTOS===null || resp.info.DOCUMENTOS - resp.info.DOCUMENTOS_GENERADOS>0){
						enviarFacturacion(objeto,resp);
					}else{
						vistaMenuSubMenu({tabla:'atencion',idSubMenu:75});
					}
				}else{
					enviarPrecuenta({id:objeto.elementos.idVenta,tabla:'pedido',accion:'paga',idDet:0});
					success('Venta cerrada','¡Se cerró la venta:\nDocumento: '+resp.info.TIPO_DOCUMENTO+'\nSerie: '+resp.info.SERIE_DOCUMENTO+'\nNro documento: '+resp.info.NRO_DOCUMENTO+'!');
				}
			}
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
	});
}


async function enviarCaja(objeto){//diego
	try{
		if($('#impresionGeneral').val()==1){
			bloquea();
			let body={
				idP:objeto.elementos.idVenta,
				idDet:1,	
				tabla:objeto.objeto.tabla,
				/*idSubMenu:objeto.objeto.idSubMenu,
				nombre: 0,*/
				tipo:'imprimirPrecuenta',
				sesId:verSesion()
			}
			const comanda =  await axios.post("/api/"+objeto.objeto.tabla+"detalle/precuenta",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			desbloquea();
			const resp=comanda.data.valor;

			fetch('http://localhost:4444/api/impresion/caja', {
				method: 'POST',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(resp)
			})
			.then(function(response) {
				response.json()
				.then(function(data){
					if(data.valor=='error'){
						toastr.error('¡No se pudo imprimir, revise su impresora!','PROBLEMA CON LA IMPRESIÓN',opcionesToast);
					}else if(data.valor=='ok'){
						return true
					}else if(data.valor=='ko'){
						toastr.error('¡La impresora esta apagada, revise su impresora!','PROBLEMA CON LA IMPRESIÓN',opcionesToast);
					}
				});
				//return true
			})
			.catch(function(err) {
				console.log(err);
				console.log('error en la impresion');
			});
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function enviarCajaVenta(objeto){//diego
	confirm('¡Se enviará la impresion de caja',function(){
		return false;
	},async function(){
		try{
			if($('#impresionGeneral').val()==1){
				let body={
					idP:objeto.idVenta,
					idDet:1,	
					tabla:objeto.tabla,
					/*idSubMenu:objeto.objeto.idSubMenu,
					nombre: 0,*/
					tipo:'imprimirPrecuenta',
					sesId:verSesion()
				}
				const comanda =  await axios.post("/api/"+objeto.tabla+"detalle/precuenta",body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});

				const resp=comanda.data.valor;
				fetch('http://localhost:4444/api/impresion/caja', {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(resp)
				})
				.then(function(response) {
					response.json()
					.then(function(data){
						if(data.valor=='error'){
							toastr.error('¡No se pudo imprimir, revise su impresora!','PROBLEMA CON LA IMPRESIÓN',opcionesToast);
						}else if(data.valor=='ok'){
							return true
						}else if(data.valor=='ko'){
							toastr.error('¡La impresora esta apagada, revise su impresora!','PROBLEMA CON LA IMPRESIÓN',opcionesToast);
						}
					});
					//return true
				})
				.catch(function(err) {
					console.log(err);
					console.log('error en la impresion');
				});
			}
			toastr.success('Se imprimió documento caja', 'DOCUMENTO DE CAJA',opcionesToast);
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
	});
}

async function enviarFacturacion(objeto, respObj){//diego
	bloquea();
	try{
		let body={
			id:objeto.elementos.idVenta,
			tipoDocumento:objeto.elementos.tipoDocumento.val(),
			sesId:verSesion(),
			token:verToken()
		}

		const facturacionCierre =  await axios.post("/api/facturacion/cierre",body,{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});

		let resp=facturacionCierre.data.valor;
		desbloquea();
		if(resp.sunatResponse.success){
			if($('#impresionGeneral').val()==1){
				imprimeDocumentoSunat(objeto,respObj);
			}else{
				success('Venta cerrada','¡Se cerró la venta:\nDocumento: '+respObj.info.TIPO_DOCUMENTO+'\nSerie: '+respObj.info.SERIE_DOCUMENTO+'\nNro documento: '+respObj.info.NRO_DOCUMENTO+'!');
				if(respObj.info.ES_DELIVERY==3){
					vistaMenuSubMenu({tabla:'atencion',idSubMenu:75});
				}
			}
		}else{
			error('Hubo un error al enviar a sunat :\nDocumento: '+respObj.info.TIPO_DOCUMENTO+'\nSerie: '+respObj.info.SERIE_DOCUMENTO+'\nNro documento: '+respObj.info.NRO_DOCUMENTO+'!');
		}
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

async function imprimeDocumentoSunat(objeto, respObj){
	bloquea();
	try{
		let body={
			idP:objeto.elementos.idVenta,
			idDet:1,	
			nombre: 0,
			tipo:'imprimirPrecuenta'
		}

		const comanda =  await axios.post("/api/"+objeto.objeto.tabla+"detalle/precuenta",body,{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});

		const buscar= await axios.get("/api/venta/buscar/"+objeto.elementos.idVenta+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
		} 
		});
		const listar= await axios.get("/api/"+objeto.objeto.tabla+"detalle/listar/pago/"+objeto.elementos.idVenta+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});


		msg={
			valor : comanda.data.valor.info,
			venta : buscar.data.valor.info,
			pago : listar.data.valor.info
		}


		fetch('http://localhost:4444/api/impresion/documento', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(msg)
		})
		.then(function(response) {
			desbloquea();
			response.json()
			.then(function(data){
				if(data.valor=='error'){
					toastr.error('¡No se pudo imprimir, revise su impresora!','PROBLEMA CON LA IMPRESIÓN',opcionesToast);
				}else if(data.valor=='ok'){
					success('Venta cerrada','¡Se cerró la venta:\nDocumento: '+respObj.info.TIPO_DOCUMENTO+'\nSerie: '+respObj.info.SERIE_DOCUMENTO+'\nNro documento: '+respObj.info.NRO_DOCUMENTO+'!');
					if(respObj.info.ES_DELIVERY==3){
						vistaMenuSubMenu({tabla:'atencion',idSubMenu:75});
					}
				}else if(data.valor=='ko'){
					toastr.error('¡La impresora esta apagada, revise su impresora!','PROBLEMA CON LA IMPRESIÓN',opcionesToast);
				}
			});
			//return true
		})
		.catch(function(err) {
			desbloquea();
			console.log(err);
			console.log('error en la impresion');
		});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}


async function imprimeDocumentoSunatVenta(objeto){
	confirm('¡Se enviará la impresión del documento!',function(){
		return false;
	},async function(){
		if($('#impresionGeneral').val()==1){
			bloquea();
			try{
				let body={
					idP:objeto.idVenta,
					idDet:1,	
					nombre: 0,
					tipo:'imprimirPrecuenta'
				}

				const comanda =  await axios.post("/api/"+objeto.tabla+"detalle/precuenta",body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
		
				const buscar= await axios.get("/api/venta/buscar/"+objeto.idVenta+"/"+verSesion(),{ 
					headers:{
						authorization: `Bearer ${verToken()}`
				} 
				});
				const listar= await axios.get("/api/"+objeto.tabla+"detalle/listar/pago/"+objeto.idVenta+"/"+verSesion(),{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});


				msg={
					valor : comanda.data.valor.info,
					venta : buscar.data.valor.info,
					pago : listar.data.valor.info
				}


				fetch('http://localhost:4444/api/impresion/documento', {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(msg)
				})
				.then(function(response) {
					desbloquea();
					response.json()
					.then(function(data){
						if(data.valor=='error'){
							toastr.error('¡No se pudo imprimir, revise su impresora!','PROBLEMA CON LA IMPRESIÓN',opcionesToast);
						}else if(data.valor=='ok'){
							toastr.success('Se imprimió el documento', 'DOCUMENTO',opcionesToast);
							return true;
						}else if(data.valor=='ko'){
							toastr.error('¡La impresora esta apagada, revise su impresora!','PROBLEMA CON LA IMPRESIÓN',opcionesToast);
						}
					});
					//return true
				})
				.catch(function(err) {
					desbloquea();
					console.log(err);
					console.log('error en la impresion');
				});
			}catch (err) {
				desbloquea();
				message=(err.response)?err.response.data.error:err;
				mensajeError(message);
			}
		}else{
			toastr.success('Se imprimió el documento', 'DOCUMENTO',opcionesToast);
			return true;
		}
		
	});
}