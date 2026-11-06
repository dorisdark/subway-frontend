// 定義 localStorage 的儲存鍵名
const STORAGE_KEY = 'subway_order_state';

/**
 * 1. 取得目前的訂單狀態資料
 * 如果裡面還沒有資料，就回傳預設的空結構
 */
function getOrderState() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {
        store: "",       // 內用門市
        tableNumber: "", // 內用桌號
        category: "",    // 主餐類別 (麵包/沙拉)
        flavor: "",      // 口味/尺寸
        toppings: []     // 配料清單 (陣列)
    };
}

/**
 * 2. 更新並儲存訂單狀態
 * @param {Object} partialState - 傳入你想更新的欄位資料（例如 { category: '麵包' }）
 */
function saveOrderState(partialState) {
    const currentState = getOrderState();
    const updatedState = { ...currentState, ...partialState };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));

    // 每次資料更新後，自動重新渲染畫面的「訂單內容」
    updateOrderSummaryUI();
}

/**
 * 3. 即時更新「訂單內容」介面呈現
 */
function updateOrderSummaryUI() {
    const state = getOrderState();
    const summaryContainer = document.getElementById('orderSummaryList');

    if (summaryContainer) {
        summaryContainer.innerHTML = `
      <li><strong>內用門市：</strong>${state.store || '尚未選擇'}</li>
      <li><strong>內用桌號：</strong>${state.tableNumber || '尚未填寫'}</li>
      <li><strong>主餐類別：</strong>${state.category || '尚未選擇'}</li>
      ${state.flavor ? `<li><strong>口味/尺寸：</strong>${state.flavor}</li>` : ''}
      ${state.toppings.length > 0 ? `<li><strong>配料：</strong>${state.toppings.join(', ')}</li>` : ''}
    `;
    }
}

// 當網頁載入完成時，自動初始化更新一次畫面上的訂單內容
document.addEventListener('DOMContentLoaded', () => {
    updateOrderSummaryUI();
});