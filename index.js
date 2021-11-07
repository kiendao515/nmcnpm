const express = require('express');
const connectionDB= require('./connection');
const userRoute= require('./routes/userRoute');
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
    ],

    allowedHeaders: [
        'Content-Type',
    ],
};

app.use(cors(corsOpts));
app.use(userRoute,function(req,res,next){
    next()
});

app.all('*',(req,res)=>{
    res.send("404 not found")
})

app.listen(process.env.PORT || 5000,(req,res)=>{
   console.log("server chay o port 5000")
})