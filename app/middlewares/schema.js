const joi = require('@hapi/joi');
//correo
//comentario
//textoNumero
//documento
//formatoCorreo
//user
//pass
//notaDebito

const schemaLogin=joi.object({
    txtCorreo: joi.string().email().min(6).max(50).required(),
    txtContrasena: joi.string().regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!¡#$%&()*+\-\./:;=¿?@\[\]\{\|\}]).{6,16}$/).min(6).max(16).required(),
    idUser:joi.number().allow(''),
    idNivel:joi.number().allow(''),
});

const schemaRecupera=joi.object({
    correo: joi.string().email().min(1).max(50).required()
});

const schemaRegister=joi.object({
    txtCorreo: joi.string().email().min(6).max(50).required(),
    txtNombre: joi.string().min(1).max(100).required(),
    txtPaterno: joi.string().min(1).max(100).required()
});

const schemaOlvidaPassword=joi.object({
    txtCorreo: joi.string().email().min(6).max(50).required()
});

const schemaParametro=joi.object({
    id:joi.number().allow(''),
    descripcion: joi.string().min(1).max(100).required(),
    abreviatura: joi.string().min(1).max(10).allow(''),
    sesId:joi.number().required()
});

const schemaParametroDetalle=joi.object({
    id:joi.number().required(),
    descripcionDetalle: joi.string().min(1).max(200).required(),
    abreviaturaDetalle:joi.string().min(4).max(4).required(),
    valorDetalle: joi.string().min(1).max(500).required(),
    sesId:joi.number().required()
});

const schemaMenu=joi.object({
    id:joi.number().allow(''),
    nombre: joi.string().min(1).max(50).required(),
    orden: joi.string().min(1).max(5).required(),
    descripcion: joi.string().min(0).max(100).allow(''),
    sesId:joi.number().required()
});

const schemaSubmenu=joi.object({
    id:joi.number().allow(''),
    nombre: joi.string().min(1).max(100).required(),
    ruta: joi.string().min(1).max(100).required(),
    orden: joi.string().min(1).max(5).required(),
    descripcion: joi.string().min(0).max(200).allow(''),
    sesId:joi.number().required()
});


const schemaOpcion=joi.object({
    id:joi.number().allow(''),
    nombre: joi.string().min(1).max(50).required(),
    orden: joi.string().min(1).max(5).required(),
    descripcion: joi.string().min(0).max(100).allow(''),
    sesId:joi.number().required()
});

const schemaNivel=joi.object({
    id:joi.number().allow(''),
    nombre: joi.string().min(1).max(50).required(),
    descripcion: joi.string().min(0).max(100).allow(''),
    sesId:joi.number().required()
});

const schemaUsuario=joi.object({
    id:joi.number().allow(''),
    apellidoPaterno: joi.string().min(1).max(50).required(),
    apellidoMaterno: joi.string().min(1).max(50).required(),
    nombre: joi.string().min(1).max(100).required(),
    tipoDocumento: joi.string().min(1).max(15).required(),
    documento: joi.string().min(1).max(15).required(),
    fijo: joi.string().min(0).max(8).allow(''),
    celular: joi.string().min(0).max(9).allow(''),
    email: joi.string().email().min(1).max(50).required(),
    fechaNacimiento: joi.string().min(10).max(10).allow(''),
    nivel: joi.number().required(),
    imagen: joi.string().min(0).max(100).allow(''),
    sesId:joi.number().required()
});

const schemaCategoria=joi.object({
    id:joi.number().allow(''),
    nombre: joi.string().min(1).max(210).required(),
    tipo: joi.string().min(1).max(1).required(),
    color: joi.string().min(1).max(10).required(),
    descripcion: joi.string().min(0).max(250).allow(''),
    sesId:joi.number().required()
});

const schemaProducto=joi.object({
    id:joi.number().allow(''),
    nombre:joi.string().min(1).max(100).required(),
    descripcion: joi.string().min(0).max(200).allow(''),
    categoria: joi.number().required(),
    sesId:joi.number().required()
});

const schemaServicio=joi.object({
    id:joi.number().allow(''),
    nombre:joi.string().min(1).max(100).required(),
    descripcion: joi.string().min(0).max(200).allow(''),
    categoria: joi.number().required(),
    sesId:joi.number().required()
});

