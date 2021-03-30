import axios from 'axios'
import { Nav, NavTitle, GoogleDiv } from '../styles/styles'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import dotenv from 'dotenv'
dotenv.config()

const Navbar = props => {
  
  const logIn = async response => {
    const userID = response.googleId
    await axios.post(`/loginSignupUser`, null, { params: {userID: userID,
                                                          email: response.profileObj.email} })
    props.logIn(userID)
  }

  const logOut = () => props.logOut()

  return (
    <Nav>
      <NavTitle>RateMyCourse - UIUC</NavTitle>
      
      <GoogleDiv>
        {props.isLoggedIn ?
          <GoogleLogout clientId={process.env.REACT_APP_GOOGLE_ID}
                        buttonText='Sign Out of Google'
                        onLogoutSuccess={logOut}
                        onFailure={e => console.log(e)} />

        : <GoogleLogin clientId={process.env.REACT_APP_GOOGLE_ID}
                       buttonText='Sign In with Google'
                       onSuccess={logIn}
                       onFailure={e => console.log(e)} />}
      </GoogleDiv>
    </Nav>
  )
}

export default Navbar