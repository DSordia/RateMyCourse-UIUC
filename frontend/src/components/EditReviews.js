import React, { Component } from 'react'
import axios from 'axios'
import Select from 'react-select'
import Review from './Review'
import { SearchDropdownDiv, DropdownHeading } from '../styles/styles'

class EditReviews extends Component {
    state = {
        selectedReview: '',
        course: '',
        professor: '',
        classRating: '',
        profRating: '',
        reviewText: '',
        reviewID: '',
        reviewOptions: [],
        userReviews: []
    }

    async componentDidMount() {
        this.updateReviews()
    }

    updateReviews = async selectedReview => {
        const userReviews = await axios.get(`/getUserReviews/${this.props.userID}`)

        let reviewOptions = []

        for (const review of userReviews.data) {
          let reviewEntry = {
            value: review.ReviewID,
            label: `Review for ${review.CourseCode} w/ ${review.ProfessorName}`
          }
          reviewOptions.push(reviewEntry)
        }

        this.setState({
            userReviews: userReviews.data,
            reviewOptions: reviewOptions,
            selectedReview: selectedReview
        })
    }

    onSelectReview = selectedReview => {
        const { courseCodeToName } = this.props

        for (const review of this.state.userReviews) {
            if (review.ReviewID === selectedReview.value) {
                // Update values that get passed to review
                this.setState({
                    selectedReview: selectedReview,
                    course: {value: review.CourseCode,
                             label: `${review.CourseCode}: ${courseCodeToName[review.CourseCode]}`},
                    professor: {value: review.ProfessorName,
                                label: review.ProfessorName},
                    classRating: {value: review.CourseRating,
                                  label: review.CourseRating},
                    profRating: {value: review.ProfessorRating,
                                 label: review.ProfessorRating},
                    reviewText: review.ReviewText,
                    reviewID: review.ReviewID
                })
                break
            }
        }
    }

    removeReviewOption = reviewID => {
        let reviewOptions = this.state.reviewOptions.filter((val => val.value !== reviewID))
        this.setState({
            reviewOptions: reviewOptions,
            selectedReview: '',
            reviewID: ''
        })
    }

    render() {
        const { courses, courseToProfs } = this.props
        
        const { selectedReview, course, professor, classRating, profRating,
                reviewText, reviewID, reviewOptions } = this.state

        return (
            <>
                <SearchDropdownDiv>
                    <DropdownHeading>Select Review to Edit/Delete:</DropdownHeading>

                    <Select value={selectedReview}
                            onChange={this.onSelectReview}
                            options={reviewOptions} />
                </SearchDropdownDiv>

                <Review editing={true}
                        courses={courses}
                        course={course}
                        professor={professor}
                        classRating={classRating}
                        profRating={profRating}
                        reviewText={reviewText}
                        courseToProfs={courseToProfs}
                        reviewID={reviewID}
                        removeReviewOption={this.removeReviewOption}
                        updateReviews={this.updateReviews} />
            </>
        )
    }
}

export default EditReviews