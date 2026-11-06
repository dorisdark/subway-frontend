const storeData = {
  "台南市": {
    "東區": ["台南東門店", "台南成大店"],
    "北區": ["台南立賢店", "台南開元店"],
    "中西區": ["台南民族店", "台南西門店"]
  },
  "高雄市": {
    "左營區": ["高雄巨蛋店", "高雄高鐵店"],
    "前金區": ["高雄市議會店"]
  }
};

let currentCity = "";
let currentDistrict = "";
let currentStore = "";

// DOM 元素取得
const trigger = document.getElementById('UnifiedTrigger');
const overlay = document.getElementById('SheetOverlay');
const closeBtn = document.getElementById('SheetClose');
const displayText = document.getElementById('UnifiedDisplayText');
const storeInput = document.getElementById('selectedStoreInput'); // 隱藏的門市欄位

const cityList = document.getElementById('CityList');
const districtList = document.getElementById('DistrictList');
const storeList = document.getElementById('StoreList');
const manualForm = document.getElementById('ManualForm');
const backBtn = document.getElementById('BackToScanner');

// 1. 彈出與關閉面板控制
trigger.addEventListener('click', () => overlay.classList.add('active'));
closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
overlay.addEventListener('click', (e) => { 
  if (e.target === overlay) overlay.classList.remove('active'); 
});

// 2. 渲染縣市
function renderCities() {
  cityList.innerHTML = "";
  Object.keys(storeData).forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    if (city === currentCity) li.classList.add('active');
    
    li.addEventListener('click', () => {
      currentCity = city;
      currentDistrict = ""; // 重設區域
      currentStore = "";   // 重設門市
      
      renderCities();
      renderDistricts(city);
      storeList.innerHTML = ""; // 清空門市欄
    });
    cityList.appendChild(li);
  });
}

// 3. 渲染區域
function renderDistricts(city) {
  districtList.innerHTML = "";
  const districts = storeData[city];
  
  Object.keys(districts).forEach(district => {
    const li = document.createElement('li');
    li.textContent = district;
    if (district === currentDistrict) li.classList.add('active');

    li.addEventListener('click', () => {
      currentDistrict = district;
      currentStore = ""; // 重設門市
      
      renderDistricts(city);
      renderStores(city, district);
    });
    districtList.appendChild(li);
  });
}

// 4. 渲染門市
function renderStores(city, district) {
  storeList.innerHTML = "";
  const stores = storeData[city][district];

  stores.forEach(store => {
    const li = document.createElement('li');
    li.textContent = store;
    if (store === currentStore) li.classList.add('active');

    li.addEventListener('click', () => {
      currentStore = store;
      renderStores(city, district);

      // 組合完整門市字串
      const fullStoreValue = `${currentCity} / ${currentDistrict} / ${currentStore}`;

      // 更新畫面顯示文字
      displayText.textContent = fullStoreValue;
      displayText.classList.remove('placeholder');
      
      // 將值賦予給隱藏的 input 供表單送出
      if (storeInput) {
        storeInput.value = fullStoreValue;
      }

      // 觸發框底線與文字變為品牌綠
      trigger.classList.add('has-value');
      
      setTimeout(() => {
        overlay.classList.remove('active');
      }, 200);

      console.log("最終選擇結果：", fullStoreValue);
    });
    storeList.appendChild(li);
  });
}

// 5. 攔截表單送出（確認按鈕）
if (ManualForm) {
  ManualForm.addEventListener('submit', (e) => {
    e.preventDefault(); // 阻止傳統頁面跳轉

    const tableNumber = document.getElementById('TableNumberInput').value;
    const storeValue = storeInput ? storeInput.value : "";

    // 檢查防呆驗證
    if (!storeValue) {
      alert('請先選擇內用門市！');
      return;
    }
    if (!tableNumber) {
      alert('請輸入桌號！');
      return;
    }

    console.log("表單準備送出！門市：", storeValue, "桌號：", tableNumber);
    // 這裡可以加入你的後續跳轉或 API 呼叫邏輯
    window.location.href = "step1.html";
  });
}
if (backBtn) {
  backBtn.addEventListener('click', (e) => {
    e.preventDefault(); // 防止預設行為
    console.log("「返回」按鈕被點擊了！"); // 👈 打開 F12 主控台看有沒有印出這行
    
    // 💡 請把 'scanner.html' 換成你實際的掃描頁面檔名
    window.location.href = "scanner.html";
  });
} else {
  console.log("找不到 BackToScanner 這個 ID 的元素");
}

// 初始化執行
renderCities();