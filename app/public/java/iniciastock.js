//FUNCIONES
$(document).ready(async function() {
	bloquea();
	let tabla="iniciastock";
	try {
		const boton= await axios.get('/api/acceso/privilegio/66/'+verSesion(),{
			headers: 
			{ 
				authorization: `Bearer ${verToken()}`
			} 
		});
		const lista =  await axios.get("/api/categoria/listar/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
	
		const lista2 =  await axios.get("/api/producto/detalle/listar/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});

		desbloquea();
		const resp=boton.data.valor.botones;
		const resp2=lista.data.valor.info;
		const resp3=lista2.data.valor.info;

		const guarda=(resp.includes('Guarda'))?`
		<button type='Guarda' name='btnGuarda' class='crud btn btn-primary btn-md guarda'>
			<i class='la la-save'></i>
			<span class='p-1'>Guardar</span>
		</button>`:''

		let listado=`
		<form id="${tabla}"> 
			<div class="row">
				<div class="col-12">
					<div class="card">
						<div class="h4 card-header form-section pl-3 pr-3 pt-2 text-left"><i class="las la-balance-scale"></i> INICIA STOCK</div>
						<div  id="<%= tabla%>Info" class="pb-0 text-right pt-2 pr-3">
							<span class='oculto muestraSubmenu'>66</span>
							<span class='oculto muestraModulo'>${tabla}</span>
						</div>
						<div class="card-content">
							<div class="card-body">
								<ul class="nav nav-tabs">`;
									for(var c=0;c<resp2.length;c++){
								listado+=`<li class="nav-item"  role="presentation">
											<button class="nav-link" id="baseIcon-tab${resp2[c].ID_CATEGORIA}" data-bs-toggle="tab"  data-bs-target="#tabIcon${resp2[c].ID_CATEGORIA}" type="button" role="tab" aria-controls="tabIcon${resp2[c].ID_CATEGORIA}" aria-selected="true"> ${resp2[c].NOMBRE}</button>
										</li>`;
									}
						listado+=`</ul>
								<div class="tab-content px-1 pt-1">`;
									for(var c=0;c<resp2.length;c++){
								listado+=`<div class="tab-pane fade" id="tabIcon${resp2[c].ID_CATEGORIA}" role="tabpanel" aria-labelledby="baseIcon-tab${resp2[c].ID_CATEGORIA}">
											<div class="card-content pt-1 productosTodos" id="listaProducto${resp2[c].ID_CATEGORIA}">
												<input type="text" class="search form-control round border-primary mb-1" placeholder="Search" />
												<ul class="list-group list pt-0 listaProductos">`;
													for(var i=0;i<resp3.length;i++){
														if(resp3[i].ID_CATEGORIA==resp2[c].ID_CATEGORIA){
													listado+=`<li class="list-group-item">
																<div class="row">
																	<div class="col mb-0 cursor">
																		<h6 class="productoNombre">${resp3[i].NOMBRE}</h6>
																		<h6 class="stockProducto">${parseFloat(resp3[i].STOCK).toFixed(2)+" "+resp3[i].ABREVIATURA_UNIDAD}</h6>
																	</div>
																	<div class="col col d-flex justify-content-end align-items-center mb-0">
																		<input name="cantidadStock" autocomplete="off" maxlength="3" type="tel" class="form-control p-1" value="0" placeholder="Stock">
																		<input name="productoSucursal" type="hidden" value="${resp3[i].ID_PRODUCTO_SUCURSAL}" >
																	</div>
																</div>
															</li>`;
													}  }
										listado+=`</ul>
											</div>
										</div>`;
									}
						listado+=`</div>
							</div>
						</div>
						<hr>
						<div class="detalleProducto col-md-12 pl-0 pr-0 pb-1 text-center">
							${guarda}
						</div>
					</div>
				</div>
			</div>
		</form>`;
		$("#cuerpoPrincipal").html(listado);

		$('#'+tabla).off( 'click');
		$('#'+tabla).on( 'click', 'button.nav-link', function () {
			let idStock=$(this).attr('id');
			let idS=idStock.replace('baseIcon-tab','');
			let contenido=$('#tabIcon'+idS).find('ul li').length;
			if(contenido>0){
				let listaProducto=idStock.replace('baseIcon-tab','listaProducto');
				var productos = {
					valueNames: [ 'productoNombre']
				};
				new List(listaProducto, productos);
			}
		});

		$('#'+tabla).on( 'click', 'button[name=btnGuarda]', function () {
			let accion=$(this).attr('type');
			let nombreSubmenu=$('#'+tabla+'Info span.muestraModulo').text();
			let idSubMenu=$('#'+tabla+'Info span.muestraSubmenu').text();
			let cuenta=0;
			verificaSesion('O', idSubMenu,19,function( ){//GUARDA
				$("#"+tabla+" input[name=cantidadStock]").each(function(){
					if($(this).val()==''){
						cuenta++;
					}
				});
				if(cuenta>0){
					mensajeSistema('¡El stock de los productos no puede estar vacio!');
				}else{
					guardaStock({idSubMenu:idSubMenu,nombreSubmenu:nombreSubmenu,tabla:tabla,accion:accion});
				}
			});
			
		});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}	numeroRegex($("#"+tabla+" input[name=cantidadStock]"));
});



function guardaStock(objeto){
	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("sesId", $('#session').val());

	confirm('¡Se guardarán las cantidades como nuevo stock del día!',function(){
			return false;
		},async function(){
        bloquea();
		let body=fd;
		try {
			const guarda = await axios.post("/api/"+objeto.tabla+"/crear",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			desbloquea();
			resp=guarda.data.valor;
			if(resp.resultado){
				success("Stock Actualizado","Se actualizarón los stock de los productos");
				vistaMenuSubMenu({tabla:objeto.tabla.toLowerCase(),idSubMenu:objeto.idSubMenu});
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

