# Dessiner des formes et les animer en SVG

## Rectangle

Dessiner un rectangle rouge de **800px** de largeur et **300px** de hauteur.

```html
<rect id="rect" x="10" y="10" width="800" height="300" fill="red" />
```

## Donut 🍩

Dessiner un donut :

- avec **contours noirs**
- **sans remplissage**
- **centré** en `(100, 100)`
- de **rayon intérieur** `30px` et **extérieur** `60px`

```html
<circle id="donut-outer" cx="100" cy="100" r="60" fill="none" stroke="black" stroke-width="2"/>
<circle id="donut-inner" cx="100" cy="100" r="30" fill="white" stroke="white" stroke-width="2"/>
```

## Ligne

Créer une ligne qui passe par un point A `(70px, 90px)`, qui a une **longueur de 100px** et une **pente de 5**.

```html
<line x1="70" y1="90" x2="89.23" y2="186.15" stroke="blue" stroke-width="2" />
```

## Path

Écrivez votre prénom avec `<path></path>`. Exemple pour la lettre **L** :

```html
<path id="letter" d="M500,100 L500,200 L550,200" fill="none" stroke="purple" stroke-width="2"/>
```

---

# Animer des formes

## On click

Changer la couleur du rectangle ci-dessus en cliquant sur le rectangle (et revenir à la couleur initiale en cliquant une deuxième fois).

```javascript
const rect = document.getElementById('rect');
let isRed = true;
rect.addEventListener('click', () => {
  rect.setAttribute('fill', isRed ? 'green' : 'red');
  isRed = !isRed;
});
```

## On hover

Agrandir le rayon extérieur du donut que vous avez créé **on hover**.

```javascript
const donutOuter = document.getElementById('donut-outer');
donutOuter.addEventListener('mouseenter', () => {
  donutOuter.setAttribute('r', '70');
});
donutOuter.addEventListener('mouseleave', () => {
  donutOuter.setAttribute('r', '60');
});
```

## Animation le long de la lettre

Prenez la première lettre de votre prénom que vous avez créée ci-dessus. Faites bouger une forme de votre choix **le long de la lettre**.

```html
<circle r="5" fill="orange">
  <animateMotion repeatCount="indefinite" dur="4s">
    <mpath href="#letter" />
  </animateMotion>
</circle>
```

---

## Astuce

Utilisez `<animateMotion>` pour faire bouger une forme le long d’un chemin `<path>`.
