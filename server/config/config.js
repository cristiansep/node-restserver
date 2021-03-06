

//=====================================
//           Puerto
//=====================================
process.env.PORT = process.env.PORT || 3000;


//=====================================
//           Entorno
//=====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



//=====================================
//           Vencimiento token
//=====================================
process.env.CADUCIDAD_TOKEN = '48h';



//=====================================
//           SEED de autenticacion
//=====================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';



//=====================================
//           Base de datos
//=====================================

let urlDB;

if(process.env.NODE_ENV === 'dev'){

    urlDB ='mongodb://localhost:27017/cafe'
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//=====================================
//           Google Client ID
//=====================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '582561889772-vj1hh8m2t945tjknc3uoup6epsqio77t.apps.googleusercontent.com';


