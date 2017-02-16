var randomBetween = function(min, max) {
  return Math.random() * (max - min) + min;
};

var Bird = function(canvas) {
  var ctx = canvas.getContext("2d");

  this.sheet = new Image();
  this.sheet.src = "https://s24.postimg.org/pq3anmg6t/bird.png";
  this.numOfFrames = 4;
  this.frameIndex = 0;
  this.lastFrameChangeAt = 0;
  this.w = 50;
  this.h = 172 / this.numOfFrames;

  this.y = canvas.width / 3;
  this.x = canvas.height / 2;
  this.g = 1; // gravity force
  this.l = 15; // lift = flap force
  this.v = 0; // velocity in y

  this.flap = function() {
    this.v -= this.l;
  }

  this.isOut = function() {
    return this.y < 0 || this.y + this.h > canvas.height;
  };

  this.update = function() {
    this.v += this.g;
    this.y += this.v;
    if (Date.now() - this.lastFrameChangeAt > 100) {
      this.frameIndex = (this.frameIndex + 1) % 4;
      this.lastFrameChangeAt = Date.now();
    }
  }

  this.draw = function() {
    ctx.drawImage(
      this.sheet,
      0, this.h * this.frameIndex, this.w, this.h, // sub rect
      this.x, this.y, this.w, this.h); // rect
  }
};

var Pipe = function(canvas) {
  var ctx = canvas.getContext("2d");

  this.topImage = new Image();
  this.topImage.src = "https://s24.postimg.org/wj3njw705/pipe_top.png";
  this.bottomImage = new Image();
  this.bottomImage.src = "https://s24.postimg.org/bkxhlt75h/pipe_bottom.png";

  this.mid = randomBetween(100, canvas.height - 100);
  this.top = this.mid - 75; // gap top
  this.bottom = this.mid + 75; // gap bottom
  this.x = canvas.width;
  this.w = 26;
  this.v = 2;

  this.passed = false;

  this.collision = function(bird) {
    if (bird.y < this.top || bird.y + bird.h > this.bottom) {
      if (bird.x + bird.w > this.x && bird.x < this.x + this.w) {
        return true;
      }
    }
    return false;
  }

  this.wasPassed = function(bird) {
    if (!this.passed && bird.x > this.x + this.w) {
      this.passed = true;
      return true;
    }
    return false;
  };

  this.draw = function() {
    ctx.drawImage(this.topImage, this.x, this.top - this.topImage.height);
    ctx.drawImage(this.bottomImage, this.x, this.bottom);
  }

  this.update = function() {
    this.x -= this.v;
  }

  this.isOut = function() {
    if (this.x < -this.w) {
      return true;
    }
    return false;
  }
};

var Game = function(initW, initH) {
  var running = true;
  var lastPipeAt = 0;
  var w = initW;
  var h = initH;

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = w;
  canvas.height = h;
  document.body.appendChild(canvas)

  var largeFont = 'bold 48px "Roboto", sans-serif';
  var smallFont = 'bold 28px "Roboto", sans-serif'
  ctx.font = largeFont;
  ctx.textBaseline = "hanging";
  ctx.textAlign = "right";

  var bird = new Bird(canvas);
  var pipes = [];
  var points = 0;

  var handleFlap = function(e) {
    if (e.keyCode === 32 || e.type === "click") {
      if (running) {
        bird.flap();
      } else {
        reset();
      }
    }
  }

  var handleCollision = function(e) {
    running = false;

    // if no points, player just started
    if (points < 1) {
      var big_text = "Flappy";
      var small_text_line_one = "Press space or click to start";
      var small_text_line_two = "";
    } else {
      // submit score if more than 0
      window.parent.postMessage({
        'messageType': 'SCORE',
        'score': points
      }, "*");
      var big_text = "Game over!";
      var small_text_line_one = "Your score was submitted.";
      var small_text_line_two = "Press space or click to restart.";
    }

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.textAlign = "center"
    ctx.fillText(big_text, canvas.width/2, canvas.height/2 - 24);
    ctx.strokeText(big_text, canvas.width/2, canvas.height/2 - 24);
    ctx.font = smallFont;
    ctx.lineWidth = 1.5;
    ctx.fillText(small_text_line_one, canvas.width/2, canvas.height/2 - 24 + 70);
    ctx.strokeText(small_text_line_one, canvas.width/2, canvas.height/2 - 24 + 70);
    ctx.fillText(small_text_line_two, canvas.width/2, canvas.height/2 - 24 + 110);
    ctx.strokeText(small_text_line_two, canvas.width/2, canvas.height/2 - 24 + 110);
    ctx.font = largeFont;
  };

  var handlePoint = function(e) {
    points++;
  };

  var update = function() {
    bird.update();
    if (bird.isOut()) {
      handleCollision();
    }
    for (var i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      if (pipes[i].collision(bird)) {
        this.dispatchEvent(new Event('collision'));
      }
      if (pipes[i].wasPassed(bird)) {
        this.dispatchEvent(new Event('gotPoint'));
      }
      if (pipes[i].isOut()) {
        pipes.splice(i, 1);
      }
    }
  };

  var draw = function() {
    if (running) {
      // background
      ctx.fillStyle = "rgb(120, 190, 200)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // pipes
      for (var i = pipes.length - 1; i >= 0; i--) {
        pipes[i].draw();
      }
      // points
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.fillText(points, canvas.width - 20, 20);
      ctx.strokeText(points, canvas.width - 20, 20);
      // bird
      bird.draw();
    }
  }

  var loop = function() {
    if ((Date.now() - lastPipeAt) > 2000) {
      pipes.push(new Pipe(canvas));
      lastPipeAt = Date.now();
    }

    setTimeout(function() {
      if (running) {
        update();
        draw();
        loop();
      }
    }, 20);
  }

  var init = function() {
    window.addEventListener('keydown', handleFlap);
    canvas.addEventListener('click', handleFlap, false);
    this.addEventListener('collision', handleCollision);
    this.addEventListener('gotPoint', handlePoint);

    bird.flap();
    loop();
  };

  var reset = function() {
    console.log(reset);
    bird = new Bird(canvas);
    pipes = [];
    points = 0;
    running = true;
    init();
  };

  init();
};