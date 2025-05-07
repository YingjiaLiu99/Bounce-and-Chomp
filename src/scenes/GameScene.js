import { GameConfig } from '../constants/GameConfig.js';
import levelData from '../levels/level1.json';
import PhysicsEngine from '../engine/PhysicsEngine.js';
import { UserBall, EnemyBall } from '../entities/Ball.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('scene-game');
  }

  preload() {}

  create() {
    const { x, y, radius, mass } = levelData.userBall;
    this.userBall = new UserBall(x, y, radius, mass);

    this.enemyBalls = levelData.enemies.map(data =>
      new EnemyBall(data.x, data.y, data.radius, data.mass)
    );

    this.graphics = this.add.graphics();

    this.input.on('pointerdown', (pointer) => {
      this.userBall.vx = (pointer.x - this.userBall.x) * 0.01;
      this.userBall.vy = (pointer.y - this.userBall.y) * 0.01;
    });
  }

  update(time, delta) {
    const deltaTime = delta / 1000;

    this.userBall.updatePosition(deltaTime);
    PhysicsEngine.applyFriction(this.userBall, GameConfig.frictionFactor, deltaTime);
    PhysicsEngine.reflectIfHitWall(this.userBall, levelData.canvas.width, levelData.canvas.height, GameConfig.bounceDamping);

    this.enemyBalls = this.enemyBalls.filter(enemy => {
      if (PhysicsEngine.checkCollision(this.userBall, enemy)) {
        if (this.userBall.mass >= enemy.mass) {
          this.userBall.grow(enemy.mass);
          this.userBall.vx = 0;
          this.userBall.vy = 0;
          return false; // remove eaten enemy
        } else {
          console.log('Game Over!');
          this.scene.restart();
        }
      }
      return true;
    });

    this.draw();
  }

  draw() {
    this.graphics.clear();

    this.graphics.fillStyle(0x00ff00);
    this.graphics.fillCircle(this.userBall.x, this.userBall.y, this.userBall.radius);

    this.graphics.fillStyle(0xff0000);
    for (const enemy of this.enemyBalls) {
      this.graphics.fillCircle(enemy.x, enemy.y, enemy.radius);
    }
  }
}
