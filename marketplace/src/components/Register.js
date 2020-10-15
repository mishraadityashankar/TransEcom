import React, { Component } from 'react';
import axios from 'axios';
class Register extends Component {
    constructor(props){
        super(props);
        this.onChangeAddress=this.onChangeAddress.bind(this);
        this.onChangeName=this.onChangeName.bind(this);
        this.onChangeContact=this.onChangeContact.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
  
        this.state = {
            name : '',
            address : '',
            contact : ''
        }
    }
  
    onChangeName(e){
        this.setState({
            name: e.target.value
        });}

    onChangeAddress(e){
        this.setState({
            address: e.target.value
        });
    }
    onChangeContact(e){
        this.setState({
            contact: e.target.value
        });
    }
  
    onSubmit(e){
      e.preventDefault();
  
      const nw_user={
  
          _id: this.props.account,
          name : this.state.name,
          address: this.state.address,
          contact: this.state.contact
      }
  
      axios.post('/user/register', nw_user)
      .then(res =>{
       alert("Registration Successful")
       this.props.history.push('/');
       window.location.reload();
        
      }).catch(
          (err)=> {console.log(err)
        });
  
       
  
      this.setState({
          name:'',
          address:'',
          contact:'',
      })
    }
    render() {
        return (
        <div class="container pt-5 pb-5 pr-5 pl-5">
        <h2 class="text-center">Register</h2>
        <div class="row">
            <div class="col-3"></div>
            <div class="col-6 card pt-5 pb-5 pr-5 pl-5">
                <form onSubmit={this.onSubmit}>
                    <div class="form-group">
                        <label for="name">Name:</label>
                            <input type="text" class="form-control" id="name" placeholder="Enter name" value={this.state.name} 
                                onChange={this.onChangeName} name="name"/>
                    </div>
                    <div class="form-group">
                        <label for="address">Address:</label>
                            <input type="text" class="form-control" id="address" placeholder="Enter address" value={this.state.address}
                                onChange={this.onChangeAddress} name="address"/>
                    </div>
                    <div class="form-group">
                        <label for="contact">Contact:</label>
                            <input type="tel" class="form-control" id="" value={this.state.contact} placeholder="Enter contact"
                                onChange={this.onChangeContact} name="contact"/>
                    </div>
                    <br/>
                    <button type="submit" class="btn btn-primary btn-block">Register</button>
                </form>
            </div>
            <div class="col-3"></div>
        </div>
        </div>
        );
    }
}

export default Register;