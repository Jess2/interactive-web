function playAnimation() {
  const EYE_LEFT = document.querySelector('.eye-wrapper.left');
  const EYE_RIGHT = document.querySelector('.eye-wrapper.right');
  const EYE_LEFT_RECT = EYE_LEFT.getBoundingClientRect();
  const EYE_RIGHT_RECT = EYE_RIGHT.getBoundingClientRect();
  const EYE_LEFT_CX = EYE_LEFT_RECT.x + (EYE_LEFT_RECT.width / 2);
  const EYE_LEFT_CY = EYE_LEFT_RECT.y + (EYE_LEFT_RECT.height / 2);
  const EYE_RIGHT_CX = EYE_RIGHT_RECT.x + (EYE_RIGHT_RECT.width / 2);
  const EYE_RIGHT_CY = EYE_RIGHT_RECT.y + (EYE_RIGHT_RECT.height / 2);

  document.addEventListener('mousemove', e =>{
    console.log(calcAngleDegrees(EYE_LEFT_CX - e.clientX, EYE_LEFT_CY - e.clientY))
    EYE_LEFT.style.transform = `rotate(${calcAngleDegrees(EYE_LEFT_CX - e.clientX, EYE_LEFT_CY - e.clientY)}deg)`;
    EYE_RIGHT.style.transform = `rotate(${calcAngleDegrees(EYE_RIGHT_CX - e.clientX, EYE_RIGHT_CY - e.clientY)}deg)`;
  });
}

function calcAngleDegrees(x, y) {
  return Math.atan2(y, x) * 180 / Math.PI;
}

playAnimation();

window.addEventListener('resize', playAnimation);
