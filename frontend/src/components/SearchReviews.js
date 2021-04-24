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
        this.setState({selectedCourse})

        const reviews = await axios.get(`/getReviews/${selectedCourse.value}`)
        const avgCourseRating = await axios.get(`/getAvgCourseRating/${selectedCourse.value}`)
        const avgProfRatings = await axios.get(`/getAvgProfessorRatings/${selectedCourse.value}`)
        const avgDeptRating = await axios.get(`/getAvgDeptRating/${selectedCourse.value}`)
        const deptInfo = await axios.get(`/getDeptInfo/${selectedCourse.value}`)
        const courseNameAndNumReviews = await axios.get(`/getCourseNameAndNumReviews/${selectedCourse.value}`)

        let profRatings = []
        for (const entry of avgProfRatings.data) {
            if (entry.AvgProfessorRating !== null) {
                profRatings.push(entry.AvgProfessorRating.toFixed(2))
            } else {
                profRatings.push(null)
            }
        }

        let numReviews = courseNameAndNumReviews.data.length > 0 ? courseNameAndNumReviews.data[0].numReviews : 0

        this.setState({
            reviews: reviews.data,
            overallCourseRating: avgCourseRating.data[0].AvgCourseRating,
            profRatings: profRatings,
            deptName: deptInfo.data[0].DeptName,
            deptSize: deptInfo.data[0].deptSize,
            deptAvg: avgDeptRating.data[0].AvgDepartmentRating,
            numReviews: numReviews
        })
    }

    render() {
        const { courses, courseToProfs } = this.props
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
                                reviewID={review.ReviewID} />
                    ))}
                </>}
            </>
        )
    }
}

export default SearchReviews