import React from 'react';
import socketIOClient from "socket.io-client";
import './TweetList.css'


class TweetList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
       items: [],
       searchTerm: "JavaScript" };

   
  }

  handleChange=(event) =>{
    this.setState({ searchTerm: event.target.value });
  }


  onClick=()=> {
    let term = this.state.searchTerm;
    fetch("/setSearchTerm",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ term })
      })
  }


  componentDidMount() {
    const socket = socketIOClient('http://localhost:3000/');

    socket.on('connect', () => {
      console.log("Socket Connected");
      socket.on("tweets", data => {
       let newList = [data].concat(this.state.items);
        this.setState({ items: newList });
      });
    });
    socket.on('disconnect', () => {
      socket.off("tweets")
      socket.removeAllListeners("tweets");
      console.log("Socket Disconnected");
    });
  }


  render() {
    let items = this.state.items;
   
    return (
      <div>
        <div className="searchText">
          <input type="text" name={this.state.searchTerm} onChange={this.handleChange} />
          <button onClick={this.onClick}>Search</button>
        </div>
        {items ?
          items.map((item) => {
            return (
              <div className="card" >
              <p>{item.text}</p>
                <div classname="imageText">
                  <h3>{item.user.name}</h3>
                  <h4>{item.created_at}</h4>
                </div>
              </div>
            )

          }) : <div>No Data</div>
        }
      </div>
    );
  }
}



export default TweetList;