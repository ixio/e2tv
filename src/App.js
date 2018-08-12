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
      let img = (tile.type === 'void') ? null : this.props.images[tile.type].img;
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
      if (key === 'soil') {
        return null;
      }
      let className = "App-building";
      if (key === this.props.selected_building) {
        className += " App-selected"
      }
      return (
        <span onClick={() => { this.props.selectBuilding(key) }} key={key}>
          <img className={className} height={80} src={val.src} alt={key}/>
          <p className="App-priceTag">Price: {val.price} M</p>
        </span>
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
      mine: { src: mine, price: 50 },
      power: { src: power, price: 80 },
      soil: { src: soil }
    },
    tiles: [],
    mineral_count: 120,
    power_count: 0
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

    // Set Timer
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    let randomTile = (tiles) => {
      let i = Math.floor(Math.random() * this.props.size);
      let j = Math.floor(Math.random() * this.props.size);
      return tiles[i][j];
    }
    let tiles = this.state.tiles.slice();
    randomTile(tiles).type = 'void';
    let mine_count = [].concat.apply([], tiles).filter(tile => tile.type === "mine").reduce((a, r) => { return a + 1 }, 0);
    let mineral_count = this.state.mineral_count + mine_count * 2;
    let pow_count = [].concat.apply([], tiles).filter(tile => tile.type === "power").reduce((a, r) => { return a + 1 }, 0);
    let power_count = this.state.power_count + pow_count * 2;
    this.setState({
      tiles: tiles,
      mineral_count: mineral_count,
      power_count: power_count
    });
  }

  selectBuilding = (building) => {
    this.setState({
      selected_building: building
    });
  }

  buildBuilding = (i, j) => {
    if (this.state.selected_building) {
      let price = this.state.images[this.state.selected_building].price;
      if (this.state.mineral_count >= price) {
        let tiles = this.state.tiles.slice();
        tiles[i][j].type = this.state.selected_building;
        let mineral_count = this.state.mineral_count - price;
        this.setState({
          tiles: tiles,
          mineral_count: mineral_count
        });
      }
    }
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
            <p>{this.state.power_count} Energy</p>
            <p>{this.state.mineral_count} Minerals</p>
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
