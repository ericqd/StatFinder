import React,{ Component } from 'react';
import {Form, Card, Image, Icon} from 'semantic-ui-react'
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      playerName: null,
      playerStats: {}
    }
  }

  getPlayerId = () => {
    fetch(`https://www.balldontlie.io/api/v1/players?search=${this.state.playerName}`)
      .then(res => res.json())
      .then(data => {
        if(data.data[0] === undefined){
          alert("Player that you entered has not played or is injured")
        }
        else if(data.data.length > 1){
          alert("Please enter full name of the player you want to search")
        }
        else{
          this.getPlayerStats(data.data[0].id) 
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  
  getPlayerStats = (playerId) => {
    fetch(`https://www.balldontlie.io/api/v1/season_averages?season=2019&player_ids[]=${playerId}`)
      .then(res => res.json())
      .then(data => {
        console.log(data.data)
        this.setState({playerStats: data.data[0]})
      })
      .catch(err => console.log(err))
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.getPlayerId()
    console.log(this.state.playerName)
  }
  handleSearch = (e) => {
    const split = e.target.value.split(" ").join("_")
    if(split.length > 0){
      this.setState({playerName: split})
    }
    else{
      alert("Please type players name")
    }
  }

  render() { 
    return (  
      <div className="App">
        <div className="header">StatFinder</div>
        <div className="search">
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Input type="text" value={this.state.value} placeholder='Enter NBA Player...' onChange={this.handleSearch}/>
              <Form.Button content='Search' />
            </Form.Group>
          </Form>
        </div>
        <div className="card">
          <Card>
            <Card.Content extra>
              <a>
                <Icon name='user' />
                Games played: {this.state.playerStats["games_played"]} 
              </a>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name='user' />
                Points: {this.state.playerStats["pts"]} 
              </a>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name='user' />
                Rebounds: {this.state.playerStats["reb"]} 
              </a>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name='user' />
                Assists: {this.state.playerStats["ast"]} 
              </a>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name='user' />
                Field Goal %: {this.state.playerStats["fg_pct"]} 
              </a>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name='user' />
                3 Point %: {this.state.playerStats["fg3_pct"]} 
              </a>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name='user' />
                Free Throw %: {this.state.playerStats["ft_pct"]} 
              </a>
            </Card.Content>
          </Card>
        </div>
      </div>
    );
  }
}
 
export default App;