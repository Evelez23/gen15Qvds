async function initResumen() {
const data = await loadDataset();
const buckets = { '0-5 años':0, '6-10 años':0, '11-15 años':0, '16+ años':0 };

data.forEach(r => {
const e = Number(r.edad) || 0;
if(e <= 5) buckets['0-5 años']++;
else if(e <= 10) buckets['6-10 años']++;
else if(e <= 15) buckets['11-15 años']++;
else buckets['16+ años']++;
});

new Chart(document.getElementById('chartAgePie').getContext('2d'), {
type: 'pie',
data: {
labels: Object.keys(buckets),
datasets: [{
data: Object.values(buckets),
backgroundColor: [
'rgba(110, 168, 254, 0.6)',
'rgba(0, 209, 209, 0.6)',
'rgba(255, 212, 59, 0.6)',
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

const keys = ['tea','hipoton','disfagi','epileps','cardiopat','tdah'];
const labels = ['TEA','Hipotonía','Disfagia','Epilepsia','Cardiopatías','TDAH'];
const counts = keys.map(k => data.filter(r => (r.sintomas || '').toLowerCase().includes(k)).length);

new Chart(document.getElementById('chartSymptoms').getContext('2d'), {
type: 'bar',
data: {
labels: labels,
datasets: [{
label: 'Pacientes',
data: counts,
backgroundColor: 'rgba(110, 168, 254, 0.6)'
}]
},
options: {
responsive: true,
scales: { y: { beginAtZero: true } }
}
});

const total = data.length;
const val = data.filter(r => r.__origen === 'validado').length;
const nov = total - val;

new Chart(document.getElementById('chartOrigenResumen').getContext('2d'), {
type: 'doughnut',
data: {
labels: ['Validados','Sin validar'],
datasets: [{
data: [val, nov],
backgroundColor: ['#63e6be', '#ffd43b']
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

document.addEventListener('DOMContentLoaded', initResumen);