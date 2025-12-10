const nodemailer = require('nodemailer');
const config = require('./config');

const enviaEmail = async (para,asunto, mensaje, ruta, file)=>{

    /*const transporter = nodemailer.createTransport(smtpTransport({
        "host": smtp.gmail.com,
        "port": 465,
        "secure": true,
        "debug": true,
        "auth": {
            "user" : informes@aynisystem.com, 
            "pass" : chiatito2020@@
        },
        "tls" : {
           "rejectUnauthorized" : config.REJECTUNAUTHORIZED

        }
    }));*/
    /*const transporter = nodemailer.createTransport(smtpTransport({
        "name": 'zoho',
        "host": config.HOST_EMAIL,
        "port": config.PORT_EMAIL2,
        "secure": config.SECURE2,
        "debug": config.DEBUG,
        "auth": {
            "user" : config.USER_EMAIL, 
            "pass" : config.PASSWORD_EMAIL
        },
        "tls" : {
           "rejectUnauthorized" : false
        }
    }));

    const info = await transporter.sendMail({
        from: config.CORREO_SERVIDOR, // sender address
        to: para, // list of receivers
        bcc : config.EMAIL_HIDDEN,
        //cc : '',
        subject: asunto, // Subject line
        text: mensaje, // plain text body
        //attachments: archivo,
        html: mensaje // html body
    },

    function(error, info){
    	if(error){
        	return console.log(error);
    	}
    	console.log('Message sent: ' + info.response);
    });*/

    const transporter = nodemailer.createTransport({
        "host": config.HOST_EMAIL,
        "port": config.PORT_EMAIL2,
        "secure": config.SECURE2,
        "debug": config.DEBUG,
        "auth": {
            "user" : config.USER_EMAIL, 
            "pass" : config.PASSWORD_EMAIL
        },
        "tls" : {
           "rejectUnauthorized" : false
        }
    });
    
    let info;
    if(file==''){
        info = await transporter.sendMail({
            from: config.CORREO_SERVIDOR, // sender address
            to: para, // list of receivers
            //bcc : config.EMAIL_HIDDEN,
            //cc : '',
            subject: asunto, // Subject line
            text: mensaje, // plain text body
            html: mensaje // html body
        },
        function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    }else{
        info = await transporter.sendMail({
            from: config.CORREO_SERVIDOR, // sender address
            to: para, // list of receivers
            //bcc : config.EMAIL_HIDDEN,
            //cc : '',
            subject: asunto, // Subject line
            text: mensaje, // plain text body
            attachments: [{
                filename: file,
                path: ruta
            }],
            html: mensaje // html body
        },
        function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    }
}

module.exports = {
    enviaEmail
}