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
    reviewsLiked: {}
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

  logIn = async userID => {
    const likedReviews = await axios.get(`/getLikedReviews/${userID}`)

    let reviewsLiked = {}
    for (const entry of likedReviews.data) reviewsLiked[entry.ReviewID] = entry.Liked

    this.setState({
      isLoggedIn: true,
      userID: userID,
      reviewsLiked: reviewsLiked
    })
  }

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
    window.location.reload()
  }

  updateReviewsLiked = reviewsLiked => this.setState({reviewsLiked: reviewsLiked})

  /* Update screen based on tab clicked */
  searchTabClicked = () => this.setState({searchSelected: true, addSelected: false, editSelected: false})
  addTabClicked = () => this.setState({searchSelected: false, addSelected: true, editSelected: false})
  editTabClicked = () => this.setState({searchSelected: false, addSelected: false, editSelected: true})

  render() {
    const { isLoggedIn, userID, courses, courseToProfs, searchSelected, addSelected, editSelected, courseCodeToName, reviewsLiked } = this.state

    return (
      <>
        <Navbar isLoggedIn={isLoggedIn}
                logIn={this.logIn}
                logOut={this.logOut} />

        {isLoggedIn ?
          <>        
            <TabsDiv>
              <TabBtn selected={searchSelected}
                      onClick={this.searchTabClicked}>
                Search Course Reviews
              </TabBtn>
        
              <Divider>|</Divider>
        
              <TabBtn selected={addSelected}
                      onClick={this.addTabClicked}>
                Add a Course Review
              </TabBtn>
        
              <Divider>|</Divider>
        
              <TabBtn selected={editSelected}
                      onClick={this.editTabClicked}>
                Edit/Delete My Reviews
              </TabBtn>
            </TabsDiv>
            <>
              {searchSelected ? <SearchReviews courses={courses}
                                               courseToProfs={courseToProfs}
                                               reviewsLiked={reviewsLiked}
                                               updateReviewsLiked={this.updateReviewsLiked}
                                               userID={userID} />

              : addSelected ? <AddReviews userID={userID}
                                          courses={courses}
                                          courseToProfs={courseToProfs} />

              : editSelected ? <EditReviews userID={userID}
                                            courses={courses}
                                            courseCodeToName={courseCodeToName}
                                            courseToProfs={courseToProfs} />
              : <></>}
            </>
          </>

        : <LoginText>Log In/Sign up to View, Add, or Edit/Delete Reviews</LoginText>}
      </>
    )
  }
}

export default App