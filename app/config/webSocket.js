const SocketIO = (server)=>{
    const io = require('socket.io')(server);
 
    io.on('connection', (socket)=>{
        //console.log("nuevo usuario conectado al socket: "+socket.id);

        socket.on("joinUsuario", function(data){
            socket.join(data.usuario);
        });

        socket.on("joinNivel", function(data){
            socket.join(data.nivel);
        });

        socket.on("joinCajero", function(data){
            socket.join(data.cajero);
        });

        socket.on("joinMozo", function(data){
            socket.join(data.mozo);
        });

        socket.on("joinAdministrador", function(data){
            socket.join(data.administrador);
        });

        socket.on("joinCajeroAdministrador", function(data){
            socket.join(data.cajeroAdministrador);
        });

        socket.on("joinSucursal", function(data){
            socket.join(data.sucursal);
        });

        /*socket.on("join", function(data){
            socket.join(data.empresa);
            //console.log("connected to room: "+data.empresa);
            //console.log(io.nsps["/"].adapter);
        });*/

        //************************************************************* */
        socket.on('actualizaModulo', (data)=>{
            io.sockets.emit('actualizaModulo', data);
        });

        socket.on('actualizaAcceso', (data)=>{
            io.sockets.in(data.usuario).emit('actualizaAcceso', data);
        });

        socket.on('actualizaFechaPedido', (data)=>{
            io.sockets.in(data.sucursal).emit('actualizaFechaPedido', data);
        });

        socket.on('actualizaFechaServicio', (data)=>{
            io.sockets.in(data.sucursal).emit('actualizaFechaServicio', data);
        });

        socket.on('creaPedidoCajeroAdministrador', (data)=>{
            io.sockets.in(data.cajeroAdministrador).emit('creaPedido', data);
        });

        socket.on('creaPedidoAdministrador', (data)=>{
            io.sockets.in(data.administrador).emit('creaPedido', data);
        });

        socket.on('editaPedidoAdministrador', (data)=>{
            io.sockets.in(data.administrador).emit('editaPedido', data);
        });

        socket.on('creaPedidoCajero', (data)=>{
            io.sockets.in(data.cajero).emit('creaPedido', data);
        });

        socket.on('creaPedidoMozo', (data)=>{
            io.sockets.in(data.mozo).emit('creaPedido', data);
        });

        socket.on('editaPedido', (data)=>{
            io.sockets.in(data.sucursal).emit('editaPedido', data);
        });

        socket.on('actualizaEstadoPedido', (data)=>{
            io.sockets.in(data.sucursal).emit('actualizaEstadoPedido', data);
        });

        socket.on('actualizaEstadoPedidoMozo', (data)=>{
            io.sockets.in(data.sucursal).emit('actualizaEstadoPedidoMozo', data);
        });

        socket.on('actualizaStockCarta', (data)=>{
            io.sockets.in(data.sucursal).emit('actualizaStockCarta', data);
        });

        socket.on('actualizaStockCartaAbastecer', (data)=>{
            io.sockets.in(data.sucursal).emit('actualizaStockCartaAbastecer', data);
        });

        socket.on('eliminaPedido', (data)=>{
            io.sockets.in(data.sucursal).emit('eliminaPedido', data);
        });

        socket.on('actualizaMesas', (data)=>{
            io.sockets.in(data.sucursal).emit('actualizaMesas', data);
        });

        socket.on('cerrarVenta', (data)=>{
            io.sockets.in(data.sucursal).emit('cerrarVenta', data);
        });

        socket.on('actualizaImpresion', (data)=>{
            io.sockets.in(data.sucursal).emit('actualizaImpresion', data);
        });

        socket.on('sunatPedido', (data)=>{
            io.sockets.in(data.administrador).emit('sunatPedido', data);
        });

        socket.on('sunatVenta', (data)=>{
            io.sockets.in(data.administrador).emit('sunatVenta', data);
        });

        socket.on('actualizaCaja', (data)=>{
            io.sockets.in(data.sucursal).emit('actualizaCaja', data);
        });

        socket.on('actualizaNombreSucursal', (data)=>{
            io.sockets.in(data.usuario).emit('actualizaNombreSucursal', data);
        });

        socket.on('actualizaLogoSucursal', (data)=>{
            io.sockets.in(data.sucursal).emit('actualizaLogoSucursal', data);
        });

        /*socket.on('loginUsuarioAdmin', (data)=>{
            io.sockets.in(data.nivelAdmin).emit('loginUsuarioAdmin', data);
        });

        socket.on('loginUsuarioSuper', (data)=>{
            io.sockets.in(data.nivelSuper).emit('loginUsuarioSuper', data);
        });*/

    })
}

module.exports = {
    SocketIO
};
