document.addEventListener('DOMContentLoaded', () => {
    const sizeCardSection = document.getElementById('SizeCardSection');
    const flavorCardSection = document.getElementById('FlavorCardSection');
    const nextStepBtn = document.getElementById('NextStepBtn');

    // 1. 尺寸資料陣列
    const sizeItems = [
        { id: "size_6", name: "6吋", img: "Assets/img/6-bread.png" },
        { id: "size_12", name: "12吋", img: "Assets/img/12-bread.png" }
    ];

    // 2. 口味資料陣列（支援詳細介紹文字描述）
    const flavorItems = [
        {
            id: "white",
            name: "白麵包",
            img: "Assets/img/white-bread.png",
            desc: "<strong>主要成分：</strong>小麥麵粉。<br><strong>最佳搭配：</strong>因為味道百搭，幾乎適合所有口味的肉類與醬料，適合口味濃郁、醬汁較多的品項，如肉丸或美乃滋系列。"
        },
        {
            id: "wheat",
            name: "小麥麵包",
            img: "Assets/img/wheat-bread.png",
            desc: "<strong>主要成分：</strong>全麥麵粉、糙米、燕麥、大麥。<br><strong>最佳搭配：</strong>適合搭配鮪魚、素食蔬菜堡、香烤雞肉，或是淋上一點紅酒醋、橄欖油。"
        },
        {
            id: "parmesan",
            name: "巴馬乾酪麵包",
            img: "Assets/img/parmesan-bread.png",
            desc: "<strong>主要成分：</strong>白麵包基底，但在烘烤前表面撒上了帕瑪森起司粉與奧勒岡葉等香草。<br><strong>最佳搭配：</strong>非常適合搭配各種肉類(如義大利經典、火牛等)，如果加熱烘烤(Toasted)，起司融化的風味會更加分。"
        },
        {
            id: "honey Oatmeal",
            name: "蜂蜜面燕麥麵包",
            img: "Assets/img/honey Oatmeal-bread.png",
            desc: "<strong>主要成分：</strong>小麥麵包基底、表面在烘烤前會撒上一層燕麥並淋上蜂蜜。<br><strong>最佳搭配：</strong>很適合搭配烤雞肉、燻雞、火腿等清爽口味，或是搭配甜蔥醬、蜂蜜芥末醬，能讓整體的香甜層次更突出。"
        },
        {
            id: "Flame-baked",
            name: "火焰烤餅",
            img: "Assets/img/Flame-baked-bread.png",
            desc: "<strong>主要成分：</strong>麵粉、水、酵母，類似中東餅皮。<br><strong>最佳搭配：</strong>非常適合包覆醬汁較多、配料豐富的品項（如西南烤雞、庫樂烤雞），因為餅皮紮實不容易破，能完美鎖住內餡。"
        }
       
    ];
  

    let selectedSize = "";
    let selectedFlavor = ""; // 修正拼寫變數

    // 3. 渲染尺寸卡片
    function renderSizeCards() {
        if (!sizeCardSection) return;
        sizeCardSection.innerHTML = sizeItems.map(item => `
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
        if (!flavorCardSection) return;
        flavorCardSection.innerHTML = flavorItems.map(item => `
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