const schemaCaja=joi.object({
    id:joi.number().allow(''),
    billete200:joi.number().allow(''),
    billete100:joi.number().allow(''),
    billete50:joi.number().allow(''),
    billete20:joi.number().allow(''),
    billete10:joi.number().allow(''),
    moneda5:joi.number().allow(''),
    moneda2:joi.number().allow(''),
    moneda1:joi.number().allow(''),
    moneda05:joi.number().allow(''),
    moneda02:joi.number().allow(''),
    moneda01:joi.number().allow(''),
    sesId:joi.number().required()
});

const schemaSucursal=joi.object({
    id:joi.number().allow(''),
    idEmpresa:joi.number().required(),
    nombre: joi.string().min(1).max(200).required(),
    direccion: joi.string().min(0).max(200).allow(''),
    fijo: joi.string().min(0).max(7).allow(''),
    celular: joi.string().min(0).max(9).allow(''),
    ruc: joi.string().min(1).max(11).required(),
    imagen: joi.string().min(0).max(100).allow(''),
    documentos:joi.number().allow(''),
    sesId:joi.number().required()
});

const schemaEmpresa=joi.object({
    id:joi.number().allow(''),
    nombre: joi.string().min(1).max(200).required(),
    razon: joi.string().min(1).max(200).required(),
    direccion: joi.string().min(0).max(200).allow(''),
    fijo: joi.string().min(0).max(7).allow(''),
    celular: joi.string().min(0).max(9).allow(''),
    ruc: joi.string().min(1).max(11).required(),
    imagen: joi.string().min(0).max(100).allow(''),
    documentos:joi.number().allow(''),
    sesId:joi.number().required()
});

const schemaCliente=joi.object({
    id:joi.number().allow(''),
    apellidoPaterno:joi.string().min(1).max(50).required(),
    apellidoMaterno:joi.string().min(1).max(50).required(),
    nombre:joi.string().min(1).max(100).required(),
    documento:joi.string().min(1).max(15).required(),
    tipoDocumento: joi.number().required(),
    direccion: joi.string().min(0).max(200).allow(''),
    fechaNacimiento: joi.string().min(0).max(10).allow(''),
    celular: joi.string().min(0).max(9).allow(''),
    email: joi.string().min(0).max(100).allow(''),
    comentario: joi.string().min(0).max(255).allow(''),
    imagen: joi.string().min(0).max(100).allow(''),
    sesId:joi.number().required()
});

const schemaEmpleado=joi.object({
    id:joi.number().allow(''),
    apellidoPaterno:joi.string().min(1).max(50).required(),
    apellidoMaterno:joi.string().min(1).max(50).required(),
    nombre:joi.string().min(1).max(100).required(),
    documento:joi.string().min(1).max(15).required(),
    tipoDocumento: joi.number().required(),
    tipoEmpleado: joi.number().required(),
    direccion: joi.string().min(1).max(200).allow(''),
    fechaNacimiento: joi.string().min(10).max(10).allow(''),
    fechaIngreso: joi.string().min(10).max(10).required(),
    celular: joi.string().min(1).max(9).required(),
    email: joi.string().min(1).max(100).required(),
    color: joi.string().min(0).max(10).required(),
    imagen: joi.string().min(0).max(100).allow(''),
    sesId:joi.number().required()
});

const schemaReserva=joi.object({
    id:joi.number().allow(''),
    cliente: joi.number().required(),
    empleado: joi.number().required(),
    fechaReserva: joi.string().min(10).max(10).required(),
    horaReserva: joi.string().min(5).max(5).required(),
    comentario: joi.string().min(0).max(250).allow(''),
    sesId:joi.number().required()
});


const schemaTipoempleado=joi.object({
    id:joi.number().allow(''),
    nombre: joi.string().min(1).max(210).required(),
    descripcion: joi.string().min(0).max(250).allow(''),
    sesId:joi.number().required()
});

const schemaZona=joi.object({
    id:joi.number().allow(''),
    nombre: joi.string().min(1).max(50).required(),
    mesas: joi.string().min(1).max(50).required(),
    descripcion: joi.string().min(0).max(200).allow(''),
    sesId:joi.number().required()
});

const schemaMesa=joi.object({
    id:joi.number().allow(''),
    nombre: joi.string().min(1).max(50).required(),
    descripcion: joi.string().min(0).max(200).allow(''),
    zona:joi.number().required(),
    sesId:joi.number().required()
});

const schemaPedido=joi.object({
    id:joi.number().allow(''),
    idMesa:joi.number().required(),
    idZona:joi.number().required(),
    idCliente:joi.number().required(),
    idMozo:joi.number().required(),
    esDelivery:joi.number().required(),
    estadoVenta:joi.number().required(),
    sesId:joi.number().required()
});


