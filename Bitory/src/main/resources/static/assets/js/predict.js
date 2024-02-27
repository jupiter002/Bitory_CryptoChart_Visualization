let tickerSelect1 = document.getElementById("ticker1")
let tickerSelect2 = document.getElementById("ticker2")

document.addEventListener("DOMContentLoaded", async () => {		// select 태그의 값이 바뀌는 것을 감지하기 위해
	await handleFetchDataAndPrepareChart();						// 차트를 그려주는 함수 호출

    $("#ticker1").on("change", async () => {			        // select 태그의 값이 바뀌는 것을 감지
    await handleFetchDataAndPrepareChart();					    // 바뀐 차트를 다시 그리기 위해 함수 재호출
    });

});


async function fetchData () {									// 예측 가격과 일시 데이터를 요청 및 전달받는 함수
    let ticker1 = tickerSelect1.value
    let ticker2 = tickerSelect2.value

	try {
	    // fetch 함수를 사용하여 지정된 URL로 POST 요청을 보냅니다.
	    const response = await fetch(`http://127.0.0.1:8000/responsePrice/${ticker1}/${ticker2}`, {
	        method: 'GET', 
	        headers: {
	            'Content-Type': 'application/json',
	        },
	    });
	    // 응답을 기다리고 JSON으로 파싱합니다.
	    const result = await response.json();

	    function convertDates(obj) {
            if (obj.days) {
                const newDays = {};
                for (const key in obj.days) {
                    if (obj.days.hasOwnProperty(key)) {
                        newDays[key] = new Date(obj.days[key]);
                    }
                }
                obj.days = newDays;
            }
        }

//	    result.forEach(array => {
//            // 배열 내의 각 객체에 대해 "convertDates" 함수 호출
//            array.forEach(obj => convertDates(obj));
//        });

	    return result		// JSON 형식으로 바꾼 데이터를 반환

	} catch (error) {
	    console.error("Error fetching data:", error);
	    throw error;
	}};


async function handleFetchDataAndPrepareChart() {
        // select 태그로 선택한 ticker1, 2
        let ticker1 = tickerSelect1.value
        let ticker2 = tickerSelect2.value

    try {
       const arrays = await fetchData();        // fetchData함수로 가상화폐 가격과 예측가격을 가져옴
       console.log(arrays[0][0]);
       //console.log(arrays[0]);

//       result.forEach((dataset) => {
//         console.log(dataset);
////            dataset.forEach((data) => {
////                console.log(data)
////            });
//       });

//        for (const [days, value] of Object.entries(result))
//            console.log(days);
//            console.log(value);

//        for (let days of Object.keys(result)) {
//            var value = result[days];
//            console.log(value['days']);
//        }

       // 그래프의 전체 크기 지정
       const margin = { top: 70, right: 30, bottom: 40, left: 80 };
       const width = 1600 - margin.left - margin.right;
       const height = 700 - margin.top - margin.bottom;

       // x, y축의 스케일을 설정
       const x = d3.scaleTime().range([0, width]);
       const y = d3.scaleLinear().range([height, 0]);

       // SVG 요소를 만들고 차트 컨테이너에 추가
       const svg = d3.select("#stockChart")
         .append("svg")
           .attr("width", width + margin.left + margin.right)
           .attr("height", height + margin.top + margin.bottom)
         .append("g")
           .attr("transform", `translate(${margin.left},${margin.top})`);

        // x, y축의 범위를 지정
        // 객체의 날짜 값만 추출해서 Date타입으로 변환
//        function convertDaysToArray(obj) {
//            const dates = Object.values(obj.days).map(date => new Date(date));
//            console.log(dates);
//            return dates
//        }

        // 날짜 문자열을 Date 객체로 변환하는 함수
        function parseDateString(dateString) {
            return new Date(dateString);
        }

        // 모든 요소의 "days" 값을 Date 객체로 변환
        const transformedDate = arrays[0][0].map(item => {
            return {
                ...item,
                days: parseDateString(item.days)
            };
        });

        const transformedValue = arrays[0][0].map(item => {
            return {
                ...item,
                value: item.value
            };
        });

        // 첫 번째 배열의 "days" 속성에서 날짜에 해당하는 값들을 추출하여 배열로 변환
         //const daysArray = convertDaysToArray(arrays[0]);
         console.log(transformedDate, d => d.days);
         console.log(transformedValue, d => d.value);
         x.domain(d3.extent(transformedDate, d => d.days));

        //  객체의 가격 값만 추출해서 반환
//        function extractValues(obj) {
//            const values = Object.values(obj.value);
//            // console.log(values);
//            return values
//        }
        // 첫 번째 배열의 "value" 속성에서 날짜에 해당하는 값들을 추출하여 배열로 변환
        //const valuesArray = extractValues(arrays[0]);
        y.domain([0, d3.max(transformedValue, d => d.value)]); // Adjust according to your data;

       // x축을 추가
       svg.append("g")
         .attr("transform", `translate(0,${height})`)
         .call(d3.axisBottom(x)
           .ticks(d3.timeHour.every(1))
           .tickFormat(d3.timeFormat("%d %m")));
       // y축을 추가
       svg.append("g")
         .call(d3.axisLeft(y));

       // 라인차트를 그리기 위한 생성자
       //console.log(daysArray);
       //console.log(valuesArray);
//       const line = d3.line()
//         .x(convertDaysToArray())
//         .y(extractValues());

        const line = d3.line()
       //.x(d => convertDaysToArray(d))
       .defined(d => !isNaN(d.value))
       .x(d => x(d.days))
       .y(d => y(d.value));

      // 라인차트 그리기
//      arrays.forEach((dataset, index) => {
//        console.log(dataset)
//        svg.append('path')
//           .data(dataset)
//           .attr('fill', 'none')
//           .attr('stroke', 'steelblue')
//           .attr('stroke-width', 2)
//           .attr('d', line());
//      });

      svg.append('path')
         //.data(arrays[0][0])
         .attr('fill', 'none')
         .attr('stroke', 'steelblue')
         .attr('stroke-width', 2)
         .attr('d', line(arrays[0][0]));

        }catch (error) {
        console.error("Error handling data:", error);
    }
    }
