import React, { Component } from 'react';
import './App.css';
import {Stage, Layer, Rect} from 'react-konva';

import soil from './img/soil.svg';
import mine from './img/mine.svg';
import power from './img/power.svg';

class Tile extends React.Component {
  state = {
    scale: { x: this.props.tile_size / 200, y: this.props.tile_size / 200}
  }

  render() {
    return (
      <Rect
        x={this.props.x} y={this.props.y} width={this.props.tile_size} height={this.props.tile_size}
        fillPatternImage={this.props.img} fillPatternScale={this.state.scale}
        onClick={this.props.handleClick}
      />
    );
  }
}

class TileMap extends React.Component {
  render() {
    const tiles = [].concat.apply([], this.props.tiles).map(tile => {
      let img = this.props.images[tile.type].img;
      let handleClick = () => {
        this.props.buildBuilding(tile.i, tile.j)
      };
      return (
        <Tile key={tile.i + '-' + tile.j} x={tile.x} y={tile.y} tile_size={this.props.tile_size} img={img} handleClick={handleClick}/>
      );
    })
    return (
      <Layer>
        {tiles}
      </Layer>
    );
  }
}

class Buildings extends React.Component {
  render() {
    let buildings = Object.entries(this.props.images).map(([key, val]) => {
      let className = "App-building";
      if (key === this.props.selected_building) {
        className += " App-selected"
      }
      return (
        <span onClick={() => { this.props.selectBuilding(key) }} key={key}><img className={className} height={80} src={val.src} alt={key}/></span>
      );
    });
    return (
      <div>
        {buildings}
      </div>
    );
  }

}

class Game extends React.Component {
  state = {
    selected_building: null,
    images: {
      mine: { src: mine },
      power: { src: power },
      soil: { src: soil }
    },
    tiles: []
  }

  selectBuilding = (building) => {
    this.setState({
      selected_building: building
    });
  }

  buildBuilding = (i, j) => {
    if (this.state.selected_building) {
      let tiles = this.state.tiles.slice();
      tiles[i][j].type = this.state.selected_building;
      this.setState({
        tiles: tiles
      });
    }
  }

  componentDidMount() {
    // Load Images
    const loadImage = (img_name) => {
      const images = Object.assign({}, this.state.images);
      const image = new window.Image();
      images[img_name].img = image;
      image.onload = () => {
        this.setState({
          images: images
        });
      }
      image.src = images[img_name].src;
    }
    loadImage('mine');
    loadImage('power');
    loadImage('soil');

    // Generate Tiles
    let tiles = [];
    let size = this.props.size;
    for (let i = 0; i < size; i++) {
      let row = [];
      let x = i * this.props.tile_size
      for (let j = 0; j < size; j++) {
        let y = j * this.props.tile_size
        row.push({i: i, j: j, x: x, y: y, type: 'soil'});
      }
      tiles.push(row);
    }
    this.setState({
      tiles: tiles
    });
  }

  render() {
    let stage_size = this.props.size * this.props.tile_size;
    return (
      <table className="App-table" border="1px">
      <tbody>
        <tr><th>Void Map</th><th>Ressources</th></tr>
        <tr>
          <td rowSpan={3}>
            <Stage className="App-center" width={stage_size} height={stage_size}>
              <TileMap tiles={this.state.tiles} tile_size={this.props.tile_size} images={this.state.images} buildBuilding={this.buildBuilding}/>
            </Stage>
          </td>
          <td>
            <p>0 Energy</p>
            <p>0 Minerals</p>
          </td>
        </tr>
        <tr><th>Construction</th></tr>
        <tr><td><Buildings selected_building={this.state.selected_building} images={this.state.images} selectBuilding={this.selectBuilding}/></td></tr>
      </tbody>
      </table>
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
        <Game size={10} tile_size={50}/>
      </div>
    );
  }
}

export default App;
