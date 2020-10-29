(() => {
  let yOffset = window.pageYOffset;
  const sceneInfo = {
    sceneHeightNum: 10, // 브라우저 높이의 sceneHeightNum 배로 sceneHeight 세팅
    sceneHeight: 0,
    videoImageCount: 499,
    videoImages: [],
    dom: {
      container: document.querySelector('#scroll-section'),
      message1: document.querySelector('#scroll-section .main-message-1'),
      message2: document.querySelector('#scroll-section .main-message-2'),
      message3: document.querySelector('#scroll-section .main-message-3'),
      message4: document.querySelector('#scroll-section .main-message-4'),
      canvas: document.querySelector('#video-canvas'),
    },
    settings: {
      imageSequence: {startValue: 1, endValue: 500, startScroll: 0, endScroll: 1},
      message1_opacity_in: {startValue: 0, endValue: 1, startScroll: 0.1, endScroll: 0.2},
      message1_opacity_out: {startValue: 1, endValue: 0, startScroll: 0.25, endScroll: 0.3},
      message1_translateY_in: {startValue: 20, endValue: 0, startScroll: 0.1, endScroll: 0.2},
      message1_translateY_out: {startValue: 0, endValue: -20, startScroll: 0.25, endScroll: 0.3},
      message2_opacity_in: {startValue: 0, endValue: 1, startScroll: 0.3, endScroll: 0.4},
      message2_opacity_out: {startValue: 1, endValue: 0, startScroll: 0.45, endScroll: 0.5},
      message2_translateY_in: {startValue: 20, endValue: 0, startScroll: 0.3, endScroll: 0.4},
      message2_translateY_out: {startValue: 0, endValue: -20, startScroll: 0.45, endScroll: 0.5},
      message3_opacity_in: {startValue: 0, endValue: 1, startScroll: 0.5, endScroll: 0.6},
      message3_opacity_out: {startValue: 1, endValue: 0, startScroll: 0.65, endScroll: 0.7},
      message3_translateY_in: {startValue: 20, endValue: 0, startScroll: 0.5, endScroll: 0.6},
      message3_translateY_out: {startValue: 0, endValue: -20, startScroll: 0.65, endScroll: 0.7},
      message4_opacity_in: {startValue: 0, endValue: 1, startScroll: 0.7, endScroll: 0.8},
      message4_opacity_out: {startValue: 1, endValue: 0, startScroll: 0.85, endScroll: 0.9},
      message4_translateY_in: {startValue: 20, endValue: 0, startScroll: 0.7, endScroll: 0.8},
      message4_translateY_out: {startValue: 0, endValue: -20, startScroll: 0.85, endScroll: 0.9},
    }
  };

  function setVideoImages () {
    for (let i = 0; i < sceneInfo.videoImageCount; i++) {
      let imgElem = new Image();
      imgElem.src = `./images/sunrise/Sunrise ${(i + 1).toString().padStart(3, '0')}.jpg`;
      sceneInfo.videoImages.push(imgElem);
    }
  }

  // 크기 세팅
  function setLayoutSize () {
    sceneInfo.sceneHeight = sceneInfo.sceneHeightNum * window.innerHeight;
    sceneInfo.dom.container.style.height = `${sceneInfo.sceneHeight}px`;
    const heightRatio = window.innerHeight / sceneInfo.dom.canvas.height;
    sceneInfo.dom.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
  }

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

  function playAnimation () {
    const dom = sceneInfo.dom;
    const settings = sceneInfo.settings;
    const sceneHeight = sceneInfo.sceneHeight;
    const scrollRatio = yOffset / sceneHeight;

    let sequence = Math.round(calcValue(settings.imageSequence));
    dom.canvas.getContext('2d').drawImage(sceneInfo.videoImages[sequence], 0, 0);

    if (scrollRatio <= 0.22) {
      dom.message1.style.opacity = calcValue(settings.message1_opacity_in);
      dom.message1.style.transform = `translate3d(0, ${calcValue(settings.message1_translateY_in)}%, 0)`;
    } else {
      dom.message1.style.opacity = calcValue(settings.message1_opacity_out);
      dom.message1.style.transform = `translate3d(0, ${calcValue(settings.message1_translateY_out)}%, 0)`;
    }
    if (scrollRatio <= 0.42) {
      dom.message2.style.opacity = calcValue(settings.message2_opacity_in);
      dom.message2.style.transform = `translate3d(0, ${calcValue(settings.message2_translateY_in)}%, 0)`;
    } else {
      dom.message2.style.opacity = calcValue(settings.message2_opacity_out);
      dom.message2.style.transform = `translate3d(0, ${calcValue(settings.message2_translateY_out)}%, 0)`;
    }
    if (scrollRatio <= 0.62) {
      dom.message3.style.opacity = calcValue(settings.message3_opacity_in);
      dom.message3.style.transform = `translate3d(0, ${calcValue(settings.message3_translateY_in)}%, 0)`;
    } else {
      dom.message3.style.opacity = calcValue(settings.message3_opacity_out);
      dom.message3.style.transform = `translate3d(0, ${calcValue(settings.message3_translateY_out)}%, 0)`;
    }
    if (scrollRatio <= 0.82) {
      dom.message4.style.opacity = calcValue(settings.message4_opacity_in);
      dom.message4.style.transform = `translate3d(0, ${calcValue(settings.message4_translateY_in)}%, 0)`;
    } else {
      dom.message4.style.opacity = calcValue(settings.message4_opacity_out);
      dom.message4.style.transform = `translate3d(0, ${calcValue(settings.message4_translateY_out)}%, 0)`;
    }
  }

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset; // 현재 스크롤 위치
    playAnimation();
  });

  window.addEventListener('load', () => {
    setLayoutSize();
    let sequence = Math.round(calcValue(sceneInfo.settings.imageSequence));
    sceneInfo.dom.canvas.getContext('2d').drawImage(sceneInfo.videoImages[sequence], 0, 0);
  });

  window.addEventListener('resize', setLayoutSize);

  setVideoImages();
  setLayoutSize();
})();
