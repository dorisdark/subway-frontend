let orderData = {
  store: "",       // 門市
  tableNumber: "", // 桌號
  category: "",    // 類別 (麵包/沙拉)
  flavor: "",      // 口味
  toppings: []     // 配料
};

// 2. 當使用者在步驟一選了麵包時
function selectCategory(type) {
  orderData.category = type;
  // 存入 localStorage 跨頁共用
  localStorage.setItem('subwayOrder', JSON.stringify(orderData));
}

// 3. 在「訂單內容」面板中，隨時讀取並動態渲染出來
function renderOrderSummary() {
  const savedOrder = JSON.parse(localStorage.getItem('subwayOrder')) || {};
  
  // 假設你的訂單內容區塊有一個容器叫 summaryList
  const summaryList = document.getElementById('summaryList');
  summaryList.innerHTML = `
    <li>內用門市：${savedOrder.store || '尚未選擇'}</li>
    <li>內用桌號：${savedOrder.tableNumber || '尚未填寫'}</li>
    <li>選擇主餐：${savedOrder.category === 'bread' ? '麵包' : '沙拉'}</li>
    <!-- 其他動態品項... -->
  `;
}