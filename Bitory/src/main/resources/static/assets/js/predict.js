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
	    
	    return result		// JSON 형식으로 바꾼 데이터를 반환 

	} catch (error) {
	    console.error("Error fetching data:", error);
	    throw error;
	}};


async function handleFetchDataAndPrepareChart() {
        let ticker1 = tickerSelect1.value
        let ticker2 = tickerSelect2.value

    try {
       const result = await fetchData();
       console.log(result[3])

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


       // Set dimensions and margins for the chart
       const margin = { top: 70, right: 30, bottom: 40, left: 80 };
       const width = 1200 - margin.left - margin.right;
       const height = 500 - margin.top - margin.bottom;

       // Set up the x and y scales
       const x = d3.scaleTime().range([0, width]);
       const y = d3.scaleLinear().range([height, 0]);

       // Create the SVG element and append it to the chart container
       const svg = d3.select("#stockChart")
         .append("svg")
           .attr("width", width + margin.left + margin.right)
           .attr("height", height + margin.top + margin.bottom)
         .append("g")
           .attr("transform", `translate(${margin.left},${margin.top})`);


        const dataset1 = [
          { date: new Date("2022-01-01"), value: 200 },
          { date: new Date("2022-02-01"), value: 250 },
          { date: new Date("2022-03-01"), value: 180 },
          { date: new Date("2022-04-01"), value: 300 },
          { date: new Date("2022-05-01"), value: 280 },
          { date: new Date("2022-06-01"), value: 220 },
          { date: new Date("2022-07-01"), value: 300 },
          { date: new Date("2022-08-01"), value: 450 },
          { date: new Date("2022-09-01"), value: 280 },
          { date: new Date("2022-10-01"), value: 600 },
          { date: new Date("2022-11-01"), value: 780 },
          { date: new Date("2022-12-01"), value: 320 }
        ];

       // Define the x and y domains
       // Assuming result is an array of objects with 'days' and 'value' properties
         x.domain(d3.extent(result, d => d.days)); // Assuming days represent dates
         y.domain([0, d3.max(result, d => d.value)]); // Adjust according to your data;
         console.log(x)

       // Add the x-axis
       svg.append("g")
         .attr("transform", `translate(0,${height})`)
         .call(d3.axisBottom(x)
           .ticks(d3.timeMonth.every(1))
           .tickFormat(d3.timeFormat("%m %y")));

       // Add the y-axis
       svg.append("g")
         .call(d3.axisLeft(y));

       // Create the line generator
       const line = d3.line()
         .x(d => x(d.days))
         .y(d => y(d.value));

      result.forEach((dataset) => {
        // console.log(dataset)
        svg.append('path')
           .datum(dataset)
           .attr('fill', 'none')
           .attr('stroke', 'steelblue')
           .attr('stroke-width', 2)
           .attr('d', line);
      });

//        svg.append('path')
//           .datum(dataset1)
//           .attr('fill', 'none')
//           .attr('stroke', 'steelblue')
//           .attr('stroke-width', 2)
//           .attr('d', line);

        }catch (error) {
        console.error("Error handling data:", error);
    }
    }
