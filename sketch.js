let words = [];
let input, button;
let defaultWords = ['AI', 'WORD', 'ART', '互动', '表达', '自由', '探索', '感受', 'REGULATION', 'WHERE', '拼接者', '偷盗', 'THEFT'];
let emojis = ['✨', '🔥', '🌈', '💥', '🍀', '🐱', '🌸', '🎈', '✂️', '🖌️', '🖍️', '🎨', '🧵', '🧶', '📐', '📏', '📌'];
let gravity;
let shakeForce = 0;

function windowResized() {
  createCanvas(windowWidth, windowWidth);
  background('#F9A800');

  input = createInput();
  input.position(20, 20);
  input.size(280, 40);
  input.style('font-size', '20px');
  input.attribute('placeholder', 'REFL-AI-CTION 输入你的反AI馈');

  button = createButton('DROP');
  button.position(input.x + input.width + 15, 20);
  button.size(100, 40);
  button.style('font-size', '20px');
  button.mousePressed(addWord);

  gravity = createVector(0, 0.2);
}

function draw() {
  background('#F9A800');

  // 定时添加默认词和 emoji
  if (frameCount % 30 === 0) {
    if (random() < 0.5) {
      addFallingText(random(defaultWords));
    } else {
      addFallingText(random(emojis));
    }
  }

  for (let i = 0; i < words.length; i++) {
    let w = words[i];
    w.applyForce(gravity);
    w.applyForce(createVector(shakeForce, 0));
    w.update();

    // 碰撞检测
    for (let j = i + 1; j < words.length; j++) {
      w.collide(words[j]);
    }

    w.display();
  }

  // 清空堆叠太多
  if (words.length > 200) {
    words.splice(0, 50);
  }

  shakeForce = 0;
}

function addWord() {
  let txt = input.value().trim();
  if (txt.length > 0) {
    let entries = txt.split(/\s+/);
    for (let t of entries) {
      addFallingText(t);
    }
    input.value('');
  }
}

function addFallingText(str) {
  let x = random(50, width - 50);
  words.push(new FallingWord(str, x, 0));
}

function deviceShaken() {
  shakeForce = random(-1, 1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowWidth);
}

class FallingWord {
  constructor(str, x, y) {
    this.str = str;
    this.pos = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.size = random(20, 40);
    this.font = random(['Arial', 'Georgia', 'Courier', 'Verdana']);
    this.angle = random(TWO_PI);
    this.rotation = random(-0.05, 0.05);
    this.r = this.size / 2; // 碰撞体积半径
  }

  applyForce(f) {
    this.acceleration.add(f);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.pos.add(this.velocity);
    this.acceleration.mult(0);
    this.angle += this.rotation;

    // 底部限制
    if (this.pos.y + this.r > height) {
      this.pos.y = height - this.r;
      this.velocity.y *= -0.2; // 轻微弹跳
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    textAlign(CENTER, CENTER);
    textSize(this.size);
    textFont(this.font);
    fill(0);
    text(this.str, 0, 0);
    pop();
  }

  collide(other) {
    let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    let minDist = this.r + other.r;
    if (d < minDist) {
      let angle = atan2(this.pos.y - other.pos.y, this.pos.x - other.pos.x);
      let overlap = minDist - d;
      let dx = cos(angle) * overlap * 0.5;
      let dy = sin(angle) * overlap * 0.5;

      this.pos.x += dx;
      this.pos.y += dy;
      other.pos.x -= dx;
      other.pos.y -= dy;

      // 碰撞后速度影响
      this.velocity.mult(0.95);
      other.velocity.mult(0.95);
    }
  }
}
