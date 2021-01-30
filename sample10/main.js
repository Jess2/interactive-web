const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d'); // ctx변수를 통해 모든 2d canvas api를 사용할 수 있게 해준다.

// canvas의 width와 height를 윈도우 창의 width와 height로 설정한다.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 새 shape을 그릴 때의 합성 방법을 지정해준다
// 이 속성을 이용해서 canvas 위의 각각의 shape이 어떻게 겹치도록 할지 정의할 수 있다. 포토샵의 레이어와 비슷하다.
// 26가지의 다른 세팅 방법이 존재한다.
// 아래의 방법은 새 shape이 직전의 shpae 뒤에 그려지도록 하는 방법이다.
ctx.globalCompositeOperation = 'destination-over';

let number = 0;
let scale = 10; // radius를 증가시키는 역할
let hue = 0; // 색을 변경시키는 역할

function drawFlower() {
  let angle = number * 0.8; // number에 몇을 곱해서 angle을 만드냐에 따라 다른 모양의 flower가 만들어진다.
  let radius = scale * Math.sqrt(number); // radius를 점점 증가시킨다.

  // javascript 내장 메소드인 Math.sin 을 이용한다. (0부터 시작하여 -1 ~ 1 사이의 값을 return함)
  // 뒤에 (canvas.width / 2)를 더해준 이유는 위치를 canvas의 좌우 가운데로 설정하기 위한 것
  let positionX = (radius * Math.sin(angle)) + (canvas.width / 2);

  // javascript 내장 메소드인 Math.cos 을 이용한다. (1부터 시작하여 -1 ~ 1 사이의 값을 return함)
  // 뒤에 (canvas.height / 2)를 더해준 이유는 위치를 canvas의 상하 가운데로 설정하기 위한 것
  let positionY = (radius * Math.cos(angle)) + (canvas.height / 2);

  ctx.fillStyle = 'hsl(' + hue + ', 100%, 50%)'; // 배경색 (hsl 첫번째 매개변수: 1~360 사이의 값)
  ctx.strokeStyle = 'brown'; // border 색
  ctx.lineWidth = 4; // border width
  ctx.beginPath(); // javascript에게 draw를 시작한다고 알리는 역할
  ctx.arc(positionX, positionY, number, 0, Math.PI * 2) // arc : 원을 그리는 메소드, 정해진 위치와 사이즈로 원을 그린다. (x, y, radius, startAngle, endAngle)
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  number += 0.5;
  hue++;
}

// 매 프레임마다 다시 그린다.
function animate() {
  // ctx.clearRect(0, 0, canvas.width, canvas.height); // 현재 프레임 보기 위해서 이전 프레임은 clear 한다.
  drawFlower();

  if (number > 150) return; // 새로 그리는 것을 멈춘다.
  requestAnimationFrame(animate); // requestAnimationFrame 은 자바스크립트 내장 메소드이고, animate 함수를 매개변수로 넘기면 재귀함수로 계속 호출된다.
}

animate();