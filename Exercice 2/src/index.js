import * as d3 from "d3-selection";

// Espace SVG
const svg = d3.select("svg");

// Cercles initiaux
const circles = [
  { cx: 50, cy: 50 },
  { cx: 150, cy: 150 },
  { cx: 250, cy: 250 }
];

svg.selectAll("circle")
  .data(circles)
  .join("circle")
  .attr("cx", d => d.cx)
  .attr("cy", d => d.cy)
  .attr("r", 40)
  .attr("fill", "steelblue"); // Couleur temporaire

 //Changer la couleur du deuxième cercle 
  svg.selectAll("circle")
  .filter((d, i) => i === 1)
  .attr("fill", "orange");

//Déplacer les 2 premiers cercles de 50px vers la droite
  svg.selectAll("circle")
  .filter((d, i) => i < 2)
  .attr("cx", d => d.cx + 50);

//Ajouter du texte sous les cercles
  svg.selectAll("text")
  .data(circles)
  .join("text")
  .attr("x", d => d.cx + (d.cx < 200 ? 50 : 0))  // ajuste si tu as déplacé
  .attr("y", d => d.cy + 60)
  .text((d, i) => `Cercle ${i + 1}`)
  .attr("text-anchor", "middle")
  .attr("font-size", "12px");

//Aligner verticalement au clic sur le 3e cercle
svg.selectAll("circle")
  .filter((d, i) => i === 2)
  .on("click", () => {
    // Aligner les cercles
    svg.selectAll("circle")
      .attr("cx", 250);

    // Aligner les textes sous les cercles
    svg.selectAll("text")
      .attr("x", 250);
  });

// Dessiner un graph en bâton avec les données
  const data = [20, 5, 25, 8, 15];

svg.selectAll("rect")
  .data(data)
  .join("rect")
  .attr("x", (d, i) => i * 30)           // espacement horizontal
  .attr("y", d => 400 - d)               // aligné en bas
  .attr("width", 20)
  .attr("height", d => d)
  .attr("fill", "teal");
