angular.module('omniMood')
  .directive('whateveryouwant', function() {
    return {
      restrict: 'E',
      scope: {

      },
      link: somethingelse
    };

    function somethingelse(scope, element, attr) {
      var mapSVG = d3.select(element[0]).append("svg")
        .attr("id", "svg_map"),
        width = window.innerWidth * .70,
        height = window.innerHeight * .70,
        outlineDefault = "#eeeeee",
        outlineHighlight = "#1221ee",
        fillDefault = "#000000",
        moodMin = -10,
        moodMid = 0,
        moodMax = 10,
        countryArrayIndex = 0;

      var moodScale = d3.scaleLinear()
        .domain([moodMin, moodMid, moodMax])
        .range(["red", "yellow", "green"]);

      var g = mapSVG
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("id", "map-container");

      g
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "steelblue");

      d3.json("../json/countries_no_show_antarctica.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        var projection = d3.geoMercator()
          .scale((height + 50) / (1.55 * Math.PI))
          .translate([width / 2, height / 1.5]);

        var path = d3.geoPath()
          .projection(projection);

        g.selectAll(".country")
          .data(countries)
          .enter().insert("path", ".graticule")
          .attr("id", function(d) {
            return "cc" + (d.properties.iso_n3 / 1);
          })
          .attr("d", path)
          .attr("stroke", outlineDefault)
          .on("mouseover", function(d) {
            d3.select(this)
            .attr("stroke", outlineHighlight);
          })

          .on("mouseout", function() {
            d3.select(this)
              .attr("stroke", outlineDefault);
          })
        .append("svg:title")
        .text(function(d) {
          return d.properties.name;
        });
      });

      setInterval(function() {
        d3.json('/api/countries', function(error, moodData) {

          countryArrayIndex = (countryArrayIndex >= moodData.length) ? 0 : countryArrayIndex;
          if (moodData[countryArrayIndex].countryId == '10') {
            countryArrayIndex++;
          }
          var thisMoodValue = moodData[countryArrayIndex];
          moodChanged = true;

          if (countries[thisMoodValue.countryId]) {
            if (countries[thisMoodValue.countryId] == thisMoodValue.mood) {
              moodChanged = false;
            }
          } else {
            countries[thisMoodValue.countryId] = thisMoodValue.mood;
          }

          if (moodChanged) {
            d3.select("path#cc" + thisMoodValue.countryId)
              .style("fill", "white")
              .attr("stroke", "black")
              .attr("stroke-width", 1)
              .transition()
              .duration(2000)
              .attr("stroke", outlineDefault)
              .attr("stroke-width", 1)
              .style("fill", moodScale(thisMoodValue.mood * 10));
          }

          countryArrayIndex++;
        });
      }, 200);
    }
  });