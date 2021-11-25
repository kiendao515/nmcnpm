const express = require('express');
const connectionDB= require('./connection');
const userRoute= require('./routes/userRoute');
const categoryRoute= require('./routes/categoryRoute')
const locationRoute= require('./routes/locationRoute')
const stationRoute= require('./routes/stationRoute')
var cors = require('cors');
const app = express();
connectionDB();
app.use(express.json());
app.use(express.urlencoded({extended:false}))

const corsOpts = {
    origin: '*',
    methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE'
    ],

    allowedHeaders: [
        'Content-Type',
        'Authorization'
    ],
};

app.use(cors(corsOpts));
app.use(userRoute,function(req,res,next){
    next()
});

app.use(categoryRoute,function (req,res,next) {
    next()
})

app.use(locationRoute,function(req,res,next){
    next();
})

app.use(stationRoute,function(req,res,next){
    next();
})
app.all('*',(req,res)=>{
    res.send("404 not found")
})

app.listen(process.env.PORT || 5000,(req,res)=>{
   console.log("server chay o port 5000")
})