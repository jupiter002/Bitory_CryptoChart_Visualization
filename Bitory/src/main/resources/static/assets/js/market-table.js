document.addEventListener('DOMContentLoaded', function () {
  const majorMarkets = {
    'KRW-BTC': 1, 'KRW-ETH': 2, 'KRW-SOL': 3, 'KRW-XRP': 4, 'KRW-ETC': 5,
    'KRW-LINK': 6, 'KRW-DOGE': 7, 'KRW-ADA': 8, 'KRW-AVAX': 9, 'KRW-MATIC': 10,
    'KRW-DOT': 11, 'KRW-TRX': 12, 'KRW-SHIB': 13, 'KRW-ATOM': 14
  };
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

  const marketList = document.getElementById('marketList');
  const rowsByCode = {};

  const interestedMarkets = Object.keys(majorMarkets);

  function connectWebSocket() {
    const ws = new WebSocket('wss://api.upbit.com/websocket/v1');

    ws.onopen = () => {
      console.log('WebSocket 연결됨');
      ws.send(JSON.stringify([{ ticket: "test" }, { type: "ticker", codes: interestedMarkets }]));
    };

    ws.onmessage = event => processBlob(event.data);
    ws.onerror = error => console.error('WebSocket 오류: ', error);
    ws.onclose = () => console.log('WebSocket 연결 종료됨');
  }

  // Function to update data when receiving WebSocket message
  function processBlob(blobData) {
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const jsonData = JSON.parse(event.target.result);
        updateMarketList(jsonData);
      } catch (e) {
        console.error('JSON 파싱 오류', e);
      }
    };
    reader.readAsText(blobData);
  }

  // Function to update the market list with received data
  function updateMarketList(tickerData) {
    if (!tickerData || !tickerData.code) {
      console.error('Invalid ticker data', tickerData);
      return;
    }
    const code = tickerData.code;
    rowsByCode[code] ? updateExistingRow(tickerData, rowsByCode[code]) : createNewRow(tickerData);
  }

  // Function to create a new row for the market
  function createNewRow(tickerData) {
    const row = document.createElement('tr');
    addCellsToRow(row, tickerData);
    marketList.appendChild(row);
    rowsByCode[tickerData.code] = row;
  }

  // Function to update an existing row with new data
  function updateExistingRow(tickerData, row) {
    addCellsToRow(row, tickerData, true);
    row.tickerData = tickerData; // Store the data
  }

  // Function to add cells to a row with market data
  function addCellsToRow(row, tickerData, isUpdate = false) {
    if (!isUpdate) row.innerHTML = ''; // Clear the existing content when updating

    const coinName = coinNames[tickerData.code] || '알 수 없음';
    const coinCode = tickerData.code;
    const currentPrice = Math.floor(parseFloat(tickerData.trade_price)).toLocaleString();
    const priceChange = getPriceChangeHtml(tickerData);
    const openingPrice = Math.floor(parseFloat(tickerData.opening_price)).toLocaleString();
    const highPrice = Math.floor(parseFloat(tickerData.high_price)).toLocaleString();
    const lowPrice = Math.floor(parseFloat(tickerData.low_price)).toLocaleString();
    const changeRate = (tickerData.change_rate * 100).toFixed(2) + '%';

    const data = [
      majorMarkets[tickerData.code], // Assigned fixed number
      `${coinName}<br><span class='coin-code-style'>${coinCode}</span>`, // Combine coin name and code
      currentPrice, // Current price
      priceChange, // Price change
      openingPrice, // Opening price
      highPrice, // High price
      lowPrice, // Low price
      changeRate // Change rate
    ];

    const cellClasses = ['no', 'coin-info', 'current-price', 'price-change', 'opening', 'high', 'low', 'change-rate'];

    data.forEach((text, index) => {
      let cell;
      if (isUpdate) {
        cell = row.cells[index];
      } else {
        cell = row.insertCell();
        cell.classList.add(cellClasses[index]);
      }
      cell.innerHTML = text;
    });

    setChangeRateStyle(row.cells[7], tickerData.change_rate); // Change cell color based on change rate
  }

  // Function to generate HTML for price change
  function getPriceChangeHtml(tickerData) {
    const priceChange = Math.floor(parseFloat(tickerData.trade_price)) - Math.floor(parseFloat(tickerData.opening_price));
    const formattedPriceChange = priceChange.toLocaleString();
    return priceChange > 0 ? `<i class="fa-solid fa-caret-up"></i> <span class="up">${formattedPriceChange}</span>` :
      priceChange < 0 ? `<i class="fa-solid fa-caret-down"></i> <span class="down">${formattedPriceChange}</span>` :
        `<span class="no-change">${formattedPriceChange}</span>`;
  }

  // Function to set the style of change rate
  function setChangeRateStyle(cell, changeRate) {
    cell.className = getChangeClassName(changeRate);
    cell.style.color = changeRate > 0 ? 'red' : changeRate < 0 ? 'blue' : 'black';
  }

  // Function to get the CSS class based on change rate
  function getChangeClassName(changeRate) {
    return changeRate > 0 ? 'up' : changeRate < 0 ? 'down' : 'no-change';
  }

  // Connect to WebSocket when the page loads
  connectWebSocket();
});



