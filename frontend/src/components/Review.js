import React, { Component } from 'react'
import Select from 'react-select'
import { CSSTransition } from 'react-transition-group'
import axios from 'axios'
import consts from '../constants'
import AreYouSureModal from './AreYouSureModal'
import { SearchReviewDiv, SearchReviewHeading, ProfessorText, HR, ReviewRatingText,
         ProfessorRatingText, ReviewText, DropdownDiv, ReviewHeading, ReviewDiv,
         ReviewTextArea, SubmitButton, AfterSubmit, DeleteButton } from '../styles/styles'

class Review extends Component {
    state = {
        course: '',
        professor: '',
        classRating: '',
        profRating: '',
        newReviewText: '',
        reviewID: '',
        reviewAdded: false,
        changesSaved: false,
        showAreYouSureModal: false
    }

    static getDerivedStateFromProps(props, state) {
        // Initialize state with existing review info
        if (props.editing && props.reviewID !== state.reviewID) {
            return {
                course: props.course,
                professor: props.professor,
                classRating: props.classRating,
                profRating: props.profRating,
                newReviewText: props.reviewText,
                reviewID: props.reviewID
            }
        } else {
            return null
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Remove text below submit button once user does something
        if (prevProps.editing && prevState.changesSaved) {
            this.setState({changesSaved: false})
        } else if (prevProps.adding && prevState.reviewAdded) {
            this.setState({reviewAdded: false})
        }
    }

    onAddReview = async () => {
        const { userID } = this.props
        const { course, professor, classRating, profRating, newReviewText } = this.state

        // Need better way to do this..
        const reviewID = Math.floor(Math.random() * 2147482647) + 1000

        const params = {
            reviewID: reviewID,
            reviewText: newReviewText,
            courseRating: classRating.value,
            professorRating: profRating.value,
            courseCode: course.value,
            professorName: professor.label,
            userID: userID
        }

        await axios.get('/addReview', { params: params })
        
        this.setState({
            course: '',
            professor: '',
            classRating: '',
            profRating: '',
            newReviewText: '',
            reviewAdded: true
        })
    }

    onEditReview = async () => {
        const { course, professor, classRating, profRating, newReviewText, reviewID } = this.state

        const params = {
            reviewID: reviewID,
            reviewText: newReviewText,
            courseRating: classRating.value,
            professorRating: profRating.value,
            courseCode: course.value,
            professorName: professor.label
        }

        await axios.get('/editReview', { params: params })

        await this.props.updateReviews({value: course.value, label: course.label})
        
        this.setState({changesSaved: true})
    }

    onDeleteReview = async () => {
        const reviewID = this.props.reviewID

        await axios.get(`/deleteReview/${reviewID}`)

        this.props.removeReviewOption(reviewID)

        this.setState({
            course: '',
            professor: '',
            classRating: '',
            profRating: '',
            newReviewText: '',
            reviewID: ''
        })
    }

    /* Modal for confirming review deletion */
    openAreYouSureModal = () => this.setState({showAreYouSureModal: true})
    closeAreYouSureModal = () => this.setState({showAreYouSureModal: false})

    /* Update state of dropdowns / text box */
    onSelectCourse = course => this.setState({course: course, professor: ''})
    onSelectProfessor = professor => this.setState({professor: professor})
    onSelectClassRating = classRating => this.setState({classRating: classRating})
    onSelectProfRating = profRating => this.setState({profRating: profRating})
    onTypeReview = reviewText => this.setState({newReviewText: reviewText})

    render() {
        const { viewing, adding, editing, courseName, professorName, courseRating,
                professorRating, reviewText, courses, courseToProfs, reviewID } = this.props

        const { course, professor, classRating, profRating, newReviewText, reviewAdded,
                changesSaved, showAreYouSureModal } = this.state

        const submitDisabled = !course || !professor || !classRating || !profRating || !newReviewText

        const profOptions = course ? courseToProfs[course.value] : []

        return (
            <>
                {viewing ?
                    <SearchReviewDiv>
                        <SearchReviewHeading>{courseName}</SearchReviewHeading>
                        <ProfessorText>Professor: {professorName}</ProfessorText>
                        <HR />
                        <ReviewRatingText>Class Rating: {courseRating} / 5</ReviewRatingText>
                        <ProfessorRatingText>Professor Rating: {professorRating} / 5</ProfessorRatingText>
                        <HR />
                        <ReviewText>{reviewText}</ReviewText>
                    </SearchReviewDiv>

                : adding || (editing && course) ?
                    <>
                        <ReviewDiv>
                            <ReviewHeading>
                                {adding ? 'Add Review For:' : editing ? 'Change Course Being Reviewed:' : ''}
                            </ReviewHeading>

                            {editing &&
                                <>
                                    <DeleteButton onClick={this.openAreYouSureModal}>
                                        Delete Review
                                    </DeleteButton>
                                    
                                    <CSSTransition in={showAreYouSureModal}
                                                   key={reviewID}
                                                   timeout={500}
                                                   classNames='fadeModal'
                                                   unmountOnExit>
                                                       <AreYouSureModal closeAreYouSureModal={this.closeAreYouSureModal}
                                                                        delete={this.onDeleteReview}
                                                                        show={showAreYouSureModal} />
                                    </CSSTransition>
                                </>}

                            <DropdownDiv>
                                <Select value={course}
                                        onChange={this.onSelectCourse}
                                        options={courses} />
                            </DropdownDiv>

                            <ReviewHeading>Professor:</ReviewHeading>
                            <DropdownDiv>
                                <Select value={professor}
                                        onChange={this.onSelectProfessor}
                                        options={profOptions} />
                            </DropdownDiv>

                            <ReviewHeading>Class Rating Out of 5</ReviewHeading>
                            <DropdownDiv>
                                <Select value={classRating}
                                        onChange={this.onSelectClassRating}
                                        options={consts.RATING_OPTIONS} />
                            </DropdownDiv>

                            <ReviewHeading>Professor Rating Out of 5:</ReviewHeading>
                            <DropdownDiv>
                                <Select value={profRating}
                                        onChange={this.onSelectProfRating}
                                        options={consts.RATING_OPTIONS} />
                            </DropdownDiv>

                            <ReviewHeading>Review Text: (limit 1000 characters)</ReviewHeading>
                            <ReviewTextArea value={newReviewText}
                                            maxLength={1000}
                                            onChange={e => this.onTypeReview(e.target.value)}/>
                        </ReviewDiv>

                        <SubmitButton isDisabled={submitDisabled}
                                   onClick={!submitDisabled && adding ? this.onAddReview
                                           : !submitDisabled && editing ? this.onEditReview
                                           : () => {/*disabled, so do nothing*/}}>
                                       {adding ? 'Add Review' : 'Save Changes'}
                        </SubmitButton>

                        <AfterSubmit>
                            {adding && reviewAdded ? 'Review added.' : editing && changesSaved ? 'Changes saved.' : ''}
                        </AfterSubmit>
                    </>
                : <></>}
            </>
        )
    }
}

export default Review