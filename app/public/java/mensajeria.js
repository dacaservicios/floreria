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

	const lista2= await axios.get('/api/mensajeria/buscarSucursal/'+verSucursal()+'/'+verSesion());

	desbloquea();
	const resp=lista.data.valor.info;
	const resp2=lista2.data.valor.info;
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
							<div class="form-group col-md-12">
								<label>Saludo (*)</label>
								<input name="asunto" autocomplete="off" maxlength="50" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese el saludo">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-12">
								<label>Mensaje (*)</label>
								<textarea  rows="5" autocomplete="off" class="form-control p-1" maxlength="500" name="descripcion" placeholder="Ingrese el mensaje"></textarea>
							</div>
						</div>
						<div class="pt-3 col-md-12 pl-0 pr-0 text-center" id="botonWasap">
							${(resp2.CUENTA==0)?(limpia()+guarda()):''}
						</div>
						<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
					</form>
					<hr class="border border-primary">
					<div class="table-responsive">
						<table id="${tabla}Tabla" class="table-striped table border-top-0  table-bordered text-nowrap border-bottom">
							<thead>
								<tr>
									<th style="width: 20%;">Asunto</th>
									<th style="width: 70%;">Descripción</th>
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
									<div class="saltos estadoTachado descripcion ${mestado}">${resp[i].DESCRIPCION }</div>
								</td>
								<td>
									${((resp[i].ES_VIGENTE==1)?enviar()+modifica()+elimina():'')}
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
		descripcion:$('#'+tabla+' textarea[name=descripcion]'),
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

	$('#'+objeto.tabla+' div').on( 'keyup','textarea',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='descripcion'){
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
		let descripcion=evento.find("td div.descripcion").text();
		enviarWhastapp({id:id, tabla:objeto.tabla,asunto:asunto,descripcion:descripcion});	
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.asunto ").text();
		mensajeriaElimina({id:id,nombre:nombre,tabla:objeto.tabla});
	});
}

function enviarWhastapp(objeto){
	$("#"+objeto.tabla+"Tabla #"+objeto.id+" td.estadoTachado").addClass('tachado');
	confirm("¡Enviará el mensaje de whatsapp a todos sus clientes!",function(){
		return false;
	},async function(){
		$("#"+objeto.tabla+" button[name=btnLimpia]").addClass('oculto');
		$("#"+objeto.tabla+" button[name=btnGuarda]").addClass('oculto');
		$("#"+objeto.tabla+"Tabla #"+objeto.id+" td a.enviar").addClass('oculto');
		$("#"+objeto.tabla+"Tabla #"+objeto.id+" td a.edita ").addClass('oculto');
		$("#"+objeto.tabla+"Tabla #"+objeto.id+" td a.elimina").addClass('oculto');
		bloquea();
		let body={
			id : objeto.id,
			asunto:objeto.asunto,
			descripcion:objeto.descripcion,
			sesId:verSesion(),
			token:verToken(),
			sucursal:verSucursal()
		}
		try {
			desbloquea();
			const correo = await axios.post("/api/"+objeto.tabla+"/whatsapp/",body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			resp=correo.data.valor;
			if(resp.resultado){
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
	$('#botonWasap').html(limpia()+guarda());
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
}

function validaFormularioMensajeria(objeto){	
	validaVacio(objeto.asunto);
	validaVacio(objeto.descripcion);

	if(objeto.asunto.val()=="" || objeto.descripcion.val()==""){
		return false;
	}else{
		enviaFormularioMensajeria(objeto);
	}
}

function enviaFormularioMensajeria(objeto){
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
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .asunto").text(resp.info.ASUNTO);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .descripcion").text(resp.info.DESCRIPCION);
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
					
					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						`<div class="estadoTachado asunto muestraMensaje">${resp.info.ASUNTO}</div>`,
						`<div class="saltos estadoTachado descripcion">${resp.info.DESCRIPCION}</div>`,
						enviar()+modifica()+elimina()
					] ).draw( false ).node();
					$( rowNode ).attr('id',resp.info.ID_MENSAJERIA);
					//success("Creado","¡Se ha creado el registro: "+dato+"!");
				}
				limpiaTodo(objeto.tabla);
				$('#botonWasap').html('');
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
				$('#botonWasap').html(limpia()+guarda());
				$("#"+objeto.tabla+" span#botonGuardar").text('Crear');
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

