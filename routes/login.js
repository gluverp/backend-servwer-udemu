var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();
var Usuario = require('../models/usuario');
var SEED = require('../config/config').SEED;

app.post('/', (req,res)=>{

 console.log(SEED);
 
    var body = req.body;


    Usuario.findOne({ email: body.email}, (err,UsuarioDB)=>{


        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if(!UsuarioDB){

            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });


        }

        if( !bcrypt.compareSync ( body.password, UsuarioDB.password )){

            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        //Crear un token!!
        UsuarioDB.password = ':)';
        var token = jwt.sign({ usuario: UsuarioDB }, SEED, {expiresIn: 14400} ); //4 horas
        
        

        res.status(200).json({
            ok: true,
            usuario: UsuarioDB,
            token:token,
            id: UsuarioDB.id
        });

    });

    // res.status(200).json({
    //     ok: true,
    //     message: 'Login post correcto',
    //     body: body 
    // });

})



module.exports = app;