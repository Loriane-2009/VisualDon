import * as d3 from "d3";
import rewind from "@turf/rewind";


/*
========================================================================================================================
1. Dessin SVG (15 points)
========================================================================================================================
Vous pouvez dessiner la figure soit à partir d'ici ou directement dans l'HTML (index.html).
*/


const svg = d3.select("#drawing");

// --- Ajout de la grille 10x10 pixels couvrant tout le SVG ---
const gridSize = 10;
const svgWidth = +svg.attr("width");
const svgHeight = +svg.attr("height");

// Lignes verticales
for (let x = 0; x <= svgWidth; x += gridSize) {
    svg.append("line")
        .attr("x1", x)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", svgHeight)
        .attr("stroke", "black")
        .attr("stroke-opacity", 0.2);
}

// Lignes horizontales
for (let y = 0; y <= svgHeight; y += gridSize) {
    svg.append("line")
        .attr("x1", 0)
        .attr("y1", y)
        .attr("x2", svgWidth)
        .attr("y2", y)
        .attr("stroke", "black")
        .attr("stroke-opacity", 0.2);
}



// Carré rouge gauche
svg.append("rect")
    .attr("x", 50)
    .attr("y", 10)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", "red")
    .attr("stroke", "black")
    .attr("stroke-width", 2);


// Carré rouge droite
svg.append("rect")
    .attr("x", 100)
    .attr("y", 10)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", "red")
    .attr("stroke", "black")
    .attr("stroke-width", 2);


// Tracé exact du V fermé (grille 10x10)
svg.append("path")
    .attr("d", d3.line()([
        [50, 20],   // coin bas gauche carré gauche
        [70, 80],  // coin bas gauche du V
        [90, 80], // coin bas droit du V
        [110, 20],  // coin bas droit carré droit
        [100, 20],  // coin haut droit carré droit
        [80, 70], // intérieur droit
        [80, 70],  // intérieur gauche
        [60, 20],   // coin haut gauche carré gauche
        [50, 20]    // fermeture
    ]))
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 2);









    
// Import des données
d3.json('../data/votations_vd.geojson')
    .then(data => {

        // Données
        console.log('Données brutes', data)

        /*
========================================================================================================================
2. Manipulation des données (20 points)
========================================================================================================================
        */

        // --- 2.1 Le pourcentage de oui pour chacune des communes ---
        data.features.forEach(d => {
            const total = d.properties.oui + d.properties.non;
            d.properties.pct_oui = total > 0 ? (d.properties.oui / total) * 100 : 0;
            d.properties.pct_non = total > 0 ? (d.properties.non / total) * 100 : 0;
        });
        console.log("2.1 Pourcentage de oui pour chaque commune:", data.features.map(d => ({
            nom: d.properties.name,
            pct_oui: d.properties.pct_oui.toFixed(2)
        })));

        // --- 2.2 La commune avec le pourcentage de non le plus élevé ---
        const worstNon = data.features.reduce((max, d) =>
            d.properties.pct_non > max.properties.pct_non ? d : max, data.features[0]
        );
        console.log("2.2 Commune avec le plus de NON:", worstNon.properties.name, "-", worstNon.properties.pct_non.toFixed(2) + "%");

        // --- 2.3 Moyennes cantonales ---
        const moyOui = d3.mean(data.features, d => d.properties.pct_oui);
        const moyNon = d3.mean(data.features, d => d.properties.pct_non);
        console.log("2.3 Moyenne cantonale OUI:", moyOui.toFixed(2) + "%");
        console.log("2.3 Moyenne cantonale NON:", moyNon.toFixed(2) + "%");

        /*
========================================================================================================================
3. Visualisations (45 points)
========================================================================================================================
        */

        // Constantes
        const margin = {top: 10, right: 40, bottom: 20, left: 40},
            width = 0.8 * window.innerWidth - margin.left - margin.right,
            height = 0.7 * window.innerHeight + margin.top + margin.bottom;


        // --- 3.1 Carte choroplète ---
        const mapSvg = d3.select('#map')
            .append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Rewind data : pour que les données soient dessinées dans le bon ordre
        let reversed_data = data.features.map(function (feature) {
            return rewind(feature, {reverse: true});
        })

        // Données à utiliser pour la carte
        console.log('Données (features) à utiliser pour la carte', reversed_data)

        const projection = d3.geoMercator()
            .fitSize([width, height], {"type": "FeatureCollection", "features": reversed_data})

        const path = d3.geoPath()
            .projection(projection)





        // Echelle de couleur
        const color = d3.scaleLinear()
            .domain([0, 100])
            .range(["red", "green"]);

        // Tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background", "#fff")
            .style("border", "1px solid #999")
            .style("padding", "5px")
            .style("pointer-events", "none");

        // Dessin des communes
        mapSvg.selectAll("path")
            .data(reversed_data)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", d => color(d.properties.pct_oui))
            .attr("stroke", "white")
            .on("mouseover", function (event, d) {
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`<strong>${d.properties.name}</strong><br>OUI: ${d.properties.pct_oui.toFixed(1)}%`);
            })
            .on("mousemove", function (event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                       .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", function () {
                tooltip.transition().duration(200).style("opacity", 0);
            });

        // Réflexion critique
        console.log("3.1 Réflexion : Une carte choroplète peut être trompeuse car les communes de grande superficie attirent plus l'attention visuelle que les plus peuplées. Une carte anamorphosée pondérée par la population ou un graphique en barres permettrait de mieux comparer les proportions.");



        // ---------------------------- Continuez ci-dessous -----------------------------------









        // --- 3.2 Barchart ---
        const barchartSvg = d3.select('#barchart')
            .append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Trier les données selon pourcentage de oui
        const sortedData = [...data.features].sort((a, b) => a.properties.pct_oui - b.properties.pct_oui);

        // Échelles
        const x = d3.scaleBand()
            .domain(sortedData.map(d => d.properties.name))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        // Axes
        barchartSvg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d => "").tickSizeOuter(0)); // pas de texte si trop de communes

        barchartSvg.append("g")
            .call(d3.axisLeft(y).ticks(10));

        // Barres
        barchartSvg.selectAll(".bar")
            .data(sortedData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.properties.name))
            .attr("width", x.bandwidth())
            .attr("y", height)
            .attr("height", 0)
            .attr("fill", "steelblue")
            .transition()
            .duration(800)
            .delay((d, i) => i * 5)
            .attr("y", d => y(d.properties.pct_oui))
            .attr("height", d => height - y(d.properties.pct_oui));

    })


