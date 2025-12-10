// JavaScript Document
function mostrar_general1(objeto){
	$("#general1.modal").css('z-index','601');
	$("#tamanoGeneral1").css({'cssText': 'max-width:'+objeto.ancho+'px !important'});
	var g1 = new bootstrap.Modal(document.getElementById('general1'), {
		backdrop: 'static',
		keyboard: true, 
	})
	g1.show();
	$("#tituloGeneral1").html(objeto.titulo);
	$("#general1 span#padreId").text(objeto.idPadre);
	if(objeto.nombre!=undefined){
		$("#subtituloGeneral1").html("<div class='alert alert-primary' role='alert'>"+objeto.nombre+"</div>");
	}
	$("#contenidoGeneral1").html(objeto.msg);
	
	$(".modal-backdrop").eq(0).css('z-index','600');
	$('#general1 button[name=btnCancela]').on( 'click', function () {
		g1.hide();
		$("#contenidoGeneral1").html('');
		$("#subtituloGeneral1").html('');
		$("#general1 span#padreId").text('');
		if(objeto.barra!=undefined){
			focusBarra(objeto.barra);
		}
	});
}

function mostrar_general2(objeto){
	$("#general2.modal").css('z-index','603');
	$("#tamanoGeneral2").css({'cssText': 'max-width:'+objeto.ancho+'px !important'});
	var g2 = new bootstrap.Modal(document.getElementById('general2'), {
		backdrop: 'static',
		keyboard: true, 
	})
	g2.show();
	$("#tituloGeneral2").html(objeto.titulo);
	if(objeto.nombre!=undefined){
		$("#subtituloGeneral2").html("<div class='alert alert-primary' role='alert'>"+objeto.nombre+"</div>");
	}
	$("#contenidoGeneral2").html(objeto.msg);


	$(".modal-backdrop").eq(1).css('z-index','602');
	$('#general2 button[name=btnCancela]').on( 'click', function () {
		g2.hide();
		$("#contenidoGeneral2").html('');
		$("#subtituloGeneral2").html('');

	});
}

function mostrar_general3(objeto){
	$("#general3.modal").css('z-index','605');
	$("#tamanoGeneral3").css({'cssText': 'max-width:'+objeto.ancho+'px !important'});
	var g3 = new bootstrap.Modal(document.getElementById('general3'), {
		backdrop: 'static',
		keyboard: true, 
	})
	g3.show();
	$("#tituloGeneral3").html(objeto.titulo);
	if(objeto.nombre!=undefined){
		$("#subtituloGeneral3").html("<div class='alert alert-primary' role='alert'>"+objeto.nombre+"</div>");
	}
	$("#contenidoGeneral3").html(objeto.msg);

	$(".modal-backdrop").eq(2).css('z-index','604');
	$('#general3 button[name=btnCancela]').on( 'click', function () {
		g3.hide();
		$("#contenidoGeneral3").html('');
		$("#subtituloGeneral3").html('');
	});
}