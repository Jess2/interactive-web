const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d'); // 모든 2d canvas drawing methods를 사용할 수 있게 해준다.

// canvas의 width와 height를 윈도우 창의 width와 height로 설정한다.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 각 Particle (Position, color 정보 등을 포함하는 Particle 객체) 들을 저장할 배열
let particleArray = [];

// 마우스 이벤트에 따라 Particle을 움직이게 하기 위해 mouse의 현재 Position 정보를 담을 객체
const mouse = {
  x: null,
  y: null,
  radius: 100, // 마우스를 감싸는 circle의 사이즈를 정의하기 위한 반지름 값
}

// mousemove 이벤트 리스너
window.addEventListener('mousemove',function (event) {
  // 마우스를 움직이면 마우스 이벤트의 좌표를 받아 mouse 객체의 x,y값을 설정한다.
  mouse.x = event.x;
  mouse.y = event.y;
});

// 이미지가 모두 로드된 다음에 실행된다. 이 함수안에 있는 코드는 이미지가 모두 로드된 다음에만 실행될 수 있다.
function drawInteractiveImage() {
  const myImageInfo = ctx.getImageData(0, 0, myImage.width, myImage.height); // getImageData 메소드는 각 픽셀의 rgba값과 이미지의 width, height를 반환한다.
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 이미지의 각 픽셀의 정보와 width, height 값을 myImageInfo 변수에 담고 있고 이미지 자체는 더이상 필요하지 않기 때문에 Canvas를 Clear한다.

  // Particle 클래스 - 각 Particle로 픽셀화된 이미지를 만든다
  class Particle {
    constructor(x, y, color) {
      this.x = x + (canvas.width / 2) - (myImage.width * 2); // 우리의 이미지가 canvas보다 작을 수 있기 때문에 가운데로 설정하는 작업을 해준다.
      this.y = y + (canvas.height / 2) - (myImage.height * 2); // 우리의 이미지가 canvas보다 작을 수 있기 때문에 가운데로 설정하는 작업을 해준다.
      this.color = color; // 각 Particle의 색상
      this.size = 2; // 각 Particle의 사이즈
      this.baseX = x + (canvas.width / 2) - (myImage.width * 2); // 각 Particle을 움직이게 하기 전의 초기값을 기억하기 위한 변수
      this.baseY = y + (canvas.height / 2) - (myImage.height * 2); // 각 Particle을 움직이게 하기 전의 초기값을 기억하기 위한 변수
      this.density = (Math.random() * 10) + 2; // 2 ~ 12 랜덤값으로, 마우스를 움직일 때 Particle들을 마우스로부터 얼마나 빠르게 멀어지도록 움직이게 할 것인지 정의
    }

    // 매 프레임마다 각각의 particle을 나타내기 위해서 원을 그린다.
    draw() {
      ctx.beginPath(); // draw를 시작하기 위해 beginPath 메소드를 실행
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // arc : 원을 그리는 메소드, 정해진 위치와 사이즈로 원을 그린다.
      ctx.closePath();
      ctx.fill();
    }

    // 매 프레임마다 particle을 그리기 전에 particle의 위치와 기타 속성들을 계산하는 메소드
    update() {
      ctx.fillStyle = this.color; // 색 지정

      // collision detection : 인터랙팅을 하기 위해 Particle이 마우스에 충분히 가까운지 확인
      const dx = mouse.x - this.x; // x축 기준으로 Particle이 마우스와 얼마나 떨어져 있는지 거리 확인
      const dy = mouse.y - this.y; // y축 기준으로 Particle이 마우스와 얼마나 떨어져 있는지 거리 확인
      const distance = Math.sqrt((dx * dx) + (dy * dy)); // 빗변의 길이(Particle과 마우스 사이의 거리) 구하기
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;

      const maxDistance = 100; // particle이 마우스로부터 최대한 멀어질 수 있는 거리 정의
      let force = (maxDistance - distance) / maxDistance; // 범위 : 0 ~ 1 사이 (마우스와 Particle 사이가 멀면 0에 가깝고, 가까우면 1에 가깝다)

      // force가 음수일 경우(distance가 maxDistance보다 큰 경우, 즉 너무 멀리 떨어져 있는 경우)에는 0으로 처리한다.
      if (force < 0) {
        force = 0;
      }

      // directionX, directionY : movement vector값 (각 Particle의 속도와 움직임의 방향)
      const directionX = (forceDirectionX * force * this.density * 0.6); // 마우스를 움직일 때 Particle들을 마우스로부터 약간 천천히 움직이게 하기 위해서 0.6을 곱한다.
      const directionY = (forceDirectionY * force * this.density * 0.6); // 마우스를 움직일 때 Particle들을 마우스로부터 약간 천천히 움직이게 하기 위해서 0.6을 곱한다.

      // distance(Particle과 마우스 사이의 거리)가 radius+size보다 작을 경우
      if (distance < (mouse.radius + this.size)) {
        this.x -= directionX;
        this.y -= directionY;
      }
      // distance(Particle과 마우스 사이의 거리)가 radius+size보다 크거나 같을 경우 원래 자리로 돌아가게 한다.
      else {
        // Particle이 x축으로 움직인 상태일 경우
        if (this.x !== this.baseX) {
          const dx = this.x - this.baseX; // Particle이 처음 위치 대비 x축으로 움직인 거리
          this.x -= dx / 20; // Particle이 제자리로 돌아갈 때 천천히 돌아가게 하기 위해서 20으로 나눴다.
        }
        // Particle이 y축으로 움직인 상태일 경우
        if (this.y !== this.baseY) {
          const dy = this.y - this.baseY; // Particle이 처음 위치 대비 y축으로 움직인 거리
          this.y -= dy / 20; // Particle이 제자리로 돌아갈 때 천천히 돌아가게 하기 위해서 20으로 나눴다.
        }
      }

      this.draw();
    }
  }

  // 이미지 데이터로부터 각 픽셀의 위치와 색상을 추출하기 위한 작업.
  // Particle을 생성해서 particlesArray에 담는다.
  function init() {
    particleArray = [];

    // y축으로 0부터 이미지 높이까지 반복문 수행
    for (let y = 0, y2 = myImageInfo.height; y < y2; y++) {
      // x축으로 0부터 이미지 넓이까지 반복문 수행
      for (let x = 0, x2 = myImageInfo.width; x < x2; x++) {
        // 투명도가 128 초과일 경우에만 Particle을 생성한다.
        if (myImageInfo.data[(y * 4 * myImageInfo.width) + (x * 4) + 3] > 128) {
          const color = "rgba(" + myImageInfo.data[(y * 4 * myImageInfo.width) + (x * 4)] + "," +
                                  myImageInfo.data[(y * 4 * myImageInfo.width) + (x * 4) + 1] + "," +
                                  myImageInfo.data[(y * 4 * myImageInfo.width) + (x * 4) + 2] + ")";

          // 성능 이슈 때문에 크기가 작은 이미지(100x100 권장)를 사용했지만 우리의 캔버스에는 크게 나타내고 싶어서 4를 곱했다.
          particleArray.push(new Particle(x * 4, y * 4, color));
        }
      }
    }
  }

  // 메인 animation loop
  function animate() {
    requestAnimationFrame(animate); // requestAnimationFrame 은 자바스크립트 내장 메소드이고, animate 함수를 매개변수로 넘기면 재귀함수로 계속 호출된다.

    ctx.fillStyle = 'rgba(0,0,0,.05)'; // 배경색 지정
    ctx.fillRect(0, 0, innerWidth, innerHeight); // 사각형 그리기

    // 매 프레임마다 모든 Particle들을 update하고 그린다.
    for (let i = 0; i < particleArray.length; i++) {
      particleArray[i].update();
    }
  }

  init();
  animate();

  // 윈도우 브라우저 창이 리사이즈되면 canvas의 사이즈를 브라우저창의 크기로 다시 설정하고 init 함수를 호출하여 particleArray를 초기화한다.
  window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
  });
}

// 이미지가 완전히 로드된 후에 실행된다.
window.addEventListener('load', (event) => {

  // canvas 2d api인 drawImage : html에 이미지를 그리게 해준다.
  // 첫번째 argument : 그리고 싶은 이미지
  // 두번째 arg : 이미지 시작 위치 x값, 세번째 arg : 이미지 시작 위치 y값 => 이미지를 좌측 상단에서부터 그리기 위해서 0, 0으로 설정
  ctx.drawImage(myImage, 0, 0);

  drawInteractiveImage();
})



