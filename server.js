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

// Check if user already exists in DB. If not, add user to DB
app.post('/loginSignupUser', (req, res) => {
    const userID = req.query.userID
    const email = req.query.email

    const sql = `
        SELECT *
        FROM user
        WHERE UserID = '${userID}'
    `
    db.query(sql, (err, results) => {
        if (err) throw err
        // User doesn't already exist in DB; create user
        if (results.length == 0) {
            const sql = `
                INSERT INTO user
                VALUES('${userID}',
                       '${email}')
            `
            db.query(sql, err => {
                if (err) throw err
                res.send('Created user.')
            })
        } else {
            res.send('User already exists in DB.')
        }
    })
})

// Get user reviews
app.get('/getUserReviews/:id', (req, res) => {
    const sql = `
        SELECT *
        FROM review
        WHERE UserID = '${req.params.id}'
    `
    db.query(sql, (err, results) => {
        if (err) throw err
        res.send(results)
    })
})

// Get reviews for course
app.get('/getReviews/:id', (req, res) => {
    const sql = `
        SELECT *
        FROM review
        WHERE CourseCode = '${req.params.id}'
    `
    db.query(sql, (err, results) => {
        if (err) throw err
        res.send(results)
    })
})

// Add review to DB
app.post('/addReview', (req, res) => {
    const sql = `
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
app.patch('/editReview', (req, res) => {
    const sql = `
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

// Delete review from DB
app.delete('/deleteReview/:id', (req, res) => {
    const sql = `
        DELETE
        FROM review
        WHERE ReviewID = '${req.params.id}'
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Deleted review from DB.')
    })
})

// Get courses and professors
app.get('/getCoursesAndProfs', (req, res) => {
    const sql = `
        SELECT DISTINCT CourseCode, CourseTitle, ProfessorName
        FROM course
        ORDER BY ProfessorName
    `
    db.query(sql, (err, results) => {
        if (err) throw err
        res.send(results)
    })
})

/* Advanced Query 1: Get department ID, department name, and size of department
   for a course given the course code; :id is the course code */
app.get('/getDeptInfo/:id', (req, res) => {
    const sql = `
        SELECT DISTINCT d1.DeptID, d1.DeptName, (SELECT COUNT(DISTINCT c2.CourseCode)
                                                 FROM course c2 NATURAL JOIN department d2
                                                 WHERE d2.DeptID = d1.DeptID) AS deptSize
        FROM course c1 NATURAL JOIN department d1
        WHERE c1.CourseCode = '${req.params.id}'
    `
    db.query(sql, (err, results) => {
        if (err) throw err
        res.send(results)
    })
})

/* Advanced Query 2: Get overall course rating
   and professor ratings for that course; :id is CourseCode */
app.get('/getCourseRating/:id', (req, res) => {
    const sql = `
        SELECT ProfessorName AS profName, AVG(ProfessorRating) AS profRating, (SELECT AVG(CourseRating)
                                                                               FROM review
                                                                               WHERE CourseCode = '${req.params.id}') AS courseRating
        FROM review
        WHERE CourseCode = '${req.params.id}'
        GROUP BY ProfessorName
        ORDER BY ProfessorName
    `
    db.query(sql, (err, results) => {
        if (err) throw err
        res.send(results)
    })
})

/* Advanced Query 3: Gets the avg rating of all courses in a department */
app.get('/getAvgDeptRating/:id', (req, res) => {
    const sql = `
    SELECT d.DeptName, AVG(r.CourseRating) AS avgDeptCourseRating
    FROM review r NATURAL JOIN department d
    WHERE d.DeptID = '${req.params.id}' AND r.CourseCode IN (SELECT c.CourseCode
                                                             FROM course c
                                                             WHERE c.DeptID = '${req.params.id}')
    `
    db.query(sql, (err, results) => {
        if (err) throw err
        res.send(results)
    })
})

/* Advanced Query 4: Get course name and number of reviews for that course */
app.get('/getCourseNameAndNumReviews/:id', (req, res) => {
    const sql = `
        SELECT DISTINCT c.CourseTitle, (SELECT COUNT(r.CourseCode)
                                        FROM review r
                                        WHERE r.CourseCode = '${req.params.id}') AS numReviews
        FROM course c NATURAL JOIN review r
        WHERE c.CourseCode = '${req.params.id}'
    `
    db.query(sql, (err, results) => {
        if (err) throw err
        res.send(results)
    })
})

const PORT = '4000'
app.listen(PORT, () => console.log(`Server started on port ${PORT}.`))