let tickerSelect = document.getElementById("ticker")
						
document.addEventListener("DOMContentLoaded", async () => {		// select 태그의 값이 바뀌는 것을 감지하기 위해 
	await handleFetchDataAndPrepareChart();						// 차트를 그려주는 함수 호출

    $("#ticker").on("change", async () => {						// select 태그의 값이 바뀌는 것을 감지
        await handleFetchDataAndPrepareChart();					// 바뀐 차트를 다시 그리기 위해 함수 재호출
    });
});


async function fetchData () {									// 예측 가격과 일시 데이터를 요청 및 전달받는 함수
	let ticker = tickerSelect.value
	try {
	    // fetch 함수를 사용하여 지정된 URL로 POST 요청을 보냅니다.
	    const response = await fetch(`http://127.0.0.1:8000/responsePrice/${ticker}`, {
	        method: 'GET', 
	        headers: {
	            'Content-Type': 'application/json',
	        },
	    });
	    // 응답을 기다리고 JSON으로 파싱합니다.
	    const result = await response.json();
	    
	    return result		// JSON 형식으로 바꾼 데이터를 반환 

	} catch (error) {
	    console.error("Error fetching data:", error);
	    throw error;
	}};
	



async function handleFetchDataAndPrepareChart() {
    try {
		
        const result = await fetchData();
		console.log(result);
        // 무작위 주가 데이터 생성
        const days = result['days'];
		//console.log(fetchData());
        // 예측한 주가 데이터 생성 (여기에서는 실제 주가와 동일한 값으로 설정)
        const predictedPrices = result['pred_price'];
        const realPrices = result['real_price'];
        // 차트를 그릴 Canvas 엘리먼트 선택
        const ctx = document.getElementById('stockChart').getContext('2d');
        
		let chartStatus = Chart.getChart('stockChart');
		
		if (chartStatus !== undefined) {
		  chartStatus.destroy();
			}
        // Chart.js를 사용하여 선 그래프를 그립니다.
        const stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [
                	{
                        label: '실제 주가',
                        data: realPrices,
                        borderColor: 'orange',
                        borderDash: [5, 5],  // 점선으로 예측 부분을 나타냅니다.
                        fill: false
                    },
                    {
                        label: '예측 주가',
                        data: predictedPrices,
                        borderColor: 'green',
                        borderDash: [5, 5],  // 점선으로 예측 부분을 나타냅니다.
                        fill: false
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Actual vs Predicted Stock Prices'
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Days'
                        },
                         ticks: {
                            // 각 틱의 레이블을 커스터마이징하는 콜백 함수
                            callback: function(value, index, values) {
                                // 예를 들어, 5일 간격으로 레이블을 표시하고자 할 때
                                if (index % 20 === 0) return value;
                                return ''; // 이외의 경우 레이블을 표시하지 않음
                            },
                            color: 'white', // 틱 레이블 색상 설정
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Stock Prices'
                        }
                    }]
                },
                animation: {
		            duration: 0 // 일반적 애니메이션 시간
		        },
		        hover: {
		            animationDuration: 0 // 항목을 호버했을 때 애니메이션 지속 시간
		        },
		        responsiveAnimationDuration: 0, // 크기 변경 후 애니메이션 지속 시간
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        });
        }catch (error) {
        console.error("Error handling data:", error);
    }
    }

    
    
    
