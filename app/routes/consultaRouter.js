const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config/config');
const path = require('path');
const moment = require("moment");
const fs = require('fs');
const {isLogin} = require('../middlewares/auth');

//general.js
router.post('/consulta/pantallaInicio', isLogin, async(req, res) => {
    const sesId=req.session.passport.user.id;
    try {
        const ventas =  await axios.get(config.URL_SISTEMA+"/api/venta/filtro/"+req.body.sesId+"/ultimasVentas",{ 
            headers:{authorization: `Bearer ${req.body.token}`
            }
        });
    
        const ventas1 =  await axios.get(config.URL_SISTEMA+"/api/venta/filtro/"+req.body.sesId+"/ventaDia",{ 
            headers:{authorization: `Bearer ${req.body.token}`
            }
        });
    
        const ventas2 =  await axios.get(config.URL_SISTEMA+"/api/venta/filtro/"+req.body.sesId+"/ventaMes",{ 
            headers:{authorization: `Bearer ${req.body.token}`
            }
        });
    
        const productos =  await axios.get(config.URL_SISTEMA+"/api/venta/filtro/"+req.body.sesId+"/productoVendido",{ 
            headers:{authorization: `Bearer ${req.body.token}`
            }
        });
    
        let total=0
        for(var i=0;i<productos.data.valor.info;i++){
            total=total+productos.data.valor.info[i];
        }
    
        const ingreso1 =  await axios.get(config.URL_SISTEMA+"/api/venta/filtro/"+req.body.sesId+"/ingresoDia",{ 
            headers:{
                authorization: `Bearer ${req.body.token}`
            } 
        });
    
        const ingreso2 =  await axios.get(config.URL_SISTEMA+"/api/venta/filtro/"+req.body.sesId+"/ingresoMes",{ 
            headers:{authorization: `Bearer ${req.body.token}`
            } 
        });
    
        const egreso1 =  await axios.get(config.URL_SISTEMA+"/api/venta/filtro/"+req.body.sesId+"/egresoDia",{ 
            headers:{authorization: `Bearer ${req.body.token}` 
            }
        });
    
        const egreso2 =  await axios.get(config.URL_SISTEMA+"/api/venta/filtro/"+req.body.sesId+"/egresoMes",{ 
            headers:{authorization: `Bearer ${req.body.token}`
            }
        });
    
        const descuento1 =  await axios.get(config.URL_SISTEMA+"/api/venta/filtro/"+req.body.sesId+"/descuentoDia",{ 
            headers:{authorization: `Bearer ${req.body.token}`
            } 
        });
    
        const descuento2 =  await axios.get(config.URL_SISTEMA+"/api/venta/filtro/"+req.body.sesId+"/descuentoMes",{ 
            headers:{authorization: `Bearer ${req.body.token}`
            }
        });

        const graficaDia =  await axios.get(config.URL_SISTEMA+"/api/venta/filtro/"+req.body.sesId+"/graficaVentaDia",{ 
            headers:{authorization: `Bearer ${req.body.token}`
            }
        });

        const graficaMes =  await axios.get(config.URL_SISTEMA+"/api/venta/filtro/"+req.body.sesId+"/graficaVentaMes",{ 
            headers:{authorization: `Bearer ${req.body.token}`
            } 
        });
        res.json({
            ultimasVentas:ventas.data.valor.info,
            ventaDia:ventas1.data.valor.info[0],
            ventaMes:ventas2.data.valor.info[0],
            productoMas:productos.data.valor.info,
            totalMas:total,
            ingresoDia:ingreso1.data.valor.info[0],
            ingresoMes:ingreso2.data.valor.info[0],
            egresoDia:egreso1.data.valor.info[0],
            egresoMes:egreso2.data.valor.info[0],
            descuentoDia:descuento1.data.valor.info[0],
            descuentoMes:descuento2.data.valor.info[0],
            graficaVentaDia:graficaDia.data.valor.info,
            graficaVentaMes:graficaMes.data.valor.info
        });
    }catch (err) {
        res.status(400).json({
            error : {
                message:err.response.data.error.message,
                errno: err.response.data.error.errno,
                code :err.response.data.error.code
            }
        });
    }
});

