// ======================
// FUNCIONES BÁSICAS
// ======================
function $(q, ctx = document) { return ctx.querySelector(q) }
function $all(q, ctx = document) { return Array.from(ctx.querySelectorAll(q)) }

// ======================
// NORMALIZACIÓN DE DATOS
// ======================
function normalizeRecord(record) {
const edad = Number(record['Edad'] || record['Edad '] || 0);
const genero = (record['Género'] || record['Sexo'] || '').toString().trim();
const generoNormalizado = genero === 'M' ? 'Masculino' : genero === 'F' ? 'Femenino' : genero;

return {
id: ${record['Nombre']}-${edad}-${generoNormalizado}.toLowerCase().replace(/\s+/g, '-'),
nombre: record['Nombre'] || '',
edad: edad,
genero: generoNormalizado,
localizacion: record['Localización'] || record['Localizacion'] || '',
sintomas: record['Síntomas'] || record['síntomas principales'] || record['síntomas principales '] || '',
gravedad: record['Gravedad'] || record['Nivel de afectación'] || '',
pruebas: record['Pruebas realizadas'] || record['Pruebas realizadas (ej: array genético, EEG, resonancia) '] || '',
__origen: record.__origen || "data"
};
}

// ======================
// CARGA DE DATOS
// ======================
async function loadDataset() {
try {
const [noValidados, validados] = await Promise.all([
  loadData('casos_no_validados.json'),
  loadData('casos_validados.json')
]);
allRecords.forEach(record => {
  if (!uniqueRecordsMap.has(record.id)) {
    uniqueRecordsMap.set(record.id, record);
  } else {
    // Priorizar registros validados sobre no validados
    const existing = uniqueRecordsMap.get(record.id);
    if (record.__origen === "validado" && existing.__origen !== "validado") {
      uniqueRecordsMap.set(record.id, record);
    }
  }
});

return Array.from(uniqueRecordsMap.values()).sort((a, b) => 
  a.nombre.localeCompare(b.nombre)
);

} catch (error) {
console.error('Error cargando dataset:', error);
return [];
}
}

// ======================
// FUNCIONES DE UTILIDAD
// ======================
function pct(part, total) {
return total ? Math.round((part / total) * 100) : 0;
}

function gravBadge(g) {
const s = (g || '').toLowerCase();
if (s.includes('grave') || s.includes('sever')) return 'badge high';
if (s.includes('moderad') || s.includes('medio')) return 'badge med';
return 'badge ok';
}

function isSevereCase(gravedad) {
const g = (gravedad || '').toLowerCase();
return g.includes('grave') || g.includes('sever');
}

function humanAgeSex(r) {
const edad = Number(r.edad) || 0;
const esNino = edad < 18;

if (r.genero === 'Masculino') return esNino ? 'niño' : 'hombre';
if (r.genero === 'Femenino') return esNino ? 'niña' : 'mujer';
return esNino ? 'menor' : 'persona adulta';
}

// ======================
// NAVEGACIÓN
// ======================
function setActiveNav() {
const path = location.pathname.split('/').pop() || 'index.html';
$all('nav a').forEach(a => {
a.classList.toggle('active', a.getAttribute('href') === path);
});
}

// ======================
// INICIALIZACIÓN
// ======================
document.addEventListener('DOMContentLoaded', setActiveNav);
new Chart(document.getElementById('chartHerencia').getContext('2d'), {
    type: 'pie',
    // ...
}

// Por esto (correctamente cerrado):
new Chart(document.getElementById('chartHerencia').getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Heredado', 'De novo', 'Desconocido'],
      datasets: [{
        data: [30, 65, 5],
        backgroundColor: [
          'rgba(110, 168, 254, 0.6)',
          'rgba(0, 209, 209, 0.6)',
          'rgba(168, 179, 207, 0.6)'
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
