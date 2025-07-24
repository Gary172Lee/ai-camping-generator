document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('cityInput');
    const countSelect = document.getElementById('countSelect');
    const generateBtn = document.getElementById('generateBtn');
    const loadingDiv = document.getElementById('loading');
    const errorMessageDiv = document.getElementById('errorMessage');
    const campingList = document.getElementById('campingList');

    // *** 請將此處替換為您 Cloud Function 部署成功後的觸發網址 ***
    const CLOUD_FUNCTION_URL = 'https://get-popular-camping-sites-34249909933.asia-east1.run.app'; // 例如: https://asia-east1-your-project-id.cloudfunctions.net/getPopularCampingSites

    generateBtn.addEventListener('click', async () => {
        const city = cityInput.value.trim();
        const count = countSelect.value;

        // 清空之前的結果和錯誤訊息
        campingList.innerHTML = '';
        errorMessageDiv.textContent = '';
        errorMessageDiv.classList.add('hidden');
        loadingDiv.classList.remove('hidden'); // 顯示載入訊息
        generateBtn.disabled = true; // 禁用按鈕防止重複點擊

        if (!city) {
            errorMessageDiv.textContent = '請輸入縣市名稱！';
            errorMessageDiv.classList.remove('hidden');
            loadingDiv.classList.add('hidden');
            generateBtn.disabled = false;
            return;
        }

        try {
            const response = await fetch(CLOUD_FUNCTION_URL, {
                method: 'POST', // 或 'GET'，如果您的 Cloud Function 設定為 GET
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ city: city, count: parseInt(count) }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP 錯誤！狀態碼: ${response.status}`);
            }

            const data = await response.json();

            if (data.camping_sites && data.camping_sites.length > 0) {
                data.camping_sites.forEach(site => {
                    const listItem = document.createElement('li');
                    listItem.textContent = site;
                    campingList.appendChild(listItem);
                });
            } else {
                campingList.innerHTML = '<li>未找到相關露營區，請嘗試其他縣市或稍後再試。</li>';
            }

        } catch (error) {
            console.error('Error:', error);
            errorMessageDiv.textContent = `哎呀，出錯了！${error.message || '無法取得露營區資訊。'}`;
            errorMessageDiv.classList.remove('hidden');
        } finally {
            loadingDiv.classList.add('hidden'); // 隱藏載入訊息
            generateBtn.disabled = false; // 重新啟用按鈕
        }
    });
});
