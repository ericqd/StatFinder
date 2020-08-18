import React,{ Component } from 'react';
import {Form, Card, Icon} from 'semantic-ui-react'
import './App.css';
import {Line} from 'react-chartjs-2';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      playerName: null,
      playerStats: {},
      chartData:{},
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
          this.getChartData(data.data[0].id)
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
  getChartData = (playerId) => {
    var labelArr = [];
    var dataArr = [];
    fetch(`https://www.balldontlie.io/api/v1/stats?seasons[]=2019&player_ids[]=${playerId}&start_date='2020-07-30'&end_date='2020-08-14'`)
    .then(res => res.json())
    .then(data => {
      for(let i = 0; i < data.data.length; i++){
        labelArr.push(data.data[i]["game"]["date"])
        dataArr.push(data.data[i]["pts"])
      }
      })
    .catch(err => console.log(err))
    this.setState({
      chartData: {
        key: Date.now(),
        labels: labelArr,
        datasets:[
          {
            label:"Points",
            fill: false,
            lineTension: 0.5,
            data: dataArr,
            borderColor: "rgba(0,0,0,1)",
            backgroundColor:[
              'rgba(255,99,132,0.6)',
              'rgba(54,162,235,0.6)',
              'rgba(255,206,86,0.6)',
              'rgba(75,192,192,0.6)',
              'rgba(153,159,64,0.6)',
              'rgba(255,99,132,0.6)'
            ]
          }
        ]
      }
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.getPlayerId()
    console.log(this.state.playerName)
    console.log(this.state.playerStats)
    console.log(this.state.chartData)
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
        <div className="cardHeader"> 
          <div>
            <h3>'19 - '20 Season Averages</h3>
            <br></br>
          </div>
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
        <div className="chart">
          <h3>Bubble Game Stats</h3>
        <Line
          data={this.state.chartData}
          key={this.state.chartData.key}
          width={100}
          height={100}
          options={{responsive:true}}
        />
        </div>
      </div>
    );
  }
}
 
export default App;