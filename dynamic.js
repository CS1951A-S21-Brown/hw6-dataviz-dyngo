
// TODO: Set up SVG object with width, height and margin
/*
    HINT: Our first call to select will select the id of the div in HTML where we want to insert our barplot

    HINT: To add a margin to your svg graph, add the attribute
    attr("transform", "translate(x, y)"), where x is the left margin
    and y is the top margin (defined in d3_lab.html). To access a variable
    defined in the HTML file, you can use the ${variable} notation.
 */
let plot = d3.select("#graph2")
    .append("svg")
    .attr("width", width)     // HINT: width
    .attr("height", height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform

// Set up reference to count SVG group
let salesRef = plot.append("g");



// TODO: Load the artists CSV file into D3 by using the d3.csv() method
d3.csv("../data/video_games.csv").then(function(data) {
    // TODO: Clean and strip desired amount of data for barplot
    data = dynamic_cleanData(data, function(a,b) {return parseInt(b.count)-parseInt(a.count)}, NUM_EXAMPLES, "Shooter");
    /*
        HINT: use the parseInt function when looking at data from the CSV file and take a look at the
        cleanData function below.

        Use your NUM_EXAMPLES defined in d3_lab.html.
     */

    // TODO: Create a linear scale for the x axis (number of occurrences)
    let x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {return d.NA_Sales})])
        .range([0, width - `${margin.left}` - `${margin.right}`]);
    /*
        HINT: The domain and range for the linear scale map the data points
        to appropriate screen space.

        The domain is the interval of the smallest to largest data point
        along the desired dimension. You can use the d3.max(data, function(d) {...})
        function to get the max value in the dataset, where d refers to a single data
        point. You can access the fields in the data point through d.count or,
        equivalently, d["count"].

        The range is the amount of space on the screen where the given element
        should lie. We want the x-axis to appear from the left edge of the svg object
        (location 0) to the right edge (width - margin.left - margin.right).
     */

    // TODO: Create a scale band for the y axis (artist)
    let y = d3.scaleBand()
        .domain(data.map(d => d.Name))
        .range([0, height - `${margin.top}` - `${margin.bottom}`])
        .padding(0.1);  // Improves readability
    /*
        HINT: For the y-axis domain, we want a list of all the artist names in the dataset.
        You might find JavaScript's map function helpful.

        Set up the range similar to that of the x-axis. Instead of going from the left edge to
        the right edge, we want the y-axis to go from the top edge to the bottom edge. How
        should we define our boundaries to incorporate margins?
     */

    // TODO: Add y-axis label
    plot.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));
    // HINT: The call function takes in a d3 axis object. Take a look at the d3.axisLeft() function.
    // SECOND HINT: Try d3.axisLeft(y).tickSize(0).tickPadding(10). At check in, explain to TA
    // what this does.

    /*
        This next line does the following:
            1. Select all desired elements in the DOM
            2. Count and parse the data values
            3. Create new, data-bound elements for each data value
     */
    let bars = plot.selectAll("rect").data(data);

    // OPTIONAL: Define color scale
    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["Name"] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), NUM_EXAMPLES));


    // TODO: Render the bar elements on the DOM
    /*
        This next section of code does the following:
            1. Take each selection and append a desired element in the DOM
            2. Merge bars with previously rendered elements
            3. For each data point, apply styling attributes to each element
     */
    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['Name']) }) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
        .attr("x", x(0))
        .attr("y", function(d) {return y(d.Name)})               // HINT: Use function(d) { return ...; } to apply styles based on the data point (d)
        .attr("width", function(d) {return x(d.NA_Sales)})
        .attr("height",  y.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height
    /*
        HINT: The x and y scale objects are also functions! Calling the scale as a function can be
        used to convert between one coordinate system to another.

        To get the y starting coordinates of a data point, use the y scale object, passing in a desired
        artist name to get its corresponding coordinate on the y-axis.

        To get the bar width, use the x scale object, passing in a desired artist count to get its corresponding
        coordinate on the x-axis.
     */
    /*
        In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
        bar plot. We will be creating these in the same manner as the bars.
     */
    let counts = salesRef.selectAll("text").data(data);

    // TODO: Render the text elements on the DOM
    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) {return x(d.NA_Sales)+10})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("y", function(d) {return y(d.Name)+height/NUM_EXAMPLES/2})       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        .style("text-anchor", "start")
        .text(function(d) {return d.NA_Sales});           // HINT: Get the name of the artist


    // TODO: Add x-axis label
    plot.append("text")
        .attr("transform", `translate(${(width-margin.left-margin.right)/2}, ${height-margin.top-(margin.bottom/2)})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        // .attr("transform", `translate(${margin.left}, ${height-margin.top})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Global Sales (Millions)");

    // TODO: Add y-axis label
    plot.append("text")
        .attr("transform", `translate(${-margin.left/2}, ${(height-margin.top-margin.bottom)/2})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        // .attr("transform", `translate(${-(margin.left+margin.right)/2}, ${margin.top})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Name");

    // TODO: Add chart title
    plot.append("text")
        .attr("transform", `translate(${(width-margin.left-margin.right)/2}, ${-margin.top/2})`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Top 10 Video Games All Time");
});

/**
 * Cleans the provided data using the given comparator then strips to first numExamples
 * instances
 */
function dynamic_cleanData(data, comparator, numExamples, genre) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
    data = data.filter(function(d){ return d.Genre == genre})
    //data = data.filter(function(d){ return d.Genre == "Shooter"})
    data = data.sort(function(a,b) { return -a.NA_Sales - -b.NA_Sales })
    //data = data.sort(comparator);
    return data.slice(0, numExamples)
}
