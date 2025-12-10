//FUNCIONES
$(document).ready(async function() {
	bloquea();
	let tabla="opcion";
	try {
		const boton= await axios.get('/api/acceso/privilegio/19/'+verSesion(),{
			headers: 
			{ 
				authorization: `Bearer ${verToken()}`
			} 
		});
		const lista= await axios.get('/api/'+tabla+'/listar/0/'+verSesion(),{
            headers: 
            { 
                authorization: `Bearer ${verToken()}`
            } 
        });
		desbloquea();
		const resp=boton.data.valor.botones;
		const resp2=lista.data.valor.info;

		const crea=(resp.includes('Nuevo'))?`
			<button type='Crea' name='btnNuevo' class='btn btn-primary btn-md'>
				<i class='las la-plus-circle'></i>
				<span class='p-1'>Crear Opción</span>
			</button>`:'';
		const estado=(resp.includes('Estado'))?`
			<a type='Estado' class="crud estado cursor" data-toggle="tooltip" data-placement="top" title="Estado">
				<i class='las la-check-circle la-2x'></i>
			</a>`:'';
		const modifica=(resp.includes('Modifica'))?`
			<a type='Edita' class="crud edita cursor" data-toggle="tooltip" data-placement="top" title="Editar">
				<i class='las la-edit la-2x'></i>
			</a>`:'';
		const elimina=(resp.includes('Elimina'))?`
			<a type='Elimina' class="crud elimina cursor" data-toggle="tooltip" data-placement="top" title="Eliminar">
				<i class='las la-trash la-2x'></i>
			</a>`:'';
		
		let listado=`
		<div class="row">
			<div class="col-12">
				<div class="card">
				<div class="h4 card-header form-section pl-3 pr-3 pt-2 text-left"><i class="la la-ellipsis-v"></i> OPCIÓN</div>
					<div  id="${tabla}Info" class="pb-0 text-right pt-2 pr-3">
						<span class='oculto muestraSubmenu'>19</span>
						<span class='oculto muestraModulo'>${tabla}</span>
						${crea}
					</div>
					<div class="card-content collapse show">
						<div class="card-body card-dashboard">
							<div class="table-responsive">
								<table id="${tabla}Tabla" class="pt-3 table table-striped text-center">
									<thead>
										<tr>
											<th>Nombre</th>
											<th>Descripción</th>
											<th>Estado</th>
											<th class="nosort nosearch">Acciones</th>
										</tr>
									</thead>
									<tbody>`;
										let mestado;
										let badge;
										for(var i=0;i<resp2.length;i++){
											if(resp2[i].ES_VIGENTE==1){
												mestado='ACTIVO';
												badge="primary"; 
											}else{
												mestado='INACTIVO';
												badge="danger";
											}
										
							listado+=`<tr id="${resp2[i].ID_OPCI }">
											<td class="nombre muestraMensaje">
												${resp2[i].NOMB_OPCI }
											</td>
											<td class="descripcion">
												${resp2[i].DESC_OPCI }
											</td>
											<td class="cambiaEstado">
												<span class="estado badge badge-${badge}">${mestado}</span> 
											</td>
											<td>
												${estado+modifica+elimina}
											</td>
										</tr>`
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
		$('[data-toggle="tooltip"]').tooltip();
		$('#'+tabla+'Tabla').DataTable(valoresTabla);

		$('#'+tabla+'Info').off( 'click');
		$('#'+tabla+'Info').on( 'click', 'button', function () {
			let accion=$(this).attr('type');
			let idSubMenu=$(this).siblings('span.muestraSubmenu').text();
			let nombreSubmenu=$(this).siblings('span.muestraModulo').text();
			modalLinkOpcion({id:0,nombre:0,nombreSubmenu:nombreSubmenu,idSubMenu:idSubMenu,tabla:tabla,accion:accion,orden:0,ancho:600,titulo:'NUEVA OPCIÓN',resp:resp});
		});
		
		$('#'+tabla+'Tabla tbody').off( 'click');
		$('#'+tabla+'Tabla tbody').on( 'click', rutaElemento, function () {
			let accion=$(this).attr('type');
			let evento=$(this).parents("tr")
			let id=evento.attr('id');
			let nombre=evento.find("td.muestraMensaje").text();
			let nombreSubmenu=$('#'+tabla+'Info span.muestraModulo').text();
			let idSubMenu=$('#'+tabla+'Info span.muestraSubmenu').text();

			if($(this).hasClass('elimina')){
				verificaSesion('O', idSubMenu,3,function( ){//ELIMINA
					eliminaOpcion({id:id,nombre:nombre,nombreSubmenu:nombreSubmenu,orden:id,tabla:tabla,accion:accion,resp:resp});
				});
			}else if($(this).hasClass('edita')){
				verificaSesion('O', idSubMenu,2,function( ){//EDITA
					modalLinkOpcion({id:id,nombre:nombre,nombreSubmenu:nombreSubmenu,idSubMenu:idSubMenu,tabla:tabla,accion:accion,orden:id,ancho:600,titulo:'EDITAR OPCIÓN',resp:resp});
				});
			}else if($(this).hasClass('estado')){
				verificaSesion('O', idSubMenu,6,function( ){//ESTADO	
					estadoOpcion({id:id,nombre:nombre,nombreSubmenu:nombreSubmenu,tabla:tabla,accion:accion,orden:id,ancho:600,titulo:'ESTADO '+tabla.toUpperCase(),resp:resp});
				});
			}
		});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function modalLinkOpcion(objeto){
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
		const busca= await axios.get('/api/'+objeto.tabla+'/buscar/'+objeto.id+'/'+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			}
		});
		const resp=busca.data.valor.info;
		desbloquea();
		let msg=`
		<form id="${objeto.tabla}">
			<div class="row">
				<div class="form-group col-md-10">
					<label>Nombre (*)</label>
					<input name="nombre" autocomplete="off" maxlength="50" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese un nombre" value="${(objeto.id==0)?'':resp.NOMB_OPCI}">
					<div class="h8 validacion">¡Campo obligatorio!</div>
				</div>
				<div class="form-group col-md-2">
					<label>Orden (*)</label>
					<input name="orden" autocomplete="off" maxlength="5" type="tel" class="form-control p-1" placeholder="Ingrese el orden" value="${(objeto.id==0)?'':resp.ORDE_OPCI}">
					<div class="h8 validacion">¡Campo obligatorio!</div>
				</div>
			</div>
			<div class="row">
				<div class="form-group col-md-12">
					<label>Descripción</label>
					<input name="descripcion" autocomplete="off" maxlength="100" type="text" class="form-control p-1" placeholder="Ingrese una descripción" value="${(objeto.id==0)?'':resp.DESC_OPCI}">
				</div> 
			</div> 
			<hr class="dropdown-divider">
			<div class="col-md-12 pl-0 pr-0 text-center">
				${cancela}${(objeto.id==0)?crea:edita}
			</div>
			<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
		</form>`;
		mostrar_general1({titulo:objeto.titulo,msg:msg,ancho:objeto.ancho});
		procesaFormularioOpcion(objeto);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function procesaFormularioOpcion(objeto){
	let nombre=$("#"+objeto.tabla+" input[name=nombre]");
	let orden=$("#"+objeto.tabla+" input[name=orden]");
	let descripcion=$("#"+objeto.tabla+" input[name=descripcion]");
	let session=$("#session");
	let elementos={
		nombre:nombre,
		orden:orden,
		descripcion:descripcion,
		session:session
	}

	comentarioRegex(nombre);
	decimalRegex(orden);
	comentarioRegex(descripcion);

	verificaElementoOpcion({objeto:objeto,elementos:elementos});
}

function verificaElementoOpcion(objeto){
	$('#'+objeto.objeto.tabla).off( 'keyup');
    $('#'+objeto.objeto.tabla).on( 'keyup','input[type=text]',function(){
		let name=$(this).attr("name");
		let tipo='text';
		enviaEventoOpcion({tabla:objeto.objeto.tabla,tipo:tipo,name:name,elementos:objeto.elementos});
	});

	$('#'+objeto.objeto.tabla).on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr("name");
		let tipo='tel';
		enviaEventoOpcion({tabla:objeto.objeto.tabla,tipo:tipo,name:name,elementos:objeto.elementos});
	});

	$('#'+objeto.objeto.tabla).off( 'click');
	$('#'+objeto.objeto.tabla).on( 'click','button.crud',function () {
		let idOpcion=(objeto.objeto.accion=='Crea')?4:5;
		verificaSesion('O', objeto.objeto.idSubMenu,idOpcion,function( ){//CREA  O MODIFICA
			validaFormularioOpcion(objeto);
		});
	});
}

function enviaEventoOpcion(objeto){
	if(objeto.tipo=='text'){
		if(objeto.name=='nombre'){
			let elementoInput=$("#"+objeto.tabla+" input[name="+objeto.name+"]");
			validaVacio(elementoInput);
		}
	}else if(objeto.tipo=='tel'){
		if(objeto.name=='orden'){
			let elementoInput=$("#"+objeto.tabla+" input[name="+objeto.name+"]");
			validaVacio(elementoInput);
		}
	}
}

function validaFormularioOpcion(objeto){
	validaVacio(objeto.elementos.nombre);
	validaVacio(objeto.elementos.orden);

	if(objeto.elementos.nombre.val()=="" || objeto.elementos.orden.val()==""){
		mensajeSistema(0);
	}else{
		enviaFormularioOpcion(objeto);
	}
}

function enviaFormularioOpcion(objeto){
	let dato=(objeto.objeto.accion=='Crea')?muestraMensaje({tabla:objeto.objeto.tabla}):objeto.objeto.nombre;
	let verbo=(objeto.objeto.id>0)?'Modificará':'Creará';

	confirm("¡"+verbo+" el registro: "+dato+"!",function(){
		return false;
	},async function(){
        bloquea();
		let body={
			id: objeto.objeto.id,
			nombre: objeto.elementos.nombre.val(),
			orden: objeto.elementos.orden.val(),
			descripcion: objeto.elementos.descripcion.val(),
			sesId:objeto.elementos.session.val()
		}
		try {
			let creaEdita;
			if(objeto.objeto.id==0){
				creaEdita = await axios.post("/api/"+objeto.objeto.tabla+"/crear",body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
			}else{
				creaEdita = await axios.put("/api/"+objeto.objeto.tabla+"/editar/"+objeto.objeto.id,body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
			}
			desbloquea();
			$("#general1").modal("hide");
			resp=creaEdita.data.valor;
			if(resp.resultado){
				if(objeto.objeto.id>0){
					$("#"+objeto.objeto.tabla+"Tabla #"+objeto.objeto.orden+" .nombre").text(resp.info.nombreOpcion);
					$("#"+objeto.objeto.tabla+"Tabla #"+objeto.objeto.orden+" .descripcion").text(resp.info.descripcionOpcion);
					$('#'+objeto.objeto.tabla+'Tabla').DataTable().draw(false);
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					let t = $('#'+objeto.objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						resp.info.nombreOpcion,
						resp.info.descripcionOpcion,
						`<span class="estado badge badge-primary">ACTIVO</span>`,
						`<a type='Estado' class="crud estado cursor" data-toggle="tooltip" data-placement="top" title="Estado">
							<i class='las la-check-circle la-2x'></i>
						</a>
						<a type='Edita' class="crud edita cursor" data-toggle="tooltip" data-placement="top" title="Editar">
							<i class='las la-edit la-2x'></i>
						</a>
						<a type='Elimina' class="crud elimina cursor" data-toggle="tooltip" data-placement="top" title="Eliminar">
							<i class='las la-trash la-2x'></i>
						</a>`
					] ).draw( false ).node();
					$( rowNode ).find('td').eq(0).addClass('nombre muestraMensaje');
					$( rowNode ).find('td').eq(1).addClass('descripcion');
					$( rowNode ).find('td').eq(2).addClass('cambiaEstado');
					$( rowNode ).attr('id',resp.info.idOpcion);

					//success("Creado","¡Se ha creado el registro: "+dato+"!");
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

function eliminaOpcion(objeto){
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
				$('#'+objeto.tabla+'Tabla #'+objeto.orden).closest('tr');
				elimina.row($('#'+objeto.tabla+'Tabla #'+objeto.orden)).remove().draw(false); 
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

function estadoOpcion(objeto){
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
				let estado=(resp.info.ESTADO==0)?'INACTIVO':'ACTIVO';
				let claseEstado=(resp.info.ESTADO==0)?'badge badge-danger':'badge badge-primary';

				$("#"+objeto.tabla+"Tabla #"+objeto.orden+" .cambiaEstado").children('span').text(estado);
				$("#"+objeto.tabla+"Tabla #"+objeto.orden+" .cambiaEstado").children('span').removeClass();
				$("#"+objeto.tabla+"Tabla #"+objeto.orden+" .cambiaEstado").children('span').addClass(claseEstado);

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