//atencion.js
router.post('/consulta/atencion', isLogin, async(req, res) => {
    const sesId=req.session.passport.user.id;

    try {
        let idVenta=0;
        /*const boton= await axios.get(config.URL_SISTEMA+"/api/acceso/privilegio/75/"+req.body.sesId,{
			headers: 
			{ 
				authorization: `Bearer ${req.body.token}`
			} 
		});*/

		const busca =  await axios.get(config.URL_SISTEMA+"/api/pedido/atencion/0/"+req.body.sesId,{ 
			headers:{authorization: `Bearer ${req.body.token}`} 
		});

		if(busca.data.valor.info!==undefined){
			idVenta=busca.data.valor.info.ID_VENTA;
		}

		const lista1 =  await axios.get(config.URL_SISTEMA+"/api/pedidodetalle/listar/"+idVenta+"/"+req.body.sesId,{ 
			headers:{ 
				authorization: `Bearer ${req.body.token}`
			}  
		});

		const lista2 =  await axios.get(config.URL_SISTEMA+"/api/pedido/buscar/"+idVenta+"/"+req.body.sesId,{ 
			headers:{ 
				authorization: `Bearer ${req.body.token}`
			}  
		});

		const lista3 =  await axios.get(config.URL_SISTEMA+"/api/categoria/listar/0/"+req.body.sesId,{ 
			headers:{ 
				authorization: `Bearer ${req.body.token}`
			}  
		});

		const lista4 =  await axios.get(config.URL_SISTEMA+"/api/producto/detalle/listar/0/"+req.body.sesId,{ 
			headers: { 
				authorization: `Bearer ${req.body.token}`
			}  
		});
        
		const usuario = await axios.get(config.URL_SISTEMA+"/api/usuario/buscar/"+req.body.sesId+"/"+req.body.sesId,{ 
			headers: { 
				authorization: `Bearer ${req.body.token}`
			}  
		});

        res.json({
            //resp:boton.data.valor.botones,
            atencionDetalle: lista1.data.valor.info,
            cabeceraAtencion: lista2.data.valor.info,
            categoria: lista3.data.valor.info,
            producto: lista4.data.valor.info,
            impresion: usuario.data.valor.info
        });
    }catch (err) {
        res.status(400).json({
            error : {
                message:err.response.data.error.message,
                errno: err.response.data.error.errno,
                code :err.response.data.error.code
            }
        });
    }
});


router.post('/consulta/mostrarPedidoDetallePago', isLogin, async(req, res) => {
    const sesId=req.session.passport.user.id;

    try {
        const lista =  await axios.get(config.URL_SISTEMA+"/api/pedidodetalle/listar/"+req.body.id+"/"+req.body.sesId,{ 
			headers:{authorization: `Bearer ${req.body.token}`} 
		});
		const lista3 =  await axios.get(config.URL_SISTEMA+"/api/cliente/listar/0/"+req.body.sesId,{ 
			headers:{authorization: `Bearer ${req.body.token}`} 
		});
		const lista5 =  await axios.get(config.URL_SISTEMA+"/api/pedidodetalle/listar/pago/"+req.body.id+"/"+req.body.sesId,{ 
			headers:{authorization: `Bearer ${req.body.token}`} 
		});
		const lista6 =  await axios.get(config.URL_SISTEMA+"/api/pedidodetalle/buscar/pago/"+req.body.id+"/"+req.body.sesId,{ 
			headers:{authorization: `Bearer ${req.body.token}`} 
		});
		

        res.json({
            atenciondetalle: lista.data.valor.info,
            cliente: lista3.data.valor.info,
            pagos: lista5.data.valor.info,
            venta: lista6.data.valor.info
        });
    }catch (err) {
        res.status(400).json({
            error : {
                message:err.response.data.error.message,
                errno: err.response.data.error.errno,
                code :err.response.data.error.code
            }
        });
    }
});

//pedido.js
router.post('/consulta/modalLinkPedidoDetallePago', isLogin, async(req, res) => {
    const sesId=req.session.passport.user.id;

    try {
        const lista =  await axios.get(config.URL_SISTEMA+"/api/pedidodetalle/listar/"+req.body.id+"/"+req.body.sesId,{ 
			headers:{
				authorization: `Bearer ${req.body.token}`
		} 
		});
		const lista3 =  await axios.get(config.URL_SISTEMA+"/api/cliente/listar/0/"+req.body.sesId,{ 
			headers:{
				authorization: `Bearer ${req.body.token}`
		} 
		});
		const lista5 =  await axios.get(config.URL_SISTEMA+"/api/pedidodetalle/listar/pago/"+req.body.id+"/"+req.body.sesId,{ 
			headers:{
				authorization: `Bearer ${req.body.token}`
		} 
		});
		const lista6 =  await axios.get(config.URL_SISTEMA+"/api/pedidodetalle/buscar/pago/"+req.body.id+"/"+req.body.sesId,{ 
			headers:{
				authorization: `Bearer ${req.body.token}`
		} 
		});

        res.json({
            pedidoDetalle:lista.data.valor.info,
            cliente:lista3.data.valor.info,
            pagos:lista5.data.valor.info,
            venta:lista6.data.valor.info
        });
    }catch (err) {
        res.status(400).json({
            error : {
                message:err.response.data.error.message,
                errno: err.response.data.error.errno,
                code :err.response.data.error.code
            }
        });
    }
});

