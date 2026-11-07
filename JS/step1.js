document.addEventListener('DOMContentLoaded', () => {
    const cardSection = document.getElementById('CardSection');
    const heatSection = document.getElementById('HeatSection');
    const nextStepBtn = document.getElementById('NextStepBtn');

    // 1. 主餐資料陣列
    const categoryItems = [
        { id: "bread", name: "麵包", img: "Assets/img/bread.png" },
        { id: "salad", name: "沙拉", img: "Assets/img/salad.png" }
    ];

    // 2. 加熱選項資料陣列
    const heatItems = [
        { id: "heat_yes", name: "要加熱", img: "Assets/img/heating.png" },      // 請對應你的圖片路徑
        { id: "heat_no", name: "不要加熱", img: "Assets/img/no-heat.png" }  // 請對應你的圖片路徑
    ];

    let selectedCategory = "";
    let selectedHeat = "";

    // 3. 渲染主餐卡片
    function renderCategoryCards() {
        if (!cardSection) return;
        cardSection.innerHTML = categoryItems.map(item => `
            <div class="card-summary" data-id="${item.id}" data-name="${item.name}">
                <div class="card-img">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="radio-circle"></div> 
                </div>
                <div class="card-title">${item.name}</div>
            </div>
        `).join('');
    }

    // 4. 渲染加熱選項卡片
    function renderHeatCards() {
        if (!heatSection) return;
        heatSection.innerHTML = heatItems.map(item => `
            <div class="heat-card card-summary" data-id="${item.id}" data-name="${item.name}">
                <div class="card-img">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="radio-circle"></div> 
                </div>
                <div class="card-title">${item.name}</div>
            </div>
        `).join('');
    }

    // 先執行畫面渲染
    renderCategoryCards();
    renderHeatCards();

    // 5. 檢查是否該顯示「下一步」按鈕
    function checkAndShowNextButton() {
        if (selectedCategory === "麵包") {
            // 如果選麵包，必須連「加熱選項」也選了才顯示下一步
            if (selectedCategory && selectedHeat) {
                nextStepBtn.style.display = 'flex';
            } else {
                nextStepBtn.style.display = 'none';
            }
        } else if (selectedCategory === "沙拉") {
            // 如果選沙拉，選完沙拉就可以直接顯示下一步
            nextStepBtn.style.display = 'flex';
        }
    }

    // 6. 💡 頁面載入時：從 step.js / localStorage 把之前存的狀態讀回來並還原
    if (typeof getOrderState === 'function') {
        const savedState = getOrderState(); // 取得目前的點餐狀態物件
        
        // 如果之前有選過主餐 (category)
        if (savedState.category) {
            selectedCategory = savedState.category;
            
            // 尋找對應的主餐卡片並加上 active
            const targetCard = cardSection.querySelector(`[data-name="${selectedCategory}"]`);
            if (targetCard) {
                targetCard.classList.add('active');
            }

            // 如果選的是「麵包」，要把加熱區塊展開，並還原加熱狀態
            if (selectedCategory === "麵包") {
                heatSection.style.display = 'grid';
                
                if (savedState.heat && savedState.heat !== "不適用") {
                    selectedHeat = savedState.heat;
                    const targetHeatCard = heatSection.querySelector(`[data-name="${selectedHeat}"]`);
                    if (targetHeatCard) {
                        targetHeatCard.classList.add('active');
                    }
                }
            } else {
                heatSection.style.display = 'none';
            }

            // 檢查是否要顯示下一步按鈕
            checkAndShowNextButton();
        }
    }

    // 7. 監聽主餐點擊事件
    if (cardSection) {
        cardSection.addEventListener('click', (e) => {
            const card = e.target.closest('.card-summary');
            if (!card) return;

            cardSection.querySelectorAll('.card-summary').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            selectedCategory = card.getAttribute('data-name');
            console.log("已選擇主餐：", selectedCategory);

            // 邏輯控制：如果點選「麵包」，展開加熱選項；如果點選「沙拉」，隱藏加熱選項並清空加熱狀態
            if (selectedCategory === "麵包") {
                heatSection.style.display = 'grid'; // 顯示加熱區塊
                selectedHeat = ""; // 重設加熱選項
                heatSection.querySelectorAll('.card-summary').forEach(c => c.classList.remove('active'));
                nextStepBtn.style.display = 'none'; // 尚未選加熱前隱藏下一步
            } else {
                heatSection.style.display = 'none'; // 隱藏加熱區塊
                selectedHeat = "不適用"; // 沙拉不需要加熱
                nextStepBtn.style.display = 'flex'; // 直接顯示下一步
            }
        });
    }

    // 8. 監聽加熱選項點擊事件
    if (heatSection) {
        heatSection.addEventListener('click', (e) => {
            const card = e.target.closest('.heat-card');
            if (!card) return;

            heatSection.querySelectorAll('.heat-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            selectedHeat = card.getAttribute('data-name');
            console.log("已選擇加熱狀態：", selectedHeat);

            // 檢查是否顯示下一步
            checkAndShowNextButton();
        });
    }

    // 9. 點擊「下一步」按鈕
    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', () => {
            if (!selectedCategory) return;

            // 存入全域狀態 (step.js)
            if (typeof saveOrderState === 'function') {
                saveOrderState({ 
                    category: selectedCategory, 
                    heat: selectedHeat 
                });
            }

            // 跳轉至步驟 2
            window.location.href = "step2.html";
        });
    }
});