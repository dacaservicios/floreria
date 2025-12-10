//FUNCIONES
$(document).ready(function() {
	try {
		vistaMensajeria();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaMensajeria(){
	bloquea();
	let tabla="mensajeria";
	const lista= await axios.get('/api/'+tabla+'/listar/0/'+verSesion(),{
		headers: 
		{ 
			authorization: `Bearer ${verToken()}`
		} 
	});

	
	desbloquea();
	const resp=lista.data.valor.info;
	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<span class='oculto muestraId'>0</span>
						<span class='oculto muestraNombre'></span>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-envelope"></i> MENSAJERÍA</div>
						<div class="row pt-3">
							<div class="form-group col-md-4">
								<label>Asunto (*)</label>
								<input name="asunto" autocomplete="off" maxlength="50" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese el asunto">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
							<div class="form-group col-md-8">
								<label>Descripción</label>
								<input name="descripcion" autocomplete="off" maxlength="50" type="text" class="form-control p-1" placeholder="Ingrese una descripcion">
							</div>  
						</div>
						<div class="row">
							<div class="form-group col-md-12">
								<label>Imagen (*)  (Solo se permite formatos: JPG, JPEG o PNG no mayor a 1Mb)</label>
								<input type="file" class="form-control p-1" name="imagen" id="imagen">
								<span id="imagenMensajeria" class="cursor"></span>
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="pt-3 col-md-12 pl-0 pr-0 text-center">
							
						</div>
						<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
					</form>
					<hr class="border border-primary">
					<div class="table-responsive">
						<table id="${tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
							<thead>
								<tr>
									<th style="width: 45%;">Asunto</th>
									<th style="width: 30%;">Descripción</th>
									<th style="width: 20%;">Imagen</th>
									<th style="width: 10%;" class="nosort nosearch">Acciones</th>
								</tr>
							</thead>
							<tbody>`;
							var mestado;
							for(let i=0;i<resp.length;i++){
								if(resp[i].ES_VIGENTE==1){
									mestado='';
								}else{
									mestado='tachado';
								}
					listado+=`<tr id="${resp[i].ID_MENSAJERIA}">
								<td>
									<div class="estadoTachado asunto muestraMensaje ${mestado}">${resp[i].ASUNTO}</div>
								</td>
								<td>
									<div class="estadoTachado descripcion ${mestado}">${resp[i].DESCRIPCION }</div>
								</td>
								<td>
									<div class="estadoTachado imagen ${mestado}">${resp[i].IMAGEN }</div>
								</td>
								<td>
									${enviar()+modifica()+elimina()}
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
	$("#"+tabla+" span#botonGuardar").text('Crear');
	$('#'+tabla+'Tabla').DataTable(valoresTabla);
	let objeto={
		asunto:$('#'+tabla+' input[name=asunto]'),
		descripcion:$('#'+tabla+' input[name=descripcion]'),
		imagen:$('#'+tabla+' input[name=imagen]'),
		tabla:tabla,
	}
	eventosMensajeria(objeto);
}

function eventosMensajeria(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='asunto'){
			comentarioRegex(elemento);
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioMensajeria(objeto)
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		limpiaTodo(objeto.tabla);
		$('span#imagenMensajeria').html('');
	});

	$('#'+objeto.tabla+'Tabla tbody').off( 'click');
	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.edita',function(){//edita
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.asunto").text();
		objeto.id=id;
		objeto.nombreEdit=nombre;
		mensajeriaEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.enviar',function(){//enviar
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let asunto=evento.find("td div.asunto").text();
		let imagen=evento.find("td div.imagen").text();
		enviarCorreo({id:id, tabla:objeto.tabla,asunto:asunto,imagen:imagen});	
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.asunto ").text();
		mensajeriaElimina({id:id,nombre:nombre,tabla:objeto.tabla});
	});
}

function enviarCorreo(objeto){
	confirm("¡Enviará el correo electrónico a todo sus clientes!",function(){
		return false;
	},async function(){
		bloquea();
		let body={
			id : objeto.id,
			asunto:objeto.asunto,
			imagen:objeto.imagen,
			sesId:verSesion(),
			token:verToken()
		}
		try {
			const correo = await axios.post("/api/"+objeto.tabla+"/correo/",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			desbloquea();
			resp=correo.data.valor;
			if(resp.resultado){
				//success("Contraseña cambiada","¡Se ha cambiado la contraseña del registro: "+objeto.nombre+"¡");
				return true;
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

async function mensajeriaEdita(objeto){
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
	objeto.asunto.val(resp.ASUNTO);
	objeto.descripcion.val(resp.DESCRIPCION);
	if(resp.IMAGEN!==null){
		$('span#imagenMensajeria').html('<span class="badge bg-primary">'+resp.IMAGEN+'</span>');
		$('span#imagenMensajeria').off( 'click');
		$('span#imagenMensajeria').on( 'click',function(){
			let imagen=`<img src="../imagenes/mensajeria/MEN_`+objeto.id+`_`+resp.IMAGEN+`">`;
			mostrar_general1({titulo:'IMAGEN',nombre:objeto.nombreEdit,msg:imagen,ancho:300});
			$('#contenidoGeneral1').addClass('text-center');
		});
	}
}

function validaFormularioMensajeria(objeto){	
	validaVacio(objeto.asunto);

	if(objeto.asunto.val()==""){
		return false;
	}else{
		enviaFormularioMensajeria(objeto);
	}
}

function enviaFormularioMensajeria(objeto){
	let dato=(objeto.id==0)?muestraMensaje({tabla:objeto.tabla}):objeto.nombreMsg;
	let verbo=(objeto.id==0)?'Creará':'Modificará';
	let imagen=(objeto.imagen.val()=='')?'':objeto.imagen.val().substring(12).trim();
	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	fd.append("imagen", imagen);
	
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
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .asunto").text(resp.info.ASUNTO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .descripcion").text(resp.info.DESCRIPCION);
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
					if(resp.info.IMAGEN!==null){
						$('span#imagenMensajeria').html('<span class="badge bg-primary">'+resp.info.IMAGEN+'</span>');
					}
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						`<div class="estadoTachado asunto muestraMensaje">${resp.info.ASUNTO}</div>`,
						`<div class="estadoTachado descripcion">${resp.info.DESCRIPCION}</div>`,
						estado()+modifica()+elimina()
					] ).draw( false ).node();
					$( rowNode ).attr('id',resp.info.ID_MENSAJERIA);
					//success("Creado","¡Se ha creado el registro: "+dato+"!");
				}
				limpiaTodo(objeto.tabla);
				$('span#imagenMensajeria').html('');
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

function mensajeriaElimina(objeto){
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

function mensajeriaEstado(objeto){
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

				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadoTachado ").removeClass('tachado');

				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadoTachado ").addClass(estado);

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

