import React, { Component } from 'react';
import './App.css';
import {Stage, Layer, Rect} from 'react-konva';

import soil from './img/soil.svg';
import mine from './img/mine.svg';
import power from './img/power.svg';

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
    image.src = soil;
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
    }
  }

  selectBuilding = (building) => {
    this.setState({
      selected_building: building
    });
  }

  componentDidMount() {
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
              <TileMap size={this.props.size} tile_size={this.props.tile_size}/>
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
