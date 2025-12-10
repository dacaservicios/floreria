$(document).ready(async function() {
    bloquea('Cargando el dashboard...');
    let body={
        sesId:verSesion(),
        token:verToken()
    }
    const result = await axios.post("/api/general/dashboard",body,{
        headers:{
			authorization: `Bearer ${verToken()}`
		} 
    });



    //servicios por mes
    let jsonBar=[];
    let monto;
    let num;
    let anioMesVer=[];
    let mes=[];
    let anioMes=[];
    arra_mes =['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Set','Oct','Nov','Dic'];
    arra_numero =[1,2,3,4,5,6,7,8,9,10,11,12];

    for(let a=0;a<result.data.resp3.length;a++){
        mes.push(result.data.resp3[a]['MES']);
        anioMesVer.push(arra_mes[result.data.resp3[a]['MES']-1]+" "+result.data.resp3[a]['ANIO']);
    }
    
    mes=[...new Set(mes)];
    anioMesVer=[...new Set(anioMesVer)];

    let cuenta=0;
    //let mesActual=moment().format('M');
    let anioActual=moment().format('Y');
    for(let a=0;a<arra_numero.length;a++){
        if(mes.includes(arra_numero[a])){
            anioMes.push(anioMesVer[cuenta]);
            cuenta++;
        }else{
            anioMes.push(arra_mes[arra_numero[a]-1]+" "+anioActual);
        }
    }

    for(let a=0;a<result.data.resp2.length;a++){
        monto=[];
        num=1;
        for(let b=0;b<result.data.resp3.length;b++){
            if(result.data.resp2[a]['SERVICIO']==result.data.resp3[b]['SERVICIO']){
                if(result.data.resp3[b]['MES']==num){
                    monto.push(result.data.resp3[b]['MONTO']);
                }else{
                    monto.push(0);
                    b--;
                }
                num++;
            }
        }
        jsonBar.push({name:result.data.resp2[a]['SERVICIO'],data:monto});
    }
    
    //servicios por dia en general
    let jsonVentaDia=[];
    let montoDia=[];
    let montoD=[];
    let fecha = new Date();
    let dias=new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
    let dia=[];

    //dias
    for(let b=0;b<result.data.resp7.length;b++){
        let diaD=result.data.resp7[b]['DIA'];
        montoD[diaD]=result.data.resp7[b]['MONTO'];
    }

    for(let a=0;a<dias;a++){
        if(!dia.includes(a+1)){
            if(montoD[a+1]===undefined){
                montoDia.push(0);
            }else{
                montoDia.push(montoD[a+1]);
            }
        }
        dia.push(a+1);
    }

    jsonVentaDia.push({name:'Ventas',data:montoDia});


    let informacion=`
    <!-- breadcrumb -->
<div class="breadcrumb-header justify-content-between">
    <div class="left-content">
        <div>
            <h2 class="main-content-title tx-24 mg-b-1 mg-b-lg-1">Hola, bienvenido de nuevo!</h2>
            <p class="mg-b-0">Panel de seguimiento de ventas. <strong class="tx-10">(actualizado cada hora)</strong></p>
        </div>
    </div>
    <div class="rigth-content">
        <div>
            <a id="actualizaDashboard" class="cursor new nav-link nav-link-bg refresh-dashboard" >
                <span class="dark-layout">
                    <svg xmlns="http://www.w3.org/2000/svg" class="header-icon-svgs" width="29" height="29" viewBox="0 0 29 29">
                        <path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"></path>
                        </svg>
                </span>
                <span class="light-layout">
                    <svg xmlns="http://www.w3.org/2000/svg" class="header-icon-svgs" width="29" height="29" viewBox="0 0 29 29">
                        <path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"></path>
                        </svg>
                </span>
            </a>
        </div>
    </div>
    <!--<div class="main-dashboard-header-right">
        <div>
            <label class="tx-13">Customer Ratings</label>
            <div class="main-star">
                <i class="typcn typcn-star active"></i> <i class="typcn typcn-star active"></i> <i class="typcn typcn-star active"></i> <i class="typcn typcn-star active"></i> <i class="typcn typcn-star"></i> <span>(14,873)</span>
            </div>
        </div>
        <div>
            <label class="tx-13">Online Sales</label>
            <h5>563,275</h5>
        </div>
        <div>
            <label class="tx-13">Offline Sales</label>
            <h5>783,675</h5>
        </div>
    </div>-->
</div>
<!-- breadcrumb -->
<!-- row -->
<div class="row row-sm">
    <div class="col-xl-4 col-lg-6 col-md-6 col-xm-12">
        <div class="card overflow-hidden sales-card bg-primary-gradient">
            <div class="px-3 pt-3  pb-2 pt-0">
                <div class="">
                    <h6 class="mb-3 tx-12 text-white">ATENCIÓN DEL MES</h6>
                </div>
                <div class="pb-0 mt-0">
                    <div class="d-flex">
                        <div class="">
                            <h4 class="tx-20 fw-bold mb-1 text-white">${'S/. '+parseFloat(result.data.resp1[0].ATENCION_MES).toFixed(2)}</h4>
                            <p class="mb-0 tx-12 text-white op-7">Comparado con el mes anterior</p>
                        </div>
                        <span class="float-end my-auto ms-auto">`;
                            let flecha=(result.data.resp1[0].ATENCION_MES>result.data.resp1[0].ATENCION_MES_ANT)?'up':'down';
                            let signo=(result.data.resp1[0].ATENCION_MES>result.data.resp1[0].ATENCION_MES_ANT)?'+':'-';
                informacion+=`<i class="fas fa-arrow-circle-${flecha} text-white"></i>
                            <span class="text-white op-7"> ${signo+'S/. '+parseFloat((result.data.resp1[0].ATENCION_MES-result.data.resp1[0].ATENCION_MES_ANT)).toFixed(2)}</span>
                        </span>
                    </div>
                </div>
            </div>
            <span id="compositeline" class="pt-1">5,9,5,6,4,12,18,14,10,15,12,5,8,5,12,5,12,10,16,12</span>
        </div>
    </div>
    <div class="col-xl-4 col-lg-6 col-md-6 col-xm-12">
        <div class="card overflow-hidden sales-card bg-danger-gradient">
            <div class="px-3 pt-3  pb-2 pt-0">
                <div class="">
                    <h6 class="mb-3 tx-12 text-white">ATENCIÓN DE LA SEMANA</h6>
                </div>
                <div class="pb-0 mt-0">
                    <div class="d-flex">
                        <div class="">
                            <h4 class="tx-20 fw-bold mb-1 text-white">${'S/. '+parseFloat(result.data.resp1[0].ATENCION_SEMANA).toFixed(2)}</h4>
                            <p class="mb-0 tx-12 text-white op-7">Comparado con la semana anterior</p>
                        </div>
                        <span class="float-end my-auto ms-auto">`;
                            flecha=(result.data.resp1[0].ATENCION_SEMANA>result.data.resp1[0].ATENCION_SEMANA_ANT)?'up':'down';
                            signo=(result.data.resp1[0].ATENCION_SEMANA>result.data.resp1[0].ATENCION_SEMANA_ANT)?'+':'-';
            informacion+=`<i class="fas fa-arrow-circle-${flecha} text-white"></i>
                        <span class="text-white op-7"> ${signo+'S/. '+parseFloat((result.data.resp1[0].ATENCION_SEMANA-result.data.resp1[0].ATENCION_SEMANA_ANT)).toFixed(2)}</span>
                        </span>
                    </div>
                </div>
            </div>
            <span id="compositeline2" class="pt-1">3,2,4,6,12,14,8,7,14,16,12,7,8,4,3,2,2,5,6,7</span>
        </div>
    </div>
    <div class="col-xl-4 col-lg-6 col-md-6 col-xm-12">
        <div class="card overflow-hidden sales-card bg-success-gradient">
            <div class="px-3 pt-3  pb-2 pt-0">
                <div class="">
                    <h6 class="mb-3 tx-12 text-white">ATENCIÓN DEL DÍA</h6>
                </div>
                <div class="pb-0 mt-0">
                    <div class="d-flex">
                        <div class="">
                            <h4 class="tx-20 fw-bold mb-1 text-white">${'S/. '+parseFloat(result.data.resp1[0].ATENCION_DIA).toFixed(2)}</h4>
                            <p class="mb-0 tx-12 text-white op-7">Comparado con el día anterior</p>
                        </div>
                        <span class="float-end my-auto ms-auto">`;
                            flecha=(result.data.resp1[0].ATENCION_DIA>result.data.resp1[0].ATENCION_DIA_ANT)?'up':'down';
                            signo=(result.data.resp1[0].ATENCION_DIA>result.data.resp1[0].ATENCION_DIA_ANT)?'+':'-';
            informacion+=`<i class="fas fa-arrow-circle-${flecha} text-white"></i>
                        <span class="text-white op-7"> ${signo+'S/. '+parseFloat((result.data.resp1[0].ATENCION_DIA-result.data.resp1[0].ATENCION_DIA_ANT)).toFixed(2)}</span>
                        </span>
                    </div>
                </div>
            </div>
            <span id="compositeline3" class="pt-1">5,10,5,20,22,12,15,18,20,15,8,12,22,5,10,12,22,15,16,10</span>
        </div>
    </div>
</div> 
<!-- row closed -->

<!-- row opened -->
<div class="row row-sm">
    <div class="col-md-12 col-lg-12 col-xl-12">
        <div class="card">
            <div class="card-header bg-transparent pd-b-0 pd-t-20 bd-b-0">
                <div class="d-flex justify-content-between">
                    <h4 class="card-title mb-0">STATUS DE SERVICIOS</h4>
                </div>
                <p class="tx-12 text-muted mb-0">El ranking de los servicios anualizados.</p>
            </div>
            <div class="card-body b-p-apex">
                <div class="row">`;
                    for(let i=0;i<result.data.resp2.length;i++){
        informacion+=`<div class='col-3'>
                        <h4 class='mb-0'>${'S/. '+parseFloat(result.data.resp2[i]['MONTO']).toFixed(2)}</h4>
                        <label><span class="bg-primary"></span>${result.data.resp2[i]['SERVICIO']}</label>
                    </div>`;
                    }
    informacion+=`</div>
                    <div id="bar" class="sales-bar mt-4"></div>
            </div>
        </div>
    </div>
</div>
<!-- row closed -->

<!-- row opened -->
<div class="row row-sm">
    <div class="col-md-12 col-lg-12 col-xl-12">
        <div class="card">
            <div class="card-header bg-transparent pd-b-0 pd-t-20 bd-b-0">
                <div class="d-flex justify-content-between">
                    <h4 class="card-title mb-0">INGRESOS DIARIOS</h4>
                </div>
                <p class="tx-12 text-muted mb-0">Los ingresos diarios en el tiempo.</p>
            </div>
            <div class="card-body b-p-apex">
                <div class="row">
                    <div class="col-md-12">
                        <div id="ventaDia" class="sales-bar"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- row closed -->

<!-- row opened -->
<div class="row row-sm">
    <div class="col-xl-6 col-md-6 col-lg-12">
        <div class="card">
            <div class="card-header pb-1">
                <h3 class="card-title mb-2">TOP COLABORADORES <strong class="tx-10">(Últimos 30 días)</strong></h3>
                <p class="tx-12 mb-0 text-muted">El top de los colaboradores mas solicitados</p>
            </div>
            <div class="card-body p-0 customers mt-1">
                <div class="list-group list-lg-group list-group-flush">`;
                for(let i=0;i<result.data.resp4.length;i++){
        informacion+=`<div class="list-group-item list-group-item-action br-t-1">
                        <div class="media mt-0">
                            <img class="avatar-lg rounded-circle my-auto me-3" src="../imagenes/empleado/${(result.data.resp4[i].IMAGEN===null)?'vacio.jpg':'EMP_'+result.data.resp4[i].IMAGEN}" alt="Image description">
                            <div class="media-body">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="mt-0">
                                        <h5 class="mb-1 tx-15">${result.data.resp4[i].BARBERO}</h5>
                                    </div>
                                    <div class="mt-0">
                                        <h5>${result.data.resp4[i].CANTIDAD}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    }
                informacion+=`</div>
            </div>
        </div>
    </div>
    <div class="col-md-12 col-lg-6 col-xl-6">
        <div class="card">
            <div class="card-header pb-1">
                <h3 class="card-title mb-2">TOP SERVICIOS <strong class="tx-10">(Últimos 30 días)</strong></h3>
                <p class="tx-12 mb-0 text-muted">El top de los servicios mas solicitados </p>
            </div>
            <div class="card-body p-0 customers mt-1">
                <div class="list-group list-lg-group list-group-flush">`;
                for(let i=0;i<result.data.resp5.length;i++){
        informacion+=`<div class="list-group-item list-group-item-action br-t-1">
                        <div class="media mt-0">
                            <img class="avatar-lg rounded-circle my-auto me-3" src="../assets/img/users/3.jpg" alt="Image description">
                            <div class="media-body">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="mt-0">
                                        <h5 class="mb-1 tx-15">${result.data.resp5[i].SERVICIO}</h5>
                                    </div>
                                    <div class="mt-0">
                                        <h5>${result.data.resp5[i].CANTIDAD}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    }
                informacion+=`</div>
            </div>
        </div>
    </div>
    <div class="col-md-12 col-lg-12 col-xl-12">
        <div class="card card-table-two">
            <div class=" card-header p-0 d-flex justify-content-between">
                <h4 class="card-title mb-1">TOP 5 CLIENTES MAS CONCURRENTES <strong class="tx-10">(Últimos 3 meses)</strong></h4>
            </div>
            <span class="tx-12 tx-muted mb-3 ">El top de clientes que mas consumen.</span>
            <div class="table-responsive country-table">
                <table class="table table-striped table-bordered mb-0 text-sm-nowrap text-lg-nowrap text-xl-nowrap">
                    <thead>
                        <tr>
                            <th class="wd-lg-50p">Cliente</th>
                            <th class="wd-lg-25p tx-right">#Servicios</th>
                            <th class="wd-lg-25p tx-right">Monto</th>
                        </tr>
                    </thead>
                    <tbody>`;
                    for(let i=0;i<result.data.resp6.length;i++){
            informacion+=`<tr>
                            <td>${result.data.resp6[i]['CLIENTE']}</td>
                            <td class="tx-right tx-medium tx-inverse">${result.data.resp6[i]['CANTIDAD']}</td>
                            <td class="tx-right tx-medium tx-inverse">${parseFloat(result.data.resp6[i]['MONTO']).toFixed(2)}</td>
                        </tr>`;
                    }
    informacion+=`</tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<!-- row close -->

<!--Internal  Chart.bundle js -->
<script src="/assets/plugins/chart.js/Chart.bundle.min.js"></script>

<!--Internal Sparkline js -->
<script src="/assets/plugins/jquery-sparkline/jquery.sparkline.min.js"></script>

<!--Internal Apexchart js-->
<script src="/assets/js/apexcharts.js"></script>

<!--Internal  index js -->
<script src='/java/graficas.js'></script>

<!-- /row -->`;

$("#cuerpoPrincipal").html(informacion);
$('#actualizaDashboard').off( 'click');
$('#actualizaDashboard').on( 'click',function () {
    actualizaDashboard();
});
indexbar(jsonBar,anioMes);
indexVentasDia(jsonVentaDia, dia);
//indexchart();
desbloquea();
});

