import React, { Component } from 'react'
import Review from './Review'

class EditTables extends Component {

    render() {
        const { userID, courses, courseToProfs } = this.props

        return (
            <Review adding={true}
                    userID={userID}
                    courses={courses}
                    courseToProfs={courseToProfs} />
        )
    }
}

export default EditTables
