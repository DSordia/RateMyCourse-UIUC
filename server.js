const express = require('express')
const mysql = require('mysql')
const path = require('path')
require('dotenv').config()
const app = express()

// Database connection to MySQL
let db = {}

// In production
if (process.env.NODE_ENV === 'production') {
    let config = {
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
    }
    
    if (process.env.INSTANCE_CONNECTION_NAME) {
      config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
    }
    
    db = mysql.createConnection(config)

    // Load frontend from root URL
    app.get('/', (req, res) => {
        app.use(express.static('frontend/build'))
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
// In development
} else {
    db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    })
}

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

// Get reviews liked/disliked by user
app.get('/getLikedReviews/:id', (req, res) => {
    const sql = `
        SELECT ReviewID, Liked
        FROM Likes
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
        ORDER BY (Likes - Dislikes) DESC
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
               '${req.query.userID}',
               0,
               0)
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

// Review was liked, unliked, disliked, or undisliked (first time)
app.post('/likedReviewFirstTime', (req, res) => {
    const sql = `
        INSERT INTO Likes
        VALUES('${req.query.userID}', ${req.query.reviewID}, ${req.query.liked})
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Added entry to likes table in DB.')
    })
})

// Review was liked, unliked, disliked, or undisliked (not first time)
app.patch('/likedReview', (req, res) => {
    const sql = `
        UPDATE Likes
        SET Liked = '${req.query.liked}'
        WHERE UserID = '${req.query.userID}' AND ReviewID = '${req.query.reviewID}'
    `
    db.query(sql, err => {
        if (err) throw err
        res.send('Edited likes entry in DB.')
    })
})

/* TRIGGER: When Likes table is inserted into or updated, updates # of likes / dislikes for review
DELIMITER $;
CREATE TRIGGER ReviewLikedFirstTime
AFTER INSERT ON Likes
FOR EACH ROW
BEGIN
SET @numLikes = (SELECT Likes
                 FROM Review
                 WHERE ReviewID = new.ReviewID);
SET @numDislikes = (SELECT Dislikes
                    FROM Review
                    WHERE ReviewID = new.ReviewID);

IF (new.Liked = 1) THEN
    UPDATE Review
    SET Likes = @numLikes + 1
    WHERE ReviewID = new.ReviewID;
END IF;

IF (new.Liked = -1) THEN
    UPDATE Review
    SET Dislikes = @numDislikes + 1
    WHERE ReviewID = new.ReviewID;
END IF;
END;
$;

DELIMITER $;
CREATE TRIGGER ReviewLiked
BEFORE UPDATE ON Likes
FOR EACH ROW
BEGIN
SET @numLikes = (SELECT Likes
                 FROM Review
                 WHERE ReviewID = new.ReviewID);
SET @numDislikes = (SELECT Dislikes
                    FROM Review
                    WHERE ReviewID = new.ReviewID);
SET @currentLiked = (SELECT Liked
                     FROM Likes
                     WHERE UserID = new.UserID AND ReviewID = new.ReviewID);

IF (@currentLiked = 0 AND new.Liked = 1) THEN
    UPDATE Review
    SET Likes = @numLikes + 1
    WHERE ReviewID = new.ReviewID;
END IF;

IF (@currentLiked = 1 AND new.Liked = 0) THEN
    UPDATE Review
    SET Likes = @numLikes - 1
    WHERE ReviewID = new.ReviewID;
END IF;

IF (@currentLiked = 1 AND new.Liked = -1) THEN
    UPDATE Review
    SET Likes = @numLikes - 1, Dislikes = @numDislikes + 1
    WHERE ReviewID = new.ReviewID;
END IF;

IF (@currentLiked = -1 AND new.Liked = 1) THEN
    UPDATE Review
    SET Likes = @numLikes + 1, Dislikes = @numDislikes - 1
    WHERE ReviewID = new.ReviewID;
END IF;

IF (@currentLiked = -1 AND new.Liked = 0) THEN
    UPDATE Review
    SET Dislikes = @numDislikes - 1
    WHERE ReviewID = new.ReviewID;
END IF;

IF (@currentLiked = 0 AND new.Liked = -1) THEN
    UPDATE Review
    SET Dislikes = @numDislikes + 1
    WHERE ReviewID = new.ReviewID;
END IF;
END;
$; */

// Stored procedure for returning search results using advanced queries
app.get('/searchResultProcedure/:id', (req, res) => {
    const sql = `
        CALL SearchResultProcedure('${req.params.id}')
    `
    db.query(sql, (err, results) => {
        if (err) throw err
        res.send(results)
    })
})

