async function initIndex() {
  const data = await loadDataset();

  // ---- KPIs ----
  const total = data.length;
  const validados = data.filter(c => c.__origen === "validado").length;
  const noValidados = data.filter(c => c.__origen === "no_validado").length;

  // Países / localización distintos (excluyendo "No especificada")
  const paises = [...new Set(data
    .map(c => (c.localizacion || "").toLowerCase())
    .filter(p => p && p !== "no especificada"))];

  // Render de KPIs
  const kpiContainer = document.getElementById("kpis");
  kpiContainer.innerHTML = `
    <div class="panel kpi">
      <h2>${total}</h2>
      <p>Total de casos</p>
    </div>
   <div class="panel kpi">
  <h2>${paises.length}</h2>
  <p>Países con casos</p>
</div>
      <h2>${validados}</h2>
      <p>Casos validados</p>
    </div>
    <div class="panel kpi">
      <h2>${noValidados}</h2>
      <p>Casos no validados</p>
    </div>
    <div class="panel kpi">
      <h2>${paises.length}</h2>
      <p>Países representados</p>
    </div>
  `;

  // ---- Distribución por edades ----
  const buckets = {
    "0-5": 0,
    "6-12": 0,
    "13-18": 0,
    "19+": 0,
    "No especificada": 0
  };

  data.forEach(c => {
    const edad = parseInt(c.edad);
    if (!isNaN(edad)) {
      if (edad <= 5) buckets["0-5"]++;
      else if (edad <= 12) buckets["6-12"]++;
      else if (edad <= 18) buckets["13-18"]++;
      else buckets["19+"]++;
    } else {
      buckets["No especificada"]++;
    }
  });

  const ctxAges = document.getElementById("chartAges").getContext("2d");
  new Chart(ctxAges, {
    type: "bar",
    data: {
      labels: Object.keys(buckets),
      datasets: [{
        label: "Número de casos",
        data: Object.values(buckets),
        backgroundColor: "#4e79a7"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } }
      }
    }
  });

  // ---- Estado de los casos ----
  const ctxOrigen = document.getElementById("chartOrigen").getContext("2d");
  new Chart(ctxOrigen, {
    type: "doughnut",
    data: {
      labels: ["Validados", "No validados"],
      datasets: [{
        data: [validados, noValidados],
        backgroundColor: ["#59a14f", "#e15759"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", initIndex);
