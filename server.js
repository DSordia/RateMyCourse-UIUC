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

/* COURSE TABLE METHODS */

// Add course to DB
app.post('/addCourse', (req, res) => {
    const sql = `
        INSERT INTO Course
        VALUES('${req.query.courseId}',
               '${req.query.deptId}',
               '${req.query.courseCode}',
               '${req.query.courseTitle}',
               '${req.query.professorName}')
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Added Course.')
    })
})

// Search for course in DB
app.get('/readCourse/:id', (req, res) => {
    const sql = `
        SELECT * 
        FROM Course 
        WHERE CourseCode = '${req.params.id}'
    `
    db.query(sql, (err, results)  => {
        if (err) throw err
        res.send(results)
    })
})

// Edit course name in DB
app.patch('/editCourse', (req, res) => {
    const sql = `
        UPDATE Course
        SET CourseTitle = '${req.query.newCourseName}'
        WHERE CourseID = '${req.query.courseID}'
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Edited review in DB.')
    })
})

// Delete course from DB
app.delete('/deleteCourse/:id', (req, res) => {
    const sql = `
        DELETE
        FROM Course
        WHERE CourseID = '${req.params.id}'
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Deleted course from DB.')
    })
})

/* PROFESSOR TABLE METHODS */

// Add professor to DB
app.post('/addProfessor', (req, res) => {
    const sql = `
        INSERT INTO Professor
        VALUES('${req.query.professorName}',
               '${req.query.deptID}',
               '${req.query.professorID}')
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Added Professor.')
    })
})

// Search for professor in DB
app.get('/readProfessor/:id', (req, res) => {
    const sql = `
        SELECT * 
        FROM Professor
        WHERE ProfessorID = '${req.params.id}'
    `
    db.query(sql, (err, results)  => {
        if (err) throw err
        res.send(results)
    })
})

// Edit professor name in DB
app.patch('/editProfessor', (req, res) => {
    const sql = `
        UPDATE Professor
        SET ProfessorName = '${req.query.newProfessorName}'
        WHERE ProfessorID = '${req.query.professorID}'
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Edited professor in DB.')
    })
})

// Delete professor from DB
app.delete('/deleteProfessor/:id', (req, res) => {
    const sql = `
        DELETE
        FROM Professor
        WHERE ProfessorID = '${req.params.id}'
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Deleted professor from DB.')
    })
})

/* DEPARTMENT TABLE METHODS */

// Add department to DB
app.post('/addDepartment', (req, res) => {
    const sql = `
        INSERT INTO Department
        VALUES('${req.query.deptID}',
               '${req.query.deptName}')
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Added Department.')
    })
})

// Search for department in DB
app.get('/readDepartment/:id', (req, res) => {
    const sql = `
        SELECT * 
        FROM Department
        WHERE DeptID = '${req.params.id}'
    `
    db.query(sql, (err, results)  => {
        if (err) throw err
        res.send(results)
    })
})

// Edit department name in DB
app.patch('/editDepartment', (req, res) => {
    const sql = `
        UPDATE Department
        SET DeptName = '${req.query.newDeptName}'
        WHERE DeptID = '${req.query.deptID}'
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Edited department in DB.')
    })
})

// Delete department from DB
app.delete('/deleteDepartment/:id', (req, res) => {
    const sql = `
        DELETE
        FROM Department
        WHERE DeptID = '${req.params.id}'
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Deleted department from DB.')
    })
})

// Check if user already exists in DB. If not, add user to DB
app.post('/loginSignupUser', (req, res) => {
    const userID = req.query.userID
    const email = req.query.email

    const sql = `
        SELECT *
        FROM User
        WHERE UserID = '${userID}'
    `
    db.query(sql, (err, results) => {
        if (err) throw err
        // User doesn't already exist in DB; create user
        if (results.length == 0) {
            const sql = `
                INSERT INTO User
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
        FROM Review
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
        FROM Review
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
        INSERT INTO Review
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
        UPDATE Review
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
        FROM Review
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
        FROM Course
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
                                                 FROM Course c2 NATURAL JOIN Department d2
                                                 WHERE d2.DeptID = d1.DeptID) AS deptSize
        FROM Course c1 NATURAL JOIN Department d1
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
                                                                               FROM Review
                                                                               WHERE CourseCode = '${req.params.id}') AS courseRating
        FROM Review
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
    FROM Review r NATURAL JOIN Department d
    WHERE d.DeptID = '${req.params.id}' AND r.CourseCode IN (SELECT c.CourseCode
                                                             FROM Course c
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
                                        FROM Review r
                                        WHERE r.CourseCode = '${req.params.id}') AS numReviews
        FROM Course c NATURAL JOIN Review r
        WHERE c.CourseCode = '${req.params.id}'
    `
    db.query(sql, (err, results) => {
        if (err) throw err
        res.send(results)
    })
})

const PORT = '4000'
app.listen(PORT, () => console.log(`Server started on port ${PORT}.`))