/**
 * Snake Game - Estilo Nokia 3310
 * HTML5 Canvas + Vanilla JavaScript
 */

(function() {
  'use strict';

  const canvas = document.getElementById('snakeGame');
  if (!canvas) {
    console.warn('Canvas #snakeGame not found');
    return;
  }

  const ctx = canvas.getContext('2d');
  const gridSize = 20;
  const tileCount = canvas.width / gridSize;

  let snake = [{ x: 10, y: 10 }];
  let velocity = { x: 0, y: 0 };
  let food = { x: 15, y: 15 };
  let score = 0;
  let gameSpeed = 150; // ms
  let gameLoop = null;
  let isPaused = false;
  let gameStarted = false;

  // Difficulty settings
  const difficulties = {
    easy: 150,
    medium: 100,
    hard: 50
  };

  // Initialize game
  function init() {
    drawWelcomeScreen();
    setupKeyboardControls();
    setupDifficultyButtons();
  }

  // Welcome screen
  function drawWelcomeScreen() {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff00';
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SNAKE GAME', canvas.width / 2, canvas.height / 2 - 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    ctx.fillText('Escolha uma dificuldade', canvas.width / 2, canvas.height / 2);
    ctx.fillText('para começar', canvas.width / 2, canvas.height / 2 + 20);

    ctx.fillStyle = '#888888';
    ctx.font = '12px monospace';
    ctx.fillText('Use as setas para mover', canvas.width / 2, canvas.height / 2 + 60);
  }

  // Setup keyboard controls
  function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      if (!gameStarted) return;

      // Pause/Resume
      if (e.code === 'Space') {
        e.preventDefault();
        togglePause();
        return;
      }

      if (isPaused) return;

      // Movement
      switch (e.code) {
        case 'ArrowUp':
          if (velocity.y === 0) velocity = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (velocity.y === 0) velocity = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (velocity.x === 0) velocity = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (velocity.x === 0) velocity = { x: 1, y: 0 };
          break;
      }
    });
  }

  // Setup difficulty buttons
  function setupDifficultyButtons() {
    window.addEventListener('snakeStart', (e) => {
      const difficulty = e.detail?.difficulty || 'medium';
      startGame(difficulty);
    });
  }

  // Start game
  function startGame(difficulty = 'medium') {
    // Reset game state
    snake = [{ x: 10, y: 10 }];
    velocity = { x: 1, y: 0 };
    score = 0;
    gameSpeed = difficulties[difficulty] || 100;
    isPaused = false;
    gameStarted = true;

    // Generate first food
    generateFood();

    // Clear any existing game loop
    if (gameLoop) clearInterval(gameLoop);

    // Start game loop
    gameLoop = setInterval(update, gameSpeed);
  }

  // Toggle pause
  function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
      drawPauseScreen();
    }
  }

  // Draw pause screen
  function drawPauseScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSADO', canvas.width / 2, canvas.height / 2);

    ctx.font = '14px monospace';
    ctx.fillText('Pressione ESPAÇO', canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillText('para continuar', canvas.width / 2, canvas.height / 2 + 50);
  }

  // Update game state
  function update() {
    if (isPaused) return;

    // Move snake
    const head = {
      x: snake[0].x + velocity.x,
      y: snake[0].y + velocity.y
    };

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
      gameOver();
      return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      gameOver();
      return;
    }

    // Add new head
    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      generateFood();
    } else {
      // Remove tail if not eating
      snake.pop();
    }

    // Draw
    draw();
  }

  // Generate food
  function generateFood() {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

    food = newFood;
  }

  // Draw game
  function draw() {
    // Background (Nokia 3310 style)
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (subtle)
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    for (let i = 0; i < tileCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(canvas.width, i * gridSize);
      ctx.stroke();
    }

    // Snake
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Head (brighter green)
        ctx.fillStyle = '#00ff00';
      } else {
        // Body (darker green)
        ctx.fillStyle = '#00cc00';
      }

      ctx.fillRect(
        segment.x * gridSize + 1,
        segment.y * gridSize + 1,
        gridSize - 2,
        gridSize - 2
      );

      // Add border for Nokia effect
      ctx.strokeStyle = '#008800';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        segment.x * gridSize + 1,
        segment.y * gridSize + 1,
        gridSize - 2,
        gridSize - 2
      );
    });

    // Food (red apple)
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(
      food.x * gridSize + gridSize / 2,
      food.y * gridSize + gridSize / 2,
      gridSize / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Score
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${score}`, 10, 20);

    // Snake length
    ctx.textAlign = 'right';
    ctx.fillText(`LENGTH: ${snake.length}`, canvas.width - 10, 20);
  }

  // Game over
  function gameOver() {
    clearInterval(gameLoop);
    gameStarted = false;

    // Draw game over screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px monospace';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText(`Length: ${snake.length}`, canvas.width / 2, canvas.height / 2 + 30);

    ctx.fillStyle = '#888888';
    ctx.font = '14px monospace';
    ctx.fillText('Escolha uma dificuldade', canvas.width / 2, canvas.height / 2 + 70);
    ctx.fillText('para jogar novamente', canvas.width / 2, canvas.height / 2 + 90);
  }

  // Initialize game when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
