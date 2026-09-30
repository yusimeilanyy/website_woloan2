const express = require("express");
const cors = require("cors");

const db = require("./db");


const app = express();


app.use(cors());
app.use(express.json());



app.get("/",(req,res)=>{

    res.send("Backend Website Kelurahan Aktif");

});



app.get("/test-db",(req,res)=>{


    db.query(
        "SELECT * FROM berita",

        (err,result)=>{


            if(err){

                res.status(500).json(err);

            }else{

                res.json(result);

            }


        }

    );


});