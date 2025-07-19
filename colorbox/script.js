document.addEventListener('DOMContentLoaded', () => {
  // カラーカードのコピー処理
  document.querySelectorAll('.color-card').forEach(card => {
    card.addEventListener('click', () => {
      const hex = card.getAttribute('data-hex');
      navigator.clipboard.writeText(hex).then(() => {
        const copied = document.getElementById('copied');
        copied.style.opacity = 1;
        setTimeout(() => {
          copied.style.opacity = 0;
        }, 1000);
      });
    });
  });

  // ✅ モーダル表示切り替え
  const modal = document.getElementById('colorModal');
  const btn = document.querySelector('.add-button');
  const span = document.querySelector('.close');

  btn.onclick = () => modal.style.display = "block";
  span.onclick = () => modal.style.display = "none";
  window.onclick = event => {
    if (event.target === modal) modal.style.display = "none";
  };

  // ✅ カラー追加処理（ローカルストレージ付き）
  const colorGrid = document.querySelector('.color-grid');
  const nameInput = document.getElementById('colorName');
  const codeInput = document.getElementById('colorCode');
  const noteInput = document.getElementById('colorNote');
  const addColorBtn = document.getElementById('addColorBtn');

  function saveColorsToStorage(colors) {
    localStorage.setItem('myColors', JSON.stringify(colors));
  }

  function loadColorsFromStorage() {
    const saved = localStorage.getItem('myColors');
    return saved ? JSON.parse(saved) : [];
  }

function renderColorCard({ name, code, note }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'color-card-wrapper';

  const card = document.createElement('div');
  card.className = 'color-card';
  card.setAttribute('data-hex', code);
  card.style.backgroundColor = code;
  card.innerHTML = `
    <span class="label">${name}<br>${code}</span>
    <button class="delete-btn">×</button>
  `;

  card.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) return;
    navigator.clipboard.writeText(code).then(() => {
      const copied = document.getElementById('copied');
      copied.style.opacity = 1;
      setTimeout(() => copied.style.opacity = 0, 1000);
    });
  });

  card.querySelector('.delete-btn').addEventListener('click', () => {
    wrapper.remove();
    const updated = loadColorsFromStorage().filter(c => !(c.name === name && c.code === code));
    saveColorsToStorage(updated);
  });

  // 説明文
  const noteEl = document.createElement('div');
  noteEl.className = 'note';
  noteEl.textContent = note;

  // 包む
  wrapper.appendChild(card);
  wrapper.appendChild(noteEl);
  colorGrid.appendChild(wrapper);
}


  // ✅ 色追加ボタンクリック
  addColorBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const code = codeInput.value.trim();
    const note = noteInput.value.trim();
    if (!name || !code) return alert('色名とカラーコードを入力してください！');
    const newColor = { name, code, note };
    renderColorCard(newColor);
    const savedColors = loadColorsFromStorage();
    saveColorsToStorage([...savedColors, newColor]);
    nameInput.value = '';
    codeInput.value = '';
    noteInput.value = '';
    modal.style.display = 'none';
  });

  // ✅ 初期ロード：保存済みカラーを表示
  const savedColors = loadColorsFromStorage();
  savedColors.forEach(renderColorCard);
});
