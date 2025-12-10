const bcrypt = require('bcrypt');
const moment = require('moment');


const encryptPassword = (password)=>{
    const salt = 10;
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

const matchPassword = (password, savePassword)=>{
    const pass = bcrypt.compareSync(password,savePassword);
    return pass;
}

const randomPassword = (largo)=>{
    const salt = 10;
    const hash = bcrypt.hashSync('moment().format()', salt);
    return hash.substr(hash.length - largo);
}


 

module.exports = {
    randomPassword,
    encryptPassword,
    matchPassword
}