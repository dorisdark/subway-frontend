document.addEventListener('DOMContentLoaded', () => {
    const btnBackHome = document.getElementById('back to index');
    let html5QrCode = null;

    // 初始化相機
    function startCamera() {
        html5QrCode = new Html5Qrcode("reader");

        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 15, qrbox: { width: 220, height: 220 } },
            (decodedText) => {
                sessionStorage.setItem('tableNumber', decodedText);
                alert(`成功讀取桌號：${decodedText}`);
                stopAndRedirect('menu.html');
            },
            (errorMessage) => {}
        ).catch(err => {
            console.error("無法存取相機:", err);
        });
    }

    // 安全關閉相機並跳轉頁面的函式
    function stopAndRedirect(targetUrl) {
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop().then(() => {
                html5QrCode.clear();
                window.location.href = targetUrl;
            }).catch(err => {
                console.error("關閉相機失敗:", err);
                window.location.href = targetUrl;
            });
        } else {
            window.location.href = targetUrl;
        }
    }

    // 點擊返回按鈕，關閉相機並回到首頁 (index.html)
    if (btnBackHome) {
        btnBackHome.addEventListener('click', () => {
            stopAndRedirect('index.html');
        });
    }

    // 啟動相機
    startCamera();
});