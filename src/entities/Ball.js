export class Ball {
    constructor(x, y, radius, mass) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.mass = mass;
      this.vx = 0;
      this.vy = 0;
      this.reboundCount = 0;
    }
  
    updatePosition(deltaTime) {
      this.x += this.vx * deltaTime;
      this.y += this.vy * deltaTime;
    }
  
    getSpeed() {
      return Math.sqrt(this.vx ** 2 + this.vy ** 2);
    }
  }
  
  export class UserBall extends Ball {
    constructor(x, y, radius, mass) {
      super(x, y, radius, mass);
      this.ballsEaten = 0; 
    }
  
    grow(eatenBallMass) {
      this.mass += eatenBallMass;
      this.ballsEaten += 1;
      this.reboundCount = 0; // Reset after eating
    }
  }
  
  export class EnemyBall extends Ball {
    constructor(x, y, radius, mass) {
      super(x, y, radius, mass);
    }
  }
  