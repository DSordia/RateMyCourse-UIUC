import React, { Component } from 'react'
import Select from 'react-select'
import axios from 'axios'
import Review from './Review'
import { SearchDropdownDiv, DropdownHeading, OverallCourseRatingText,
         OverallProfRatingText, SearchReviewDiv, HR, ProfessorRatingText } from '../styles/styles'

class SearchReviews extends Component {
    state = {
        selectedCourse: '',
        reviews: []
    }

    onSelectCourse = async selectedCourse => {
        this.setState({selectedCourse})
        const reviews = await axios.get(`/getReviews/${selectedCourse.value}`)
        this.setState({reviews: reviews.data})
    }

    render() {
        const { courses, courseToProfs } = this.props
        const { selectedCourse, reviews } = this.state
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
                    <SearchReviewDiv>
                        <OverallCourseRatingText>Overall Course Rating: 0 / 5</OverallCourseRatingText>
                        <HR />
                        <OverallProfRatingText>Overall Professor Ratings:</OverallProfRatingText>
                        {profs && profs.map((prof, i) => (
                            <ProfessorRatingText key={i}>{prof.label}: 0 / 5</ProfessorRatingText>
                        ))}
                        <br />
                    </SearchReviewDiv>}

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
            </>
        )
    }
}

export default SearchReviews