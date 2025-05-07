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
    this.strengthBar = this.add.graphics({ x: 0, y: 0 });
    this.arrowGraphics = this.add.graphics({ x: 0, y: 0 });
    this.strengthText = this.add.text(0, 0, '', {
        fontSize: '14px',
        color: '#ffffff',
        fontFamily: 'Arial',
        backgroundColor: '#000000aa',
        padding: { x: 4, y: 2 }
    });

    this.strengthText.setVisible(false);
    this.isDragging = false;
    this.dragStart = null;

    this.input.on('pointerdown', (pointer) => {
      const dx = pointer.x - this.userBall.x;
      const dy = pointer.y - this.userBall.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.userBall.radius + 10) {
        this.isDragging = true;
        this.dragStart = { x: pointer.x, y: pointer.y };
      }
    });

    this.input.on('pointermove', (pointer) => {
      if (!this.isDragging) return;

      const dragVec = {
        x: pointer.x - this.dragStart.x,
        y: pointer.y - this.dragStart.y,
      };
      const dragDistance = Math.sqrt(dragVec.x ** 2 + dragVec.y ** 2);
      const canvasDiagonal = Math.sqrt(levelData.canvas.width ** 2 + levelData.canvas.height ** 2);
      const normalizedStrength = dragDistance / canvasDiagonal;

      this.drawStrengthBar(normalizedStrength);
      this.drawDirectionArrow(pointer);

      // show strength number
      this.strengthText.setVisible(true);
      this.strengthText.setText(`${Math.round(normalizedStrength * 100)}%`);
      this.strengthText.setPosition(this.userBall.x + 60, this.userBall.y - this.userBall.radius - 25);
    });

    this.input.on('pointerup', (pointer) => {
      if (!this.isDragging) return;

      this.strengthBar.clear();
      this.arrowGraphics.clear();
      this.strengthBar.setVisible(false);
      this.arrowGraphics.setVisible(false);
      this.strengthText.setVisible(false);
      this.isDragging = false;

      const dx = this.dragStart.x - pointer.x;
      const dy = this.dragStart.y - pointer.y;
      const dragDistance = Math.sqrt(dx * dx + dy * dy);

      const MIN_DRAG_THRESHOLD = 10;
      if (dragDistance < MIN_DRAG_THRESHOLD) return;

      const canvasDiagonal = Math.sqrt(levelData.canvas.width ** 2 + levelData.canvas.height ** 2);
      const normalizedStrength = dragDistance / canvasDiagonal;
      const maxVelocity = 400;

      this.userBall.vx = (dx / dragDistance) * normalizedStrength * maxVelocity;
      this.userBall.vy = (dy / dragDistance) * normalizedStrength * maxVelocity;

      console.log('Launched with velocity:', this.userBall.vx, this.userBall.vy);
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

  drawStrengthBar(normalizedStrength) {
    const maxBarLength = 50;
    const barHeight = 8;
    const percent = Math.min(normalizedStrength, 1);

    this.strengthBar.clear();
    this.strengthBar.setVisible(true);

    const x = this.userBall.x - maxBarLength / 2;
    const y = this.userBall.y - this.userBall.radius - 20;

    this.strengthBar.fillStyle(0x000000, 0.5);
    this.strengthBar.fillRect(x - 1, y - 1, maxBarLength + 2, barHeight + 2);

    this.strengthBar.fillStyle(0xffcc00);
    this.strengthBar.fillRect(x, y, maxBarLength * percent, barHeight);
  }

  drawDirectionArrow(pointer) {
    this.arrowGraphics.clear();
    this.arrowGraphics.visible = true;

    const fromX = this.userBall.x;
    const fromY = this.userBall.y;
    const toX = pointer.x;
    const toY = pointer.y;

    const dx = fromX - toX;
    const dy = fromY - toY;

    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;

    const arrowLength = Math.min(length, 100);
    const endX = fromX + unitX * arrowLength;
    const endY = fromY + unitY * arrowLength;

    this.arrowGraphics.lineStyle(2, 0x00bfff);
    this.arrowGraphics.strokeLineShape(new Phaser.Geom.Line(fromX, fromY, endX, endY));
  }
}
