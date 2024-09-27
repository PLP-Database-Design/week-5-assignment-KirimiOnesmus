const express=require('express');
const app=express();
require('dotenv').config()
const mysql=require('mysql2');

// Configure the database connection and test the connection

const db=mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
});
db.getConnection((err,connection)=>{
    if(err){
        console.error("Database Connection Failed!:",err);
        return
    }
    else{
        console.log("Connected to the databse!");
        connection.release();
    }
})

// -------------------Retrieve all patients-------------------------

app.get('/patients',(req,res)=>{
    const sql='SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(sql,(err,results)=>{
        if(err){
            console.error("Error fetching patients:",err);
            return res.status(500).json ({error:err.message});
        }
        res.json(results);
    })
})

// ==================Retrieve all providers============================

app.get('/providers',(req,res)=>{
    const sql='SELECT first_name,last_name,provider_specialty FROM providers';
    db.query(sql,(err,results)=>{
        if(err) return res.status(500).json({error:err.message});
        res.json(results);

        if(results=length===0){
            return res.status(404).json({ message:'No provider found.'})
        }
        res.json(results);
    });
});

// ===================Filter patients by First Name=============================

app.get('/patients/filter',(req,res)=>{
    const{first_name}=req.query;
    const sql='SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(sql,[first_name],(err,results)=>{
        if(err) return res.status(500).json({error:err.message});
        res.json(results);
    });
});

// ========================Retrieve all providers by their specialty================

app.get('/providers/filter',(req,res)=>{
    const{specialty} = req.query;
    const sql= 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    db.query(sql,[specialty],(err,results)=>{
        if (err) return res.status(500).json({error:err.message});
        res.json(results);
    })
})


const PORT=3000;

app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})