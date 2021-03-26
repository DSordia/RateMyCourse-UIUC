import React, { useState } from 'react'
import Navbar from './Navbar'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const logIn = () => setIsLoggedIn(true)
  const logOut = () => setIsLoggedIn(false)

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn}
              logIn={logIn}
              logOut={logOut} />

      <h1>RateMyCourse - UIUC Web Application</h1>
    </div>
  )
}

export default App