//abastecer.js
router.post('/consulta/modalLinkAbastecerDetallePago', isLogin, async(req, res) => {
    const sesId=req.session.passport.user.id;

    try {
        const lista =  await axios.get(config.URL_SISTEMA+"/api/abastecer/listar/"+req.body.id+"/"+req.body.sesId,{ 
			headers:{
				authorization: `Bearer ${req.body.token}`
		} 
		});
		const lista2= await axios.get(config.URL_SISTEMA+"/api/proveedor/listar/0/"+req.body.sesId,{
            headers: 
            { 
                authorization: `Bearer ${req.body.token}`
            } 
        });
		const lista5 =  await axios.get(config.URL_SISTEMA+"/api/abastecer/detalle/listar/pago/"+req.body.id+"/"+req.body.sesId,{ 
			headers:{
				authorization: `Bearer ${req.body.token}`
		} 
		});
		const lista6 =  await axios.get(config.URL_SISTEMA+"/api/abastecer/detalle/buscar/pago/"+req.body.id+"/"+req.body.sesId,{ 
			headers:{
				authorization: `Bearer ${req.body.token}`
		} 
		});

        res.json({
            abastecerDetalle:lista.data.valor.info,
            pagos:lista5.data.valor.info,
            compra:lista6.data.valor.info,
            proveedor:lista2.data.valor.info
        })
    }catch (err) {
        res.status(400).json({
            error : {
                message:err.response.data.error.message,
                errno: err.response.data.error.errno,
                code :err.response.data.error.code
            }
        });
    }
});


//venta.js
router.post('/consulta/modalLinkCorrigeDocumento', isLogin, async(req, res) => {
    const sesId=req.session.passport.user.id;

    try {
        const lista2 =  await axios.get(config.URL_SISTEMA+"/api/serie/listar/0/"+req.body.sesId,{ 
			headers:{
				authorization: `Bearer ${req.body.token}`
			} 
		});
	
		const buscar= await axios.get(config.URL_SISTEMA+"/api/pedido/buscar/"+req.body.id+"/"+req.body.sesId,{ 
			headers:{
				authorization: `Bearer ${req.body.token}`
			} 
		});
	
		const lista= await axios.get(config.URL_SISTEMA+"/api/cliente/listar/0/"+req.body.sesId,{ 
			headers:{
				authorization: `Bearer ${req.body.token}`
			} 
		});

        res.json({
            tipoDocumento: lista2.data.valor.info,
		    cliente: lista.data.valor.info,
		    pedido:buscar.data.valor.info
        })
    }catch (err) {
        res.status(400).json({
            error : {
                message:err.response.data.error.message,
                errno: err.response.data.error.errno,
                code :err.response.data.error.code
            }
        });
    }
});


router.post('/consulta/modalLinkVentaDetalle', isLogin, async(req, res) => {
    const sesId=req.session.passport.user.id;

    try {
        const lista =  await axios.get(config.URL_SISTEMA+"/api/venta/detalle/listar/"+req.body.id+"/"+req.body.sesId,{ 
			headers:{
				authorization: `Bearer ${req.body.token}`
			} 
		});
	
		const lista5 =  await axios.get(config.URL_SISTEMA+"/api/pedidodetalle/listar/pago/"+req.body.id+"/"+req.body.sesId,{ 
			headers:{
				authorization: `Bearer ${req.body.token}`
			} 
		});
		const lista6 =  await axios.get(config.URL_SISTEMA+"/api/pedidodetalle/buscar/pago/"+req.body.id+"/"+req.body.sesId,{ 
			headers:{
				authorization: `Bearer ${req.body.token}`
			} 
		});

        res.json({
            pedidoDetalle:lista.data.valor.info,
		    pagos:lista5.data.valor.info,
		    venta:lista6.data.valor.info
        })
    }catch (err) {
        res.status(400).json({
            error : {
                message:err.response.data.error.message,
                errno: err.response.data.error.errno,
                code :err.response.data.error.code
            }
        });
    }
});

module.exports = router;