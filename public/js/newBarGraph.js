var emojis = {};

var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        console.log("ERROR!!!");
        reject(status);
      }
    };
    xhr.send();
  });
};

getJSON('/api/timeline').then(function(data) {
    emojis = data.totalCount;
    var maxPercent = 0;

    var emojiKeys = Object.keys(emojis);

    var emojiObject = {};
    var emojiArray = [];
    emojiKeys.forEach(function(key) {
      if(key != 'total') {
        emojiObject = {
          name: key,
          count: emojis[key].count,
          percentage: emojis[key].percentage
        }
      emojiArray.push(emojiObject);
      }
    });

    emojiArray.sort(compare);

    function compare(a,b) {
      if (a.percentage < b.percentage) {
        maxPercent = b.percentage;
        return -1;
      }
      if (a.percentage > b.percentage) {
        maxPercent = a.percentage;
        return 1;
      }
      return 0;
    }

    var topEmojis = emojiArray.slice(emojiArray.length - 8, emojiArray.length);
    // set the dimensions and margins of the graph
    var margin = {top: 40, right: 20, bottom: 50, left: 40},
        width = parseInt(d3.select('.barGraph').style('width')) - margin.left - margin.right,
        height = parseInt(d3.select('.barGraph').style('height')) - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand()
              .range([0, width])
              .padding(0.1);
    var y = d3.scaleLinear()
              .range([height, 0]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(".barGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // get the data
    for(var i = 0; i < 8; i++) {
        data = topEmojis;
        data[i].name = topEmojis[i].name;
        data[i].percentage = topEmojis[i].percentage;
      }

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.percentage + .03; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.name); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.percentage); })
      .attr("height", function(d) { return height - y(d.percentage); });

    // add the x Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "xAxis")
      .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
      .attr("class", "yAxis")
      .call(d3.axisLeft(y));

    svg.selectAll("bar")
      .data(data)
      .enter()
      .append("image")
      .attr("class", "emoji")
      .attr("x", function(d, index) {
        return x(d.name) + 2;
      })
      .attr("y", function(d, index) {
        return height + 8;
      })
      .style("width", '1vw')
      .style("height", '1vw')
      .attr("xlink:href", function(d) {
        return "emojis/" + d.name.toLowerCase() + ".png"
      });

    svg.selectAll(".xAxis text")
      .style("opacity", 0);

    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline")
      .text("Top Emojis");

    svg.append("g")
      .append("text")
      .attr("y", -15)
      .attr("x", 40)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font-size", ".7em")
      .text("Percentage");

    svg.selectAll(".bar")
      .style("fill", "gold");

    svg.selectAll("text")
      .style("fill", "white");

    svg.selectAll("line")
      .style("stroke", "white");

    svg.selectAll(".domain")
      .style("stroke", "white");

  }, function(status) { //error detection....
    alert('Something went wrong.');
});
