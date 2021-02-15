/*
* Canvas Setup
* */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

// css file 에 정한 넓이/높이와 같은 값으로 지정해줘야 한다.
canvas.width = 800;
canvas.height = 500;

let score = 0; // 점수
let gameFrame = 0; // 매 animation loop 마다 1씩 증가시킨다. 50 프레임마다 새로운 버블을 만들건데 그걸 계산하기 위한 변수다.
ctx.font = '50px Georgia'; // Canvas 위에 출력하는 텍스트 폰트를 지정한다.

/*
* Mouse Interactivity - Capture Mouse Position
* */
// 캔버스 좌상단의 위치를 클릭했을 때 mouse 객체의 position 값을 (0, 0)으로 처리하기 위한 값
let canvasPosition = canvas.getBoundingClientRect();

// mouse 객체
const mouse = {
  x: canvas.width / 2, // 가로 기준 중앙 위치
  y: canvas.height / 2, // 세로 기준 중앙 위치
  click: false,
};

// canvas 위에 마우스다운 이벤트가 발생하면 mouse 객체 속성을 업데이트 한다.
canvas.addEventListener('mousedown', function(event) {
  mouse.x = event.x - canvasPosition.left; // 마우스 이벤트가 발생했을 때의 x 위치 - Canvas의 x 위치 (Canvas의 가장 좌측이 0이 되도록)
  mouse.y = event.y - canvasPosition.top; // 마우스 이벤트가 발생했을 때의 y 위치 - Canvas의 y 위치 (Canvas의 가장 상단이 0이 되도록)
  mouse.click = true; // 마우스다운 이벤트가 발생하면 mouse 객체의 click 속성을 true로 설정한다.
});

canvas.addEventListener('mouseup', function(event) {
  mouse.click = false; // 마우스업 이벤트가 발생하면 mouse 객체의 click 속성을 false로 설정한다.
});

/*
* Create Player Character
* */
class Player {
  constructor() {
    this.x = canvas.width / 2; // player 의 최초 위치 지정
    this.y = canvas.height / 2; // player 의 최초 위치 지정
    this.radius = 50; // player를 우선 단순한 원으로 나타내기 위해서 반지름 값 지정
    this.angle = 0; // Player를 회전시키기 위한 값
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 498;
    this.spriteHeight = 327;
  }

  update() {
    // Player의 현재 위치와 마우스의 위치를 이용하여 이동할 거리를 구한다.
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;

    // Player의 x 좌표와 mouse의 x 좌표가 다를 경우 Player의 x 좌표에서 그 차이만큼 뺀다.
    // 단 천천히 빼기 위해서 30으로 나눈 값을 뺀다.
    if (mouse.x !== this.x) {
      this.x -= (dx / 20);
    }
    if (mouse.y !== this.y) {
      this.y -= (dy / 20); // x와 마찬가지 방식.
    }
  }

  draw() {
    // 마우스 객체의 click 속성이 true일 경우 그린다.
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y); // start point
      ctx.lineTo(mouse.x, mouse.y); // end point
      ctx.stroke();
    }

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

const player = new Player();

/*
* Handle Bubbles - pop and score points
* */
const bubbles = [];

class Bubble {
  constructor() {
    this.radius = 50; // 버블의 반지름값
    this.x = Math.random() * canvas.width; // x값은 랜덤값으로 설정된다. (0 ~ canvas.width 사이의 랜덤값)
    this.y = canvas.height + this.radius// bottom에서 시작하기 위해서 canvas.height를 더했다.
    this.speed = Math.random() * 5 + 1; // 버블의 속도 (1 ~ 6 사이의 랜덤값)
    this.distance; // player와 버블의 거리
  }

  update() {
    this.y -= this.speed; // 버블은 위로 점점 올라간다.
  }

  draw() {
    ctx.fillStyle = 'blue'; // 파란색 버블
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
  }
}

function handleBubbles() {
  // 프레임 50번째마다 버블을 만든다.
  if (gameFrame % 50 === 0) {
    bubbles.push(new Bubble());
  }

  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].update();
    bubbles[i].draw();
  }

  for (let i = 0; i < bubbles.length; i++) {
    // canvas보다 더 위로 올라간 버블 배열에서 제거한다.
    if (bubbles[i].y + this.radius < 0) {
      bubbles.splice(i, 1);
    }
  }
}

/*
* Animation Loop
* */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전 paint를 지운다.
  handleBubbles();
  player.update();
  player.draw();
  gameFrame++;
  requestAnimationFrame(animate);
}

animate();