moment.locale('es');
function indexVentasDia(jsonVentaDia, dia) {
	var optionsBar = {
		chart: {
			height: 250,
			responsive: 'true',
			type: 'bar',
			toolbar: {
				show: false,
			},
			fontFamily: 'Nunito, sans-serif',
		},
		colors: [myVarVal, '#f93a5a', '#f7a556'],
		plotOptions: {
			bar: {
				dataLabels: {
					enabled: true,
                    position:'top'
				},
				columnWidth: '50%',
				endingShape: 'rounded',
			}
		},
		dataLabels: {
			enabled: true,
            formatter: function (val) {
                return (val==0)?'':val;
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#304758"]
            }
		},
		grid: {
			show: true,
			borderColor: '#f3f3f3',
		},
		stroke: {
			show: true,
			width: 2,
			endingShape: 'rounded',
			colors: ['transparent'],
		},
		responsive: [{
			enable: 'true',
			breakpoint: 576,
			options: {
				stroke: {
					show: true,
					width: 1,
					endingShape: 'rounded',
					colors: ['transparent'],
				},
			},

		}],
		series: jsonVentaDia,
		xaxis: {
			categories: dia,
            title: {
                text: 'Días'
            }
		},
        yaxis:{
            title: {
                text: 'S/. (Monto)'
            }
        },
		fill: {
			opacity: 1
		},
		legend: {
			show: false,
			floating: true,
			position: 'top',
			horizontalAlign: 'left',


		},
        title: {
            text: 'Ingresos '+moment().format('MMMM YYYY'),
        },
		tooltip: {
			y: {
				formatter: function (val) {
					return "S/. " + parseFloat(val).toFixed(2)
				}
			}
		}
	}
	document.querySelector('#ventaDia').innerHTML = ""
	new ApexCharts(document.querySelector('#ventaDia'), optionsBar).render();
}

