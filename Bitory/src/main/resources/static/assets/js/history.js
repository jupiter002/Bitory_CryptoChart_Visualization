// 웹소켓 연결 설정
const marketSocket = new WebSocket('wss://api.upbit.com/websocket/v1');

marketSocket.onopen = function(event) {
  console.log("Upbit 웹소켓에 연결되었습니다.");
  // 웹소켓 서버에 구독 메시지를 보냅니다.
  const msg = JSON.stringify([
    { ticket: 'uniqueTicket' },
    { type: 'ticker', codes: [
        'KRW-BTC', 'KRW-ETH', 'KRW-SOL', 'KRW-XRP', 'KRW-ETC',
        'KRW-LINK', 'KRW-DOGE', 'KRW-ADA', 'KRW-AVAX', 'KRW-MATIC',
        'KRW-DOT', 'KRW-TRX', 'KRW-SHIB', 'KRW-ATOM'
    ] },
    // 추가로 더 많은 코인 코드를 여기에 포함시킬 수 있습니다.
  ]);
  marketSocket.send(msg);
};

marketSocket.onmessage = function(event) {
  // Blob 데이터를 텍스트로 변환합니다.
  const reader = new FileReader();

  reader.onload = function() {
    // 텍스트 데이터를 JSON으로 파싱합니다.
    try {
      const data = JSON.parse(reader.result);
      console.log(data); // 콘솔에 데이터를 출력합니다.
      updateMarketTable(data);
    } catch (e) {
      console.error('JSON 파싱 오류:', e);
    }
  };

  // 읽기 작업이 실패했을 때의 이벤트 핸들러를 추가합니다.
  reader.onerror = function(e) {
    console.error('파일 읽기 오류:', e);
  };

  // Blob 데이터를 텍스트로 읽습니다.
  reader.readAsText(event.data);
};
// 데이터를 받아서 테이블을 업데이트하는 함수입니다.
// 이 함수는 실제 업비트로부터 받는 데이터의 형식에 맞춰 구현되어야 합니다.
function updateMarketTable(data) {
  // 테이블의 tbody 선택
  const tableBody = document.getElementById('realtimeMarketTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = ''; // 테이블 초기화

  // 웹소켓에서 받은 데이터를 가정하여 반복문을 작성합니다.
  // 실제 데이터 구조에 따라서 내부 로직을 변경해야 할 수 있습니다.
  data.forEach((item, index) => {
    // 새로운 행(row)를 만듭니다.
    const row = tableBody.insertRow();

    // 순위 셀
    const cellRank = row.insertCell(0);
    cellRank.textContent = index + 1; // 순위는 0부터 시작하므로 1을 더해줍니다.

    // 코인명/코드 셀
    const cellNameCode = row.insertCell(1);
    cellNameCode.textContent = `${item.korean_name} / ${item.market}`;

    // 변동률 셀
    const cellChange = row.insertCell(2);
    cellChange.textContent = `${(item.change_rate * 100).toFixed(2)}%`;
    cellChange.className = item.change_rate > 0 ? 'up' : 'down';

    // 현재가 셀
    const cellPrice = row.insertCell(3);
    cellPrice.textContent = item.trade_price.toLocaleString();
  });
}

