function botonAccesoDirecto(){
    let acceso=`
    <div id="accesoDirecto">
        <div class="card">  
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4 accesoDirecto cursor">
                        <div class="card">
                            <div class="box bg-success text-center shadow rounded-3">
                                <h6 class="font-light text-white"><i class="fas fa-cart-arrow-down fa-2x"></i></h6>
                                <h6 class="text-white"> ATENCION</h6>
                                <input name="idSubMenu" type="hidden" value="75">
                                <input name="idMenu" type="hidden" value="6">
                                <input name="menuNombre" type="hidden" value="Ventas">
                                <input name="submenuNombre" type="hidden" value="Atencion">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 accesoDirecto cursor">
                        <div class="card">
                            <div class="box bg-primary text-center shadow rounded-3">
                                <h6 class="font-light text-white"><i class="fas fa-donate fa-2x"></i></h6>
                                <h6 class="text-white"> PEDIDO</h6>
                                <input name="idSubMenu" type="hidden" value="56">
                                <input name="idMenu" type="hidden" value="6">
                                <input name="menuNombre" type="hidden" value="Ventas">
                                <input name="submenuNombre" type="hidden" value="Pedido">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 accesoDirecto cursor">
                        <div class="card">
                            <div class="box bg-info text-center shadow rounded-3">
                                <h6 class="font-light text-white"><i class="fas fa-shopping-basket fa-2x"></i></h6>
                                <h6 class="text-white"> VENTA</h6>
                                <input name="idSubMenu" type="hidden" value="64">
                                <input name="idMenu" type="hidden" value="25">
                                <input name="menuNombre" type="hidden" value="Gestión">
                                <input name="submenuNombre" type="hidden" value="Venta">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    return acceso;
}

function resumenUltimasVenta(ultimasVentas,ventaDia,ventaMes,productoMas,totalMas,ingresoDia,ingresoMes,egresoDia,egresoMes,descuentoDia,descuentoMes){
    let ultimas=`
    <div class="card ultimasVentas">
        <div class="row">
            <div class="col-md-8">
                <div class="card-header">
                    <h6>ÚLTIMAS VENTAS DEL DÍA</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="pt-3 table table-striped text-center">
                            <thead class="thead-dark">
                                <tr>
                                    <th class="nosort">Tipo</th>
                                    <th class="nosort">Documento</th>
                                    <th class="nosort">Cliente</th>
                                    <th class="nosort">Fecha</th>
                                    <th class="nosort">Monto</th>
                                </tr>
                            </thead>
                            <tbody id="ultimasVentas">`;
                                for(var i=0;i<ultimasVentas.length;i++){
                            ultimas+=`<tr>
                                        <td class="mediano">${ultimasVentas[i].TIPO_DOCUMENTO}</td>
                                        <td class="mediano">${ultimasVentas[i].SERIE+" - "+ultimasVentas[i].NUMERO_DOCUMENTO}</td>
                                        <td class="mediano">${(ultimasVentas[i].APELLIDOS===null)?ultimasVentas[i].NOMBRE:ultimasVentas[i].NOMBRE+' '+ultimasVentas[i].APELLIDOS}</td>
                                        <td class="mediano">${moment(ultimasVentas[i].FECHA_VENTA).format('DD-MM-YYYY')}</td>
                                        <td class="mediano">${parseFloat(ultimasVentas[i].TOTAL-ultimasVentas[i].DESCUENTO).toFixed(2)}</td>
                                    </tr>`;
                                }
                ultimas+=`</tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card-header">
                    <h6>PRODUCTOS MÁS VENDIDOS DEL MES
                    </h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="pt-3 table table-striped text-center">
                            <thead class="thead-dark">
                                <tr>
                                    <th class="nosort">Producto</th>
                                    <th class="nosort">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody id="productoVendido">`;
                                for(var i=0;i<productoMas.length;i++){
                        ultimas+=`<tr>
                                        <td class="mediano">${productoMas[i].NOMBRE}</td>
                                        <td>
                                            <div class="progress" style="height: 20px;">
                                                <div class="progress-bar progress-bar-striped progress-bar-animated" style="witdh: ${productoMas[i].CANTIDAD/totalMas}"role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">${productoMas[i].CANTIDAD}</div>
                                            </div>
                                        </td>
                                    </tr>`;
                                }
                ultimas+=`</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 pt-1 pb-1">
                <div class="card">  
                    <div class="card-body"> 
                        <div id="resumenes" class="row">
                            <div class="col-md-3 pt-1">
                                <div class="bg-dark text-white text-center rounded-3">
                                    <i class="las la-donate"></i>
                                    <h5 class="ventaDia mb-0">${parseFloat(ventaDia.TOTAL).toFixed(2)}</h5>
                                    <small class="font-light">Ventas Día</small>
                                </div>
                            </div>
                            <div class="col-md-3 pt-1">
                                <div class="bg-dark text-white text-center rounded-3">
                                    <i class="las la-cash-register"></i>
                                    <h5 class="ventaMes mb-0">${parseFloat(ventaMes.TOTAL).toFixed(2)}</h5>
                                    <small class="font-light">Ventas Mes</small>
                                </div>
                            </div>
                            <div class="col-md-3 pt-1">
                                <div class="bg-dark text-white text-center rounded-3">
                                    <i class="las la-chart-pie"></i>
                                    <h5 class="descuentoDia mb-0">${parseFloat(descuentoDia.DESCUENTO_DIA).toFixed(2)}</h5>
                                    <small class="font-light">Descuento Día</small>
                                </div>
                            </div>
                            <div class="col-md-3 pt-1">
                                <div class="bg-dark text-white text-center rounded-3">
                                    <i class="las la-chart-line"></i>
                                    <h5 class="descuentoMes mb-0">${parseFloat(descuentoMes.DESCUENTO_MES).toFixed(2)}</h5>
                                    <small class="font-light">Descuento Mes</small>
                                </div>
                            </div>
                            <div class="col-md-3 pt-1">
                                <div class="bg-dark text-white text-center rounded-3">
                                    <i class="las la-money-bill"></i>
                                    <h5 class="ingresoDia mb-0">${parseFloat(ingresoDia.INGRESO_DIA).toFixed(2)}</h5>
                                    <small class="font-light">Ingreso Día</small>
                                </div>
                            </div>
                            <div class="col-md-3 pt-1">
                                <div class="bg-dark text-white text-center rounded-3">
                                    <i class="las la-piggy-bank"></i>
                                    <h5 class="ingresoMes mb-0">${parseFloat(ingresoMes.INGRESO_MES).toFixed(2)}</h5>
                                    <small class="font-light">Ingreso Mes</small>
                                </div>  
                            </div>
                            <div class="col-md-3 pt-1">
                                <div class="bg-dark text-white text-center rounded-3">
                                    <i class="las la-money-bill-alt"></i>
                                    <h5 class="egresoDia mb-0">${parseFloat(egresoDia.EGRESO_DIA).toFixed(2)}</h5>
                                    <small class="font-light">Egreso Día</small>
                                </div>
                            </div>
                            <div class="col-md-3 pt-1">
                                <div class="bg-dark text-white text-center rounded-3">
                                    <i class="las la-comments-dollar"></i>
                                    <h5 class="egresoMes mb-0">${parseFloat(egresoMes.EGRESO_MES).toFixed(2)}</h5>
                                    <small class="font-light">Egreso Mes</small>
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return ultimas;
}

