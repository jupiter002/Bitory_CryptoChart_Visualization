const coinNames = {
    'KRW-BTC': '비트코인',
    'KRW-ETH': '이더리움',
    'KRW-SOL': '솔라나',
    'KRW-XRP': '리플',
    'KRW-ETC': '이더리움 클래식',
    'KRW-LINK': '체인링크',
    'KRW-DOGE': '도지코인',
    'KRW-ADA': '카르다노',
    'KRW-AVAX': '아발란체',
    'KRW-MATIC': '폴리곤',
    'KRW-DOT': '폴카닷',
    'KRW-TRX': '트론',
    'KRW-SHIB': '시바이누',
    'KRW-ATOM': '코스모스'
};

var tradeVolumes = []; // 체결량 데이터를 저장할 배열

// WebSocket 연결 생성
var ws = new WebSocket('wss://api.upbit.com/websocket/v1');
ws.binaryType = 'arraybuffer'; // 데이터 타입을 arraybuffer로 설정합니다.

ws.onopen = function() {
    var subscribeMessage = JSON.stringify([
        { ticket: "test" },
        { type: "trade", codes: Object.keys(coinNames) }
    ]);
    ws.send(subscribeMessage);
};

ws.onmessage = function(event) {
    var enc = new TextDecoder("utf-8");
    var arr = new Uint8Array(event.data);
    var data = enc.decode(arr);
    var response = JSON.parse(data);

    var code = response.code;
    var tradeVolume = response.trade_volume;

    var foundIndex = tradeVolumes.findIndex(item => item.code === code);
    if (foundIndex !== -1) {
        tradeVolumes[foundIndex].tradeVolume = tradeVolume;
    } else {
        tradeVolumes.push({ code: code, tradeVolume: tradeVolume });
    }

    tradeVolumes.sort((a, b) => b.tradeVolume - a.tradeVolume);
    tradeVolumes = tradeVolumes.slice(0, 5);

    updateTable();
};

function updateTable() {
    // 이 부분은 실제 테이블 요소가 HTML에 존재하는지 확인해야 합니다.
    var tableBody = document.getElementById('realtimeTradeVolumeTable')?.getElementsByTagName('tbody')[0];
    if (!tableBody) return; // 테이블 요소가 없으면 함수를 종료합니다.

    tableBody.innerHTML = '';

    tradeVolumes.forEach(function(item) {
        var row = tableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);

        cell1.innerHTML = coinNames[item.code] + '<br><small>' + item.code + '</small>';
        cell2.textContent = item.tradeVolume.toFixed(2); // trade_volume 값을 소수점 2자리까지 표시합니다.
    });
};

ws.onerror = function(error) {
    console.log('WebSocket Error: ' + error);
};

ws.onclose = function() {
    console.log('WebSocket connection closed');
};
