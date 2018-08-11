import React, { Component } from 'react';
import './App.css';
import {Stage, Layer, Rect} from 'react-konva';

import cracked_ground from './img/cracked_ground.svg';

class Tile extends React.Component {
  state = {
    color: 'white',
    bg_img: null,
    scale: { x: this.props.tile_size / 200, y: this.props.tile_size / 200}
  }

  componentDidMount() {
    const image = new window.Image();
    image.onload = () => {
      this.setState({
        bg_img: image
      });
    }
    image.src = cracked_ground;
  }

  handleClick = () => {
    this.setState({
      bg_img: null
    });
  }

  render() {
    return (
      <Rect
        x={this.props.x} y={this.props.y} width={this.props.tile_size} height={this.props.tile_size}
        fillPatternImage={this.state.bg_img} fillPatternScale={this.state.scale}
        onClick={this.handleClick}
      />
    );
  }
}

class TileMap extends React.Component {
  state = {
    tile_size: this.props.tile_size,
    tiles: []
  }

  componentDidMount() {
    let tiles = [];
    let size = this.props.size;
    for (let i = 0; i < size; i++) {
      let row = [];
      let x = i * this.state.tile_size
      for (let j = 0; j < size; j++) {
        let y = j * this.state.tile_size
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

class StageMap extends React.Component {
    render() {
    let stage_size = this.props.size * this.props.tile_size;
    return (
      <Stage className="App-center" width={stage_size} height={stage_size}>
        <TileMap size={this.props.size} tile_size={this.props.tile_size}/>
      </Stage>
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
        <table className="App-table" border="1px">
          <tr><th>Void Map</th><th>Ressources</th></tr>
          <tr>
            <td><StageMap size={10} tile_size={50}/></td>
            <td></td>
          </tr>
        </table>
      </div>
    );
  }
}

export default App;
