
let width = 900,
    height = 350;



let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", width)     // HINT: width
    .attr("height", height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform


let countRef = svg.append("g");


d3.csv("../data/video_games.csv").then(function (data) {

    data = cleanData(data, function (a, b) { return parseInt(b.count) - parseInt(a.count) }, NUM_EXAMPLES);



    let x = d3.scaleLinear()

        .domain([0, d3.max(data, function (d) { return d.Global_Sales })])
        .range([0, width - `${margin.left}` - `${margin.right}`]);


    let y = d3.scaleBand()
        .domain(data.map(d => d.Name))
        .range([0, height - `${margin.top}` - `${margin.bottom}`])
        .padding(0.1);  // Improves readability

    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));


    let bars = svg.selectAll("rect").data(data);


    let color = d3.scaleOrdinal()
        .domain(data.map(function (d) { return d["Name"] }))
        .range(d3.quantize(d3.interpolateHcl("rgb(233, 92, 96)", "rgb(171, 162, 187)"), NUM_EXAMPLES));
    



    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function (d) { return color(d['Name']) })
        .attr("x", x(0))
        .attr("y", function (d) { return y(d.Name) })
        .attr("width", function (d) { return x(d.Global_Sales) })
        .attr("height", y.bandwidth())
        

    let counts = countRef.selectAll("text").data(data);


    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function (d) { return x(d.Global_Sales) + 10 })
        .attr("y", function (d) { return y(d.Name) + height / NUM_EXAMPLES / 2 })
        .style("text-anchor", "start")
        .text(function (d) { return d.Global_Sales });



    svg.append("text")
        .attr("transform", `translate(${(width - margin.left - margin.right) / 2}, ${height - margin.top - (margin.bottom / 2)})`)

        .style("text-anchor", "middle")
        .text("Global Sales (Millions)");

    // TODO: Add y-axis label
    svg.append("text")
        .attr("transform", `translate(${-margin.left / 2}, ${(height - margin.top - margin.bottom) / 2})`)

        .style("text-anchor", "middle")
        .text("Game");

    // TODO: Add chart title
    svg.append("text")
        .attr("transform", `translate(${(width - margin.left - margin.right) / 2}, ${-margin.top / 2})`)
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Top 10 Video Games All Time");
});


function cleanData(data, comparator, numExamples) {

    data = data.sort(comparator);

    return data.slice(0, numExamples)
}
