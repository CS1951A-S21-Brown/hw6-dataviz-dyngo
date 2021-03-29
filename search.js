

let g3 = d3.select("#graph3")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform


let x3 = d3.scaleLinear()
    .range([0, width - margin.left - margin.right]);


let y3 = d3.scaleBand()
    .range([0, height - margin.top - margin.bottom])
    .padding(0.1);



let datRef = g3.append("g");

let y3_axis_label = g3.append("g");


g3.append("text")
    .attr("transform", `translate(${width / 2 - margin.left}, ${height - margin.bottom})`)
    .style("text-anchor", "middle")
    .text("Global Sales in Dollars (Millions)");




let y3_axis_text = g3.append("text")
    .attr("transform", `translate(-150, ${height / 2 - margin.bottom})`)
    .style("text-anchor", "middle");


let title3 = g3.append("text")
    .attr("transform", `translate(${width / 2 - margin.left}, 0)`)
    .style("text-anchor", "middle")
    .style("font-size", 15);


function setGenre() {
    d3.csv('../data/video_games.csv').then(function (data) {
        input_genre = document.getElementById("attrInput").value;
        if (input_genre.length > 1) {
            genre = input_genre;
        }
        else {
            genre = "Action";
        }
        data = clean(data, function (a, b) { return parseInt(b.count) - parseInt(a.count) }, genre);
        
        x3.domain([0, d3.max(data, d => d.value)])
        
        y3.domain(data.map(d => d.key))

        y3_axis_label.call(d3.axisLeft(y3).tickSize(0).tickPadding(0));

        let bars3 = g3.selectAll("rect").data(data);
        let color3 = d3.scaleOrdinal()
            .domain(data.map(function (d) { return d.key }))
            .range(d3.quantize(d3.interpolateHcl("rgb(0, 191, 128)", "rgb(77, 65, 147)"), 6));

        bars3.enter()
            .append("rect")
            .merge(bars3)
            .attr("fill", d => color3(d.key))
            .transition()
            .duration(1000)
            .attr("x", x3(0))
            .attr("y", d => y3(d.key))

            .attr("width", d => `${x3(d.value)}px`)
            .attr("height", y3.bandwidth());


        let counts3 = datRef.selectAll("text").data(data);


        counts3.enter()
            .append("text")
            .merge(counts3)
            .transition()
            .duration(1000)
            .attr("x", d => x3(d.value) + 10)
            .attr("y", d => y3(d.key) + 10)
            .style("text-anchor", "start")
            .text(d => d.value);


        y3_axis_text.text("Publisher");

        title3.text(`Top Publishers of ${genre} Videogames`);


        bars3.exit().remove();
        counts3.exit().remove();


    })
}
function clean(data, numExamples, genre) {

    data = data.filter(function (d) { return d.Genre == genre })
    let nestedData = d3.nest()
        .key(function (d) { return d.Publisher })

        .rollup(function (leaves) {
            return d3.sum(leaves, function (d) { return (d.Global_Sales) })
        })
        .entries(data)
    nestedData = nestedData.sort(function (a, b) { return -a.value - -b.value })
    
    
    
    return nestedData.slice(0, 8)
}
setGenre()