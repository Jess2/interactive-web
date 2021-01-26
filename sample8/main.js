// 이미지가 로드되면 실행한다.
myImage.addEventListener('load', function() {
  console.log('load!')
  const canvas = document.getElementById('canvas1'); // canvas 설정 (이미지 크기와 동일한 크기로 설정)
  const ctx = canvas.getContext('2d'); // 모든 2d canvas drawing methods를 사용할 수 있게 해준다.
  canvas.width = 540;
  canvas.height = 799;

  // drawImage : html에 이미지를 그리게 해준다.
  // 첫번째 argument : 그리고 싶은 이미지
  // 두번째 arg : 이미지 시작 위치 x값, 세번째 arg : 이미지 시작 위치 y값 => 이미지를 좌측 상단에서부터 그리기 위해서 0, 0으로 설정
  // 네번째 arg : 이미지 width, 다섯번째 arg : 이미지 height => 이미지가 캔버스 전체 영역을 차지하기 위해서 width는 canvas의 width로, height는 canvas의 height로 설정
  ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);

  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height); // (추가됨) getImageData 메소드는 각 픽셀의 rgba값과 width, height를 반환한다.
  ctx.clearRect(0, 0, canvas.width, canvas.height); // (추가됨) 각 픽셀의 정보는 pixels 변수에 담고 있고 이미지 자체는 더이상 필요하지 않기 때문에 Canvas를 Clear한다.

  let particlesArray = []; // particle들을 담을 배열 (Particle Class로 particle을 생성해서 이 배열에 담을 것이다.)
  const numberOfParticles = 5000; // particle 개수 설정 (개수가 많을 수록 촘촘해진다?)

  let mappedImage = []; // (추가됨) 이미지의 각 픽셀당 밝기 값을 담을 배열

  for (let y = 0; y < canvas.height; y++) { // (추가됨) 이미지의 높이가 799 픽셀로 이루어짐 (상하로 799 줄)
    let row = []; // 각 줄의 픽셀 데이터를 담을 배열을 만든다. (799번 만들어진다)

    for (let x = 0; x < canvas.width; x++) { // 이미지의 넓이가 540 픽셀로 이루어짐 (좌우로 540 칸)
      // 이미지의 각 픽셀의 color 값
      const red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
      const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
      const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)];
      const brightness = calculateRelativeBrightness(red, green, blue); // JavaScript 호이스팅 기능으로 인해 선언하기 전에 호출할 수 있다.
      const cell = [
        cellBrightness = brightness, // 상대적인 밝기값을 저장
      ];
      row.push(cell); // 하나의 row에 540개의 cell을 넣게 된다.
    }
    mappedImage.push(row); // 799개의 row를 넣게되고 하나의 row에는 540개의 cell이 존재한다.
  }

  // (추가됨) 색에 따라 밝기를 계산하는 함수 - 이 공식을 온라인에서 찾았는데 이해할 필요없다.
  function calculateRelativeBrightness(red, green, blue) {
    return Math.sqrt(
      (red * red) * 0.299 +
      (green * green) * 0.587 +
      (blue * blue) * 0.114
    )/100;
  }

  // Particle 클래스
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width; // x값의 랜덤 범위 : 0 ~ canvas.width
      this.y = 0;
      this.speed = 0;
      this.velocity = Math.random() * 0.5; // 떨어지는 속도 랜덤 범위 : 0 ~ 0.5 => 배경 밝기에 따라 계산될 것이다. 어두운 배경에서는 빠르게 떨어지고 밝은 배경에서는 천천히 떨어진다.
      this.size = Math.random() * 1.5 + 1; // 사이즈 랜덤 범위 : 1 ~ 2.5

      // (추가됨) mappedImage 배열에서 index 로 사용하기 위해서 소수값을 버린 값을 구한다.
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
    }

    // 매 프레임마다 particle을 그리기 전에 particle의 위치를 계산하는 메소드
    update() {
      // (추가됨) mappedImage 배열에서 index 로 사용하기 위해서 소수값을 버린 값을 구한다.
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
      this.speed = mappedImage[this.position1] ? mappedImage[this.position1][this.position2][0] : 0;// 해당 셀의 밝기값을 속도로 지정한다.

      // 밝기가 0에 가까우면 어두운 배경이고 이 때는 굉장히 빠르게 움직인다.
      // 밝기가 2.5에 가까우면 밝은 배경이고 이 때는 굉장히 천천히 움직인다.
      this.y += ((2.5 - this.speed) + this.velocity);

      if (this.y >= canvas.height) {
        this.y = 0; // 캔버스의 끝에 닿으면 위치 0(최상단)으로 초기화한다. (초기화하면 다시 아래로 떨어질 것이다.)
        this.x = Math.random() * canvas.width; // 그와 동시에 x 위치는 랜덤값으로 변경한다.
      }
    }

    // 각각의 particle을 나타내기 위해서 원을 그린다.
    draw() {
      ctx.beginPath(); // draw를 시작하기 위해 beginPath 메소드를 실행
      ctx.fillStyle = 'white'; // 배경색 지정
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // arc : 원을 그리는 메소드
      ctx.fill();
    }
  }

  // 위에서 지정한 particle 개수만큼 Particle을 생성해서 particlesArray에 담는다.
  function init() {
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle);
    }
  }

  init();

  // 메인 animation loop
  function animate() {
    // (제거됨)
    // ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);

    // 매 프레임마다 약간 투명한 검정색 네모를 캔버스 위에 그린다.
    ctx.globalAlpha = 0.05; // 투명도
    ctx.fillStyle = 'rgb(0, 0, 0)'; // 색
    ctx.fillRect(0, 0, canvas.width, canvas.height); // 네모
    ctx.globalAlpha = 0.2; // (추가됨) 한 번 그리면 투명도를 0.2로 증가시킨다.

    // 매 프레임마다 모든 Particle들을 update하고 그린다.
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      ctx.globalAlpha = particlesArray[i].speed * 0.3; // (추가됨) 매 프레임마다 Particle을 그리기 직전에 Particle 속도에 따른 투명도를 다시 계산한다.
      particlesArray[i].draw();
    }

    // requestAnimationFrame : 자바스크립트 내장 메소드
    // animate 함수를 매개변수로 넘기면 재귀함수로 계속 호출된다.
    requestAnimationFrame(animate);
  }

  animate();
});