const schemaPedidodetalle=joi.object({
    id:joi.number().allow(''),
    idVenta:joi.number().allow(''),
    idProductoSucursal:joi.number().required(),
    cantidad:joi.number().allow(''),
    comentario:joi.string().min(0).max(500).allow(''),
    monto:joi.number().required(),
    sesId:joi.number().required()
});

const schemaPedidoPagar=joi.object({
    id:joi.number().allow(''),
    idVenta:joi.number().required(),
    tipoPago:joi.number().required(),
    montoRecibido:joi.string().min(1).max(22).required(),
    sesId:joi.number().required()
});

const schemaProductosucursal=joi.object({
    id:joi.number().allow(''),
    producto: joi.number().required(),
    proveedor: joi.number().required(),
    stock: joi.number().required(),
    precioCompra:joi.string().min(1).max(10).required(),
    precioVenta:joi.string().min(1).max(10).required(),
    sesId:joi.number().required()
});

const schemaServiciosucursal=joi.object({
    id:joi.number().allow(''),
    servicio: joi.number().required(),
    precio:joi.string().min(1).max(10).required(),
    sesId:joi.number().required()
});

const schemaComprobante=joi.object({
    id:joi.number().allow(''),
    tipoDocumento: joi.number().required(),
    tipoVenta: joi.number().required(),
    serie: joi.string().min(0).max(10).required(),
    inicio:joi.string().min(0).max(10).required(),
    sesId:joi.number().required()
});

const schemaIngresosegresos=joi.object({
    id:joi.number().allow(''),
    movimiento: joi.number().required(),
    concepto: joi.number().required(),
    empleado: joi.number().allow(''),
    descripcion:joi.string().min(0).max(1000).allow(''),
    fecha: joi.string().min(10).max(10).required(),
    monto:joi.string().min(1).max(10).required(),
    sesId:joi.number().required()
});

const schemaConcepto=joi.object({
    id:joi.number().allow(''),
    nombre: joi.string().min(1).max(100).required(),
    tipo: joi.number().required(),
    descripcion: joi.string().min(0).max(250).allow(''),
    sesId:joi.number().required()
});

const schemaIngresosegresos_caja=joi.object({
    id:joi.number().allow(''),
    padreId:joi.number().allow(''),
    movimiento: joi.number().required(),
    usuario: joi.number().allow(''),
    descripcion:joi.string().min(1).max(1000).required(),
    moneda: joi.number().required(),
    monto:joi.string().min(1).max(10).required(),
    sesId:joi.number().required()
});

const schemaMovimiento=joi.object({
    id:joi.number().allow(''),
    movimiento: joi.number().required(),
    autocompletaProd: joi.string().allow(''),
    producto: joi.number().required(),
    idProductoDetalle: joi.number().required(),
    fecha: joi.string().min(10).max(10).required(),
    motivo:joi.string().min(1).max(1000).required(),
    cantidad:joi.string().min(1).max(10).required(),
    sesId:joi.number().required()
});

const schemaProveedor=joi.object({
    id:joi.number().allow(''),
    razon: joi.string().min(1).max(200).required(),
    nombre: joi.string().min(1).max(200).required(),
    direccion: joi.string().min(0).max(250).allow(''),
    fijo: joi.string().min(0).max(7).allow(''),
    celular: joi.string().min(0).max(9).allow(''),
    ruc: joi.string().min(1).max(11).required(),
    email: joi.string().email().min(0).max(100).allow(''),
    sesId:joi.number().required()
});

const schemaAbastecer=joi.object({
    id:joi.number().allow(''),
    sesId:joi.number().required()
});

const schemaAbastecerDetalle=joi.object({
    id:joi.number().allow(''),
    cantidad:joi.string().min(1).max(10).required(),
    comentario:joi.string().min(0).max(500).allow(''),
    precioCosto:joi.string().min(1).max(10).required(),
    precioVenta:joi.string().min(1).max(10).required(),
    sesId:joi.number().required()
});

const schemaAbastecerPagar=joi.object({
    id:joi.number().allow(''),
    idCompra:joi.number().required(),
    tipoDocumento:joi.number().required(),
    sesId:joi.number().required()
});

