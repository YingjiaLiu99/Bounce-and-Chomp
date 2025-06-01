export default class GameHUD {
  constructor(scene, userBall, enemyBalls) {
    this.scene = scene;
    this.userBall = userBall;
    this.enemyBalls = enemyBalls;

    const baseX = scene.scale.width - 200;

    this.massText = scene.add.text(baseX, 20, '', this._style());
    this.remainingText = scene.add.text(baseX, 50, '', this._style());
    this.eatenText = scene.add.text(baseX, 80, '', this._style());
    this.vxText = scene.add.text(baseX, 110, '', this._style());
    this.vyText = scene.add.text(baseX, 140, '', this._style());
  }

  _style() {
    return {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 4, y: 2 },
      fontFamily: 'Arial'
    };
  }

  update() {
    this.massText.setText(`Mass: ${Math.round(this.userBall.mass)}`);
    this.remainingText.setText(`Remaining: ${this.enemyBalls.length}`);
    this.eatenText.setText(`Eaten: ${this.userBall.ballsEaten}`);
    this.vxText.setText(`VX: ${this.userBall.vx}`);
    this.vyText.setText(`VY: ${this.userBall.vy}`);
  }
}