/* STORED PROCEDURE: Returns search results using 3 advanced queries
DELIMITER $;
CREATE PROCEDURE SearchResultProcedure(IN courseCodeParam VARCHAR(50))
BEGIN
    DROP TABLE IF EXISTS SearchResultTable;
    CREATE TABLE SearchResultTable (
        DeptName VARCHAR(100),
        DeptSize INTEGER,
        ProfName VARCHAR(50),
        ProfRating DOUBLE,
        CourseRating DOUBLE,
        DeptAvg DOUBLE
    );
    BEGIN
        DECLARE done INT DEFAULT 0;
        DECLARE DeptName_ VARCHAR(100) DEFAULT "";
        DECLARE DeptSize_ INTEGER DEFAULT 0;
        
        DECLARE cur1 CURSOR FOR SELECT DISTINCT d1.DeptName, (SELECT COUNT(DISTINCT c2.CourseCode)
                                                              FROM Course c2 NATURAL JOIN Department d2
                                                              WHERE d2.DeptID = d1.DeptID) AS deptSize
                                FROM Course c1 NATURAL JOIN Department d1
                                WHERE c1.CourseCode = courseCodeParam;
        
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
        
        OPEN cur1;
            REPEAT
                FETCH cur1 INTO DeptName_, DeptSize_;
                IF DeptName_ IS NOT NULL THEN
                    INSERT INTO SearchResultTable(DeptName, DeptSize)
                    VALUES(DeptName_, DeptSize_);
                END IF;
            UNTIL done
            END REPEAT;
        CLOSE cur1;
        
        SELECT DISTINCT DeptName, DeptSize
        FROM SearchResultTable
        WHERE DeptName IS NOT NULL;
    END;
    
    BEGIN
        DECLARE done INT DEFAULT 0;
        DECLARE ProfName_ VARCHAR(50) DEFAULT "";
        DECLARE CourseRating_ DOUBLE DEFAULT 0.0;
        DECLARE ProfRating_ DOUBLE DEFAULT 0.0;
        
        DECLARE cur2 CURSOR FOR SELECT ProfessorName AS profName, AVG(ProfessorRating) AS profRating, (SELECT AVG(CourseRating)
                                                                                                      FROM Review
                                                                                                      WHERE CourseCode = courseCodeParam) AS courseRating
                               FROM Review
                               WHERE CourseCode = courseCodeParam
                               GROUP BY ProfessorName
                               ORDER BY ProfessorName;
                               
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
        
        OPEN cur2;
            REPEAT
                FETCH cur2 INTO ProfName_, ProfRating_, CourseRating_;
                IF ProfName_ IS NOT NULL THEN
                    INSERT INTO SearchResultTable(ProfName, ProfRating, CourseRating)
                    VALUES(ProfName_, ProfRating_, CourseRating_);
                END IF;
            UNTIL done
            END REPEAT;
        CLOSE cur2;
        
        SELECT DISTINCT ProfName, ProfRating, CourseRating
        FROM SearchResultTable
        WHERE ProfName IS NOT NULL
        ORDER BY ProfName;
    END;
    
    BEGIN
        DECLARE done INT DEFAULT 0;
        DECLARE DeptAvg_ DOUBLE DEFAULT 0.0;
        
        DECLARE cur3 CURSOR FOR SELECT AVG(r.CourseRating) AS avgDeptCourseRating
                                FROM Review r, Department d
                                WHERE d.DeptID = (SELECT DISTINCT DeptID
                                                  FROM Course
                                                  WHERE CourseCode = courseCodeParam) AND r.CourseCode IN (SELECT c.CourseCode
                                                       FROM Course c
                                                       WHERE c.DeptID = (SELECT DISTINCT DeptID
                                                                         FROM Course
                                                                         WHERE CourseCode = courseCodeParam));

        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
        
        OPEN cur3;
            REPEAT
                FETCH cur3 INTO DeptAvg_;
                IF DeptAvg_ IS NOT NULL THEN
                    INSERT INTO SearchResultTable(DeptAvg)
                    VALUES(DeptAvg_);
                ELSE
                    INSERT INTO SearchResultTable(DeptAvg)
                    VALUES(0.0);
                END IF;
            UNTIL done
            END REPEAT;
        CLOSE cur3;
        
        SELECT DISTINCT DeptAvg
        FROM SearchResultTable
        WHERE DeptAvg IS NOT NULL;
    END;
END;
$; */

/* Advanced Query 1: Get department ID, department name, and size of department
   for a course given the course code; :id is the course code */
// app.get('/getDeptInfo/:id', (req, res) => {
//     const sql = `
//         SELECT DISTINCT d1.DeptName, (SELECT COUNT(DISTINCT c2.CourseCode)
//                                       FROM Course c2 NATURAL JOIN Department d2
//                                       WHERE d2.DeptID = d1.DeptID) AS deptSize
//         FROM Course c1 NATURAL JOIN Department d1
//         WHERE c1.CourseCode = '${req.params.id}'
//     `
//     db.query(sql, (err, results) => {
//         if (err) throw err
//         res.send(results)
//     })
// })

/* Advanced Query 2: Get overall course rating
   and professor ratings for that course; :id is CourseCode */
// app.get('/getCourseRating/:id', (req, res) => {
//     const sql = `
//         SELECT ProfessorName AS profName, AVG(ProfessorRating) AS profRating, (SELECT AVG(CourseRating)
//                                                                                FROM Review
//                                                                                WHERE CourseCode = '${req.params.id}') AS courseRating
//         FROM Review
//         WHERE CourseCode = '${req.params.id}'
//         GROUP BY ProfessorName
//         ORDER BY ProfessorName
//     `
//     db.query(sql, (err, results) => {
//         if (err) throw err
//         res.send(results)
//     })
// })

/* Advanced Query 3: Gets the avg rating of all courses in a department */
// app.get('/getAvgDeptRating/:id', (req, res) => {
//     const sql = `
//     SELECT AVG(r.CourseRating) AS avgDeptCourseRating
//     FROM Review r, Department d
//     WHERE d.DeptID = '${req.params.id}' AND r.CourseCode IN (SELECT c.CourseCode
//                                                              FROM Course c
//                                                              WHERE c.DeptID = '${req.params.id}')
//     `
//     db.query(sql, (err, results) => {
//         if (err) throw err
//         res.send(results)
//     })
// })

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

const PORT = process.env.PORT || '4000'
app.listen(PORT, () => console.log(`Server started on port ${PORT}.`))