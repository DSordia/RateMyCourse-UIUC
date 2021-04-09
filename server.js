import express from 'express'
import mysql from 'mysql'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

// Create connection to MySQL
const db = mysql.createConnection({
    host: "34.67.38.169",
    user: "root",
    password: "password",
    database: "rmc_db"

})

// Connect to MySQL DB
db.connect(err => {
    if (err) throw err
    console.log('Connected to MySQL Database.')
})

app.post('/addDept', (req, res) => {
  const deptId = req.query.deptId
  const deptName = req.query.deptName
  const sql = `
      INSERT INTO Department
      VALUES('${deptId}',
             '${deptName}')
  `
  db.query(sql, err => {
      if (err) throw err
      res.send('Added Dept')
  })
})

app.get('/searchDept/:id', (req, res) => {
  const deptId = req.params.id
  console.log(deptId)
  const sql = `
      Select *
      FROM Department
      WHERE DeptID like "%${deptId}%"
  `
  db.query(sql, (err,results) => {
      if (err) throw err
      res.send(results)
  })
})

// Delete review from DB
app.delete('/deleteDept/:id', (req, res) => {
    const deptId = req.params.id
    const sql = `
        DELETE
        FROM Department
        WHERE DeptID = '${deptId}'
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Deleted review from DB.')
    })
})

// Edit review in DB
app.patch('/updateDept', (req, res) => {
    const deptId = req.query.deptId
    console.log(deptId)
    const deptName = req.query.deptName
    console.log(deptName)
    const sql = `
        UPDATE Department
        SET DeptName = '${deptName}'
        WHERE DeptID = '${deptId}'
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Edited review in DB.')
    })
})

app.listen(4000, () => {
  console.log("running on port 4000");
})
