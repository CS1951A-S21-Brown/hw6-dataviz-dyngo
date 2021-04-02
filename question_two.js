

let graph = d3.select("#graph2")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform


let x = d3.scaleLinear()
    .range([0, width - margin.left - margin.right]);


let y = d3.scaleBand()
    .range([0, height - margin.top - margin.bottom])
    .padding(0.1);



let salesRef = graph.append("g");

let y_axis_label = graph.append("g");


graph.append("text")
    .attr("transform", `translate(${width / 2 - margin.left}, ${height - margin.bottom})`)
    .style("text-anchor", "middle")
    .text("Dollars (Millions)");




let y_axis_text = graph.append("text")
    .attr("transform", `translate(-150, ${height / 2 - margin.bottom})`)
    .style("text-anchor", "middle");


let title = graph.append("text")
    .attr("transform", `translate(${width / 2 - margin.left}, 0)`)
    .style("text-anchor", "middle")
    .style("font-size", 15);


function setData(region) {
    d3.csv('../data/video_games.csv').then(function (data) {

        data = second_cleanData(data, function (a, b) { return parseInt(b.count) - parseInt(a.count) }, region);



        x.domain([0, d3.max(data, d => d.value)])
        y.domain(data.map(d => d.key))

        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(0));

        let blocks = graph.selectAll("rect").data(data);
        let color = d3.scaleOrdinal()

            .domain(data.map(function (d) { return d.key }))
            .range(d3.quantize(d3.interpolateHcl("lightblue", "darkblue"), 5));
        
        blocks.enter()
            .append("rect")
            .merge(blocks)
            .attr("fill", d => color(d.key))
            .transition()
            .duration(1000)
            .attr("x", x(0))
            .attr("y", d => y(d.key))
            .attr("width", d => `${x(d.value)}px`)
            .attr("height", y.bandwidth())
           

        let counter = salesRef.selectAll("text").data(data);


        counter.enter()
            .append("text")
            .merge(counter)
            .transition()
            .duration(1000)
            .attr("x", d => x(d.value) + 10)
            .attr("y", d => y(d.key) + 10)
            .style("text-anchor", "start")
            .text(d => d.value);


        y_axis_text.text("Genre");

        title.text(`Top Selling Genres of ${region} Videogames`);


        blocks.exit().remove();
        counter.exit().remove();
    });
}

function second_cleanData(data, numExamples, region) {
    let nestedData = d3.nest()
        .key(function (d) { return d.Genre })
        .rollup(function (leaves) {
            return d3.sum(leaves, function (d) { return (d[region]) })
        })
        .entries(data)
    nestedData = nestedData.sort(function (a, b) { return -a.value - -b.value })
    return nestedData.slice(0, 8)
}
setData("NA_Sales")
