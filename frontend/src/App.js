import React, { Component } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import SearchReviews from './components/SearchReviews'
import AddReviews from './components/AddReviews'
import EditReviews from './components/EditReviews'
import { LoginText, TabsDiv, TabBtn, Divider } from './styles/styles'

class App extends Component {
  state = {
    isLoggedIn: false,
    userID: '',
    courses: [],
    courseToProfs: {},
    courseCodeToName: {},
    searchSelected: true,
    addSelected: false,
    editSelected: false,

    formValuesCourse: {},
    searchResultsCourse: [],

    formValuesProf: {},
    searchResultsProf: [],

    formValuesDept: {},
    searchResultsDept: []
  }

  async componentDidMount() {
    const res = await axios.get('/getCoursesAndProfs')
    let courses = []
    let courseToProfs = {}
    let courseCodeToName = {}

    // Initializes courses options array and course code -> professors and course name maps
    for (const course of res.data) {
      const courseCode = course.CourseCode
      const courseLabel = `${courseCode}: ${course.CourseTitle}`

      if (courseCode in courseToProfs) {
        let shouldAddProf = true
        for (const prof of courseToProfs[courseCode]) {
          if (prof.value === course.ProfessorName) {
            shouldAddProf = false
            break
          }
        }
        if (shouldAddProf) {
          courseToProfs[courseCode] = [...courseToProfs[courseCode],
          { value: course.ProfessorName,
            label: course.ProfessorName }]
        }
      } else {
        courseToProfs[courseCode] = [{ value: course.ProfessorName,
                                       label: course.ProfessorName }]

        const courseEntry = { value: courseCode, label: courseLabel }
        courses.push(courseEntry)

        courseCodeToName[courseCode] = course.CourseTitle
      }
    }

    this.setState({
      courses: courses,
      courseToProfs: courseToProfs,
      courseCodeToName: courseCodeToName
    })
  }

  logIn = userID => this.setState({isLoggedIn: true, userID: userID})

  logOut = () => {
    this.setState({
      isLoggedIn: false,
      userID: '',
      userReviews: [],
      courses: [],
      courseToProfs: {},
      courseCodeToName: {},
      reviewOptions: [],
      searchSelected: true,
      addSelected: false,
      editSelected: false
    })
  }

  searchTabClicked = () => {
    this.setState({
      searchSelected: true,
      addSelected: false,
      editSelected: false
    })
  }

  addTabClicked = () => {
    this.setState({
      searchSelected: false,
      addSelected: true,
      editSelected: false
    })
  }

  editTabClicked = () => {
    this.setState({
      searchSelected: false,
      addSelected: false,
      editSelected: true
    })
  }

  /* COURSE METHODS */

  handleChangeCourse = e => {
    let formValuesCourse = this.state.formValuesCourse
    formValuesCourse[e.target.name] = e.target.value
    this.setState({formValuesCourse})
  }

  addCourse = async () => {
    const formValues = this.state.formValuesCourse

    const params = {
      courseId: formValues.newCourseId,
      courseTitle: formValues.newCourseTitle,
      courseCode: formValues.newCourseCode,
      professorName: formValues.newProfessorName,
      deptId: formValues.newDeptID,
    }

    await axios.post('/addCourse', null, { params: params })
  }

  readCourse = async () => {
    let result = await axios.get(`/readCourse/${this.state.formValuesCourse.courseCodeToSearch}`)
    result = result.data[0]  
    let results = []
    results.push(result.CourseCode)
    results.push(result.CourseTitle)
    results.push(result.ProfessorName)

    this.setState({searchResultsCourse: results})
  }

  updateCourse = async () => {
    const params = {
      courseID: this.state.formValuesCourse.courseIdToUpdate,
      newCourseName: this.state.formValuesCourse.courseNameUpdated
    }
    await axios.patch('/editCourse', null, { params: params })
  }

  deleteCourse = async () => {
    await axios.delete(`/deleteCourse/${this.state.formValuesCourse.courseIdToDelete}`)
  }

  /* PROF METHODS */

  handleChangeProf = e => {
    let formValuesProf = this.state.formValuesProf
    formValuesProf[e.target.name] = e.target.value
    this.setState({formValuesProf})
  }

  addProfessor = async () => {
    const formValues = this.state.formValuesProf

    const params = {
      professorName: formValues.newProfessorName,
      deptID: formValues.newDeptID,
      professorID: formValues.newProfessorId
    }

    await axios.post('/addProfessor', null, { params: params })
  }

  readProfessor = async () => {
    let result = await axios.get(`/readProfessor/${this.state.formValuesProf.professorIdToSearch}`)
    result = result.data[0]  
    let results = []
    results.push(result.ProfessorName)
    results.push(result.DeptID)

    this.setState({searchResultsProf: results})
  }

  updateProfessor = async () => {
    const params = {
      professorID: this.state.formValuesProf.profIdToUpdate,
      newProfessorName: this.state.formValuesProf.profNameUpdated
    }
    await axios.patch('/editProfessor', null, { params: params })
  }

