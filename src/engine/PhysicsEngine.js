export default class PhysicsEngine {
    static applyFriction(ball, frictionFactor, deltaTime) {
      ball.vx *= Math.pow(frictionFactor, deltaTime);
      ball.vy *= Math.pow(frictionFactor, deltaTime);
  
      // Stop very small velocities to avoid drifting forever
      if (Math.abs(ball.vx) < 0.01) ball.vx = 0;
      if (Math.abs(ball.vy) < 0.01) ball.vy = 0;
    }
  
    static reflectIfHitWall(ball, width, height, bounceDamping = 0.9) {
      let hit = false;
      if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= width) {
        ball.vx *= -bounceDamping;
        hit = true;
      }
      if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= height) {
        ball.vy *= -bounceDamping;
        hit = true;
      }
      if (hit) ball.reboundCount += 1;
    }
  
    static checkCollision(ballA, ballB) {
      const dx = ballA.x - ballB.x;
      const dy = ballA.y - ballB.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < ballA.radius + ballB.radius;
    }
}
  