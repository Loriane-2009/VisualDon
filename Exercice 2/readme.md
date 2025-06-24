# 🌐 Introduction à D3.js

## 📦 Installation

1. Installez **Node.js** et **npm** si ce n’est pas encore fait.  
   *(Pas besoin de connaître Node.js en profondeur — c’est juste pour faire tourner un serveur local et gérer les dépendances.)*
2. Ouvrez votre terminal et placez-vous dans le dossier de l’exercice :

```bash
cd 02-intro-d3
```

3. Installez les dépendances :

```bash
npm install
```

4. Lancez le serveur de développement :

```bash
npm run dev
```

🟢 Une fois lancé, le serveur sera accessible à l’adresse : **http://localhost:5173**

- Le fichier HTML principal est `index.html`
- Le fichier dans lequel vous coderez est `src/index.js`

> ⚠️ **Important** : Seules les **méthodes du module `d3-selection`** sont autorisées pour cet exercice.

---

## 🧪 Exercice

### 🎯 Manipuler le DOM

- Créez **3 cercles** de rayon **40px** avec les positions :
  - (50, 50)
  - (150, 150)
  - (250, 250)

### 🎨 Attributs

- Changez la **couleur du deuxième cercle**
- Déplacez les **deux premiers cercles** de **50px vers la droite**

### ➕ Append

- Ajoutez un **texte sous chaque cercle**

### 🖱️ Événements

- Lorsque vous **cliquez sur le 3e cercle**, alignez **verticalement** les 3 cercles

### 📊 Données

Dessinez des **rectangles** représentant les valeurs `[20, 5, 25, 8, 15]`.

- Largeur fixe : **20px**
- Hauteur dynamique : correspond à la valeur
- Alignez les rectangles en **bas** comme dans un **graphique en bâtons**
- Utilisez :

```js
selection.data(data).join(enter => enter.append(...))
```

---

## ✅ Structure minimale pour démarrer (src/index.js)

```js
import * as d3 from "d3";

// Création de l’espace SVG
const svg = d3.select("svg");

// Circles
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
  .attr("fill", (d, i) => i === 1 ? "orange" : "steelblue");

// Déplacer les 2 premiers
svg.selectAll("circle")
  .filter((d, i) => i < 2)
  .attr("cx", d => d.cx + 50);

// Ajouter texte
svg.selectAll("text")
  .data(circles)
  .join("text")
  .attr("x", d => d.cx + 50)
  .attr("y", d => d.cy + 60)
  .text((d, i) => `Cercle ${i + 1}`)
  .attr("text-anchor", "middle");

// Aligner verticalement au clic
svg.selectAll("circle")
  .filter((d, i) => i === 2)
  .on("click", () => {
    svg.selectAll("circle")
      .attr("cx", 250);
  });

// Bar chart avec data
const data = [20, 5, 25, 8, 15];
svg.selectAll("rect")
  .data(data)
  .join("rect")
  .attr("x", (d, i) => i * 30)
  .attr("y", d => 300 - d)
  .attr("width", 20)
  .attr("height", d => d)
  .attr("fill", "teal");
```

---

✨ Voilà, amusez-vous bien avec **D3.js** !
