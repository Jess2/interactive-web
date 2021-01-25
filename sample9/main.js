const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

// canvas의 width와 height를 윈도우 창의 width와 height로 설정한다.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 각 Particle (Position, color 정보 등을 포함하는 Particle 객체) 들을 저장할 배열
let particleArray = [];

// 마우스 이벤트에 따라 우리의 이미지를 Particle들로 변환하기 위해서 mouse의 현재 Position 정보를 담을 객체
let mouse = {
  x: null,
  y: null,
  radius: 100, // particle의 사이즈를 정의하기 위한 반지름 값
}

// mousemove 이벤트 리스너
window.addEventListener('mousemove',function (event) {
  // 마우스를 움직이면 마우스 이벤트의 좌표를 받아 mouse 객체의 x,y값을 설정한다.
  mouse.x = event.x + (canvas.clientLeft / 2);
  mouse.y = event.y + (canvas.clientTop / 2);
});

function drawImage() {
  const pixels = ctx.getImageData(0, 0, myImage.width, myImage.height); // getImageData 메소드는 각 픽셀의 rgba값과 width, height를 반환한다.
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 각 픽셀의 정보와 width, height 값을 pixels 변수에 담고 있고 이미지 자체는 더이상 필요하지 않기 때문에 Canvas를 Clear한다.

  // Particle 클래스
  class Particle {
    constructor(x, y, color) {
      this.x = x + (canvas.width / 2) - (myImage.width * 2);
      this.y = y + (canvas.height / 2) - (myImage.height * 2);
      this.color = color;
      this.size = 2;
      this.baseX = x + (canvas.width / 2) - (myImage.width * 2);
      this.baseY = y + (canvas.height / 2) - (myImage.height * 2);
      this.density = (Math.random() * 10) + 2; // 마우스를 움직일 때 얼마나 빠르게 움직이게 할 것인지 정의
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      ctx.fillStyle = this.color;

      //collision detection
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt((dx * dx) + (dy * dy));
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;

      // max distance, past that the force will be 0
      const maxDistance = 100;
      let force = (maxDistance - distance) / maxDistance;

      if (force < 0) {
        force = 0;
      }

      let directionX = (forceDirectionX * force * this.density * 0.9);
      let directionY = (forceDirectionY * force * this.density * 0.9);

      if (distance < (mouse.radius + this.size)) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 20;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 20;
        }
      }

      this.draw();
    }
  }

  function init() {
    particleArray = [];

    for (let y = 0, y2 = pixels.height; y < y2; y++) {
      for (let x = 0, x2 = pixels.width; x < x2; x++) {
        if (pixels.data[(y * 4 * pixels.width) + (x * 4) + 3] > 128) {
          let positionX = x;
          let positionY = y;
          let color = "rgba(" + pixels.data[(y * 4 * pixels.width) + (x * 4)] + "," +
                                pixels.data[(y * 4 * pixels.width) + (x * 4) + 1] + "," +
                                pixels.data[(y * 4 * pixels.width) + (x * 4) + 2] + ")";

          particleArray.push(new Particle(positionX * 4, positionY * 4, color));
        }
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0,0,0,.05)';
    ctx.fillRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particleArray.length; i++) {
      particleArray[i].update();
    }
  }

  init();
  animate();

  window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
  });
}

window.addEventListener('load', (event) => {
  ctx.drawImage(myImage, 0, 0);
  drawImage();
})



