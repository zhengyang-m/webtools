const uploadInput = document.getElementById('upload');
const downloadArea = document.getElementById('download');
const dropArea = document.getElementById('drop-area');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const zip = new JSZip();
let imageCount = 0;

uploadInput.addEventListener('change', (e) => {
  const files = e.target.files;
  handleFiles(files);
});

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, (e) => {
    e.preventDefault();π
    dropArea.classList.add('hover');
  });
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    dropArea.classList.remove('hover');
  });
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('hover');
  const files = e.dataTransfer.files;
  handleFiles(files);
});

function handleFiles(files) {
  downloadArea.innerHTML = '';
  imageCount = 0;
  zip.files = {}; // zipの中身を初期化

  Array.from(files).forEach((file, index) => {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = function(e) {
      img.src = e.target.result;
    };

img.onload = function() {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const webpData = canvas.toDataURL('image/webp');

  const originalName = file.name.replace(/\.[^/.]+$/, ''); // ← ← ★ここ！
  const finalName = `${originalName}.webp`;

  const link = document.createElement('a');
  link.className = "download-button";

  link.href = webpData;
  link.download = finalName; // ← ← ★ここ！
  link.textContent = `${finalName} をダウンロード`;
  link.style.display = 'block';
  link.style.margin = '10px 0';
  downloadArea.appendChild(link);

  zip.file(finalName, webpData.split(',')[1], { base64: true }); // ← ← ★ここ！

  imageCount++;
  if (imageCount === files.length) {
    document.getElementById('download-zip').style.display = 'inline-block';
  }
};


    reader.readAsDataURL(file);
  });
}

// ✅ ZIPボタンの動作は関数の外に置く！
document.getElementById('download-zip').addEventListener('click', () => {
  zip.generateAsync({ type: 'blob' }).then(content => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = 'converted_images.zip';
    a.click();
  });
});
