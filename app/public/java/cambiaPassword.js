//FUNCIONES

$(document).ready(function() {
	try {
		vistaCambiaPassword();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

function vistaCambiaPassword(){
	let tabla='contrasena';
	let listado=`
	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form id="${tabla}" class="needs-validation" novalidate>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="la la-graduation-cap"></i> CAMBIA CONTRASEÑA</div>
						<div class="row pt-3">
							<div class="form-group col-md-12">
								<label>Contraseña actual (*)</label>
								<input name="contrasenaActual" autocomplete="off" maxlength="50" type="password" class="form-control p-1" placeholder="Ingrese la contraseña actual" required>
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
								<div id="passactual" class="mensaje oculto"></div>
								<div class="d-flex align-items-center justify-content-end">
									<span id="verPassActual" class="cursor wd-200" >
										<i class="las la-low-vision la-2x"></i>
										<strong>Mostrar contraseña</strong>
									</span>
								</div>
							</div>
						</div>
						<div class="row pt-12">
							<div class="form-group col-md-12">
								<label>Contraseña nueva (*)</label>
								<input name="contrasenaNueva" autocomplete="off" maxlength="50" type="password" class="form-control p-1" placeholder="Ingrese la contraseña nueva" required>
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
								<div  id="passnueva" class="mensaje oculto"></div>
								<div class=" d-flex align-items-center justify-content-end">
									<span id="verPassNueva" class="cursor wd-200" >
										<i class="las la-low-vision la-2x"></i>
										<strong>Mostrar contraseña</strong>
									</span>
								</div>
							</div>
						</div>
						<div class="row pt-12">
							<div class="form-group col-md-12">
								<label>Repite contraseña nueva (*)</label>
								<input name="contrasenaRepite" autocomplete="off" maxlength="50" type="password" class="form-control p-1" placeholder="Repita la contraseña nueva" required>
								<div class="vacio oculto">¡Campo obligatorio!</div>
								<div class="formato oculto">¡Formato Incorrecto!</div>
								<div id="passrepite" class="mensaje oculto"></div>
								<div class="d-flex align-items-center justify-content-end">
									<span id="verPassRepite" class="cursor wd-200" >
										<i class="las la-low-vision la-2x"></i>
										<strong>Mostrar contraseña</strong>
									</span>
								</div>
							</div>
						</div>
						<div class="pt-3 col-md-12 pl-0 pr-0 text-center">
							${limpia()+guarda()}
						</div>
						<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
						<hr class="border border-primary">
						<div class="col-md-12 pl-0 pr-0 text-center h8">
							<span>Su contraseña debe contener:<br><strong><span id="minimo"></span>6 a 16 carácteres<span id="minimo2"></span><br><span id="numero"></span>al menos 1 número<span id="numero2"></span><br><span id="mayuscula"></span>al menos una letra mayúscula<span id="mayuscula2"></span><br><span id="minuscula"></span>al menos una letra minúscula<span id="minuscula2"></span><br><span id="especial"></span>al menos un caractér<span id="especial2"></span></strong>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>`;
	$("#cuerpoPrincipal").html(listado);
	let objeto={
		contrasenaActual:$("#"+tabla+" input[name=contrasenaActual]"),
		contrasenaNueva:$("#"+tabla+" input[name=contrasenaNueva]"),
		contrasenaRepite:$("#"+tabla+" input[name=contrasenaRepite]"),
		tabla:tabla,
	}
	eventosCambiaPassword(objeto);
}

function eventosCambiaPassword(objeto){
	$('#'+objeto.tabla).off( 'keypress keyup keydown');
    $('#'+objeto.tabla).on( 'keypress keyup keydown','input[type=password]',function(){
		let name=$(this).attr("name");
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='contrasenaActual' || name=='contrasenaNueva' || name=='contrasenaRepite'){
			validaPassword(elemento);
			if(name=='contrasenaNueva' || name=='contrasenaRepite'){
				validaContrasenas({tabla:objeto.tabla,name:name})
			}
		}
	});

	$('#'+objeto.tabla).on( 'keypress keyup keydown','input[type=textPass]',function(){
		let name=$(this).attr("name");
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='contrasenaActual' || name=='contrasenaNueva' || name=='contrasenaRepite'){
			validaPassword(elemento);
			if(name=='contrasenaNueva' || name=='contrasenaRepite'){
				validaContrasenas({tabla:objeto.tabla,name:name})
			}
		}
	});

	$('#'+objeto.tabla).on( 'click','span#verPassActual',function(){
		if($(this).children('i').hasClass('la-low-vision')){
			$(this).children('i').removeClass('la-low-vision').addClass('la-eye');
			$(this).children('strong').text('Ocultar contraseña');
			$(this).parents('div.form-group').children('input').attr('type','textPass');
		}else{
			$(this).children('i').removeClass('la-eye').addClass('la-low-vision');
			$(this).children('strong').text('Mostrar contraseña');
			$(this).parents('div.form-group').children('input').attr('type','password');
		}
		
	});

	$('#'+objeto.tabla).on( 'click','span#verPassNueva',function(){
		if($(this).children('i').hasClass('la-low-vision')){
			$(this).children('i').removeClass('la-low-vision').addClass('la-eye');
			$(this).children('strong').text('Ocultar contraseña');
			$(this).parents('div.form-group').children('input').attr('type','textPass');
		}else{
			$(this).children('i').removeClass('la-eye').addClass('la-low-vision');
			$(this).children('strong').text('Mostrar contraseña');
			$(this).parents('div.form-group').children('input').attr('type','password');
		}
		
	});

	$('#'+objeto.tabla).on( 'click','span#verPassRepite',function(){
		if($(this).children('i').hasClass('la-low-vision')){
			$(this).children('i').removeClass('la-low-vision').addClass('la-eye');
			$(this).children('strong').text('Ocultar contraseña');
			$(this).parents('div.form-group').children('input').attr('type','textPass');
		}else{
			$(this).children('i').removeClass('la-eye').addClass('la-low-vision');
			$(this).children('strong').text('Mostrar contraseña');
			$(this).parents('div.form-group').children('input').attr('type','password');
		}
		
	});

	$('#'+objeto.tabla+' div').off( 'click');
	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		validaFormularioCambiaPassword(objeto)
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		limpiaTodo(objeto.tabla);
		$('#passrepite').addClass('oculto');
		$('#passnueva').addClass('oculto');
		$('#passrepite').text('');
		$('#passnueva').text('');
	});

}

