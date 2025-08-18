async function initStats() {
const data = await loadDataset();
const defs = [
['TEA', /tea/i],
['Hipotonía', /hipoton/i],
['Disfagia', /disfagi/i],
['Epilepsia', /epileps/i],
['Cardiopatías', /cardiopat/i],
['TDAH', /tdah/i]
];

const counts = defs.map(([l, rx]) => data.filter(r => rx.test(r.sintomas || '')).length);

new Chart(document.getElementById('chartPrev').getContext('2d'), {
type: 'bar',
data: {
labels: defs.map(d => d[0]),
datasets: [{
label: 'Pacientes',
data: counts,
backgroundColor: 'rgba(110, 168, 254, 0.6)'
}]
},
options: {
responsive: true,
scales: {
y: {
beginAtZero: true,
title: {
display: true,
text: 'Número de casos'
}
}
}
}
});

const h = data.filter(r => (r.genero || '').toUpperCase() === 'MASCULINO' || (r.genero || '').toUpperCase() === 'M').length;
const m = data.filter(r => (r.genero || '').toUpperCase() === 'FEMENINO' || (r.genero || '').toUpperCase() === 'F').length;

new Chart(document.getElementById('chartSexo').getContext('2d'), {
type: 'doughnut',
data: {
labels: ['Masculino', 'Femenino'],
datasets: [{
data: [h, m],
backgroundColor: [
'rgba(110, 168, 254, 0.6)',
'rgba(255, 107, 107, 0.6)'
]
}]
},
options: {
responsive: true,
plugins: {
legend: {
position: 'bottom'
}
}
}
});

if(window.anime) {
anime({
targets: '.panel',
opacity: [0,1],
translateY: [10,0],
delay: anime.stagger(80),
duration: 700,
easing: 'easeOutQuad'
});
}
}

document.addEventListener('DOMContentLoaded', initStats);