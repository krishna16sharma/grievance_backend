const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors');

const login = require('./controllers/login');
const register = require('./controllers/register');
const aadhaar = require('./controllers/aadhaar');
const g_form = require('./controllers/grievance_form');
const dashboard = require('./controllers/dashboard');
const response = require('./controllers/response');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'dbms_project'
  }
});

db.select('*').from('users').then(data=>{
    console.log(data);
});

const app = express();

app.use(bodyParser.json());
app.use(cors());


app.post('/login', (req,res) => { login.handleLogin(req,res,db)} )
app.post('/register', (req,res) => { register.handleRegister(req,res,db)} )
app.post('/aadhaar', (req,res) => { aadhaar.handleAadhaar(req,res,db)} )
app.post('/grievance_submit', (req,res) => { g_form.handleGrievance(req,res,db)})
app.post('/dashboard', (req,res) => { dashboard.handleDashboard(req,res,db)})
app.post('/response', (req,res) => { response.handleResponse(req,res,db)} )

app.listen( 3000 , ()=>{
    console.log('Server running on port 3000');
})
