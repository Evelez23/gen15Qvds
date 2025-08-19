async function initCasos() {
  const data = await loadDataset();

  const contValidados = document.getElementById('casos-validados');
  const contNoValidados = document.getElementById('casos-no-validados');

  function iconoGeneroEdad(genero, edad) {
    if (!genero) return "👤";
    const g = genero.toLowerCase();
    if (g.startsWith("m")) return edad && edad < 18 ? "👦" : "👨";
    if (g.startsWith("f")) return edad && edad < 18 ? "👧" : "👩";
    return "👤";
  }

  function renderCasos(casos, container) {
    container.innerHTML = '';

    if (casos.length === 0) {
      container.innerHTML = `
        <div class="panel" style="grid-column:1/-1">
          <p>No se encontraron casos que coincidan con la búsqueda</p>
        </div>
      `;
      return;
    }

    const casosHTML = casos.map((caso, i) => `
      <div class="panel">
        <div class="panel-header toggle" data-id="${i}">
          <h3>
            ${iconoGeneroEdad(caso.genero, caso.edad)} 
            ${caso.nombre || 'Nombre no disponible'}
          </h3>
          <div style="display:flex;gap:8px">
            <span class="${gravBadge(caso.gravedad)}">${caso.gravedad || 'No especificado'}</span>
            ${caso.__origen === 'validado' ? '<span class="badge ok">Validado</span>' : '<span class="badge med">Por validar</span>'}
          </div>
        </div>
        <div class="panel-body" style="max-height:0; overflow:hidden; transition:max-height 0.4s ease;">
          <p><strong>Edad:</strong> ${caso.edad || 'No especificado'} años</p>
          <p><strong>Género:</strong> ${caso.genero || 'No especificado'}</p>
          <p><strong>Ubicación:</strong> ${caso.localizacion || 'No especificada'}</p>
          <p><strong>Pruebas realizadas:</strong> ${caso.pruebas || 'No especificadas'}</p>
          <p><strong>Síntomas:</strong> ${caso.sintomas || 'No especificados'}</p>
          <p><strong>Medicamentos:</strong> ${caso.medicamentos || 'No especificados'}</p>
          <p><strong>Terapias:</strong> ${caso.terapias || 'No especificadas'}</p>
          <p><strong>Necesidades y Desafíos:</strong> ${caso.desafios || 'No especificados'}</p>
        </div>
      </div>
    `).join('');

    container.innerHTML = casosHTML;

    // Toggle accordion animado
    container.querySelectorAll('.panel-header').forEach(header => {
      header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        if (body.style.maxHeight && body.style.maxHeight !== "0px") {
          body.style.maxHeight = "0";
        } else {
          body.style.maxHeight = body.scrollHeight + "px";
        }
      });
    });

    // Animación de aparición de tarjetas
    if (window.anime) {
      anime({
        targets: container.querySelectorAll('.panel'),
        opacity: [0, 1],
        translateY: [10, 0],
        delay: anime.stagger(80),
        duration: 700,
        easing: 'easeOutQuad'
      });
    }
  }

  function filtrarYRenderizar(term = '') {
    const filtrados = data.filter(c =>
      c.nombre?.toLowerCase().includes(term) ||
      c.localizacion?.toLowerCase().includes(term) ||
      c.sintomas?.toLowerCase().includes(term) ||
      c.gravedad?.toLowerCase().includes(term)
    );

    const validados = filtrados.filter(c => c.__origen === 'validado');
    const noValidados = filtrados.filter(c => c.__origen === 'no_validado');

    renderCasos(validados, contValidados);
    renderCasos(noValidados, contNoValidados);
  }

  document.getElementById('search')?.addEventListener('input', (e) => {
    filtrarYRenderizar(e.target.value.toLowerCase().trim());
  });

  // Render inicial
  filtrarYRenderizar();
}

document.addEventListener('DOMContentLoaded', initCasos);
