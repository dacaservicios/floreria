const {app} = require('./config/server');


const inicio = require('./routes/inicioRouter');
const autocompleta = require('./routes/autocompletaRouter');
const reporte = require('./routes/reporteRouter');
const atencion = require('./routes/atencionRouter');

//GENERAL
const sockets = require('./routes/socketRouter');
const consulta= require('./routes/consultaRouter');


app.use('/',inicio);
app.use('/',autocompleta);
app.use('/',reporte);
app.use('/',atencion);

//GENERAL
app.use('/',sockets);
app.use('/',consulta);

/******************APIS**************************/
const inicioApi = require('./apis/inicioApi');
const parametroApi= require('./apis/parametroApi');
const menuApi= require('./apis/menuApi');
const submenuApi= require('./apis/submenuApi');
const opcionApi= require('./apis/opcionApi');
const nivelApi= require('./apis/nivelApi');
const accesoApi= require('./apis/accesoApi');
const moduloApi= require('./apis/moduloApi');
const usuarioApi= require('./apis/usuarioApi');
const ingresosegresosApi= require('./apis/ingresosegresosApi');
const conceptoApi= require('./apis/conceptoApi');
const categoriaApi= require('./apis/categoriaApi');
const sucursalApi= require('./apis/sucursalApi');
const empresaApi= require('./apis/empresaApi');
const productoApi= require('./apis/productoApi');
const servicioApi= require('./apis/servicioApi');
const proveedorApi= require('./apis/proveedorApi');
const clienteApi= require('./apis/clienteApi');
const mensajeriaApi= require('./apis/mensajeriaApi');
const empleadoApi= require('./apis/empleadoApi');
const tipoempleadoApi= require('./apis/tipoempleadoApi');
const reservaApi= require('./apis/reservaApi');
const zonaApi= require('./apis/zonaApi');
const mesaApi= require('./apis/mesaApi');
const pedidoApi= require('./apis/pedidoApi');
const pedidodetalleApi= require('./apis/pedidodetalleApi');
const productosucursalApi= require('./apis/productosucursalApi');
const serviciosucursalApi= require('./apis/serviciosucursalApi');
const comprobanteApi= require('./apis/comprobanteApi');
const atencionApi= require('./apis/atencionApi');
const ventaApi= require('./apis/ventaApi');
const compraApi= require('./apis/compraApi');
const iniciastockApi= require('./apis/iniciastockApi');
const facturacionApi= require('./apis/facturacionApi');
const movimientoApi= require('./apis/movimientoApi');
const kardexApi= require('./apis/kardexApi');
const cajaApi= require('./apis/cajaApi');
const reporteApi= require('./apis/reporteApi');
const membresiaApi= require('./apis/membresiaApi');
const pagosApi= require('./apis/pagosApi');
const generalApi= require('./apis/generalApi');

//--------------------------------------------------
app.use('/',inicioApi);
app.use('/',parametroApi);
app.use('/',menuApi);
app.use('/',submenuApi);
app.use('/',opcionApi);
app.use('/',nivelApi);
app.use('/',accesoApi);
app.use('/',moduloApi);
app.use('/',usuarioApi);
app.use('/',ingresosegresosApi);
app.use('/',conceptoApi);
app.use('/',productoApi);
app.use('/',servicioApi);
app.use('/',sucursalApi);
app.use('/',empresaApi);
app.use('/',categoriaApi);
app.use('/',clienteApi);
app.use('/',mensajeriaApi);
app.use('/',empleadoApi);
app.use('/',tipoempleadoApi);
app.use('/',reservaApi);
app.use('/',proveedorApi);
app.use('/',zonaApi);
app.use('/',mesaApi);
app.use('/',pedidoApi);
app.use('/',pedidodetalleApi);
app.use('/',productosucursalApi);
app.use('/',serviciosucursalApi);
app.use('/',comprobanteApi);
app.use('/',ventaApi);
app.use('/',compraApi);
app.use('/',atencionApi);
app.use('/',iniciastockApi);
app.use('/',facturacionApi);
app.use('/',movimientoApi);
app.use('/',kardexApi);
app.use('/',cajaApi);
app.use('/',reporteApi);
app.use('/',membresiaApi);
app.use('/',pagosApi);
app.use('/',generalApi);
