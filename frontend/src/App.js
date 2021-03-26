import React, { useState } from 'react'
import Navbar from './Navbar'
import SearchReviews from './SearchReviews'
import AddReviews from './AddReviews'
import EditReviews from './EditReviews'
import { TabsDiv, TabBtn, Divider } from './styles'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchSelected, setSearchSelected] = useState(true)
  const [addSelected, setAddSelected] = useState(false)
  const [editSelected, setEditSelected] = useState(false)

  const logIn = () => setIsLoggedIn(true)
  const logOut = () => setIsLoggedIn(false)

  const searchTabClicked = () => {
    setSearchSelected(true)
    setAddSelected(false)
    setEditSelected(false)
  }

  const addTabClicked = () => {
    setSearchSelected(false)
    setAddSelected(true)
    setEditSelected(false)
  }

  const editTabClicked = () => {
    setSearchSelected(false)
    setAddSelected(false)
    setEditSelected(true)
  }

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn}
              logIn={logIn}
              logOut={logOut} />

      <TabsDiv>
        <TabBtn selected={searchSelected}
                onClick={searchTabClicked}>
          Search Course Reviews
        </TabBtn>

        <Divider>|</Divider>

        <TabBtn selected={addSelected}
                onClick={addTabClicked}>
          Add a Course Review
        </TabBtn>

        <Divider>|</Divider>

        <TabBtn selected={editSelected}
                onClick={editTabClicked}>
          Edit/Delete My Reviews
        </TabBtn>
      </TabsDiv>

      <div>
        {searchSelected ?
          <SearchReviews />
        : addSelected ?
          <AddReviews />
        : <EditReviews />}
      </div>

    </div>
  )
}

export default App