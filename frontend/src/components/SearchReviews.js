import React, { Component } from 'react'
import Select from 'react-select'
import axios from 'axios'
import Review from './Review'
import { SearchDropdownDiv, DropdownHeading, SelectedCourseInfoDiv, OverallCourseRatingText,
         OverallRatingText, SearchReviewDiv, HR1, HR2, ProfessorRatingText, ReviewsHeading } from '../styles/styles'

class SearchReviews extends Component {
    state = {
        selectedCourse: '',
        reviews: [],
        overallCourseRating: null,
        profRatings: [],
        deptName: '',
        deptSize: null,
        deptAvg: null,
        numReviews: 0
    }

    onSelectCourse = async selectedCourse => {
        const reviews = await axios.get(`/getReviews/${selectedCourse.value}`)
        const courseNameAndNumReviews = await axios.get(`/getCourseNameAndNumReviews/${selectedCourse.value}`)

        // Replaced with 1 call to stored procedure
        // const ratings = await axios.get(`/getCourseRating/${selectedCourse.value}`)
        // const deptInfo = await axios.get(`/getDeptInfo/${selectedCourse.value}`)
        // const deptAvg = await axios.get(`/getAvgDeptRating/${deptInfo.data[0].DeptID}`)
        const searchResult = await axios.get(`/searchResultProcedure/${selectedCourse.value}`)

        let profRatings = []
        for (const entry of searchResult.data[1]) profRatings.push(entry.ProfRating.toFixed(2))

        let courseRating = searchResult.data[1].length > 0 ? searchResult.data[1][0].CourseRating.toFixed(2) : null
        let numReviews = courseNameAndNumReviews.data.length > 0 ? courseNameAndNumReviews.data[0].numReviews : 0

        this.setState({
            selectedCourse: selectedCourse,
            reviews: reviews.data,
            overallCourseRating: courseRating,
            profRatings: profRatings,
            deptName: searchResult.data[0][0].DeptName,
            deptSize: searchResult.data[0][0].DeptSize,
            deptAvg: searchResult.data[2][0].DeptAvg.toFixed(2),
            numReviews: numReviews
        })
    }

    render() {
        const { courses, courseToProfs, reviewsLiked, updateReviewsLiked, userID } = this.props
        const { selectedCourse, reviews, overallCourseRating, profRatings, deptName, deptSize, deptAvg, numReviews } = this.state
        const profs = courseToProfs[selectedCourse.value]

        return (
            <>
                <SearchDropdownDiv>
                    <DropdownHeading>Select Course to View Reviews For:</DropdownHeading>

                    <Select value={selectedCourse}
                            onChange={this.onSelectCourse}
                            options={courses} />
                </SearchDropdownDiv>

                {selectedCourse &&
                    <>
                        <SelectedCourseInfoDiv>
                            <span>Course: {selectedCourse.label}</span>
                            <HR2 />
                            <span>Department: {deptName}</span>
                            <HR2 />
                            <span>Department Size: {deptSize}</span>
                            <HR2 />
                            <span>Number of reviews: {numReviews}</span>
                        </SelectedCourseInfoDiv>

                        {numReviews > 0 &&
                            <>
                                <SearchReviewDiv>
                                    <OverallCourseRatingText>Overall Course Rating: {overallCourseRating} / 5</OverallCourseRatingText>
                                    <HR1 />
                                    <OverallRatingText>Department Average: {deptAvg} / 5</OverallRatingText>
                                    <HR1 />
                                    <OverallRatingText>Overall Professor Ratings:</OverallRatingText>
                                    {profs && profs.map((prof, i) => (
                                        <ProfessorRatingText key={i}>{prof.label}: {profRatings[i]} / 5</ProfessorRatingText>
                                    ))}
                                    <br />
                                </SearchReviewDiv>

                                <ReviewsHeading>Reviews:</ReviewsHeading>
                            </>}

                    {reviews.map((review, i) => (
                        <Review key={i}
                                viewing={true}
                                courseName={selectedCourse.label}
                                professorName={review.ProfessorName}
                                courseRating={review.CourseRating}
                                professorRating={review.ProfessorRating}
                                reviewText={review.ReviewText}
                                reviewID={review.ReviewID}
                                reviewsLiked={reviewsLiked}
                                likes={review.Likes}
                                dislikes={review.Dislikes}
                                updateReviewsLiked={updateReviewsLiked}
                                userID={userID} />
                    ))}
                </>}
            </>
        )
    }
}

export default SearchReviews