function validaFormularioCambiaPassword(objeto){
	let vactual=validaPassword(objeto.contrasenaActual);
	let vnueva=validaPassword(objeto.contrasenaNueva);
	let vrepite=validaPassword(objeto.contrasenaRepite);

	let numero1=$('#'+objeto.tabla+' #numero').html();
	let minuscula1=$('#'+objeto.tabla+' #minuscula').html();
	let mayuscula1=$('#'+objeto.tabla+' #mayuscula').html();
	let minimo1=$('#'+objeto.tabla+' #minimo').html();
	let especial1=$('#'+objeto.tabla+' #especial').html();

	let numero2=$('#'+objeto.tabla+' #numero2').html();
	let minuscula2=$('#'+objeto.tabla+' #minuscula2').html();
	let mayuscula2=$('#'+objeto.tabla+' #mayuscula2').html();
	let minimo2=$('#'+objeto.tabla+' #minimo2').html();
	let especial2=$('#'+objeto.tabla+' #especial2').html();


	if(vactual==false || vnueva==false || vrepite==false){
		return false;
	}else if(numero1=="" || minuscula1==""  || mayuscula1=="" || minimo1=="" || especial1==""){
		noCoincide(objeto.contrasenaNueva);
		info('¡La contrasena nueva no cumple con los requisitos!');
	}else if(numero2=="" || minuscula2==""  || mayuscula2=="" || minimo2=="" || especial2==""){
		noCoincide(objeto.contrasenaRepite);
		info('¡La contrasena repetida no cumple con los requisitos!');
	}else if(objeto.contrasenaNueva.val()!=objeto.contrasenaRepite.val()){
		noCoincide(objeto.contrasenaNueva);
		noCoincide(objeto.contrasenaRepite);
		$('#passnueva').text('¡Las contraseñas no coinciden!');
		$('#passnueva').removeClass('oculto');
		$('#passrepite').text('¡Las contraseñas no coinciden!');
		$('#passrepite').removeClass('oculto');
	}else{
		verificaPassword(objeto);
	}
}

