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
    dom: {
      container: document.querySelector('#scene'),
      canvasCaption: document.querySelector('.canvas-caption'),
      canvas: document.querySelector('.image-blend-canvas'),
    },
    settings: {
      rect1X: {startValue: 0, endValue: 0, startScroll: 0, endScroll: 0},
      rect2X: {startValue: 0, endValue: 0, startScroll: 0, endScroll: 0},
      blendHeight: {startValue: 0, endValue: 0, startScroll: 0, endScroll: 0},
      canvas_scale: {startValue: 0, endValue: 0, startScroll: 0, endScroll: 0},
      canvasCaption_opacity: {startValue: 0, endValue: 1, startScroll: 0, endScroll: 0},
      canvasCaption_translateY: {startValue: 20, endValue: 0, startScroll: 0, endScroll: 0},
      rectStartY: 0,
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
    const heightRatio = window.innerHeight / sceneInfo.dom.canvas.height;
    const widthRatio = window.innerWidth / sceneInfo.dom.canvas.width;

    sceneInfo.sceneHeight = sceneInfo.sceneHeightNum * window.innerHeight;
    sceneInfo.dom.container.style.height = `${sceneInfo.sceneHeight}px`;
    sceneInfo.dom.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${widthRatio > heightRatio ? widthRatio : heightRatio})`;
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

    console.log(scrollRatio);
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
