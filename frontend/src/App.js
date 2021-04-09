import React, { Component } from 'react'
import Navbar from './components/Navbar'
import SearchReviews from './components/SearchReviews'
import AddReviews from './components/AddReviews'
import EditReviews from './components/EditReviews'
import EditTables from './components/EditTables'
import { LoginText, TabsDiv, TabBtn, Divider } from './styles/styles'
import axios from 'axios';

class App extends Component {
  state = {
    deptIdCreate: "",
    deptNameCreate: "",
    deptIdSearch: "",
    deptNameSearch: "",
    deptIdDelete: "",
    deptIdUpdate: "",
    deptNameUpdate: "",
    deptData:[]

  }


  handleChange = (deptIdCreate) => {
    this.setState({
      deptIdCreate: deptIdCreate
    })
  }

  handleChange2 = (deptNameCreate) => {
    this.setState({
      deptNameCreate: deptNameCreate
    })
  }

  handleChange3 = (deptIdSearch) => {
    this.setState({
      deptIdSearch: deptIdSearch
    })
  }

  handleChange4 = (deptNameSearch) => {
    this.setState({
      deptNameSearch: deptNameSearch
    })
  }

  handleChange5 = (deptNameUpdate) => {
    this.setState({
      deptNameUpdate: deptNameUpdate
    })
  }


  addDeptmethod=async()=>{
    const data1 = await axios.post(`/addDept`, null, { params: {deptId: this.state.deptIdCreate,
                                                      deptName: this.state.deptNameCreate} })
          console.log(data1)
  }

  searchDeptmethod=async()=>{
    const data2 = await axios.get(`/searchDept/${this.state.deptIdSearch}`)
          console.log(data2)
          this.setState({
            deptData: data2.data
          })

  }

  deleteDept= async(deptIdDelete)=>{
    const data3 = await axios.delete(`/deleteDept/${deptIdDelete}`)
          console.log(data3)
  }

  updateDept=async(deptIdUpdate)=>{
    const data4 = await axios.patch(`/updateDept`, null, { params: {deptId: deptIdUpdate,
                                                                  deptName: this.state.deptNameUpdate} })
          console.log(data4)
  }

render() {
    const { deptIdCreate, deptNameCreate, deptIdSearch, deptNameSearch, deptData, deptNameUpdate, deptIdUpdate} = this.state

    return (


      <div className = "form">
        <h1> CRUD App </h1>
          <div>
              <label>deptId1</label>
              <input type="text" value = {deptIdCreate} onChange={e => this.handleChange(e.target.value)}/>
              <label>deptName1</label>

              <input type="text" value = {deptNameCreate} onChange={e => this.handleChange2(e.target.value)}/>
              <button onClick = {this.addDeptmethod} >CREATE</button>
          </div>

              {/*NEED TO change to SEARCH*/}
          <div>
              <label>deptId2</label>
              <input type="text" value = {deptIdSearch} onChange={e => this.handleChange3(e.target.value)}/>
              <button onClick = {this.searchDeptmethod} >READ</button>
          </div>
          {deptData.map((val, i) => (
              <div key = {i}>
              <div className = "card">
                <h1> Department ID: {val.DeptID} </h1>
                <p>Department Name: {val.DeptName}</p>
                <button onClick={() => { this.deleteDept(val.DeptID) }}> Delete</button>
                <input type="text" value = {deptNameUpdate} id="Update Department Name" onChange={(e) => this.handleChange5(e.target.value)}/>
                <button onClick={() => { this.updateDept(val.DeptID)}}> Update</button>
                </div>
              </div>
          ))}
    </div>

    )
  }
}

export default App
