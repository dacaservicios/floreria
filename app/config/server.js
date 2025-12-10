const config = require('./config');
const debug = require('debug')('app');
const express = require('express');
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const moment = require("moment");
const fileUpload = require('express-fileupload');
const {cronNode} = require('./cron');
const {SocketIO} = require('./webSocket');

//initialization
const app = express();
require('../middlewares/passport');

//globals
app.use((req,res, next)=>{
    app.locals.users = req.user;
    next();
})
app.use((req, res, next)=>{
    res.locals.moment = moment;
    next();
});

//public
app.use('/assets',express.static(path.join(__dirname, '../public/assets')));
app.use('/imagenes',express.static(path.join(__dirname, '../public/imagenes')));
app.use('/fuentes',express.static(path.join(__dirname, '../public/fuentes')));
app.use('/java',express.static(path.join(__dirname, '../public/java')));
app.use('/estilos',express.static(path.join(__dirname, '../public/estilos')));
app.use('/librerias',express.static(path.join(__dirname, '../public/librerias')));
app.use('/pdf',express.static(path.join(__dirname, '../public/pdf')));

//setting

app.set('port',config.PORT);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'../views/'));

if(config.NODE_ENV==='development'){
    app.use(morgan('tiny')) ;
    debug('inicio morgan');
}

//middleware

app.use(express.urlencoded({
    limit: '200mb',
    extended: true,
    parameterLimit:200000
}));
app.use(express.json({ 
    limit: '200mb',
})); 
app.use(session({
    secret : config.SECRETO,
    resave : true,
    saveUninitialized : true,
    store : new mysqlStore({
        "host"     : config.HOST_BD,
        "user"     : config.USER_BD,
        "password" : config.PASSWORD,
        "database" : config.DATABASE
    })
}));            
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload())

//start server
const server = app.listen(config.PORT, ()=>{
    console.log(`Servidor Activo en http://${config.HOST}:${config.PORT}`);
    console.log(`Se ha iniciado ${config.URL_SISTEMA} como ${config.NODE_ENV}`)
});

SocketIO(server);
cronNode();

module.exports = {
    app:app
}
