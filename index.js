const express = require('express');
const connectionDB= require('./connection');
const userRoute= require('./routes/userRoute');
var cors = require('cors');
const app = express();
connectionDB();
app.use(express.urlencoded({extended:false}))

app.use(cors());
app.options('*', cors());
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(userRoute,function(req,res,next){
    next()
});

app.all('*',(req,res)=>{
    res.send("404 not found")
})

app.listen(process.env.PORT || 5000,(req,res)=>{
   console.log("server chay o port 5000")
})