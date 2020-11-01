(() => {
  let yOffset = window.pageYOffset;
  const sceneInfo = {
    sceneHeightNum: 5, // 브라우저 높이의 sceneHeightNum 배로 scene의 높이 세팅할 것임
    sceneHeight: 0, // scene의 높이
    imagesPaths: [
      './images/blend-image-1.jpg',
      './images/blend-image-2.jpg',
    ],
    images: [], // 이미지 dom 객체들을 담을 배열
    rectStartY: 0,
    dom: {
      container: document.querySelector('#scene'),
      canvasCaption: document.querySelector('.canvas-caption'),
      canvas: document.querySelector('.image-blend-canvas'),
    },
    settings: {
      rect1: {startValue: 0, endValue: 0, startScroll: 0, endScroll: 0},
      rect2: {startValue: 0, endValue: 0, startScroll: 0, endScroll: 0},
      blendHeight: {startValue: 0, endValue: 0, startScroll: 0, endScroll: 0},
      canvas_scale: {startValue: 0, endValue: 0, startScroll: 0, endScroll: 0},
      canvasCaption_opacity: {startValue: 0, endValue: 1, startScroll: 0, endScroll: 0},
      canvasCaption_translateY: {startValue: 20, endValue: 0, startScroll: 0, endScroll: 0},
    },
  };

  // 캔버스 이미지 세팅
  function setCanvasImages () {
    for (let i = 0; i < sceneInfo.imagesPaths.length; i++) {
      let imgElem = new Image();
      imgElem.src = sceneInfo.imagesPaths[i];
      sceneInfo.images.push(imgElem);
    }
  }

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
    let step = 0;

    // 가로/세로 모두 꽉 차게 하기 위해서 여기서 세팅(계산 필요)
    const widthRatio = window.innerWidth / sceneInfo.dom.canvas.width;
    const heightRatio = window.innerHeight / sceneInfo.dom.canvas.height;
    let canvasScaleRatio;

    if (widthRatio <= heightRatio) {
      // 캔버스보다 브라우저 창이 홀쭉한 경우
      canvasScaleRatio = heightRatio;
    } else {
      // 캔버스보다 브라우저 창이 납작한 경우
      canvasScaleRatio = widthRatio;
    }

    dom.canvas.style.transform = `scale(${canvasScaleRatio})`;
    dom.canvas.getContext('2d').fillStyle = '#ffffff';
    dom.canvas.getContext('2d').drawImage(sceneInfo.images[0], 0, 0);

    // 캔버스 사이즈에 맞춰 가정한 innerWidth/innerHeight
    const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
    const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

    if (!sceneInfo.rectStartY) {
      sceneInfo.rectStartY = dom.canvas.offsetTop + (dom.canvas.height - dom.canvas.height * canvasScaleRatio) / 2; // scale이 조정된 크기를 기준으로 top의 위치 계산
      settings.rect1.startScroll = (window.innerHeight / 2) / sceneHeight;
      settings.rect2.startScroll = (window.innerHeight / 2) / sceneHeight;
      settings.rect1.endScroll = sceneInfo.rectStartY / sceneHeight;
      settings.rect2.endScroll = sceneInfo.rectStartY / sceneHeight;
    }

    const whiteRectWidth = recalculatedInnerWidth * 0.15;
    settings.rect1.startValue = (dom.canvas.width - recalculatedInnerWidth) / 2;
    settings.rect1.endValue = settings.rect1.startValue - whiteRectWidth;
    settings.rect2.startValue = settings.rect1.startValue + recalculatedInnerWidth - whiteRectWidth;
    settings.rect2.endValue = settings.rect2.startValue + whiteRectWidth;

    // 좌우 박스 그리기
    dom.canvas.getContext('2d').fillRect(parseInt(calcValue(settings.rect1)), 0, whiteRectWidth, dom.canvas.height);
    dom.canvas.getContext('2d').fillRect(parseInt(calcValue(settings.rect2)), 0, whiteRectWidth, dom.canvas.height);

    if (scrollRatio < settings.rect1.endScroll) { // 캔버스가 브라우저 상단에 닿기 전
      step = 1;
      dom.canvas.classList.remove('sticky');
    } else { // 닿은 후
      // 이미지 블렌드
      step = 2;

      // blendHeight: {startValue: 0, endValue: 0, startScroll: 0, endScroll: 0},
      settings.blendHeight.startValue = 0;
      settings.blendHeight.endValue = dom.canvas.height;
      settings.blendHeight.startScroll = settings.rect1.endScroll;
      settings.blendHeight.endScroll = settings.blendHeight.startScroll + 0.2;

      const blendHeight = calcValue(settings.blendHeight );

      dom.canvas.getContext('2d').drawImage(sceneInfo.images[1],
          0, dom.canvas.height - blendHeight, dom.canvas.width, blendHeight,
          0, dom.canvas.height - blendHeight, dom.canvas.width, blendHeight,
      );


      dom.canvas.classList.add('sticky');
      dom.canvas.style.top = `${-(dom.canvas.height - dom.canvas.height * canvasScaleRatio) / 2}px`;

      if (scrollRatio > settings.blendHeight.endScroll) {
        step = 3;
        settings.canvas_scale.startValue = canvasScaleRatio;
        settings.canvas_scale.endValue = document.body.offsetWidth / (dom.canvas.width * 1.5);
        settings.canvas_scale.startScroll = settings.blendHeight.endScroll;
        settings.canvas_scale.endScroll = settings.canvas_scale.startScroll + 0.2;

        dom.canvas.style.transform = `scale(${calcValue(settings.canvas_scale)})`;
        dom.canvas.style.marginTop = `0px`;
      }

      if (scrollRatio > settings.canvas_scale.endScroll && settings.canvas_scale.endScroll > 0) {
        dom.canvas.classList.remove('sticky');
        dom.canvas.style.marginTop = `${sceneHeight * 0.4}px`;
      }
    }
  }

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset; // 현재 스크롤 위치
    playAnimation();
  });

  window.addEventListener('load', () => {
    setLayoutSize();
    playAnimation();
  });

  window.addEventListener('resize', () => {
    setLayoutSize();
    playAnimation();
  });

  setCanvasImages();
  setLayoutSize();
})();
