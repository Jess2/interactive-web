(() => {
  let yOffset = window.pageYOffset;
  const sceneInfo = {
    sceneHeightNum: 5, // 브라우저 높이의 sceneHeightNum 배로 scene의 높이 세팅할 것임
    sceneHeight: 0, // scene의 높이
    dom: {
      container: document.querySelector('#scene'),
      message1: document.querySelector('#scene .sticky-message-1'),
      rect: document.querySelector('#scene .rect'),
    },
    settings: {
      message1_rgb_blue: {startValue: 100, endValue: -200, startScroll: 0, endScroll: 0.3},
      message1_rgb_red: {startValue: 200, endValue: -100, startScroll: 0, endScroll: 0.3},
      message1_rgb_green: {startValue: 300, endValue: 0, startScroll: 0, endScroll: 0.3},
      rect_rotateX: {startValue: 20, endValue: 0, startScroll: 0.1, endScroll: 0.25},
      rect_rotateY: {startValue: 30, endValue: 0, startScroll: 0.1, endScroll: 0.25},
      rect_opacity: {startValue: 0, endValue: 1, startScroll: 0, endScroll: 0.2},
      rect_rgb_blue: {startValue: 100, endValue: -200, startScroll: 0, endScroll: 0.6},
      rect_rgb_red: {startValue: 200, endValue: -100, startScroll: 0, endScroll: 0.6},
      rect_rgb_green: {startValue: 300, endValue: 0, startScroll: 0, endScroll: 0.6},
      rect_width: {startValue: 50, endValue: 100, startScroll: 0.1, endScroll: 0.25}
    }
  };

  // 크기 세팅
  function setLayoutSize () {
    sceneInfo.sceneHeight = sceneInfo.sceneHeightNum * window.innerHeight;
    sceneInfo.dom.container.style.height = `${sceneInfo.sceneHeight}px`;
  }

  // 애니메이션 값 계산
  function calcValue (setting) {
    const partScrollStart = setting.startScroll * sceneInfo.sceneHeight;
    const partScrollEnd = setting.endScroll * sceneInfo.sceneHeight;
    const partScrollHeight = partScrollEnd - partScrollStart;

    if (yOffset >= partScrollStart && yOffset <= partScrollEnd) {
      return (yOffset - partScrollStart) / partScrollHeight * (setting.endValue - setting.startValue) + setting.startValue;
    } else if (yOffset < partScrollStart) {
      return setting.startValue;
    } else if (yOffset > partScrollEnd) {
      return setting.endValue;
    }
  }

  // 스크롤
  function playAnimation () {
    const dom = sceneInfo.dom;
    const settings = sceneInfo.settings;
    const sceneHeight = sceneInfo.sceneHeight;
    const scrollRatio = yOffset / sceneHeight;

    console.log(scrollRatio);

    dom.message1.style.background = `linear-gradient(150deg, rgb(15, 68, 167) ${calcValue(settings.message1_rgb_blue)}%, rgb(217, 90, 90) ${calcValue(settings.message1_rgb_red)}%, rgb(76, 167, 84) ${calcValue(settings.message1_rgb_green)}%)`;
    dom.message1.style.setProperty('-webkit-background-clip', 'text');
    dom.rect.style.transform = `rotateX(${calcValue(settings.rect_rotateX)}deg) rotateY(${calcValue(settings.rect_rotateY)}deg) rotateZ(0deg)`;
    // dom.rect.style.transform = `rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    dom.rect.style.width = `${calcValue(settings.rect_width)}%`;
    dom.rect.style.opacity = `${calcValue(settings.rect_opacity)}`;
    dom.rect.style.background = `linear-gradient(150deg, rgb(15, 68, 167) ${calcValue(settings.rect_rgb_blue)}%, rgb(217, 90, 90) ${calcValue(settings.rect_rgb_red)}%, rgb(76, 167, 84) ${calcValue(settings.rect_rgb_green)}%)`;
  }

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset; // 현재 스크롤 위치
    playAnimation();
  });

  window.addEventListener('load', () => {
    setLayoutSize();
  });

  window.addEventListener('resize', setLayoutSize);

  setLayoutSize();
})();