function indexbar(jsonBar,anioMes) {
	var optionsBar = {
		chart: {
			height: 249,
			responsive: 'true',
			type: 'bar',
			toolbar: {
				show: false,
			},
			fontFamily: 'Nunito, sans-serif',
		},
		colors: [myVarVal, '#f93a5a', '#f7a556'],
		plotOptions: {
			bar: {
				dataLabels: {
					enabled: false
				},
				columnWidth: '42%',
				endingShape: 'rounded',
			}
		},
		dataLabels: {
			enabled: false
		},
		grid: {
			show: true,
			borderColor: '#f3f3f3',
		},
		stroke: {
			show: true,
			width: 2,
			endingShape: 'rounded',
			colors: ['transparent'],
		},
		responsive: [{
			enable: 'true',
			breakpoint: 576,
			options: {
				stroke: {
					show: true,
					width: 1,
					endingShape: 'rounded',
					colors: ['transparent'],
				},
			},

		}],
		series: jsonBar,
		xaxis: {
			categories: anioMes,
		},
		fill: {
			opacity: 1
		},
		legend: {
			show: false,
			floating: true,
			position: 'top',
			horizontalAlign: 'left',


		},

		tooltip: {
			y: {
				formatter: function (val) {
					return "S/. " + parseFloat(val).toFixed(2)
				}
			}
		}
	}
	document.querySelector('#bar').innerHTML = ""
	new ApexCharts(document.querySelector('#bar'), optionsBar).render();
}
/*
function indexchart(){
	var options = {
		chart: {
			width: 200,
			height: 205,
			responsive: 'true',
			reset: 'true',
			type: 'radialBar',
			offsetX: 0,
			offsetY: 0,
		},
		plotOptions: {
			radialBar: {
				responsive: 'true',
				startAngle: -135,
				endAngle: 135,
				size: 120,
				imageWidth: 50,
				imageHeight: 50,

				track: {
					strokeWidth: "80%",
					background: '#ecf0fa',
				},
				dropShadow: {
					enabled: false,
					top: 0,
					left: 0,
					bottom: 0,
					blur: 3,
					opacity: 0.5
				},
				dataLabels: {
					name: {
						fontSize: '16px',
						color: undefined,
						offsetY: 30,
					},
					hollow: {
						size: "60%"
					},
					value: {
						offsetY: -10,
						fontSize: '22px',
						color: undefined,
						formatter: function (val) {
							return val + "%";
						}
					}
				}
			}
		},
		colors: ['#0db2de'],
		fill: {
			type: "gradient",
			gradient: {
				shade: "dark",
				type: "horizontal",
				shadeIntensity: .5,
				gradientToColors: [myVarVal],
				inverseColors: !0,
				opacityFrom: 1,
				opacityTo: 1,
				stops: [0, 100]
			}
		},
		stroke: {
			dashArray: 4
		},
		series: [83],
		labels: [""]
	};

	document.querySelector('#chart').innerHTML = ""
	var chart = new ApexCharts(document.querySelector("#chart"), options);
	chart.render();
}*/
