const express = require('express');

let { verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

//=============================
//Obtener todos los productos
//=============================
app.get('/productos',verificaToken, (req,res)=>{

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Producto.find({disponible: true})
      .sort('nombre')
      .skip(desde)
      .limit(limite)
      .populate('usuario', 'nombre email')
      .populate('categoria', 'descripcion')
      .exec((err,productos)=>{
          if (err) {
              return res.status(500).json({
              ok: false,
              err
              });
          }

        res.json({
            ok: true,
            productos
        })
  })

});

//=============================
//Mostrar producto por id
//=============================
app.get('/productos/:id', verificaToken,(req,res)=>{
  // Categoria.findById();

  let id = req.params.id;

  Producto.findById(id) 
  .populate('usuario', 'nombre email')
  .populate('categoria', 'descripcion')
  .exec((err, productoDB) => {
      if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }

        if (!productoDB) {
          return res.status(500).json({
            ok: false,
            err: {
                message: 'Id no encontrado'
            }
          });
        }

        res.json({
          ok: true,
          producto: productoDB
      })
  })

});

//=============================
//Buscar productos
//=============================
app.get('/productos/buscar/:termino',verificaToken, (req,res)=>{

  let termino = req.params.termino;

  let regx = new RegExp(termino, 'i');

  Producto.find({nombre: regx}) 
  .populate('categoria', 'nombre')
  .exec((err, productos) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    
    res.json({
      ok: true,
      productos
  })

  })
})

//=============================
//Crear productos
//=============================
app.post('/productos',verificaToken, (req,res)=>{
    // regresa la nueva categoria
    //req.usuario._id

    let body= req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err,productoDB)=>{
        
        if (err) {
            return res.status(500).json({
              ok: false,
              err
            });
          }


          res.status(201).json({
            ok: true,
            producto: productoDB
          });
    });

});

//=============================
//Actualizar productos
//=============================
app.put("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Producto.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!productoDB) {
        return res.status(500).json({
          ok: false,
          err: {
            message: "Id no existe"
          }
        });
      }

      productoDB.nombre = body.nombre;
      productoDB.precioUni = body.precioUni;
      productoDB.descripcion = body.descripcion;
      productoDB.disponible = body.disponible;
      productoDB.categoria = body.categoria;
      productoDB.usuario = req.usuario._id;

      productoDB.save((err, productoGuardado) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }

        res.json({
          ok: true,
          producto: productoGuardado
        });
      });
    }
  );
});

//=============================
//Elimina productos
//=============================
app.delete('/productos/:id', [verificaToken, verificaAdmin_Role],function (req, res) {
    
  let id = req.params.id;

  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{

    let noDisponible = {
      disponible: false
    }

    Producto.findByIdAndUpdate(id, noDisponible,{new : true},(err, productoEliminado)=>{


    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    };

    if (!productoEliminado) {
      return res.status(400).json({
        ok: false,
        err: {
          message : 'Producto no encontrado'
        }
      });
    };


    res.json({
      ok: true,
      producto: productoEliminado,
      message: 'Producto Borrado'
    });

  });
});

module.exports = app;
