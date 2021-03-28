import express from 'express'
import mysql from 'mysql'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

// Create connection to MySQL
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

// Connect to MySQL DB
db.connect(err => {
    if (err) throw err
    console.log('Connected to MySQL Database.')
})

// Check if user already exists in DB. If not, add user to DB. :id is user ID
app.get('/getUser/:id', (req, res) => {
    const userID = req.params.id
    const email = req.query.email

    let sql = `
        SELECT *
        FROM user
        WHERE UserID = '${userID}'
    `
    db.query(sql, (err, results) => {
        if (err) throw err
        // User doesn't already exist in DB; create user
        if (results.length == 0) {
            sql = `
                INSERT INTO user
                VALUES('${userID}',
                       '${email}')
            `
            db.query(sql, err => {
                if (err) throw err
                // User has no reviews; send empty array
                res.send('Created user.')
            })
        } else {
            res.send('User already exists in DB.')
        }
    })
})

// Get user reviews; :id is user ID
app.get('/getUserReviews/:id', (req, res) => {
    let sql = `
        SELECT *
        FROM review
        WHERE UserID = '${req.params.id}'
    `
    db.query(sql, (err, results) => {
        if (err) throw err
        // Return array of user's reviews
        res.send(results)
    })
})

// Get courses
app.get('/getCoursesAndProfs', (req, res) => {
    let sql = `
        SELECT DISTINCT CourseCode, CourseTitle, ProfessorName
        FROM course
    `
    db.query(sql, (err, results) => {
        if (err) throw err
        // Return array of courses / professors
        res.send(results)
    })
})

// Get reviews for course; :id is course code
app.get('/getReviews/:id', (req, res) => {
    let sql = `
        SELECT *
        FROM review
        WHERE CourseCode = '${req.params.id}'
    `
    db.query(sql, (err, results) => {
        if (err) throw err
        // Return array of review objects
        res.send(results)
    })
})

// Add review to DB
app.get('/addReview', (req, res) => {
    let sql = `
        INSERT INTO review
        VALUES(${req.query.reviewID},
               '${req.query.reviewText}',
               ${req.query.courseRating},
               ${req.query.professorRating},
               '${req.query.courseCode}',
               '${req.query.professorName}',
               '${req.query.userID}')
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Added review to DB.')
    })
})

// Edit review in DB
app.get('/editReview', (req, res) => {
    let sql = `
        UPDATE review
        SET ReviewText = '${req.query.reviewText}',
            CourseRating = ${req.query.courseRating},
            ProfessorRating = ${req.query.professorRating},
            CourseCode = '${req.query.courseCode}',
            ProfessorName = '${req.query.professorName}'
        WHERE ReviewID = '${req.query.reviewID}'
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Edited review in DB.')
    })
})

// Delete review from DB; :id is review ID
app.get('/deleteReview/:id', (req, res) => {
    let sql = `
        DELETE
        FROM review
        WHERE ReviewID = '${req.params.id}'
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Deleted review from DB.')
    })
})

const PORT = '4000'
app.listen(PORT, () => console.log(`Server started on port ${PORT}.`))