  deleteProfessor = async () => {
    await axios.delete(`/deleteProfessor/${this.state.formValuesProf.profIdToDelete}`)
  }

  /* DEPT METHODS */

  handleChangeDept = e => {
    let formValuesDept = this.state.formValuesDept
    formValuesDept[e.target.name] = e.target.value
    this.setState({formValuesDept})
  }

  addDepartment = async () => {
    const formValues = this.state.formValuesDept

    const params = {
      deptID: formValues.newDeptId,
      deptName: formValues.newDeptName
    }

    await axios.post('/addDepartment', null, { params: params })
  }

  readDepartment = async () => {
    let result = await axios.get(`/readDepartment/${this.state.formValuesDept.deptIdToSearch}`)
    result = result.data[0]  
    let results = []
    results.push(result.DeptID)
    results.push(result.DeptName)

    this.setState({searchResultsDept: results})
  }

  updateDepartment = async () => {
    const params = {
      deptID: this.state.formValuesDept.deptIdToUpdate,
      newDeptName: this.state.formValuesDept.deptNameUpdated
    }
    await axios.patch('/editDepartment', null, { params: params })
  }

  deleteDepartment = async () => {
    await axios.delete(`/deleteDepartment/${this.state.formValuesDept.deptIdToDelete}`)
  }

