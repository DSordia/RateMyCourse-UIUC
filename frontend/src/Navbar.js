import { Nav, NavTitle, GoogleDiv } from './styles'
import { GoogleLogin, GoogleLogout } from 'react-google-login'

const Navbar = props => {

  const login = response => {
      //todo: stuff with response

      props.logIn()
  }

  const logout = response => {
    //window.location.reload();

    props.logOut()
  }

  return (
    <Nav>
      <NavTitle>RateMyCourse - UIUC</NavTitle>
      
      <GoogleDiv>
        {props.isLoggedIn ?
          <GoogleLogout clientId={'To-Do'}
                        buttonText='Sign Out'
                        onLogoutSuccess={logout}
                        onFailure={e => console.log(e)} />

        : <GoogleLogin clientId={'To-Do'}
                       onSuccess={login}
                       onFailure={e => console.log(e)} />}
      </GoogleDiv>
    </Nav>
  )
}

export default Navbar