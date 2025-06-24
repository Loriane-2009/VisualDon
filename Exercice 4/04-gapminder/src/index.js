import * as d3 from 'd3';

const width = 960;
const height = 600;
const margin = { top: 20, right: 20, bottom: 50, left: 70 };
const year = "2021";

Promise.all([
  d3.csv("../data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv"),
  d3.csv("../data/life_expectancy_years.csv"),
  d3.csv("../data/population_total.csv"),
  d3.json("../data/world.geojson")
]).then(([incomeData, lifeData, popData, geojson]) => {
  // --- Préparation des données ---
  const parseNumber = (val) => {
    if (!val) return 0;
    val = val.replace(/,/g, '');
    const match = val.match(/([\d.]+)([kM])?/);
    if (!match) return 0;
    const num = parseFloat(match[1]);
    const suffix = match[2];
    return suffix === 'k' ? num * 1000 : suffix === 'M' ? num * 1e6 : num;
  };

  const incomeMap = new Map(incomeData.map(d => [d.country, parseNumber(d[year])]));
  const lifeMap = new Map(lifeData.map(d => [d.country, parseNumber(d[year])]));
  const popMap = new Map(popData.map(d => [d.country, parseNumber(d[year])]));

  const data = incomeData.map(d => {
    const country = d.country;
    return {
      country,
      income: incomeMap.get(country),
      life: lifeMap.get(country),
      pop: popMap.get(country)
    };
  }).filter(d => d.income > 0 && d.life > 0 && d.pop > 0);

  console.log('Nombre de pays valides :', data.length);

  // === SCATTER PLOT ===
  const svgScatter = d3.select("#scatter");

  const x = d3.scaleLog()
    .domain([100, d3.max(data, d => d.income)])
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.life)])
    .range([height - margin.bottom, margin.top]);

  const r = d3.scaleSqrt()
    .domain([0, d3.max(data, d => d.pop)])
    .range([2, 20]);

  svgScatter.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(10, "~s"));

  svgScatter.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svgScatter.append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .text("PIB par habitant ($)");

  svgScatter.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .text("Espérance de vie (années)");

  svgScatter.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.income))
    .attr("cy", d => y(d.life))
    .attr("r", d => r(d.pop))
    .attr("fill", "#1f77b4")
    .attr("opacity", 0.7)
    .on('mouseover', (event, d) => {
      d3.select(event.currentTarget)
        .attr("fill", "#ff7f0e")
        .attr("opacity", 1);
      d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("z-index", 10)
        .html(`<strong>${d.country}</strong><br>
               PIB: ${d3.format(".2s")(d.income)}<br>
               Espérance de vie: ${d.life.toFixed(1)} ans<br>
               Population: ${d3.format(".2s")(d.pop)}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px");
    })
    .on('mouseout', (event) => {
      d3.select(event.currentTarget)
        .attr("fill", "#1f77b4")
        .attr("opacity", 0.7);
      d3.selectAll(".tooltip").remove();
    });

  // === CHOROPLÈTHE ===
  const svgMap = d3.select("#map");
  const mapWidth = +svgMap.attr("width");
  const mapHeight = +svgMap.attr("height");

  const projection = d3.geoNaturalEarth1()
    .scale(160)
    .translate([mapWidth / 2, mapHeight / 2]);

  const path = d3.geoPath().projection(projection);

  const lifeValues = Array.from(lifeMap.values()).filter(v => v > 0);
  const color = d3.scaleQuantile()
    .domain(lifeValues)
    .range(d3.schemeYlGnBu[9]);

  svgMap.selectAll("path")
    .data(geojson.features)
    .join("path")
    .attr("d", path)
    .attr("fill", d => {
      const val = lifeMap.get(d.properties.name);
      return val ? color(val) : "#eee";
    })
    .attr("stroke", "#666")
    .attr("stroke-width", 0.5)
    .on("mouseover", (event, d) => {
      const name = d.properties.name;
      const val = lifeMap.get(name);
      const countryData = data.find(c => c.country === name);

      d3.select(event.currentTarget)
        .style("stroke", "#ff7f0e")
        .style("opacity", 0.8);

      d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("z-index", 10)
        .html(`<strong>${name}</strong><br>
               ${val ? `Espérance de vie: ${val.toFixed(1)} ans<br>` : "Donnée manquante"} 
               ${countryData ? `PIB: ${d3.format(".2s")(countryData.income)}<br>Population: ${d3.format(".2s")(countryData.pop)}` : ""}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px");
    })
    .on("mouseout", (event) => {
      d3.select(event.currentTarget)
        .style("stroke", "#666")
        .style("opacity", 1);
      d3.selectAll(".tooltip").remove();
    });

  // Légende
  const legend = svgMap.append("g")
    .attr("transform", `translate(${(mapWidth - 150) / 2}, ${mapHeight - 50})`);

  const steps = color.range().length;
  const stepWidth = 150 / steps;

  color.range().forEach((col, i) => {
    legend.append("rect")
      .attr("x", i * stepWidth)
      .attr("width", stepWidth)
      .attr("height", 15)
      .attr("fill", col);
  });

  legend.append("text")
    .attr("x", 0)
    .attr("y", -5)
    .text("Espérance de vie (années)");

  legend.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("text-anchor", "start")
    .text(d3.min(lifeValues).toFixed(1));

  legend.append("text")
    .attr("x", 150)
    .attr("y", 30)
    .attr("text-anchor", "end")
    .text(d3.max(lifeValues).toFixed(1));
});