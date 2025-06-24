// Click pour changer la couleur du rectangle
const rect = document.getElementById('rect');
let isRed = true;
rect.addEventListener('click', () => {
  rect.setAttribute('fill', isRed ? 'green' : 'red');
  isRed = !isRed;
});

// Hover pour agrandir le donut
const donutOuter = document.getElementById('donut-outer');
donutOuter.addEventListener('mouseenter', () => {
  donutOuter.setAttribute('r', '70');
});
donutOuter.addEventListener('mouseleave', () => {
  donutOuter.setAttribute('r', '60');
});
