document.addEventListener('DOMContentLoaded', () => {
    const chickenCardSection= document.getElementById('ChickenCardSection');
    const beefCardSection = document.getElementById('BeefCardSection');
    const pigCardSection = document.getElementById('PigCardSection');
    const fishCardSection = document.getElementById('FishCardSection');
    const comboCardSection = document.getElementById('ComboCardSection');
    const nextStepBtn = document.getElementById('NextStepBtn');

    // 1. 尺寸資料陣列
    const chickenItems = [
        { id: "roasted", name: "香烤雞肉", img: "Assets/img/bread.png" },
        { id: "size_12", name: "12吋", img: "Assets/img/bread.png" }
    ];

    // 2. 口味資料陣列（支援詳細介紹文字描述）
    const beefItems = [
        {
            id: "white",
            name: "白麵包",
            img: "Assets/img/bread.png",
            desc: "<strong>主要成分：</strong>小麥麵粉。<br><strong>最佳搭配：</strong>因為味道百搭，幾乎適合所有口味的肉類與醬料，適合口味濃郁、醬汁較多的品項，如肉丸或美乃滋系列。"
        },
        {
            id: "wheat",
            name: "小麥麵包",
            img: "Assets/img/bread.png",
            desc: "<strong>主要成分：</strong>全麥麵粉、糙米、燕麥、大麥。<br><strong>最佳搭配：</strong>適合搭配鮪魚、素食蔬菜堡、香烤雞肉，或是淋上一點紅酒醋、橄欖油。"
        }
    ];

    let selectedchicken = "";
    let selectedbeef = ""; // 修正拼寫變數

    // 3. 渲染雞肉卡片
    function renderSizeCards() {
        if (!chickenCardSection) return;
        chickenCardSection.innerHTML = chickenItems.map(item => `
            <div class="card-summary size-card" data-name="${item.name}">
                <div class="card-img">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="radio-circle"></div> 
                </div>
                <div class="card-title">${item.name}</div>
            </div>
        `).join('');
    }

    // 4. 渲染口味卡片（包含描述文字區塊）
    function renderFlavorCards() {
        if (!beefCardSection) return;
        beefCardSection.innerHTML =  beefItems.map(item => `
            <div class="card-summary flavor-card" data-name="${item.name}">
                <div class="card-img">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="radio-circle"></div> 
                </div>
                <div class="card-title">${item.name}</div>
                ${item.desc ? `<div class="card-desc">${item.desc}</div>` : ''}
            </div>
        `).join('');
    }

    // 先執行畫面渲染
    renderSizeCards();
    renderFlavorCards();

    // 5. 檢查是否顯示下一步按鈕（尺寸與口味都必須選擇）
    function checkAndShowNextButton() {
        if (selectedSize && selectedFlavor) {
            nextStepBtn.style.display = 'flex';
        } else {
            nextStepBtn.style.display = 'none';
        }
    }

    // 6. 💡 頁面載入時：從 step.js / localStorage 把之前存的狀態讀回來並還原（對齊第一步驟邏輯）
    if (typeof getOrderState === 'function') {
        const savedState = getOrderState(); // 取得目前的點餐狀態物件

        // 還原尺寸
        if (savedState.size) {
            selectedSize = savedState.size;
            const targetSizeCard = sizeCardSection.querySelector(`[data-name="${selectedSize}"]`);
            if (targetSizeCard) {
                targetSizeCard.classList.add('active');
            }
        }

        // 還原口味
        if (savedState.flavor) {
            selectedFlavor = savedState.flavor;
            const targetFlavorCard = flavorCardSection.querySelector(`[data-name="${selectedFlavor}"]`);
            if (targetFlavorCard) {
                targetFlavorCard.classList.add('active');
            }
        }

        // 檢查是否要顯示下一步按鈕
        checkAndShowNextButton();
    }

    // 7. 監聽尺寸點擊（不即時呼叫 saveOrderState，對齊第一步驟）
    if (sizeCardSection) {
        sizeCardSection.addEventListener('click', (e) => {
            const card = e.target.closest('.size-card');
            if (!card) return;

            sizeCardSection.querySelectorAll('.size-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            selectedSize = card.getAttribute('data-name');
            console.log("已選擇尺寸：", selectedSize);

            checkAndShowNextButton();
        });
    }

    // 8. 監聽口味點擊（不即時呼叫 saveOrderState，對齊第一步驟）
    if (flavorCardSection) {
        flavorCardSection.addEventListener('click', (e) => {
            const card = e.target.closest('.flavor-card');
            if (!card) return;

            flavorCardSection.querySelectorAll('.flavor-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            selectedFlavor = card.getAttribute('data-name');
            console.log("已選擇口味：", selectedFlavor);

            checkAndShowNextButton();
        });
    }

    // 9. 點擊「下一步」按鈕：才正式寫入資料並跳轉
    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', () => {
            if (!selectedSize || !selectedFlavor) return;

            // 存入全域狀態 (step.js)
            if (typeof saveOrderState === 'function') {
                saveOrderState({ 
                    size: selectedSize, 
                    flavor: selectedFlavor 
                });
            }

            // 跳轉至步驟 3
            window.location.href = "step3.html";
        });
    }
});