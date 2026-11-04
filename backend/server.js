require('dotenv').config
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg')

const app = express()
const port = process.env.PORT || 500;

app.use(cors())
app.use(express.json())
const pool = new Pool({
    user: 'danil',
    host: 'localhost',
    database: 'habbits_tracker',
    port: '5432',
});


pool.connect((err, client, release) => {
    if (err) return console.log('Error connecting by bd', err.stack)
    console.log('This good connecting to bd')
    release()
})
module.exports = pool

try {

    app.get('api/habbits', async (req, res) => {
        const result = await pool.query('SELECT * FROM habbits')
        res.json(result.rows)
    })
} catch (err) {
    console.error(err.message)
    res.status(500).send('Ошибка серверв ')
}

app.listen(port, () => {
    console.log(`Север запущен по адресу http://localhost:${port}`)
})