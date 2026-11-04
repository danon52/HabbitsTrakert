require('dotenv').config
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg')

const app = express()
const port = process.env.PORT || 500;

app.use(cors())
app.use(express.json())
const pool = new Pool({
    // user: 
})