async function verificaPassword(objeto){
	bloquea();
	let body={
		contrasenaActual:objeto.contrasenaActual.val()
	}
	try{
		const verifica = await axios.put("/api/acceso/verificaPass/"+verSesion(),body,{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		desbloquea();
		const resp=verifica.data.valor;
		if(resp.resultado){
			cambiaContrasena(objeto);
		}else{
			noCoincide(objeto.contrasenaActual);
			$('#passactual').text(resp.mensaje);
		}
	}catch (err) {
		desbloquea();	
		message=err.response.data.error.message;
		errno=err.response.data.error.errno;
		mensajeSistema(message);
	}
}

function cambiaContrasena(objeto){
    confirm('¡Se cambiará su contraseña!',function(){
		return false;
	},async function(){
        bloquea();
		let body={
			contrasenaNueva:objeto.contrasenaNueva.val()
		}
		try{
			const contrasena = await axios.put("/api/acceso/password/"+verSesion(),body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			const resp=contrasena.data.valor;
	
			if(resp.resultado){
				desbloquea();
				limpiaElementos(objeto.tabla);
				quitaValidacionTodo(objeto.tabla);
				$('#passactual').addClass('oculto');
				$('#passrepite').addClass('oculto');
				$('#passnueva').addClass('oculto');
				$('#passactual').text('');
				$('#passrepite').text('');
				$('#passnueva').text('');
				//window.location.replace('/');
				return true;
			}else{
				mensajeSistema(resp.mensaje);
			}
		}catch (err) {
			desbloquea();	
			message=err.response.data.error.message;
			errno=err.response.data.error.errno;
			mensajeSistema(message);
		}
    });
}


function validaContrasenas(objeto){
	
	let numero="0123456789";
	let minuscula="abcdefghijklmnñopqrstuvwxyz";
	let mayuscula="ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
	let especial="!¡#$%&()*+-./:;=¿?@[]{|}";
	let dig='';
	if(objeto.name=='contrasenaRepite'){
		dig=2;
	}
	$('#'+objeto.tabla+' #numero'+dig).html("");
	$('#'+objeto.tabla+' #minuscula'+dig).html("");
	$('#'+objeto.tabla+' #mayuscula'+dig).html("");
	$('#'+objeto.tabla+' #especial'+dig).html("");
	$('#'+objeto.tabla+' #minimo'+dig).html("");

	let caja=$("#"+objeto.tabla+" input[name="+objeto.name+"]").val();

	let verifica1=0;
	let verifica2=0;
	let verifica3=0;
	let verifica4=0;
	let verifica5=0;
	for(i=0; i<caja.length; i++){
		if (numero.indexOf(caja.charAt(i),0)!=-1){
			$('#'+objeto.tabla+' #numero'+dig).html("<i class='bg-accent-4 las la-check-circle'></i>");
			verifica1=1;
		}
		if (minuscula.indexOf(caja.charAt(i),0)!=-1){
			$('#'+objeto.tabla+' #minuscula'+dig).html("<i class='bg-accent-4 las la-check-circle'></i>");
			verifica2=1;
		}
		if (mayuscula.indexOf(caja.charAt(i),0)!=-1){
			$('#'+objeto.tabla+' #mayuscula'+dig).html("<i class='bg-accent-4 las la-check-circle'></i>");
			verifica3=1;
		}
		if (especial.indexOf(caja.charAt(i),0)!=-1){
			$('#'+objeto.tabla+' #especial'+dig).html("<i class='bg-accent-4 las la-check-circle'></i>");
			verifica4=1;
		}
		if(i>=5 && 16>=i){
			$('#'+objeto.tabla+' #minimo'+dig).html("<i class='bg-accent-4 las la-check-circle'></i>");
			verifica5=1;
		}
	}

	if(verifica1+verifica2+verifica3+verifica4+verifica5==5){
		coincide($("#"+objeto.tabla+" input[name="+objeto.name+"]"));
	}else{
		noCoincide($("#"+objeto.tabla+" input[name="+objeto.name+"]"));
		$("#"+objeto.tabla+" input[name="+objeto.name+"]").siblings('div.mensaje').text('¡La contraseña no cumple con los requisitos!');
	}
}

