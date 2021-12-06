require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./db')
const app = express()

app.use(cors())
app.use(express.json())

app.post('/todos', async (req, res) => {
  try {
    const { description } = req.body
    const { rows } = await pool.query(
      'INSERT INTO todo (description) VALUES($1) RETURNING *',
      [description]
    )

    res.json(rows[0])
  } catch (e) {
    console.log(e.message || e)
  }
})

app.get('/todos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM todo')
    res.json(rows)
  } catch (e) {
    console.log(e.message || e)
  }
})

app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { rows } = await pool.query(
      'SELECT * FROM todo WHERE todo_id = $1',
      [id]
    )

    res.json(rows[0])
  } catch (e) {
    console.log(e.message || e)
  }
})

app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { description } = req.body

    const { rows } = await pool.query(
      'UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *',
      [description, id]
    )

    res.json(rows[0])
  } catch (e) {
    console.log(e.message || e)
  }
})

app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params

    await pool.query('DELETE FROM todo WHERE todo_id = $1', [id])
    res.ok
  } catch (e) {
    console.log(e.message || e)
  }
})

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server has started on port ${process.env.SERVER_PORT}`)
})