const schemaAtencion=joi.object({
    id:joi.number().allow(''),
    cliente:joi.number().required(),
    tipoPago:joi.number().required(),
    comprobante:joi.number().required(),
    serie:joi.string().min(0).max(10).allow(''),
    numero:joi.string().min(0).max(10).allow(''),
    comentario: joi.string().min(0).max(255).allow(''),
    sesId:joi.number().required()
});

const schemaVenta=joi.object({
    id:joi.number().allow(''),
    cliente:joi.number().required(),
    tipoPago:joi.number().required(),
    comprobante:joi.number().required(),
    comentario: joi.string().min(0).max(255).allow(''),
    descuento:joi.number().required(),
    pagacon:joi.number().allow(''),
    sesId:joi.number().required()
});


const schemaVentaDetalle=joi.object({
    id:joi.number().allow(''),
    cantidad:joi.number().required(),
    comentario:joi.string().min(0).max(500).allow(''),
    descuento:joi.number().required(),
    sesId:joi.number().required()
});

const schemaAtencionDetalle=joi.object({
    id:joi.number().allow(''),
    cantidad:joi.number().required(),
    comentario:joi.string().min(0).max(500).allow(''),
    precioAtencion:joi.number().required(),
    sesId:joi.number().required()
});

const schemaVentaPagar=joi.object({
    id:joi.number().allow(''),
    idVenta:joi.number().required(),
    tipoPago:joi.number().required(),
    montoRecibido:joi.string().min(1).max(22).required(),
    sesId:joi.number().required()
});

const schemaCompra=joi.object({
    id:joi.number().allow(''),
    tipoPago:joi.number().required(),
    comprobante:joi.number().required(),
    serie:joi.string().min(0).max(10).allow(''),
    numero:joi.string().min(0).max(10).allow(''),
    comentario: joi.string().min(0).max(255).allow(''),
    sesId:joi.number().required()
});


const schemaCompraDetalle=joi.object({
    id:joi.number().allow(''),
    cantidad:joi.number().required(),
    comentario:joi.string().min(0).max(500).allow(''),
    precioCompra:joi.number().required(),
    precioVenta:joi.number().required(),
    sesId:joi.number().required()
});

const schemaPagos=joi.object({
    id:joi.number().allow(''),
    medioPago:joi.number().required(),
    estado: joi.number().required(),
    imagen: joi.string().min(0).max(100).allow(''),
    observacion:joi.string().min(1).max(255).allow(''),
    sesId:joi.number().required()
});

const schemaMembresia=joi.object({
    id:joi.number().allow(''),
    empresa:joi.number().required(),
    tipoMoneda:joi.number().required(),
    monto: joi.number().required(),
    fechaInicio:joi.string().min(10).max(10).required(),
    sesId:joi.number().required()
});

/*const schemaMensajeria=joi.object({
    id:joi.number().allow(''),
    asunto:joi.string().min(1).max(100).required(),
    descripcion: joi.string().min(1).max(255).allow(''),
    imagen: joi.string().min(0).max(100).allow(''),
    sesId:joi.number().required()
});*/

const schemaMensajeria=joi.object({
    id:joi.number().allow(''),
    asunto:joi.string().min(1).max(100).required(),
    descripcion: joi.string().min(1).max(255).allow(''),
    sesId:joi.number().required()
});

module.exports = {
    schemaRegister,
    schemaRecupera,
    schemaOlvidaPassword,
    schemaParametro,
    schemaParametroDetalle,
    schemaLogin,
    schemaMenu,
    schemaSubmenu,
    schemaOpcion,
    schemaNivel,
    schemaUsuario,
    schemaCategoria,
    schemaProducto,
    schemaServicio,
    schemaSucursal,
    schemaEmpresa,
    schemaCliente,
    schemaEmpleado,
    schemaTipoempleado,
    schemaZona,
    schemaMesa,
    schemaPedido,
    schemaAbastecerDetalle,
    schemaPedidoPagar,
    schemaPedidodetalle,
    schemaProductosucursal,
    schemaServiciosucursal,
    schemaComprobante,
    schemaIngresosegresos,
    schemaConcepto,
    schemaIngresosegresos_caja,
    schemaMovimiento,
    schemaCaja,
    schemaProveedor,
    schemaAbastecer,
    schemaAbastecerPagar,
    schemaAtencion,
    schemaAtencionDetalle,
    schemaVenta,
    schemaVentaDetalle,
    schemaCompra,
    schemaCompraDetalle,
    schemaVentaPagar,
    schemaReserva,
    schemaMensajeria,
    schemaPagos,
    schemaMembresia
}