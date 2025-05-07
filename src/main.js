import Phaser, { Physics } from 'phaser';
import GameScene from './scenes/GameScene';
import levelData from './levels/level1.json';
import './style.css';

const config = {
  type: Phaser.WEBGL,
  width: levelData.canvas.width,
  height: levelData.canvas.height,
  backgroundColor: '#1d1d1d',
  scene: [GameScene],
  canvas: document.getElementById('gameCanvas')
};

const game = new Phaser.Game(config);