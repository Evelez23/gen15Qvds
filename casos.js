<div class="controls">
  <input type="text" id="search" placeholder="Buscar casos por nombre, ubicación o síntomas..." aria-label="Buscar casos">
  
  <select id="filtro-genero">
    <option value="">Todos los géneros</option>
    <option value="m">Masculino</option>
    <option value="f">Femenino</option>
  </select>

  <select id="filtro-gravedad">
    <option value="">Todos los niveles</option>
    <option value="leve">Leve</option>
    <option value="moderado">Moderado</option>
    <option value="severo">Severo</option>
  </select>
</div>
async function initCasos() {
  const data = await loadDataset();

  const contValidados = document.getElementById('casos-validados');
  const contNoValidados = document.getElementById('casos-no-validados');

  const filtroGenero = document.getElementById('filtro-genero');
  const filtroGravedad = document.getElementById('filtro-gravedad');

  // Helper para icono
  function iconoGeneroEdad(genero, edad) {
    if (!genero) return "👤";
    const g = genero.toLowerCase();
    if (g.startsWith("m")) return edad && edad < 18 ? "👦" : "👨";
    if (g.startsWith("f")) return edad && edad < 18 ? "👧" : "👩";
    return "👤";
  }

  // Helper para formatear en listas
  function formatearLista(texto) {
    if (!texto) return "No especificado";
    if (texto.includes(";")) {
      const items = texto.split(";").map(t => t.trim()).filter(t => t.length > 0);
      return "<ul>" + items.map(i => `<li>${i}</li>`).join("") + "</ul>";
    }
    return texto;
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
        <button class="btn-toggle">Ver más</button>
        <div class="panel-body" style="max-height:0; overflow:hidden; transition:max-height 0.4s ease;">
          <p><strong>Edad:</strong> ${caso.edad || 'No especificado'} años</p>
          <p><strong>Género:</strong> ${caso.genero || 'No especificado'}</p>
          <p><strong>Ubicación:</strong> ${caso.localizacion || 'No especificada'}</p>
          <p><strong>Pruebas realizadas:</strong> ${formatearLista(caso.pruebas)}</p>
          <p><strong>Síntomas:</strong> ${formatearLista(caso.sintomas)}</p>
          <p><strong>Medicamentos:</strong> ${formatearLista(caso.medicamentos)}</p>
          <p><strong>Terapias:</strong> ${formatearLista(caso.terapias)}</p>
          <p><strong>Necesidades y Desafíos:</strong> ${formatearLista(caso.desafios)}</p>
        </div>
      </div>
    `).join('');

    container.innerHTML = casosHTML;

    // Toggle con animación y botón
    container.querySelectorAll('.btn-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const body = btn.nextElementSibling;
        if (body.style.maxHeight && body.style.maxHeight !== "0px") {
          body.style.maxHeight = "0";
          btn.textContent = "Ver más";
        } else {
          body.style.maxHeight = body.scrollHeight + "px";
          btn.textContent = "Ver menos";
        }
      });
    });

    // Animación aparición tarjetas
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
    let filtrados = data;

    // Filtro por búsqueda
    if (term) {
      filtrados = filtrados.filter(c =>
        c.nombre?.toLowerCase().includes(term) ||
        c.localizacion?.toLowerCase().includes(term) ||
        c.sintomas?.toLowerCase().includes(term) ||
        c.gravedad?.toLowerCase().includes(term)
      );
    }

    // Filtro por género
    if (filtroGenero.value) {
      filtrados = filtrados.filter(c => (c.genero || "").toLowerCase().startsWith(filtroGenero.value.toLowerCase()));
    }

    // Filtro por gravedad
    if (filtroGravedad.value) {
      filtrados = filtrados.filter(c => (c.gravedad || "").toLowerCase().includes(filtroGravedad.value.toLowerCase()));
    }

    const validados = filtrados.filter(c => c.__origen === 'validado');
    const noValidados = filtrados.filter(c => c.__origen === 'no_validado');

    renderCasos(validados, contValidados);
    renderCasos(noValidados, contNoValidados);
  }

  // Eventos de filtros
  document.getElementById('search')?.addEventListener('input', (e) => {
    filtrarYRenderizar(e.target.value.toLowerCase().trim());
  });
  filtroGenero?.addEventListener('change', () => filtrarYRenderizar(document.getElementById('search').value.toLowerCase().trim()));
  filtroGravedad?.addEventListener('change', () => filtrarYRenderizar(document.getElementById('search').value.toLowerCase().trim()));

  // Render inicial
  filtrarYRenderizar();
}

document.addEventListener('DOMContentLoaded', initCasos);
