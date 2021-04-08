import React, { Component } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import SearchReviews from './components/SearchReviews'
import AddReviews from './components/AddReviews'
import EditReviews from './components/EditReviews'
import EditTables from './components/EditTables'
import { LoginText, TabsDiv, TabBtn, Divider } from './styles/styles'

class App extends Component {
  state = {
    deptId: "",
    deptName: ""
  }


  handleChange = (deptId) => {
    this.setState({
      deptId: deptId
    })
  }

  handleChange2 = (deptName) => {
    this.setState({
      deptName: deptName
    })
  }

  addDeptmethod=async()=>{
    await axios.post(`/addDept`, null, { params: {deptId: this.state.deptId,
                                                  deptName: this.state.deptName} })
  }

render() {
    const { deptId, deptName } = this.state

    return (


      <div className = "form">
      <h1> CRUD App </h1>
            <label>deptId</label>

              <input type="text" value = {deptId} onChange={e => this.handleChange(e.target.value)}/>
              <label>deptName</label>

              <input type="text" value = {deptName} onChange={e => this.handleChange2(e.target.value)}/>
              <button onClick = {this.addDeptmethod} >CREATE</button>
              {/*
              <input type="text" value = {deptId} onChange={e => this.handleChange(e.target.value)}/>
              <label>deptName</label>

              <input type="text" value = {deptName} onChange={e => this.handleChange2(e.target.value)}/>
              <button>READ</button>

              <input type="text" value = {deptId} onChange={e => this.handleChange(e.target.value)}/>
              <label>deptName</label>

              <input type="text" value = {deptName} onChange={e => this.handleChange2(e.target.value)}/>
              <button>EDIT</button>

              <input type="text" value = {deptId} onChange={e => this.handleChange(e.target.value)}/>
              <label>deptName</label>

              <input type="text" value = {deptName} onChange={e => this.handleChange2(e.target.value)}/>
              <button>DELETE</button>
              */}

              <h3> {deptId} </h3>
              <h3> {deptName} </h3>
      </div>
      // <>
      //   <Navbar isLoggedIn={isLoggedIn}
      //           logIn={this.logIn}
      //           logOut={this.logOut} />
      //
      //   {isLoggedIn ?
      //     <>
      //       <TabsDiv>
      //         <TabBtn selected={searchSelected}
      //                 onClick={this.searchTabClicked}>
      //           Search Course Reviews
      //         </TabBtn>
      //
      //         <Divider>|</Divider>
      //
      //         <TabBtn selected={addSelected}
      //                 onClick={this.addTabClicked}>
      //           Add a Course Review
      //         </TabBtn>
      //
      //         <Divider>|</Divider>
      //
      //         <TabBtn selected={editSelected}
      //                 onClick={this.editTabClicked}>
      //           Edit/Delete My Reviews
      //         </TabBtn>
      //
      //         <Divider>|</Divider>
      //
      //         <TabBtn selected={tablesSelected}
      //                 onClick={this.tablesTabClicked}>
      //           Edit/Delete Tables
      //         </TabBtn>
      //       </TabsDiv>
      //       <>
      //         {searchSelected ? <SearchReviews courses={courses}
      //                                          courseToProfs={courseToProfs} />
      //
      //         : addSelected ? <AddReviews userID={userID}
      //                                     courses={courses}
      //                                     courseToProfs={courseToProfs} />
      //
      //         : editSelected ? <EditReviews userID={userID}
      //                                       courses={courses}
      //                                       courseCodeToName={courseCodeToName}
      //                                       courseToProfs={courseToProfs} />
      //
      //         : tablesSelected ? <EditTables  userID={userID}
      //                                         courses={courses}
      //                                         courseToProfs={courseToProfs}
      //                                         //deptID={deptID}
      //                                         /*deptName={deptName}*//>
      //         : <></>}
      //       </>
      //     </>
      //
      //   : <LoginText>Log In/Sign up to View, Add, or Edit/Delete Reviews</LoginText>}
      // </>
    )
  }
}

export default App
