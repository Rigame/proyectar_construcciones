const apiBase = '/api/professionals';

async function fetchProfessionals() {
  const res = await fetch(apiBase);
  return res.json();
}

function renderList(items) {
  const container = document.getElementById('listaProfesionales');
  container.innerHTML = '';
  items.forEach(p => {
    const div = document.createElement('div');
    div.className = 'prof';
    div.innerHTML = `
      <div class="avatar"></div>
      <div style="flex:1">
        <strong>${escapeHtml(p.name)}</strong><br>
        <small style="color:#2f4f4f">${p.specialty}</small><br>
        ${escapeHtml(p.experience)}<br>
        <small>${p.email || ''} ${p.phone ? '• ' + p.phone : ''}</small>
      </div>
      <div class="buttons">
        <button data-id="${p.id}" class="editBtn">Editar</button>
        <button data-id="${p.id}" class="delBtn">Eliminar</button>
      </div>
    `;
    container.appendChild(div);
  });
  attachListEvents();
}

function attachListEvents() {
  document.querySelectorAll('.delBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (!confirm('¿Eliminar profesional?')) return;
      await fetch(apiBase + '/' + id, { method: 'DELETE' });
      loadAndRender();
    });
  });
  document.querySelectorAll('.editBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const items = await fetchProfessionals();
      const p = items.find(x => x.id === id);
      if (!p) return alert('No encontrado');
      // Prefill form for editing
      document.getElementById('name').value = p.name;
      document.getElementById('email').value = p.email;
      document.getElementById('specialty').value = p.specialty;
      document.getElementById('experience').value = p.experience;
      document.getElementById('phone').value = p.phone || '';
      document.getElementById('formRegistro').dataset.editId = id;
      window.location.hash = '#registro';
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

async function loadAndRender() {
  const all = await fetchProfessionals();
  const filtro = document.getElementById('filtro').value;
  const filtered = filtro === 'todos' ? all : all.filter(p => p.specialty === filtro);
  renderList(filtered);
}

document.getElementById('filtro').addEventListener('change', loadAndRender);

document.getElementById('formRegistro').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const payload = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    specialty: document.getElementById('specialty').value,
    experience: document.getElementById('experience').value.trim(),
    phone: document.getElementById('phone').value.trim()
  };
  const editId = form.dataset.editId;
  if (editId) {
    await fetch(apiBase + '/' + editId, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    delete form.dataset.editId;
    document.getElementById('registroMsg').textContent = 'Profesional actualizado.';
  } else {
    await fetch(apiBase, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    document.getElementById('registroMsg').textContent = 'Registro enviado con éxito.';
  }
  form.reset();
  loadAndRender();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  const f = document.getElementById('formRegistro');
  f.reset();
  delete f.dataset.editId;
});

document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Mensaje enviado. Gracias!');
  e.target.reset();
});

// On load
window.addEventListener('DOMContentLoaded', loadAndRender);
