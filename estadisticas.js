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

  // Conteo de síntomas
  const counts = defs.map(([l, rx]) => data.filter(r => rx.test(r.sintomas || '')).length);

  new Chart(document.getElementById('chartPrev').getContext('2d'), {
    type: 'bar',
    data: {
      labels: defs.map(d => d[0]),
      datasets: [{
        label: 'Casos',
        data: counts,
        backgroundColor: 'rgba(110, 168, 254, 0.6)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Número de casos' }
        }
      }
    }
  });

  // Conteo por género
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
      plugins: { legend: { position: 'bottom' } }
    }
  });

  // Animación de panels
  if (window.anime) {
    anime({
      targets: '.panel',
      opacity: [0, 1],
      translateY: [10, 0],
      delay: anime.stagger(80),
      duration: 700,
      easing: 'easeOutQuad'
    });
  }
}

// === BLOQUE DE ESTADÍSTICAS (contador tipo reloj) ===
async function cargarEstadisticas() {
  try {
    const [validados, noValidados] = await Promise.all([
      fetch("https://raw.githubusercontent.com/Evelez23/gen15Qvds/main/data/casos_validados.json").then(r => r.json()),
      fetch("https://raw.githubusercontent.com/Evelez23/gen15Qvds/main/data/casos_no_validados.json").then(r => r.json())
    ]);

    const totalCasos = validados.length + noValidados.length;
    const paises = new Set([
      ...validados.map(c => c.localizacion).filter(Boolean),
      ...noValidados.map(c => c.localizacion).filter(Boolean)
    ]);

    document.getElementById("total-casos").textContent = totalCasos;
    document.getElementById("validados").textContent = validados.length;
    document.getElementById("no-validados").textContent = noValidados.length;
    document.getElementById("paises").textContent = paises.size;
  } catch (err) {
    console.error("Error cargando estadísticas", err);
  }
}

// Inicializar todo
document.addEventListener("DOMContentLoaded", () => {
  initStats();
  cargarEstadisticas();
});
