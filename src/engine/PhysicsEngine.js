export default class PhysicsEngine {
  static applyFriction(ball, deltaTime, stopThreshold = 0.01) {
    const speed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);
    if (speed === 0) return;

    // Speed-proportional damping (inertia-like)
    // Max decay of 4% per frame; less if moving slowly
    const damping = 1 - Math.max(0.02, speed * 0.02);  // tweak 0.02 for responsiveness
    const decay = Math.pow(damping, deltaTime/3);   // normalize to 60fps frame units

    ball.vx *= decay;
    ball.vy *= decay;

    // Stop the ball completely if nearly still
    if (ball.vx ** 2 + ball.vy ** 2 < stopThreshold ** 2) {
      ball.vx = 0;
      ball.vy = 0;
    }
  }

  
  static reflectIfHitWall(ball, width, height, bounceDamping = 0.9) {
    let hit = false;
    // Left or Right Wall
    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= width) {
        ball.vx *= -bounceDamping;
        hit = true;

        // Correct penetration (optional for better realism)
        if (ball.x - ball.radius < 0) ball.x = ball.radius;
        else if (ball.x + ball.radius > width) ball.x = width - ball.radius;
    }

    // Top or Bottom Wall
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= height) {
        ball.vy *= -bounceDamping;
        hit = true;

        // Correct penetration (optional)
        if (ball.y - ball.radius < 0) ball.y = ball.radius;
        else if (ball.y + ball.radius > height) ball.y = height - ball.radius;
    }

    if (hit) ball.reboundCount += 1;
}

  
  static checkCollision(ballA, ballB) {
    const dx = ballA.x - ballB.x;
    const dy = ballA.y - ballB.y;
    const fudge = 2; // small buffer to prevent tunneling
    const radiiSum = ballA.radius + ballB.radius + fudge;
    return (dx * dx + dy * dy) <= (radiiSum * radiiSum);
  }
}
  