const btnDineIn = document.getElementById('BtnDineIn');

if (btnDineIn) {
    btnDineIn.addEventListener('click', () => {
        // 1. 記錄用餐類型（選用）
        sessionStorage.setItem('diningType', 'dine-in');
        
        // 2. 執行頁面跳轉
        window.location.href = 'scanner.html';
    });
}