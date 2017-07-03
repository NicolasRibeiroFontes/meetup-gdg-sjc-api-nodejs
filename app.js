var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

app.set('chave','gdg-nodejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var usuario = {
    nome:'gdg-sjc',
    senha:'1234'
};

var apiRoutes = express.Router();

apiRoutes.use(function(req,res,next){
   var token = req.headers['access-token'];
   if (!token){
       return res.status(404).send({status:false,resposta:'Usuário não autenticado'});
   }else{
       jwt.verify(token,app.get('chave'), function(err,chave){
           if (err){
               return res.status(404).send({status:false,resposta:'Falha na autenticação'});
           }else{
               req.chave = chave;
               next();
           }
       })
   }
});

app.get('/', function(req,res){
   res.send('Hello World');
});

apiRoutes.get('/user', function(req,res){
    res.send(usuario);
});

app.post('/user', function(req,res){
    usuario.nome = req.body.nome;
    usuario.senha = req.body.senha;
    res.send(true);
});

app.get('/autenticar', function(req,res){
    var token = jwt.sign(usuario,app.get('chave'),{
        expiresIn:1440
    });
    res.send({status:true,token:token});
});

app.use('/api',apiRoutes);
app.listen(3000);
console.log('App rodando!');