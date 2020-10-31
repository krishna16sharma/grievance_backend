const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '',
    database : ''
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.listen( 3000 , ()=>{
    console.log('Server running on port 3000');
})