function graficasVentas(){
    let grafica=`
    <div id="grafica">
        <div class="card"> 
            <div class="row">
                <div class="col-md-6 pt-1 pb-1">
                    <div class="card">  
                        <div id="graficaVentasDia" class="card-body">
                            <div class="chart-container"> 
                                <canvas id="myChartDia" class="graficaReporte"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 pt-1 pb-1">
                    <div class="card">  
                        <div id="graficaVentasMes" class="card-body">   
                            <div class="chart-container"> 
                                <canvas id="myChartMes" class="graficaReporte"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return grafica;
}

function graficaVentasDias(graficaVentaDia){
    let arrayVentaDia=[];
    let arrayDia=[];
    let arrayMes=[];
    for(var i=0;i<graficaVentaDia.length;i++){
        arrayVentaDia.push(parseFloat(graficaVentaDia[i].TOTAL).toFixed(2));
        arrayDia.push(moment(graficaVentaDia[i].FECHA).format('DD'));
        arrayMes.push(moment(graficaVentaDia[i].FECHA).format('MM'));
    }

    let arrayMesesEntero=['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SETIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];

    let datosDia ={
        type: 'bar',
        data: {
            labels: arrayDia,
            datasets: [{
                label: 'VENTAS DIARIAS',
                data: arrayVentaDia,
                backgroundColor: '#0000FF',
                borderColor: ['#0000FF'],
                borderWidth: 0,
                borderRadius:20,
                pointStyle: 'rectRot',
                pointRadius: 3,
                pointBorderColor: '#0000FF'
            }]
        },
        options: {
            plugins: { 
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        fontSize: 10,
                        fontFamily: 'Tahoma'
                    }
                },
                title:{
                    display: true,
                    text: 'GRÁFICA - '+arrayMesesEntero[parseInt(arrayMes[0])-1]
                }
            },
            title: {
                display: true,
                text: 'VENTAS DIARIAS',
            },
            scales: {
                x: {
                    display:true,
                    title:{
                        display: true,
                        text: 'Días',
                        font:{
                            family: 'Tahoma',
                            size: 12,
                            weight: 'bold',
                            lineHeight: 1.2,
                        }
                    },
                },
                y: {
                    display:true,
                    title:{
                        display: true,
                        text: 'Monto (S/.)',
                        font:{
                            family: 'Tahoma',
                            size: 12,
                            weight: 'bold',
                            lineHeight: 1.2,
                        }
                    },
                }
            }
        }
    }
   
    let ctxDia = document.getElementById('myChartDia').getContext('2d');
    new Chart(ctxDia, datosDia);
}

function graficaVentasMeses(graficaVentaMes){
    let arrayVentaMes=[];
    let arrayMesi=[];
    let arrayAnio=[];
    let arrayMesesCorto=['ene','feb','mar','abr','may','jun','jul','ago','set','oct','nov','dic'];
    for(var i=0;i<graficaVentaMes.length;i++){
        arrayVentaMes.push(parseFloat(graficaVentaMes[i].TOTAL).toFixed(2));
        arrayMesi.push(arrayMesesCorto[parseInt(moment(graficaVentaMes[i].FECHA).format('MM'))-1]);
        arrayAnio.push(moment(graficaVentaMes[i].FECHA).format('YYYY'));
    }

    let datosMes ={
        type: 'bar',
        data: {
            labels: arrayMesi,
            datasets: [{
                label: 'VENTAS MESUALES',
                data: arrayVentaMes,
                backgroundColor: '#0000FF',
                borderColor: ['#0000FF'],
                borderWidth: 0,
                borderRadius:20,
                pointStyle: 'rectRot',
                pointRadius: 3,
                pointBorderColor: '#0000FF'
            }]
        },
        options: {
            plugins: { 
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        fontSize: 10,
                        fontFamily: 'Tahoma'
                    }
                },
                title:{
                    display: true,
                    text: 'GRÁFICA - '+arrayAnio[0]
                }
            },
            title: {
                display: true,
                text: 'VENTAS MENSUALES',
            },
            scales: {
                x: {
                    display:true,
                    title:{
                        display: true,
                        text: 'Meses',
                        font:{
                            family: 'Tahoma',
                            size: 12,
                            weight: 'bold',
                            lineHeight: 1.2,
                        }
                    },
                },
                y: {
                    display:true,
                    title:{
                        display: true,
                        text: 'Monto (S/.)',
                        font:{
                            family: 'Tahoma',
                            size: 12,
                            weight: 'bold',
                            lineHeight: 1.2,
                        }
                    },
                }
            }
        }
    }
    let ctxMes = document.getElementById('myChartMes').getContext('2d');
    new Chart(ctxMes, datosMes);

}