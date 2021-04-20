'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({extended:true}));


// Specify a directory for static resources
app.use(express.static('./public'))

// define our method-override reference
app.use(methodOverride('_methodOverride'));

// Set the view engine for server-side templating
app.set('view engine','ejs')

// Use app cors
app.use(cors());

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
app.get('/',homePage)
app.post('/save',saveToDb)
app.get('/favorite-quotes',renderFav);
app.get('/favorite-quotes/:quote_id',getDetails)
app.put('/favorite-quotes/:quote_id',updatDetails)
app.delete('/favorite-quotes/:quote_id',deleteDetails)


// callback functions
function deleteDetails(req,res){
    const id =req.params.quote_id;
    const save=[id];
    const sql=`DELETE FROM exam WHERE id=$1;`
    client.query(sql,save).then((result)=>{
        res.redirect('/favorite-quotes')
    })
}

function updatDetails(req,res){
    const id =req.params.quote_id;
    const{quote}=req.body;
    const save= [quote,id]
    const sql =`UPDATE exam SET quote=$1 WHERE id=$2;`
    client.query(sql,save).then(()=>{
        res.redirect(`/favorite-quotes/${id}`)
})
} 


function getDetails(req,res){
    const id =req.params.quote_id;
    const save=[id];
    const sql = `SELECT * FROM exam WHERE id=$1;`
    client.query(sql,save).then((result)=>{
        res.render('detail',{senData:result.rows})
    })
}

function renderFav(req,res){
    const save=['API'];
    const sql = `SELECT * FROM exam WHERE creat_by=$1;`
    client.query(sql,save).then((result)=>{
        res.render('myFav',{senData:result.rows})
    })
}

function saveToDb(req,res){
    const{quote,character,image,characterDirection}=req.body;
    const save = [quote,character,image,characterDirection,'API'];
    const sql=`INSERT INTO exam (quote,character,image,characterDirection,creat_by) VALUES ($1,$2,$3,$4,$5);`;
   
    client.query(sql,save).then(()=>{
        res.redirect('/favorite-quotes')
    })
}

function homePage(req,res){
   const url = 'https://thesimpsonsquoteapi.glitch.me/quotes?count=10'
   superagent.get(url).set('User-Agent', '1.0').then(result=>{
       const quote= result.body.map(e=>new Quote(e))
       console.log(quote);
       res.render('index.ejs',{senData:quote})
   })
}

// helper functions
function Quote(data){
    this.quote=data.quote;
    this.character=data.character
    this.image=data.image
    this.characterDirection=data.characterDirection
}
// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
