import React, { Component } from 'react';
import './App.css';
import mySocket from 'socket.io-client';

class App extends Component {
    constructor(props){
        super(props);
        
        this.state = {    
            mode:0,
            username: "",
            users: [],
            allChat:[],
            myMsg:""
        }
        this.joinChat = this.joinChat.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.handleMyMsg = this.handleMyMsg.bind(this);
        this.sendChat = this.sendChat.bind(this);
    }
    
    componentDidMount(){
        //this.socket =mySocket("http://localhost:10001");
    }
    
    joinChat(){
        this.setState({
            mode:1
        })
        this.socket = mySocket("http://localhost:10001");
        this.socket.emit("username", this.state.username);
        
        this.socket.on("usersjoined", (data)=>{
           console.log(data);
            this.setState({
                users:data
            })
            
        });
        
        this.socket.on("msgsent", (data)=>{
            this.setState({
                allChat:data
            })
        })
    }
    
    handleMyMsg(evt){
        this.setState({
            myMsg:evt.target.value
        })
    }
    
    handleUsername(evt){
        this.setState({
            username:evt.target.value
        })
    }
    
    sendChat(){
        var msg = this.state.username+": "+this.state.myMsg;
        this.socket.emit("sendChat", msg);
        
    }
    
  render() {
      
      var config = null;
      
      if(this.state.mode === 0){
          config = (
            <div>
            <input type="text" placeholder="Type Username" onChange={this.handleUsername}/>
            <button onClick={this.joinChat}> Join Chat</button>

        </div>
      ) 
      
      } else if(this.state.mode === 1){
          var allChats = this.state.allChat.map((obj,i)=>{
              return(
              <div key={i}>
              {obj}
              </div>
              )
          });
          config = (
          <div id="chatBox">
              <div id='chatDisplay'>
              {allChats}
              </div>
              <div id="controls">
              <input type='text' placeholder='type your msg' onChange={this.handleMyMsg} />
              <button onClick={this.sendChat}>send chat</button>
              </div>
              </div>
          )
      }
      
    var allUsers = this.state.users.map((obj,i)=>{
        return (
            <div key={i}>
            {obj}
            </div>
        )
    })  
    return (
      <div className="App">
        {config}
        <hr />
        <div>
        Users in the chatroom right now!
        {this.state.users.join(" , ")}
        </div>
      </div>
    );
  }
}

export default App;