  render() {
    const { isLoggedIn, userID, courses, courseToProfs, searchSelected, addSelected, editSelected,
            courseCodeToName, formValuesCourse, searchResultsCourse, formValuesProf, searchResultsProf,
            formValuesDept, searchResultsDept } = this.state

    return (
      <div>
        {/* COURSE TABLE */}

        <h1>Course Table CRUD Application</h1>

        {/*Create*/}
        <h2>CREATE</h2>

        <label>New CourseID</label>
        <input type='text'
               name='newCourseId'
               value={formValuesCourse['newCourseId']}
               onChange={e => this.handleChangeCourse(e)} />

        <label>New CourseTitle</label>
        <input type='text'
               name='newCourseTitle'
               value={formValuesCourse['newCourseTitle']}
               onChange={e => this.handleChangeCourse(e)} />

        <label>New CourseCode</label>
        <input type='text'
               name='newCourseCode'
               value={formValuesCourse['newCourseCode']}
               onChange={e => this.handleChangeCourse(e)} />

        <label>New ProfessorName</label>
        <input type='text'
               name='newProfessorName'
               value={formValuesCourse['newProfessorName']}
               onChange={e => this.handleChangeCourse(e)} />

        <label>New DeptID</label>
        <input type='text'
               name='newDeptID'
               value={formValuesCourse['newDeptID']}
               onChange={e => this.handleChangeCourse(e)} />

        <button onClick={this.addCourse}>CREATE</button>

        {/*Read*/}
        <h2>READ</h2>

        <label>CourseCode To Search</label>
        <input type='text'
               name='courseCodeToSearch'
               value={formValuesCourse['courseCodeToSearch']}
               onChange={e => this.handleChangeCourse(e)} />

        <button onClick={this.readCourse}>READ</button>

        {searchResultsCourse.map((info, i) => (
          <div key={i}>{info}</div>
        ))}

        {/*Update*/}
        <h2>UPDATE</h2>

        <label>CourseID To Update</label>
        <input type='text'
               name='courseIdToUpdate'
               value={formValuesCourse['courseIdToUpdate']}
               onChange={e => this.handleChangeCourse(e)} />

        <label>New Course Name</label>
        <input type='text'
               name='courseNameUpdated'
               value={formValuesCourse['courseNameUpdated']}
               onChange={e => this.handleChangeCourse(e)} />

        <button onClick={this.updateCourse}>UPDATE</button>

        {/*Delete*/}
        <h2>DELETE</h2>

        <label>CourseID To Delete</label>
        <input type='text'
               name='courseIdToDelete'
               value={formValuesCourse['courseIdToDelete']}
               onChange={e => this.handleChangeCourse(e)} />

        <button onClick={this.deleteCourse}>DELETE</button>

        <hr style={{marginTop: '50px', marginBottom: '50px'}} />

        {/*------------------------------------------------------------------------------------------------------*/}

        {/* PROFESSOR TABLE */}

        <h1>Professor Table CRUD Application</h1>

        {/*Create*/}
        <h2>CREATE</h2>

        <label>New ProfessorID</label>
        <input type='text'
               name='newProfessorId'
               value={formValuesProf['newProfessorId']}
               onChange={e => this.handleChangeProf(e)} />

        <label>New ProfessorName</label>
        <input type='text'
               name='newProfessorName'
               value={formValuesProf['newProfessorName']}
               onChange={e => this.handleChangeProf(e)} />

        <label>New DeptID</label>
        <input type='text'
               name='newDeptID'
               value={formValuesProf['newDeptID']}
               onChange={e => this.handleChangeProf(e)} />

        <button onClick={this.addProfessor}>CREATE</button>

        {/*Read*/}
        <h2>READ</h2>

        <label>ProfessorID To Search</label>
        <input type='text'
               name='professorIdToSearch'
               value={formValuesProf['professorIdToSearch']}
               onChange={e => this.handleChangeProf(e)} />

        <button onClick={this.readProfessor}>READ</button>

        {searchResultsProf.map((info, i) => (
          <div key={i}>{info}</div>
        ))}

        {/*Update*/}
        <h2>UPDATE</h2>

        <label>ProfessorID To Update</label>
        <input type='text'
               name='profIdToUpdate'
               value={formValuesProf['profIdToUpdate']}
               onChange={e => this.handleChangeProf(e)} />

        <label>New Professor Name</label>
        <input type='text'
               name='profNameUpdated'
               value={formValuesProf['profNameUpdated']}
               onChange={e => this.handleChangeProf(e)} />

        <button onClick={this.updateProfessor}>UPDATE</button>

        {/*Delete*/}
        <h2>DELETE</h2>

        <label>ProfessorID To Delete</label>
        <input type='text'
               name='profIdToDelete'
               value={formValuesProf['profIdToDelete']}
               onChange={e => this.handleChangeProf(e)} />

        <button onClick={this.deleteProfessor}>DELETE</button>

        <hr style={{marginTop: '50px', marginBottom: '50px'}} />
        {/*------------------------------------------------------------------------------------------------------*/}

        <h1>Department Table CRUD Application</h1>

        {/* PROFESSOR TABLE */}

        {/*Create*/}
        <h2>CREATE</h2>

        <label>New DeptID</label>
        <input type='text'
               name='newDeptId'
               value={formValuesDept['newDeptId']}
               onChange={e => this.handleChangeDept(e)} />

        <label>New Department Name</label>
        <input type='text'
               name='newDeptName'
               value={formValuesDept['newDeptName']}
               onChange={e => this.handleChangeDept(e)} />

        <button onClick={this.addDepartment}>CREATE</button>

        {/*Read*/}
        <h2>READ</h2>

        <label>DeptID To Search</label>
        <input type='text'
               name='deptIdToSearch'
               value={formValuesDept['deptIdToSearch']}
               onChange={e => this.handleChangeDept(e)} />

        <button onClick={this.readDepartment}>READ</button>

        {searchResultsDept.map((info, i) => (
          <div key={i}>{info}</div>
        ))}

        {/*Update*/}
        <h2>UPDATE</h2>

        <label>DeptID To Update</label>
        <input type='text'
               name='deptIdToUpdate'
               value={formValuesDept['deptIdToUpdate']}
               onChange={e => this.handleChangeDept(e)} />

        <label>New Department Name</label>
        <input type='text'
               name='deptNameUpdated'
               value={formValuesDept['deptNameUpdated']}
               onChange={e => this.handleChangeDept(e)} />

        <button onClick={this.updateDepartment}>UPDATE</button>

        {/*Delete*/}
        <h2>DELETE</h2>

        <label>DeptID To Delete</label>
        <input type='text'
               name='deptIdToDelete'
               value={formValuesProf['deptIdToDelete']}
               onChange={e => this.handleChangeDept(e)} />

        <button onClick={this.deleteDepartment}>DELETE</button>
        <br />
        <br />
        <br />
      </div>

      // <>
      //   <Navbar isLoggedIn={isLoggedIn}
      //           logIn={this.logIn}
      //           logOut={this.logOut} />

      //   {isLoggedIn ?
      //     <>        
      //       <TabsDiv>
      //         <TabBtn selected={searchSelected}
      //                 onClick={this.searchTabClicked}>
      //           Search Course Reviews
      //         </TabBtn>
        
      //         <Divider>|</Divider>
        
      //         <TabBtn selected={addSelected}
      //                 onClick={this.addTabClicked}>
      //           Add a Course Review
      //         </TabBtn>
        
      //         <Divider>|</Divider>
        
      //         <TabBtn selected={editSelected}
      //                 onClick={this.editTabClicked}>
      //           Edit/Delete My Reviews
      //         </TabBtn>
      //       </TabsDiv>
      //       <>
      //         {searchSelected ? <SearchReviews courses={courses}
      //                                          courseToProfs={courseToProfs} />

      //         : addSelected ? <AddReviews userID={userID}
      //                                     courses={courses}
      //                                     courseToProfs={courseToProfs} />

      //         : editSelected ? <EditReviews userID={userID}
      //                                       courses={courses}
      //                                       courseCodeToName={courseCodeToName}
      //                                       courseToProfs={courseToProfs} />
      //         : <></>}
      //       </>
      //     </>

      //   : <LoginText>Log In/Sign up to View, Add, or Edit/Delete Reviews</LoginText>}
      // </>
    )
  }
}

export default App