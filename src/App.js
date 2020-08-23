import React,{ Component } from 'react';
import {Form, Dropdown, Menu, Table} from 'semantic-ui-react'
import './App.css';
import {Line} from 'react-chartjs-2';
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      playerName: null,
      playerStats: {},
      chartData:{},
      playerKey: {},
      playerInfo:{},
      options:{}
    }
  }

  getPlayerId = () => {
    const idArr = [];
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
          idArr.push(data.data[0].id)
          this.getPlayerStats(data.data[0].id)
          this.getPlayerInfo(data.data[0].id)
        }
      })
      .catch(err => {
        console.log(err)
      })
    this.setState({
      playerKey: {
        id: idArr
      }
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
  
  getPlayerInfo = (playerId) =>{
    fetch(`https://www.balldontlie.io/api/v1/players/${playerId}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          playerInfo: {
            firstName: data["first_name"],
            lastName: data["last_name"],
            position: data["position"],
            team: data["team"]["full_name"]
          }
        })
      })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.getPlayerId()
    console.log(this.state.playerKey)
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
  handleChange = (e, newData) => {
    e.preventDefault()
    this.setState({
      [newData.name]: newData.value
    })
    console.log(newData.value)
    fetch(`https://www.balldontlie.io/api/v1/stats?seasons[]=2019&player_ids[]=${this.state.playerKey.id}&start_date='2020-07-30'&end_date='2020-08-14'`)
    .then(res => res.json())
    .then(data => {
      var labelArr = [];
      var ptsArr = [];
      var astArr = [];
      var rebArr = [];
      for(let i = 0; i < data.data.length; i++){
        labelArr.push(data.data[i]["game"]["date"].substr(0,10))
        ptsArr.push(data.data[i]["pts"])
        astArr.push(data.data[i]["ast"])
        rebArr.push(data.data[i]["reb"])
      }
      console.log(labelArr)
      if(labelArr[labelArr.length - 1] === "2020-07-30"){
        labelArr = labelArr.filter(element => element !== "2020-07-30");
        labelArr.unshift("2020-07-30")
      }
      else if(labelArr[labelArr.length - 1] === "2020-07-31"){
        labelArr = labelArr.filter(element => element !== "2020-07-31");
        labelArr.unshift("2020-07-31")
      }
      else if(labelArr.length === 0){
        alert("Player did not play in bubble")
      }
      if(newData.value === 1){
        this.setState({
          chartData: {
            key: Date.now(),
            labels: labelArr,
            datasets:[
              {
                label:"Points",
                fill: false,
                lineTension: 0.5,
                data: ptsArr,
                borderColor: "rgba(20,255,101,1)",
                backgroundColor:[
                  "rgba(20,255,101,1)"
                ]
              }
            ]
          },
          options: {
            responsive:true,
            maintainAspectRatio: false,
            scales:{
              yAxes: [{
                ticks:{
                  fontColor: "#F3F3F3",
                }
              }],
              xAxes:[{
                ticks:{
                  fontColor: '#F3F3F3'
                }
              }]
            }
          }
        })
      }
      else if(newData.value === 2){
        this.setState({
          chartData: {
            key: Date.now(),
            labels: labelArr,
            datasets:[
              {
                label:"Assists",
                fill: false,
                lineTension: 0.5,
                data: astArr,
                borderColor: "rgba(20,255,101,1)",
                backgroundColor:[
                  "rgba(20,255,101,1)"
                ]
              }
            ]
          },
          options: {
            responsive:true,
            maintainAspectRatio: false,
            scales:{
              yAxes: [{
                ticks:{
                  fontColor: "#F3F3F3",
                }
              }],
              xAxes:[{
                ticks:{
                  fontColor: '#F3F3F3'
                }
              }]
            }
          }
        })
      }
      else if(newData.value === 3){
        this.setState({
          chartData: {
            key: Date.now(),
            labels: labelArr,
            datasets:[
              {
                label:"Rebounds",
                fill: false,
                lineTension: 0.5,
                data: rebArr,
                borderColor: "rgba(20,255,101,1)",
                backgroundColor:[
                  "rgba(20,255,101,1)"
                ]
              }
            ],
          },
          options: {
            responsive:true,
            maintainAspectRatio: false,
            scales:{
              yAxes: [{
                ticks:{
                  fontColor: "#F3F3F3",
                }
              }],
              xAxes:[{
                ticks:{
                  fontColor: '#F3F3F3'
                }
              }]
            }
          }
        })
      }
    })
    .catch(err => console.log(err))
  }

  render() { 
    const options = [
      {key: 1, text: "PTS", value:1},
      {key: 2, text: "AST", value:2},
      {key: 3, text: "REB", value:3},
    ]
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
            <h2>'19 - '20 Season Averages</h2>
            <br></br>
          </div>
        </div>
        <div className="playerInfo">
          <div>
            <h3>{this.state.playerInfo.firstName} {this.state.playerInfo.lastName}</h3>
            <div>Position: {this.state.playerInfo.position} | Team: {this.state.playerInfo.team} </div>
          </div>
        </div>
        <div className="table"> 
        <Table inverted>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>GP</Table.HeaderCell>
              <Table.HeaderCell>MIN</Table.HeaderCell>
              <Table.HeaderCell>FGM</Table.HeaderCell>
              <Table.HeaderCell>FGA</Table.HeaderCell>
              <Table.HeaderCell>FGPCT</Table.HeaderCell>
              <Table.HeaderCell>FG3M</Table.HeaderCell>
              <Table.HeaderCell>FG3A</Table.HeaderCell>
              <Table.HeaderCell>FG3PCT</Table.HeaderCell>
              <Table.HeaderCell>FTM</Table.HeaderCell>
              <Table.HeaderCell>FTA</Table.HeaderCell>
              <Table.HeaderCell>FTPCT</Table.HeaderCell>
              <Table.HeaderCell>OREB</Table.HeaderCell>
              <Table.HeaderCell>DREB</Table.HeaderCell>
              <Table.HeaderCell>REB</Table.HeaderCell>
              <Table.HeaderCell>AST</Table.HeaderCell>
              <Table.HeaderCell>STL</Table.HeaderCell>
              <Table.HeaderCell>BLK</Table.HeaderCell>
              <Table.HeaderCell>TO</Table.HeaderCell>
              <Table.HeaderCell>PF</Table.HeaderCell>
              <Table.HeaderCell>PTS</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
             <Table.Row>
                <Table.Cell>{this.state.playerStats["games_played"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["min"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["fgm"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["fta"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["fg_pct"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["fg3m"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["fg3a"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["fg3_pct"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["ftm"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["fta"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["ft_pct"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["oreb"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["dreb"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["reb"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["ast"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["stl"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["blk"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["turnover"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["pf"]}</Table.Cell>
                <Table.Cell>{this.state.playerStats["pts"]}</Table.Cell>
              </Table.Row>
          </Table.Body>
        </Table>
        </div>
        <div className="chart">
          <h2>Bubble Game Stats</h2>
          <div className="dropdown">
          <Menu compact>
            <Dropdown 
              name="selectedStat"
              options={options}
              value={this.state.value}
              simple item
              onChange={this.handleChange}
            />
          </Menu>
          </div>
        <Line
          data={this.state.chartData}
          key={this.state.chartData.key}
          width={250}
          height={250}
          options={this.state.options}
        />
        </div>
      </div>
    );
  }
}
 
export default App;