//FUNCIONES
$(document).ready(function() {
	try {
		vistaProducto();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaProducto(){
	bloquea();
	let tabla="producto";
	const lista= await axios.get('/api/'+tabla+'/listar/0/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});

	const categoria= await axios.get("/api/categoria/listar/0/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	desbloquea();
	const resp=lista.data.valor.info;
	const resp2=categoria.data.valor.info;

	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-shopping-cart"></i> PRODUCTO</div>
						<div class="row pt-3">
							<div class="form-group col-md-6">
								<label>Nombre (*)</label>
								<input name="nombre" autocomplete="off" maxlength="100" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese el nombre">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
							<div class="form-group col-md-4">
								<label>Categoría (*)</label>
								<select name="categoria" class="form-control select2">
									<option value="">Select...</option>`;
									for(var i=0;i<resp2.length;i++){
										if(resp2[i].ES_VIGENTE==1){
									listado+=`<option value="${resp2[i].ID_CATEGORIA}">${resp2[i].NOMBRE}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
                            <div class="form-group col-md-2">
								<label>Compuesto (*)</label>
								<select name="compuesto" class="form-control select2">
									<option value="0">No</option>
                                    <option value="1">Si</option>
						        </select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-12">
								<label>Descripcion</label>
								<input name="descripcion" autocomplete="off" maxlength="200" type="text" class="form-control p-1" placeholder="Ingrese la descripción">
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
									<th style="width: 35%;">Nombre</th>
									<th style="width: 20%;">Categoría</th>
									<th style="width: 25%;">Descripción</th>
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
					listado+=`<tr id="${resp[i].ID_PRODUCTO}" >
									<td>
										<div class="estadoTachado codigo ${mestado}">${ resp[i].CODIGO_PRODUCTO }</div>
									</td>
									<td>
										<div class="estadoTachado nombre muestraMensaje ${mestado}">${resp[i].NOMBRE}</div>
                                        <div><span class="compuesto badge bg-primary">${(resp[i].ES_COMPUESTO==1)?'Compuesto':''}</span></div>
									</td>
									<td>
										<div class="estadoTachado categoria ${mestado}">${resp[i].CATEGORIA}</div>
									</td>
									<td>
										<div class="estadoTachado descripcion ${mestado}">${(resp[i].DESCRIPCION===null)?'':resp[i].DESCRIPCION}</div>
									</td>
									<td>
										${((resp[i].ES_COMPUESTO==1)?compuesto():'')+estado()+modifica()+elimina()}
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
		nombre:$('#'+tabla+' input[name=nombre]'),
		descripcion:$('#'+tabla+' input[name=descripcion]'),
		categoria:$('#'+tabla+' select[name=categoria]'),
        compuesto:$('#'+tabla+' select[name=compuesto]'),
		tabla:tabla,
	}
    tooltip();
	eventosProducto(objeto);
}

function eventosProducto(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='descripcion'){
			comentarioRegex(elemento);
		}else if(name=='nombre'){
			validaVacio(elemento);
			comentarioRegex(elemento);
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
		validaFormularioProducto(objeto)
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
		productoEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		productoEstado({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		productoElimina({id:id,nombre:nombre,tabla:objeto.tabla});
	});

    $('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.compuesto',function(){//detalle
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		vistaProductoCompuesto({id:id,nombre:nombre,tabla:objeto.tabla});
	});
}

async function productoEdita(objeto){
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
	objeto.nombre.val(resp.NOMBRE);
	objeto.descripcion.val(resp.DESCRIPCION);
	objeto.categoria.val(resp.ID_CATEGORIA).trigger('change.select2');
    objeto.compuesto.val(resp.ES_COMPUESTO).trigger('change.select2');
}

function validaFormularioProducto(objeto){	
	validaVacio(objeto.nombre);
	validaVacioSelect(objeto.categoria);
	validaVacioSelect(objeto.compuesto);

	if(objeto.nombre.val()=="" || objeto.categoria.val()=="" || objeto.compuesto.val()==""){
		return false;
	}else{
		enviaFormularioProducto(objeto);
	}
}

function enviaFormularioProducto(objeto){
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
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .nombre").text(resp.info.NOMBRE);
                    $("#"+objeto.tabla+"Tabla #"+objeto.id+" .compuesto").text((resp.info.ES_COMPUESTO==1)?'Compuesto':'');
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .descripcion").text((resp.info.DESCRIPCION===null)?'':resp.info.DESCRIPCION);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .categoria").text(resp.info.CATEGORIA);
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
					
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						`<div class="estadoTachado codigo">${resp.info.CODIGO_PRODUCTO}</div>`,
						`<div class="estadoTachado nombre muestraMensaje">${resp.info.NOMBRE}</div><div><span class="compuesto badge bg-primary">${(resp.info.ES_COMPUESTO==1)?'Compuesto':''}</span></div>`,
						`<div class="estadoTachado categoria">${resp.info.CATEGORIA}</div>`,
						`<div class="estadoTachado descripcion">${(resp.info.DESCRIPCION===null)?'':resp.info.DESCRIPCION}</div>`,
						estado()+modifica()+elimina()
					] ).draw( false ).node();
					$( rowNode ).attr('id',resp.info.ID_PRODUCTO);
					
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

function productoElimina(objeto){
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

function productoEstado(objeto){
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


//PRODUCTO COMPUESTO
async function vistaProductoCompuesto(objeto){
	bloquea();
	const lista= await axios.get('/api/'+objeto.tabla+'/compuesto/listar/'+objeto.id+'/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});
	const productos = await axios.get("/api/"+objeto.tabla+"/listar/0/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		}
	});

	desbloquea();
	const resp=lista.data.valor.info;
	const resp2=productos.data.valor.info;

    const idsCompuesto = resp.map(producto => producto.ID_PRODUCTO);
	const setIdsExcluidos = new Set(idsCompuesto);
	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${objeto.tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="la la-list-alt"></i> PRODUCTO COMPUESTO</div>
						<div class="alert alert-primary" role="alert">${objeto.nombre}</div>
						<div class="row">
							<div class="form-group col-md-8">
                                <label>Producto (*)</label>
                                <span id="idElementoEditar" class="oculto"></span>
								<select class="form-control select2 muestraMensaje" name="producto" id="elementoSeleccionado">
									<option value="">Select..</option>`;
									for(var i=0;i<resp2.length;i++){
										if(resp2[i].ES_VIGENTE==1 && resp2[i].ES_COMPUESTO==0 && !setIdsExcluidos.has(resp2[i].ID_PRODUCTO)){
								listado+=`<option value="${resp2[i].ID_PRODUCTO}">${resp2[i].NOMBRE}</option>`;
										}
									} 
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
                            <div class="form-group col-md-4">
                                <label>Cantidad (*)</label>
                                <input name="cantidad" autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Ingrese la cantidad">
                                <div class="vacio oculto">¡Campo obligatorio!</div>
                            </div>
						</div>
						<div class="col-md-12 pl-0 pr-0 text-center pd-t-15">
							${regresa()+guarda()}
						</div>
						<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
					</form>
					<hr class="border border-primary">
					<div class="table-responsive">
						<table id="${objeto.tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
							<thead>
								<tr>
									<th style="width:70%;">Producto</th>
									<th style="width:20%;">Cantidad</th>
									<th style="width:10%;" class="nosort nosearch">Acciones</th>
								</tr>
							</thead>
							<tbody>`;
								let mestado;
								for(var i=0;i<resp.length;i++){
									if(resp[i].ES_VIGENTE==1){
										mestado='';
									}else{
										mestado='tachado';
									}
						listado+=`<tr id="${resp[i].ID_COMPUESTO}">
									<td>
										<div class="estadoTachado producto muestraMensaje ${mestado}">${resp[i].NOMBRE }</div>
									</td>
									<td>
										<div class="estadoTachado cantidad ${mestado}">${resp[i].CANTIDAD }</div>
									</td>
									<td>
										${estado()+elimina()}
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
	$("#"+objeto.tabla+" span#botonGuardar").text('Crear');
	$('#'+objeto.tabla+'Tabla').DataTable(valoresTabla);
	let objetoDetalle={
		producto:$('#'+objeto.tabla+' select[name=producto]'),
        cantidad:$('#'+objeto.tabla+' input[name=cantidad]'),
		tabla:objeto.tabla,
		idPadre:objeto.id,
		nombrePadre:objeto.nombre
	}
	eventosProductoCompuesto(objetoDetalle);
}

function eventosProductoCompuesto(objeto){
	$('#'+objeto.tabla+' div').off( 'change');
    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		if(name=='producto'){
			validaVacioSelect(elemento);
		}
	});

    $('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='cantidad'){
			numeroRegex(elemento);
			validaVacio(elemento);
        }
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.idDetalle= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioProductoCompuesto(objeto)
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnRegresa]',function(){//regresa
		vistaProducto();
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let idDetalle=evento.attr('id');
		let producto=evento.find("td div.producto").text();
		let cantidad=evento.find("td div.cantidad").text();
		estadoProductoCompuesto({idDetalle:idDetalle,producto:producto,cantidad:cantidad,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let idDetalle=evento.attr('id');
		let producto=evento.find("td div.producto").text();
		let cantidad=evento.find("td div.cantidad").text();
		eliminaProductoCompuesto({idDetalle:idDetalle,producto:producto,cantidad:cantidad,tabla:objeto.tabla});
	});
}

function validaFormularioProductoCompuesto(objeto){	
	validaVacioSelect(objeto.producto);
    validaVacio(objeto.cantidad);

	if(objeto.producto.val()=="" || objeto.cantidad.val()==""){
		return false;
	}else{
		enviaFormularioProductoCompuesto(objeto);
	}
}

function enviaFormularioProductoCompuesto(objeto){
	let dato=(objeto.idDetalle==0)?muestraMensaje({tabla:objeto.tabla}):objeto.nombreMsg;
	let verbo=(objeto.idDetalle==0)?'Creará':'Modificará';

	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("idPadre", objeto.idPadre);
	fd.append("sesId", verSesion());
	
	confirm("¡"+verbo+" el registro: "+dato+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body=fd;
		try {
			let crea = await axios.post("/api/"+objeto.tabla+"/compuesto/crear",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});

			desbloquea();
			resp=crea.data.valor;
			if(resp.resultado){
                let t = $('#'+objeto.tabla+'Tabla').DataTable();
                let rowNode =t.row.add( [
                    `<div class="estadoTachado  producto muestraMensaje">${resp.info.PRODUCTO}</div>`,
                    `<div class="estadoTachado  cantidad">${resp.info.CANTIDAD}</div>`,
                    estado()+modifica()+elimina()
                ] ).draw( false ).node();
                $( rowNode ).attr('id',resp.info.ID_COMPUESTO);
                                    
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

function eliminaProductoCompuesto(objeto){
	confirm("¡Eliminará el registro: "+objeto.producto+"!",function(){
		return false;
	},async function(){
        bloquea();
		try {
			const eliminar = await axios.delete("/api/"+objeto.tabla+"/compuesto/eliminar/"+objeto.idDetalle,{ 
				headers:{authorization: `Bearer ${verToken()}`} 
			});
			
			desbloquea();
			resp=eliminar.data.valor;
			if(resp.resultado){
				let  elimina=$('#'+objeto.tabla+'Tabla').DataTable();
				$('#'+objeto.tabla+'Tabla #'+objeto.idDetalle).closest('tr');
				elimina.row($('#'+objeto.tabla+'Tabla #'+objeto.idDetalle)).remove().draw(false);
				agregaElemento({id:resp.info.ID_PRODUCTO,nombre:resp.info.NOMBRE, tabla:objeto.tabla})
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

function estadoProductoCompuesto(objeto){
	confirm("¡Cambiará el estado del registro: "+objeto.producto+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body={
		}
		try {
			const estado = await axios.put("/api/"+objeto.tabla+"/compuesto/estado/"+objeto.idDetalle,body,{ 
				headers:{authorization: `Bearer ${verToken()}`} 
			});
			desbloquea();
			resp=estado.data.valor;
			if(resp.resultado){
				let estado=(resp.info.ESTADO==0)?'tachado':'';

				$("#"+objeto.tabla+"Tabla #"+objeto.idDetalle+" .estadoTachado").removeClass('tachado');

				$("#"+objeto.tabla+"Tabla #"+objeto.idDetalle+" .estadoTachado").addClass(estado);

				//success("Estado","¡Se ha cambiado el estado del registro: "+objeto.descripcion+"!");
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