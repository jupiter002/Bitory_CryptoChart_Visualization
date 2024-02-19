document.addEventListener('DOMContentLoaded', function () {
    const interestedMarkets = [
        'KRW-BTC', 'KRW-ETH', 'KRW-SOL', 'KRW-XRP', 'KRW-ETC',
        'KRW-LINK', 'KRW-DOGE', 'KRW-ADA', 'KRW-AVAX', 'KRW-MATIC',
        'KRW-DOT', 'KRW-TRX', 'KRW-SHIB', 'KRW-ATOM'
    ];

    const coinNames = {
        'KRW-BTC': '비트코인', 'KRW-ETH': '이더리움', 'KRW-SOL': '솔라나',
        'KRW-XRP': '리플', 'KRW-ETC': '이더리움 클래식', 'KRW-LINK': '체인링크',
        'KRW-DOGE': '도지코인', 'KRW-ADA': '카르다노', 'KRW-AVAX': '아발란체',
        'KRW-MATIC': '폴리곤', 'KRW-DOT': '폴카닷', 'KRW-TRX': '트론',
        'KRW-SHIB': '시바이누', 'KRW-ATOM': '코스모스'
    };

    // 정렬 상태를 저장하는 객체 초기화
    var currentSort = {};

    // 클릭 이전의 정렬 순서를 저장하는 객체 초기화
    var originalOrder = {};

    // 각 컬럼의 클릭 이벤트에 대한 핸들러 등록
    const headers = document.querySelectorAll(".sortable");
    headers.forEach(function(header, index) {
        header.addEventListener('click', function() {
            sortTable(index);
        });
    });

    function connectWebSocket() {
        const ws = new WebSocket('wss://api.upbit.com/websocket/v1');
        ws.onopen = () => {
            const message = JSON.stringify([{ticket:"test"},{type:"ticker", codes: interestedMarkets}]);
            ws.send(message);
        };

        ws.onmessage = event => {
            const reader = new FileReader();
            reader.onload = () => {
                const data = JSON.parse(reader.result);
                updateMarketList(data);
            };
            reader.readAsText(event.data);
        };
    }

    function updateMarketList(data) {
        const marketList = document.getElementById('tradeList');
        let row = marketList.querySelector(`[data-code="${data.code}"]`);
        if (!row) {
            row = createNewRow(data.code);
        }

        // 현재가 셀을 찾고, 새로운 현재가와 이전 현재가를 비교
        const currentPriceCell = row.querySelector('.current-price');
        const changeCell = row.querySelector('.change');
        const newCurrentPrice = data.trade_price;
        const oldCurrentPrice = parseFloat(currentPriceCell.getAttribute('data-old-price')) || newCurrentPrice;

        // 변화율과 변화액 값을 계산
        const changeRateValue = (data.signed_change_rate * 100).toFixed(2);
        const priceChangeValue = data.signed_change_price.toLocaleString();
        const changeRateAndPrice = `${changeRateValue}%<br/>${priceChangeValue}`;
        const isPositive = data.signed_change_rate > 0;

        // 색상 및 효과 설정
        const colorClass = isPositive ? 'positive' : 'negative';
        currentPriceCell.classList.add(colorClass);
        changeCell.classList.add(colorClass);
        row.querySelector('.coin-name').innerHTML = `${coinNames[data.code] || '알 수 없음'}<br/>${data.code}`;
        currentPriceCell.textContent = `${newCurrentPrice.toLocaleString()}`;
        currentPriceCell.setAttribute('data-old-price', newCurrentPrice);
        changeCell.innerHTML = changeRateAndPrice;

        // 24시간 누적 거래대금 설정
        const accTradePrice24hValue = Math.floor(data.acc_trade_price_24h / 1000000);
        row.querySelector('.acc-trade-price-24h').textContent = `${accTradePrice24hValue.toLocaleString()} 백만`;

        // 변화 감지 및 테두리 반짝이는 효과 적용
        if (newCurrentPrice > oldCurrentPrice) {
            applyFlashEffect(currentPriceCell, 'flash-border-red');
        } else if (newCurrentPrice < oldCurrentPrice) {
            applyFlashEffect(currentPriceCell, 'flash-border-blue');
        }

        // 한 줄을 클릭했을 때 해당 줄의 데이터값 출력
        row.addEventListener('click', function() {
            console.log("종목 한글명:", coinNames[data.code] || '알 수 없음');
            console.log("종목 코드:", data.code);
            console.log("현재가:", newCurrentPrice.toLocaleString());
            console.log("변동률:", changeRateValue + "%");
            console.log("거래량 (24h):", accTradePrice24hValue.toLocaleString());
            console.log("고가 (당일):", data.high_price.toLocaleString());
            console.log("거래금액 (24h):", data.acc_trade_price_24h.toLocaleString());
            console.log("저가 (당일):", data.low_price.toLocaleString());
            console.log("채결강도:", data.trade_strength);
            console.log("전일 종가:", data.prev_closing_price.toLocaleString());
        });
    }



    function applyFlashEffect(element, effectClass) {
        element.classList.add(effectClass);
        setTimeout(() => element.classList.remove(effectClass), 1000); // 1초 후 효과 제거
    }

    function createNewRow(code) {
        const marketList = document.getElementById('tradeList');
        const row = document.createElement('tr');
        row.setAttribute('data-code', code);
        row.innerHTML = `
            <td class="coin-name two-lines"></td>
            <td class="current-price"></td>
            <td class="change two-lines"></td>
            <td class="acc-trade-price-24h"></td>
        `;
        marketList.appendChild(row);
        return row;
    }

    connectWebSocket();

    function sortTable(column) {
        const table = document.getElementById("tradeList");
        const rows = Array.from(table.rows).slice(0); // 헤더 행은 제외
        const direction = currentSort[column] === 'asc' ? 'desc' : 'asc'; // 정렬 방향 가져오기

        // 정렬 기준에 따라 정렬하는 함수
        let comparator;
        if (column === 0) { // 종목명을 정렬하는 경우
            comparator = function(a, b) {
                const aValue = a.querySelector('.coin-name').textContent;
                const bValue = b.querySelector('.coin-name').textContent;
                return direction === 'asc' ? aValue.localeCompare(bValue, 'ko') : bValue.localeCompare(aValue, 'ko');
            };
        } else { // 숫자를 정렬하는 경우
            comparator = function(a, b) {
                const aValue = parseFloat(a.getElementsByTagName('TD')[column].textContent.replace(/[^0-9.-]+/g,""));
                const bValue = parseFloat(b.getElementsByTagName('TD')[column].textContent.replace(/[^0-9.-]+/g,""));
                return direction === 'asc' ? aValue - bValue : bValue - aValue;
            };
        }

        // 정렬
        rows.sort(comparator);

        // 테이블에 정렬된 행들 다시 추가
        rows.forEach(row => table.appendChild(row));

        // 정렬 방향 업데이트
        currentSort[column] = direction;

        // 모든 컬럼의 상태 초기화 및 현재 컬럼 상태 업데이트
        resetSortIcons();
        headers.forEach((header, index) => {
            if (index !== column) {
                header.classList.remove("asc", "desc");
            }
        });
        headers[column].classList.add(direction);
    }

    function resetSortIcons() {
        headers.forEach(function(header) {
            header.classList.remove("asc", "desc");
        });
    }

    // 실시간 테이블 클릭 이벤트 핸들러
    const realtimeRows = document.querySelectorAll('#tradeList tr');
    realtimeRows.forEach(function(row) {
        row.addEventListener('click', function() {
            const coinCode = this.dataset.code;
            const coinName = this.querySelector('.coin-name').textContent;
            // 클릭된 행의 종목명과 종목코드를 새로운 테이블에 업데이트합니다.
            updateRealtimeTable(coinName, coinCode);
            // 클릭된 종목의 데이터를 출력합니다.
            console.log("종목 한글명:", coinName);
            console.log("종목 코드:", coinCode);
        });
    });

    // 새로운 테이블 업데이트 함수
    function updateRealtimeTable(coinName, coinCode) {
        document.getElementById('coinName2').textContent = coinName || '-';
        document.getElementById('coinCode2').textContent = coinCode || '-';
        // 여기에 다른 필요한 값을 업데이트하는 코드를 추가합니다.
    }
});
