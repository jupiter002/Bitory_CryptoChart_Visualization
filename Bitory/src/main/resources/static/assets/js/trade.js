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

    // 웹소켓 연결을 전역 변수로 이동
    var ws;

    // 클릭 이전의 정렬 순서를 저장하는 객체 초기화
    var currentSort = {};

    // 전역 변수로 선택된 코인 코드를 추적합니다.
    var selectedCoinCode = null;

    function connectWebSocket() {
        ws = new WebSocket('wss://api.upbit.com/websocket/v1');
        ws.onopen = () => {
            const message = JSON.stringify([{ticket:"test"},{type:"ticker", codes: interestedMarkets}]);
            ws.send(message);
        };

        // 웹소켓으로부터 메시지를 받을 때의 이벤트 핸들러를 설정합니다.
        ws.onmessage = event => {
            const reader = new FileReader();
            reader.onload = () => {
                const data = JSON.parse(reader.result);
                updateMarketList(data);
                // 선택된 코인의 데이터가 도착하면 상세 테이블을 업데이트합니다.
                if (selectedCoinCode === data.code) {
                    updateDetailTable(data);
                }
            };
            reader.readAsText(event.data);
        };
    }

    connectWebSocket();

    // 새로운 테이블 업데이트 함수
    function updateMarketList(data) {
        const marketList = document.getElementById('tradeList');
        let row = marketList.querySelector(`[data-code="${data.code}"]`);
        if (!row) {
            row = createNewRow(data.code);
            marketList.appendChild(row);
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

    // 웹소켓으로부터 메시지를 받을 때의 이벤트 핸들러를 설정합니다.
    ws.onmessage = event => {
        const reader = new FileReader();
        reader.onload = () => {
            const data = JSON.parse(reader.result);
            updateMarketList(data);
            // 실시간 테이블의 각 행에 클릭 이벤트 리스너를 추가합니다.
            const row = document.querySelector(`[data-code="${data.code}"]`);
            row.removeEventListener('click', handleRealtimeRowClick); // 중복 이벤트 방지를 위해 기존 리스너를 제거합니다.
            row.addEventListener('click', () => handleRealtimeRowClick(data)); // 새로운 데이터로 리스너를 추가합니다.
        };
        reader.readAsText(event.data);
    };

    // 실시간 테이블 클릭 이벤트 핸들러
    function handleRealtimeRowClick(data) {
        // 클릭된 코인의 상세 정보를 새로운 테이블에 업데이트합니다.
        updateDetailTable({
            name: coinNames[data.code] || '알 수 없음',
            code: data.code,
            currentPrice: data.trade_price.toLocaleString(),
            changeRate: (data.signed_change_rate * 100).toFixed(2),
            volume24h: (data.acc_trade_volume_24h).toLocaleString(),
            highPrice: data.high_price.toLocaleString(),
            tradeAmount24h: (data.acc_trade_price_24h).toLocaleString(),
            lowPrice: data.low_price.toLocaleString(),
            tradeStrength: data.trade_strength || '-', // 'undefined' 대신에 실제 데이터가 들어가야 합니다.
            prevClosingPrice: data.prev_closing_price.toLocaleString()
        });
    }

    // 상세 테이블 업데이트 함수
    function updateDetailTable(coinData) {
        document.getElementById('coinName2').getElementsByTagName('h4')[0].textContent = coinData.name;
        document.getElementById('coinCode2').textContent = coinData.code;
        document.getElementById('currentPrice2').textContent = coinData.currentPrice;
        document.getElementById('changeRate2').textContent = coinData.changeRate + '%';
        document.getElementById('volume2').textContent = coinData.volume24h;
        document.getElementById('highPrice2').textContent = coinData.highPrice;
        document.getElementById('tradeAmount2').textContent = coinData.tradeAmount24h;
        document.getElementById('lowPrice2').textContent = coinData.lowPrice;
        document.getElementById('tradeStrength2').textContent = coinData.tradeStrength;
        document.getElementById('prevClosingPrice2').textContent = coinData.prevClosingPrice;
    }

});


// <============================== 매수/매도 창활성화 자바스크립트 ====================================>

document.addEventListener('DOMContentLoaded', function() {
    // 매수/매도 버튼 이벤트
    function toggleTradeWindows(event) {
        var isBuyButton = event.target.id === 'buyButton';
        document.getElementById('buyWindow').style.display = isBuyButton ? 'block' : 'none';
        document.getElementById('sellWindow').style.display = isBuyButton ? 'none' : 'block';
    }

    // 지정가/시장가 라디오 버튼 이벤트
    function toggleOrderType(event) {
        var isLimitOrder = event.target.id === 'limitOrder';
        var limitOrderContent = document.getElementById('limitOrderContent');
        var marketOrderContent = document.getElementById('marketOrderContent');

        // 지정가 및 시장가 내용을 토글합니다.
        if (isLimitOrder) {
            limitOrderContent.style.display = 'block';
            marketOrderContent.style.display = 'none';
        } else {
            limitOrderContent.style.display = 'none';
            marketOrderContent.style.display = 'block';
        }
    }

    // 버튼 클릭 이벤트 리스너 등록
    document.getElementById('buyButton').addEventListener('click', toggleTradeWindows);
    document.getElementById('sellButton').addEventListener('click', toggleTradeWindows);

    // 라디오 버튼 클릭 이벤트 리스너 등록
    document.getElementById('limitOrder').addEventListener('click', toggleOrderType);
    document.getElementById('marketOrder').addEventListener('click', toggleOrderType);
});

document.addEventListener('DOMContentLoaded', function() {
    var sellOrderTypeRadios = document.querySelectorAll('input[name="sellOrderType"]');
    sellOrderTypeRadios.forEach(function(radio) {
        radio.addEventListener('change', function() {
            toggleSellOrderContent();
        });
    });

    function toggleSellOrderContent() {
        var limitSellOrderContent = document.getElementById('limitSellOrderContent');
        var marketSellOrderContent = document.getElementById('marketSellOrderContent');
        if (document.getElementById('limitSellOrder').checked) {
            limitSellOrderContent.style.display = '';
            marketSellOrderContent.style.display = 'none';
        } else {
            limitSellOrderContent.style.display = 'none';
            marketSellOrderContent.style.display = '';
        }
    }

    // 초기 상태 설정
    toggleSellOrderContent();
});
