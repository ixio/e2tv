import React, { Component } from 'react';
import Konva from 'konva';
import './App.css';
import {Layer, Rect, Stage} from 'react-konva';

class Tile extends React.Component {
  state = {
    color: 'green'
  }

  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    });
  }

  render() {
    return (
      <Rect
        x={this.props.x} y={this.props.y} width={this.props.tile_size} height={this.props.tile_size}
        fill={this.state.color}
        onClick={this.handleClick}
      />
    );
  }
}

class TileMap extends React.Component {
  state = {
    tile_size: 49,
    tile_border_size: 1,
    tiles: []
  }

  componentDidMount() {
    let tiles = [];
    let size = this.props.size;
    for (let i = 0; i < size; i++) {
      let row = [];
      let x = i * this.state.tile_size + (i + 1) * this.state.tile_border_size
      for (let j = 0; j < size; j++) {
        let y = j * this.state.tile_size + (j + 1) * this.state.tile_border_size
        row.push({i: i, j: j, x: x, y: y});
      }
      tiles.push(row);
    }
    this.setState({
      tiles: tiles
    });
  }

  render() {
    const tiles = [].concat.apply([], this.state.tiles).map(tile => {
      return (
        <Tile key={tile.i + '-' + tile.j} x={tile.x} y={tile.y} tile_size={this.state.tile_size}/>
      );
    })
    return (
      <Layer>
        {tiles}
      </Layer>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Escape through the Void</h1>
        </header>
        <p className="App-intro">
          Your world is dead, you must travel through rifts in the Void in order to find a new world for your people.
        </p>
        <Stage className="App-center" width={500} height={500}>
          <TileMap size={10}/>
        </Stage>
      </div>
    );
  }
}

export default App;
