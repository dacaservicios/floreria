//FUNCIONES
$(document).ready(function() {
	try {
		vistaProveedor();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaProveedor(){
	bloquea();
	let tabla="proveedor";
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
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-city"></i> PROVEEDOR</div>
						<div class="row pt-3">
							<div class="form-group col-md-7">
								<label>Razón (*)</label>
								<input name="razon" autocomplete="off" maxlength="200" type="text" class="form-control p-1" placeholder="Ingrese la razón social">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
							<div class="form-group col-md-5">
								<label>Nombre (*)</label>
								<input name="nombre" autocomplete="off" maxlength="200" type="text" class="form-control p-1 muestraMensaje" placeholder="Ingrese el nombre">
								<div class="vacio oculto">¡Campo obligatorio!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-12">
								<label>Dirección</label>
								<input name="direccion" autocomplete="off" maxlength="200" type="text" class="form-control p-1" placeholder="Ingrese la dirección">
							</div> 
						</div>
						<div class="row">
							<div class="form-group col-md-6">
								<label>Fijo</label>
								<input name="fijo" autocomplete="off" maxlength="7" type="tel" class="form-control p-1" placeholder="Ingrese el fijo">
							</div> 
							<div class="form-group col-md-6">
								<label>Celular (*)</label>
								<input name="celular" autocomplete="off" maxlength="9" type="tel" class="form-control p-1" placeholder="Ingrese el celular">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
						</div>
						<div class="row">
							<div class="form-group col-md-6">
								<label>Ruc (*)</label>
								<input name="ruc" autocomplete="off" maxlength="11" type="tel" class="form-control p-1" placeholder="Ingrese el ruc">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
							</div>
							<div class="form-group col-md-6">
								<label>Email (*)</label>
								<input name="email" autocomplete="off" maxlength="100" type="text" class="form-control p-1" placeholder="Ingrese el email">
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
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
									<th style="width: 25%;">Razón social</th>
									<th style="width: 20%;">Nombre</th>
									<th style="width: 10%;">Ruc</th>
									<th style="width: 10%;">Celular</th>
									<th style="width: 25%;">Email</th>
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

					listado+=`<tr id="${resp[i].ID_PROVEEDOR}">
									<td>
										<div class="estadoTachado razon ${mestado}">${resp[i].RAZON_PROVEEDOR }</div>
									</td>
									<td>
										<div class="estadoTachado nombre muestraMensaje ${mestado}">${resp[i].NOMB_PROVEEDOR }</div>
									</td>
									<td>
										<div class="estadoTachado ruc ${mestado}">${resp[i].RUC }</div>
									</td>
									<td>
										<div class="estadoTachado celular ${mestado}">${resp[i].NRO_CELULAR}</div>
									</td>
									<td>
										<div class="estadoTachado email ${mestado}">${resp[i].EMAIL}</div>
									</td>
									<td>
										${estado()+modifica()+elimina()}
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
		razon:$('#'+tabla+' input[name=razon]'),
		nombre:$('#'+tabla+' input[name=nombre]'),
		direccion:$('#'+tabla+' input[name=direccion]'),
		fijo:$('#'+tabla+' input[name=fijo]'),
		celular:$('#'+tabla+' input[name=celular]'),
		ruc:$('#'+tabla+' input[name=ruc]'),
		email:$('#'+tabla+' input[name=email]'),
		tabla:tabla,
	}
	eventosProveedor(objeto);
}

function eventosProveedor(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='razon' || name=='nombre'){
			textoNumeroRegex(elemento);
			validaVacio(elemento);
		}else if(name=='direccion'){
			comentarioRegex(elemento);
		}else if(name=='email'){
			validaCorreo(elemento);
		}
	});


	$('#'+objeto.tabla+' div').on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='ruc'){
			validaRuc(elemento);
		}else if(name=='celular'){
			validaCelular(elemento);
		}else if(name=='fijo'){
			fijoRegex(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioProveedor(objeto)
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
		proveedorEdita(objeto);
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		proveedorEstado({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.elimina',function(){//elimina
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre ").text();
		proveedorElimina({id:id,nombre:nombre,tabla:objeto.tabla});
	});
}

async function proveedorEdita(objeto){
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
	objeto.razon.val(resp.RAZON_PROVEEDOR);
	objeto.nombre.val(resp.NOMB_PROVEEDOR);
	objeto.direccion.val(resp.DIRECCION);
	objeto.fijo.val(resp.NRO_FIJO);
	objeto.celular.val(resp.NRO_CELULAR);
	objeto.ruc.val(resp.RUC);
	objeto.email.val(resp.EMAIL);
}

function validaFormularioProveedor(objeto){	
	validaVacio(objeto.razon);
	validaVacio(objeto.nombre);
	let vruc=validaRuc(objeto.ruc);
	let vcel=validaCelular(objeto.celular);
	let vemai=validaCorreo(objeto.email);

	if(objeto.razon.val()=="" || objeto.nombre.val()=="" || vruc==false || vcel==false || vemai==false){
		return false;
	}else{
		enviaFormularioProveedor(objeto);
	}
}

function enviaFormularioProveedor(objeto){
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
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .razon").text(resp.info.RAZON_PROVEEDOR);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .nombre").text(resp.info.NOMB_PROVEEDOR);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .ruc").text(resp.info.RUC);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .celular").text(resp.info.NRO_CELULAR);
					$("#"+objeto.tabla+"Tabla #"+objeto.id+" .email").text(resp.info.EMAIL);
					$('#'+objeto.tabla+'Tabla').DataTable().draw(false);

					//success("Modificado","¡Se ha modificado el registro: "+dato+"!");
				}else{
					let t = $('#'+objeto.tabla+'Tabla').DataTable();
					let rowNode =t.row.add( [
						`<div class="estadoTachado razon muestraMensaje">${resp.info.RAZON_PROVEEDOR}</div>`,
						`<div class="estadoTachado nombre muestraMensaje">${resp.info.NOMB_PROVEEDOR}</div>`,
						`<div class="estadoTachado ruc">${resp.info.RUC}</div>`,
						`<div class="estadoTachado celular">${resp.info.NRO_CELULAR}</div>`,
						`<div class="estadoTachado email">${resp.info.EMAIL}</div>`,
						estado()+modifica()+elimina()
					] ).draw( false ).node();
					$( rowNode ).attr('id',resp.info.ID_PROVEEDOR);
					
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

function proveedorElimina(objeto){
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

function proveedorEstado(objeto){
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