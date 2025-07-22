document.addEventListener("DOMContentLoaded", () => {
  const maxOptions = 10;
  let options = ["選択肢1", "選択肢2", "選択肢3", "選択肢4", "選択肢5"];
  const inputArea = document.getElementById("input-area");
  const canvas = document.getElementById("roulette-canvas");
  const ctx = canvas.getContext("2d");
  const resultDisplay = document.getElementById("result-display");
  const spinButton = document.getElementById("spin-button");

  const radius = canvas.width / 2;
  canvas.height = canvas.width;

  function renderInputs() {
    inputArea.innerHTML = "";
    options.forEach((text, index) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <input type="text" value="${text}" data-index="${index}" />
        ${options.length > 2 ? `<button data-remove="${index}">削除</button>` : ""}
      `;
      inputArea.appendChild(div);
    });

    inputArea.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", (e) => {
        const i = Number(e.target.dataset.index);
        options[i] = e.target.value;
        drawRoulette();
      });
    });

    inputArea.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.remove);
        options.splice(i, 1);
        renderInputs();
        drawRoulette();
      });
    });
  }

  function drawRoulette() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const num = options.length;
    const angle = (2 * Math.PI) / num;

    options.forEach((opt, i) => {
      const start = i * angle;
      const end = start + angle;

      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, start, end);
      ctx.fillStyle = `hsl(${i * 360 / num}, 80%, 75%)`;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(start + angle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#333";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(opt, radius - 10, 5);
      ctx.restore();
    });
  }

 function spinRoulette() {
  const num = options.length;
  const anglePerSlice = 360 / num;

  let angle = 0;
  const totalRotation = 360 * 5 + Math.floor(Math.random() * 360); // 5周以上のランダム角度

  const spinInterval = setInterval(() => {
    angle += 20;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(radius, radius);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.translate(-radius, -radius);
    drawRoulette();

    if (angle >= totalRotation) {
      clearInterval(spinInterval);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      drawRoulette();

      const finalAngle = totalRotation % 360;
      const adjustedAngle = (360 - (finalAngle % 360) + anglePerSlice / 2) % 360;
      const hitIndex = Math.floor(adjustedAngle / anglePerSlice) % num;
      resultDisplay.textContent = `🎯 ${options[hitIndex]} 🎯`;
    }
  }, 30);
}


  document.getElementById("add-option").addEventListener("click", () => {
    if (options.length < maxOptions) {
      options.push(`選択肢${options.length + 1}`);
      renderInputs();
      drawRoulette();
    }
  });

  spinButton.addEventListener("click", spinRoulette);

  renderInputs();
  drawRoulette();
});
