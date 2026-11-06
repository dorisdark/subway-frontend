document.addEventListener('DOMContentLoaded', () => {
    const cardSection = document.getElementById('CardSection');
    const nextStepBtn = document.getElementById('NextStepBtn');

    // 1. 定義步驟二的口味與尺寸資料陣列（未來也可從後台或設定檔讀取）
    const flavorItems = [
        { id: "6-inches", name: "6吋", img: "Assets/img/6-bread.png" },
        { id: "12-inches", name: "12吋", img: "Assets/img/12-bread.png" },
    ];

    let selectedFlavor = "";

    // 2. 動態渲染卡片
    function renderCards() {
        if (!cardSection) return;
        
        cardSection.innerHTML = flavorItems.map(item => `
            <div class="card-summary" data-id="${item.id}" data-name="${item.name}">
                <div class="card-img">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="radio-circle"></div> 
                </div>
                <div class="card-title">${item.name}</div>
            </div>
        `).join('');
    }

    renderCards();

    // 3. 監聽點擊事件
    if (cardSection) {
        cardSection.addEventListener('click', (e) => {
            const card = e.target.closest('.card-summary');
            if (!card) return;

            // 移除其他卡片的 active 狀態
            document.querySelectorAll('.card-summary').forEach(c => c.classList.remove('active'));

            // 設定當前點擊卡片為 active
            card.classList.add('active');

            // 取得選取的口味尺寸名稱
            selectedFlavor = card.getAttribute('data-name');

            // 顯示下一步按鈕
            if (nextStepBtn) {
                nextStepBtn.style.display = 'flex';
            }
        });
    }

    // 4. 點擊「下一步」按鈕處理
    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', () => {
            if (!selectedFlavor) return;

            // 將選擇的口味/尺寸存入全域狀態 (step.js)
            if (typeof saveOrderState === 'function') {
                saveOrderState({ flavor: selectedFlavor });
            }

            // 跳轉至步驟 3
            window.location.href = "step3.html";
        });
    }
});