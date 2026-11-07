// ==========================================
// 1. 全域常數與 LocalStorage 狀態管理
// ==========================================
const STORAGE_KEY = 'subway_order_state';

/**
 * 取得目前的訂單狀態資料
 */
function getOrderState() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {
        store: "",       // 內用門市
        tableNumber: "", // 內用桌號
        category: "",    // 主餐類別 (麵包/沙拉)
        heat: "",        // 加熱狀態
        flavor: "",      // 口味/尺寸
        toppings: []     // 配料清單 (陣列)
    };
}

/**
 * 更新並儲存訂單狀態
 * @param {Object} partialState 傳入你想更新的欄位資料
 */
function saveOrderState(partialState) {
    const currentState = getOrderState();
    const updatedState = { ...currentState, ...partialState };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));

    // 更新畫面上的訂單內容與導覽列狀態
    updateOrderSummaryUI();
    updateStepNavCompletedStatus();
}

/**
 * 即時更新「訂單內容」介面呈現
 */
function updateOrderSummaryUI() {
    const state = getOrderState();
    const summaryContainer = document.getElementById('orderSummaryList');

    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <li><strong>內用門市：</strong>${state.store || '尚未選擇'}</li>
            <li><strong>內用桌號：</strong>${state.tableNumber || '尚未填寫'}</li>
            <li><strong>主餐類別：</strong>${state.category || '尚未選擇'}</li>
            ${state.heat ? `<li><strong>加熱狀態：</strong>${state.heat}</li>` : ''}
            ${state.flavor ? `<li><strong>口味/尺寸：</strong>${state.flavor}</li>` : ''}
            ${state.toppings.length > 0 ? `<li><strong>配料：</strong>${state.toppings.join(', ')}</li>` : ''}
        `;
    }
}

/**
 * 檢查各步驟是否已完成，自動為導覽按鈕加上 completed 類別以顯示打勾 icon
 */
function updateStepNavCompletedStatus() {
    const state = getOrderState();
    const navButtons = document.querySelectorAll('.step-nav-btn');

    if (navButtons.length === 0) return;

    navButtons.forEach(btn => {
        const targetStep = btn.getAttribute('data-step');

        // 判斷每一個按鈕對應的完成條件
        let isCompleted = false;

        // 嚴格判斷：必須對應欄位真的有選擇資料才算完成
        if (targetStep === 'step1.html' && state.category && state.category.trim() !== "") {
            isCompleted = true;
        } else if (targetStep === 'step2.html') {
            const hasSize = state.size && state.size.trim() !== "";
            const hasFlavor = state.flavor && state.flavor.trim() !== "";
            if (hasSize && hasFlavor) {
                isCompleted = true;
            }
        }
        // 之後如果有步驟三、四，也可以在這裡擴充：
        // else if (targetStep === 'step3.html' && state.xxx) { isCompleted = true; }



        // 有紀錄加 completed，無紀錄移除 completed
        if (isCompleted) {
            btn.classList.add('completed');
        } else {
            btn.classList.remove('completed');
        }
    });
}

// ==========================================
// 2. 獨立的全域初始化監聽（不影響各頁面專屬 JS）
// ==========================================

// A. 導覽列自動切換 active 狀態
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const navButtons = document.querySelectorAll('.step-nav-btn');

    navButtons.forEach(btn => {
        const targetStep = btn.getAttribute('data-step');
        if (targetStep === currentPage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
});

// B. 訂單內容與打勾狀態初始化
document.addEventListener('DOMContentLoaded', () => {
    updateOrderSummaryUI();
    updateStepNavCompletedStatus();
});

// C. 導覽列點擊跳轉監聽
document.addEventListener('DOMContentLoaded', () => {
    const stepNav = document.querySelector('.step-nav');
    if (stepNav) {
        stepNav.addEventListener('click', (e) => {
            const btn = e.target.closest('.step-nav-btn');
            if (!btn) return;

            const targetPage = btn.getAttribute('data-step');
            if (targetPage) {
                window.location.href = targetPage;
            }
        });
    }
});