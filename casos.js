async function initCasos() {
const data = await loadDataset();
const container = document.getElementById('casos-list');

function renderCasos(casos) {
container.innerHTML = '';
if (casos.length === 0) {
  container.innerHTML = `
    <div class="panel" style="grid-column:1/-1">
      <p>No se encontraron casos que coincidan con la búsqueda</p>
    </div>
  `;
  return;
}

const casosHTML = casos.map(caso => `
  <div class="panel">
    <div class="panel-header">
      <h3>${caso.nombre || 'Nombre no disponible'}</h3>
      <div style="display:flex;gap:8px">
        <span class="${gravBadge(caso.gravedad)}">${caso.gravedad || 'No especificado'}</span>
        ${caso.__origen === 'validado' ? '<span class="badge ok">Validado</span>' : '<span class="badge med">Por validar</span>'}
      </div>
    </div>
    <p><strong>Edad:</strong> ${caso.edad || 'No especificado'} años</p>
    <p><strong>Género:</strong> ${caso.genero || 'No especificado'}</p>
    <p><strong>Ubicación:</strong> ${caso.localizacion || 'No especificada'}</p>
    <p><strong>Pruebas realizadas:</strong> ${caso.pruebas || 'No especificadas'}</p>
    <p><strong>Características:</strong> ${caso.sintomas || 'No especificadas'}</p>
  </div>
`).join('');

container.innerHTML = casosHTML;

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

document.getElementById('search')?.addEventListener('input', (e) => {
const term = e.target.value.toLowerCase().trim();
if (!term) {
renderCasos(data);
return;
}
onst filtered = data.filter(c => 
  (c.nombre?.toLowerCase().includes(term)) ||
  (c.localizacion?.toLowerCase().includes(term)) ||
  (c.sintomas?.toLowerCase().includes(term)) ||
  (c.gravedad?.toLowerCase().includes(term)) ||
  (c.pruebas?.toLowerCase().includes(term))
);
renderCasos(filtered);

});

renderCasos(data);
}

document.addEventListener('DOMContentLoaded', initCasos);
});
