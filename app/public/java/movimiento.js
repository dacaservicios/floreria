//FUNCIONES
$(document).ready(function() {
	try {
		vistaMovimiento();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaMovimiento(){
	bloquea();
	let tabla="movimiento";
	const lista= await axios.get('/api/'+tabla+'/listar/0/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});

	const movimiento = await axios.get("/api/parametro/detalle/listar/48/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});
	desbloquea();
	const resp=lista.data.valor.info;
	const resp3=movimiento.data.valor.info;

	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-dolly"></i> MOVIMIENTO</div>
						<div class="row pt-3">
							<div class="form-group col-md-6">
								<label>Producto (Lote - Stock)</label>
								<input id="autocompletaProd" name="autocompletaProd" autocomplete="off" maxlength="10" type="tel" class="form-control p-1 muestraMensaje" placeholder="Busque el producto">
								<input type="hidden" name="producto" id="producto">
								<input type="hidden" name="idProductoDetalle" id="idProductoDetalle">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-6">
								<label>Movimiento (*)</label>
								<select name="movimiento" class="form-control select2 muestraMensaje">
									<option value="">Select...</option>`;
									for(var i=0;i<resp3.length;i++){
										if(resp3[i].ES_VIGENTE==1){
							listado+=`<option value="${resp3[i].ID_PARAMETRO_DETALLE}">${resp3[i].DESCRIPCIONDETALLE}</option>`;
										}
									}
						listado+=`</select>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-6">
								<label>Fecha (*)</label>
								<input name="fecha" autocomplete="off" maxlength="10" type="fecha" class="form-control datepicker" placeholder="Seleccione la Fecha" value="${moment().format('DD-MM-YYYY')}">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-6">
								<label>Cantidad (*)</label>
								<input name="cantidad" autocomplete="off" maxlength="10" type="tel" class="form-control p-1" placeholder="Ingrese la cantidad">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div> 
						</div>
						<div class="row">
							<div class="form-group col-md-12">
								<label>Motivo (*)</label>
								<textarea  rows="5" autocomplete="off" class="form-control p-1" maxlength="1000" name="motivo" placeholder="Ingrese el motivo"></textarea>
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
									<th style="width: 15%;">Movimiento</th>
									<th style="width: 10%;">Fecha</th>
									<th style="width: 25%;">Producto</th>
									<th style="width: 5%;">cantidad</th>
									<th style="width: 45%;">Motivo</th>
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
					listado+=`<tr id="${resp[i].ID_MOVIMIENTO}" >
									<td>
										<div class="estadoTachado movimiento muestraMensaje ${mestado}">${ resp[i].TIPO_MOVIMIENTO }</div>
									</td>
									<td>
										<div class="estadoTachado fecha ${mestado}">${ moment(resp[i].FECHA_CREA).format('DD/MM/YYYY') }</div>
									</td>
									<td>
										<div class="estadoTachado producto ${mestado}">${ resp[i].PRODUCTO }</div>
									</td>
									<td>
										<div class="estadoTachado cantidad ${mestado}">${ resp[i].CANTIDAD }</div>
									</td>
									<td>
										<div class="estadoTachado motivo ${mestado}">${(resp[i].MOTIVO===null)?'':resp[i].MOTIVO}</div>
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

	$('.datepicker').datepicker({
		language: 'es',
		changeMonth: true,
		changeYear: true,
		todayHighlight: true,
		autoclose: true
	});

	$("#"+tabla+" span#botonGuardar").text('Crear');
	$('#'+tabla+'Tabla').DataTable(valoresTabla);
	let objeto={
		movimiento:$("#"+tabla+" select[name=movimiento]"),
		autocompletaProd:$("#"+tabla+" input[name=autocompletaProd]"),
		producto:$("#"+tabla+" input[name=producto]"),
		idProductoDetalle:$("#"+tabla+" input[name=idProductoDetalle]"),
		fecha:$("#"+tabla+" input[name=fecha]"),
		motivo:$("#"+tabla+" textarea[name=motivo]"),
		cantidad:$("#"+tabla+" input[name=cantidad]"),
		tabla:tabla,
	}
	eventosMovimiento(objeto);
}

function eventosMovimiento(objeto){
	$('#autocompletaProd').autocomplete({
		source: async function(request, response){
			$.ajax({
				url:"/autocompleta/producto",
				type: "POST",
				dataType: "json",
				data:{
					producto:request.term,
					tipo:'autocompletaVenta',
					sesId:verSesion(),
					token:verToken()
				},
				success: function(data){
					let datos=data.valor.info;
					response( $.map( datos, function( item ){
						return {
							idProductoDetalle:item.ID_PRODUCTO_DETALLE,
							idProductoSucursal:	item.ID_PRODUCTO_SUCURSAL,
							codigo:	item.CODIGO_PRODUCTO,
							nombre:	item.NOMBRE,
							idLote: item.ID_DETALLE,
							precioVenta: item.PRECIO_VENTA,
							precioCompra: item.PRECIO_COMPRA,
							cantidad:1,
							tabla:objeto.tabla,
							label: item.NOMBRE+" ("+item.LOTE+" - "+item.STOCK+")",
							value: item.NOMBRE+" ("+item.LOTE+" - "+item.STOCK+")"
						}
					}));
				},
			});
		},
		minLength:3,
		select:function(event,ui){
			objeto.autocompletaProd.val(ui.item.nombre);
			objeto.producto.val(ui.item.idProductoSucursal);
			objeto.idProductoDetalle.val(ui.item.idProductoDetalle);
			return false;
		}	
	});


	$('#'+objeto.tabla+' div').off( 'keyup');
	$('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='autocompletaProd'){
			comentarioRegex(elemento);
		}
	});

    $('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='cantidad'){
			decimalRegex(elemento);
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'keyup','textarea',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" textarea[name="+name+"]");
		if(name=='motivo'){
			comentarioRegex(elemento);
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').off( 'change');
    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
	});

	$('#'+objeto.tabla+' div').on( 'change','input[type=fecha]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		if(name=='fecha'){
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'change','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='producto'){
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioMovimiento(objeto)
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
		movimientoEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		movimientoEstado({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		movimientoElimina({id:id,nombre:nombre,tabla:objeto.tabla});
	});
}

async function movimientoEdita(objeto){
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
	objeto.movimiento.val(resp.ID_TIPO_MOVIMIENTO).trigger('change.select2');
	objeto.produto.val(resp.ID_PRODUCTO_SUCURSAL);
	objeto.autocompletaProd.val(resp.NOMBRE);
	objeto.fecha.val(moment(resp.FECHA).format('DD-MM-YYYY'));
	objeto.motivo.val(resp.MOTIVO);
	objeto.cantidad.val(resp.CANTIDAD);
}

function validaFormularioMovimiento(objeto){	
	validaVacioSelect(objeto.movimiento);
	validaVacio(objeto.autocompletaProd);
	validaVacio(objeto.cantidad);
	validaVacio(objeto.motivo);
	validaVacio(objeto.fecha);

	if(objeto.movimiento.val()=="" || objeto.autocompletaProd.val()=="" || objeto.cantidad.val()=="" || objeto.motivo.val()=="" || objeto.fecha.val()==""){
		return false;
	}else{
		enviaFormularioMovimiento(objeto);
	}
}

function enviaFormularioMovimiento(objeto){
	let dato=(objeto.id==0)?muestraMensaje({tabla:objeto.tabla}):objeto.nombreMsg;
	let verbo=(objeto.id==0)?'Creará':'Modificará';

	var fd = new FormData(document.getElementById(objeto.tabla));
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
			console.log(resp)
			if(resp.resultado){
				if(objeto.id>0){
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .movimiento").text(resp.info.TIPO_MOVIMIENTO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .producto").text(resp.info.PRODUCTO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .cantidad").text(resp.info.CANTIDAD);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .motivo").text(resp.info.MOTIVO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .fecha").text(moment(resp.info.FECHA_CREA).format('DD/MM/YYYY'));
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
					
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						`<div class="estadoTachado movimiento muestraMensaje">${resp.info.TIPO_MOVIMIENTO}</div>`,
						`<div class="estadoTachado fecha">${moment(resp.info.FECHA_CREA).format('DD/MM/YYYY')}</div>`,
						`<div class="estadoTachado producto muestraMensaje">${resp.info.PRODUCTO}</div>`,
						`<div class="estadoTachado cantidad">${resp.info.CANTIDAD}</div>`,
						`<div class="estadoTachado motivo">${resp.info.MOTIVO}</div>`
					] ).draw( false ).node();
					$( rowNode ).attr('id',resp.info.ID_MOVIMIENTO);
					
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

function movimientoElimina(objeto){
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

function movimientoEstado(objeto){
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