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
  function onScroll () {
    const dom = sceneInfo.dom;
    const settings = sceneInfo.settings;
    const sceneHeight = sceneInfo.sceneHeight;
    const scrollRatio = yOffset / sceneHeight;

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
  }

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset; // 현재 스크롤 위치
    onScroll();
  });

  window.addEventListener('load', () => {
    setLayoutSize();
  });

  window.addEventListener('resize', setLayoutSize);

  setCanvasImages();
  setLayoutSize();
})();
