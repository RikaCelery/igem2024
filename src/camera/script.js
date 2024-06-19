// 获取视频和画布元素
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
// const originalCanvas = document.getElementById('originalCanvas');
const type1Canvas = document.getElementById('type1Canvas');
const type2Canvas = document.getElementById('type2Canvas');
const type3Canvas = document.getElementById('type3Canvas');
const fileInput = document.getElementById('fileInput');

// 获取画布2D上下文
const ctx = canvas.getContext('2d');
// const originalCtx = originalCanvas.getContext('2d');
const type1Ctx = type1Canvas.getContext('2d');
const type2Ctx = type2Canvas.getContext('2d');
const type3Ctx = type3Canvas.getContext('2d');

// 启动摄像头
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    // video.srcObject = stream;
    // video.play();
  })
  .catch(err => {
    console.error('无法访问摄像头:', err);
  });

// 处理文件上传
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        // originalCanvas.width = img.width;
        // originalCanvas.height = img.height;
        type1Canvas.width = img.width;
        type1Canvas.height = img.height;
        type2Canvas.width = img.width;
        type2Canvas.height = img.height;
        type3Canvas.width = img.width;
        type3Canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        processImage();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});
function captureAndDraw(){
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  processImage();
}
// setInterval(captureAndDraw,10)
// 捕获并处理图像
const captureBtn = document.getElementById('captureBtn');
captureBtn.addEventListener('click', () => {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  processImage();
});

function processImage() {
  // 获取图像数据
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // 绘制原始图像
//   originalCtx.putImageData(imageData, 0, 0);
  // 模拟1型色盲
  var filter = getMachadoMatrix("Protanomaly",100)
  for (let i = 0; i < data.length; i += 4) {
    let f = filter([data[i],data[i+1],data[i+2],data[i+3]]);
    data[i] = f[0]
    data[i+1] = f[1]
    data[i+2] = f[2]
    data[i+3] = 255
  }
  type1Ctx.putImageData(imageData, 0, 0);

  // 模拟2型色盲
  var filter = getMachadoMatrix("Deuteranomaly",100)
  for (let i = 0; i < data.length; i += 4) {
    let f = filter([data[i],data[i+1],data[i+2],data[i+3]]);
    data[i] = f[0]
    data[i+1] = f[1]
    data[i+2] = f[2]
    data[i+3] = 255
  }
  type2Ctx.putImageData(imageData, 0, 0);

  // 模拟3型色盲
  var filter = getMachadoMatrix("Tritanomaly",100)
  for (let i = 0; i < data.length; i += 4) {
    let f = filter([data[i],data[i+1],data[i+2],data[i+3]]);
    data[i] = f[0]
    data[i+1] = f[1]
    data[i+2] = f[2]
    data[i+3] = 255
  }
  type3Ctx.putImageData(imageData, 0, 0);
}