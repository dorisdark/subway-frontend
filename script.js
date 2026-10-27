// 確保網頁 DOM 元素都載入完成後再執行
document.addEventListener('DOMContentLoaded', () => {
    const stepButtons = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.card');
    const nextBtn = document.querySelector('.next-btn'); 
    const orderModal = document.getElementById('orderModal');
    const orderContentBtn = document.getElementById('orderContentBtn'); // 右上角「訂單內容」按鈕
    const closeModalBtn = document.getElementById('closeModalBtn'); // 右上角 X
    const continueBtn = document.getElementById('continueBtn'); // 繼續點餐按鈕

    // 步驟按鈕切換邏輯
    stepButtons.forEach(button => {
        button.addEventListener('click', () => {
            stepButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // 卡片單選邏輯
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            if (nextBtn) {
                nextBtn.classList.add('show');
            }
        });
    });

    // 1. 開啟 Modal（點擊右上角「訂單內容」）
    if (orderContentBtn) {
        orderContentBtn.addEventListener('click', () => {
            if (orderModal) {
                orderModal.classList.add('active');
            }
        });
    }

    // 2. 關閉 Modal（點 X 按鈕）
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (orderModal) {
                orderModal.classList.remove('active');
            }
        });
    }

    // 3. 關閉 Modal（點「繼續點餐」按鈕）
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            if (orderModal) {
                orderModal.classList.remove('active');
            }
        });
    }

    // 4. 點擊 Modal 外圍灰色遮罩也能關閉
    if (orderModal) {
        orderModal.addEventListener('click', (e) => {
            if (e.target === orderModal) {
                orderModal.classList.remove('active');
            }
        });
    }
});