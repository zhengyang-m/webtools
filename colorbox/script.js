document.addEventListener("DOMContentLoaded", () => {
  const copiedMsg = document.getElementById("copied");
  const colorCards = document.querySelectorAll(".colorbox-card");

  colorCards.forEach(card => {
    card.addEventListener("click", () => {
      const hex = card.getAttribute("data-hex");
      navigator.clipboard.writeText(hex).then(() => {
        copiedMsg.style.display = "block";
        setTimeout(() => {
          copiedMsg.style.display = "none";
        }, 1500);
      });
    });
  });

  const modal = document.getElementById("colorModal");
  const openBtn = document.getElementById("openModal");
  const closeBtn = document.getElementById("closeModal");
  const addColorBtn = document.getElementById("addColorBtn");
  const container = document.getElementById("colorContainer");

  console.log("✅ JS読み込みOK");

  openBtn.addEventListener("click", () => {
    console.log("🟢 モーダル開く");
    modal.style.display = "flex";
  });

  closeBtn.addEventListener("click", () => {
    console.log("🔴 モーダル閉じる");
    modal.style.display = "none";
  });

  window.addEventListener("click", e => {
    if (e.target === modal) {
      console.log("🟡 背景クリックでモーダル閉じる");
      modal.style.display = "none";
    }
  });

  addColorBtn.addEventListener("click", () => {
    const name = document.getElementById("colorName").value;
    const hex = document.getElementById("colorCode").value;
    const note = document.getElementById("colorNote").value;

    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      alert("正しいHEXコードを入力してください");
      return;
    }

    const div = document.createElement("div");
    div.innerHTML = `
      <div class="colorbox-card" data-hex="${hex}" style="background-color: ${hex}">
        <span class="label">${name}<br>${hex}</span>
      </div>
      <p class="note">${note}</p>
    `;
    container.appendChild(div);

    div.querySelector(".colorbox-card").addEventListener("click", () => {
      navigator.clipboard.writeText(hex).then(() => {
        copiedMsg.style.display = "block";
        setTimeout(() => {
          copiedMsg.style.display = "none";
        }, 1500);
      });
    });

    modal.style.display = "none";
  });
});
