// Admin utilities for GM Consultants dashboard

const API_BASE_URL = '/api';

const escapeHTML = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getJson = async (endpoint, options = {}) => {
  const response = await fetch(endpoint, {
    credentials: 'include',
    ...options
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data?.message || response.statusText || 'Request failed';
    throw new Error(message);
  }

  return data;
};

const initAdminEventListeners = () => {
  if (window.__gmAdminListenersAttached) {
    return;
  }

  const addServiceBtn = document.getElementById('add-service-btn');
  addServiceBtn?.addEventListener('click', showAddServiceForm);

  const addGuidelineBtn = document.getElementById('add-guideline-btn');
  addGuidelineBtn?.addEventListener('click', showAddGuidelineForm);

  document.addEventListener('submit', (event) => {
    if (event.target.id === 'service-form') {
      event.preventDefault();
      handleServiceSubmit(event);
    }

    if (event.target.id === 'guideline-form') {
      event.preventDefault();
      handleGuidelineSubmit(event);
    }
  });

  window.__gmAdminListenersAttached = true;
};

// --- Services -------------------------------------------------------------

const loadAdminServices = async () => {
  const container = document.getElementById('admin-services');
  if (!container) return;

  container.innerHTML = '<p>Loading services...</p>';

  try {
    const services = await getJson(`${API_BASE_URL}/services`);

    if (!services.length) {
      container.innerHTML = '<p>No services available yet.</p>';
      return;
    }

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${services
            .map(
              (service) => `
                <tr>
                  <td>${escapeHTML(service.title)}</td>
                  <td>${escapeHTML(service.description)}</td>
                  <td>
                    <button class="btn" style="padding:0.4rem 1rem" onclick="editService('${service._id}')">Edit</button>
                    <button class="btn btn-secondary" style="padding:0.4rem 1rem" onclick="deleteService('${service._id}')">Delete</button>
                  </td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error('Error loading services:', error);
    container.innerHTML = `<p class="form-error">${escapeHTML(error.message)}</p>`;
  }
};

const renderServiceForm = (mode, service = {}) => {
  const container = document.getElementById('service-form-container');
  if (!container) return;

  const isEdit = mode === 'edit';

  container.style.display = 'block';
  container.innerHTML = `
    <div class="admin-section">
      <div data-section-header>
        <h3>${isEdit ? 'Edit Service' : 'Add New Service'}</h3>
      </div>
      <form id="service-form" data-mode="${mode}" ${
        isEdit ? `data-id="${service._id}"` : ''
      }>
        <div class="form-group">
          <label for="service-title">Title *</label>
          <input id="service-title" name="title" required value="${escapeHTML(service.title || '')}" />
        </div>
        <div class="form-group">
          <label for="service-description">Description *</label>
          <textarea id="service-description" name="description" required rows="4">${escapeHTML(service.description || '')}</textarea>
        </div>
        <div class="form-group">
          <label for="service-image">Image URL</label>
          <input id="service-image" name="imageURL" type="url" placeholder="https://example.com/image.jpg" value="${escapeHTML(service.imageURL || '')}" />
        </div>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;">
          <button type="submit" class="btn">${isEdit ? 'Save Changes' : 'Create Service'}</button>
          <button type="button" class="btn btn-secondary" onclick="hideServiceForm()">Cancel</button>
        </div>
      </form>
    </div>
  `;

  container.querySelector('input')?.focus();
};

const showAddServiceForm = () => renderServiceForm('create');
const showEditServiceForm = (service) => renderServiceForm('edit', service);

const hideServiceForm = () => {
  const container = document.getElementById('service-form-container');
  if (!container) return;
  container.innerHTML = '';
  container.style.display = 'none';
};

const handleServiceSubmit = async (event) => {
  const form = event.target;
  const mode = form.dataset.mode || 'create';
  const id = form.dataset.id;

  const payload = {
    title: form.title.value.trim(),
    description: form.description.value.trim(),
    imageURL: form.imageURL.value.trim()
  };

  if (!payload.title || !payload.description) {
    alert('Please complete required fields.');
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  const original = button.textContent;
  button.disabled = true;
  button.textContent = mode === 'edit' ? 'Saving…' : 'Creating…';

  try {
    await getJson(`${API_BASE_URL}/services${mode === 'edit' ? `/${id}` : ''}`, {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    hideServiceForm();
    await loadAdminServices();
    alert(mode === 'edit' ? 'Service updated.' : 'Service created.');
  } catch (error) {
    alert(error.message);
  } finally {
    button.disabled = false;
    button.textContent = original;
  }
};

const editService = async (id) => {
  try {
    const service = await getJson(`${API_BASE_URL}/services/${id}`);
    showEditServiceForm(service);
  } catch (error) {
    alert(error.message);
  }
};

const deleteService = async (id) => {
  if (!confirm('Delete this service?')) return;
  try {
    await getJson(`${API_BASE_URL}/services/${id}`, { method: 'DELETE' });
    await loadAdminServices();
    alert('Service deleted.');
  } catch (error) {
    alert(error.message);
  }
};

// --- Guidelines ----------------------------------------------------------

const loadAdminGuidelines = async () => {
  const container = document.getElementById('admin-guidelines');
  if (!container) return;

  container.innerHTML = '<p>Loading guidelines...</p>';

  try {
    const guidelines = await getJson(`${API_BASE_URL}/guidelines`);

    if (!guidelines.length) {
      container.innerHTML = '<p>No guidelines created yet.</p>';
      return;
    }

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${guidelines
            .map((guideline) => {
              const preview = guideline.content?.length > 140
                ? `${guideline.content.slice(0, 140)}…`
                : guideline.content;

              return `
                <tr>
                  <td>${escapeHTML(guideline.title)}</td>
                  <td>${escapeHTML(preview || '')}</td>
                  <td>
                    <button class="btn" style="padding:0.4rem 1rem" onclick="editGuideline('${guideline._id}')">Edit</button>
                    <button class="btn btn-secondary" style="padding:0.4rem 1rem" onclick="deleteGuideline('${guideline._id}')">Delete</button>
                  </td>
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error('Error loading guidelines:', error);
    container.innerHTML = `<p class="form-error">${escapeHTML(error.message)}</p>`;
  }
};

const renderGuidelineForm = (mode, guideline = {}) => {
  const container = document.getElementById('guideline-form-container');
  if (!container) return;

  const isEdit = mode === 'edit';

  container.style.display = 'block';
  container.innerHTML = `
    <div class="admin-section">
      <div data-section-header>
        <h3>${isEdit ? 'Edit Guideline' : 'Add New Guideline'}</h3>
      </div>
      <form id="guideline-form" data-mode="${mode}" ${
        isEdit ? `data-id="${guideline._id}"` : ''
      }>
        <div class="form-group">
          <label for="guideline-title">Title *</label>
          <input id="guideline-title" name="title" required value="${escapeHTML(guideline.title || '')}" />
        </div>
        <div class="form-group">
          <label for="guideline-content">Content *</label>
          <textarea id="guideline-content" name="content" rows="6" required>${escapeHTML(guideline.content || '')}</textarea>
        </div>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;">
          <button type="submit" class="btn">${isEdit ? 'Save Changes' : 'Create Guideline'}</button>
          <button type="button" class="btn btn-secondary" onclick="hideGuidelineForm()">Cancel</button>
        </div>
      </form>
    </div>
  `;

  container.querySelector('input')?.focus();
};

const showAddGuidelineForm = () => renderGuidelineForm('create');
const showEditGuidelineForm = (guideline) => renderGuidelineForm('edit', guideline);

const hideGuidelineForm = () => {
  const container = document.getElementById('guideline-form-container');
  if (!container) return;
  container.innerHTML = '';
  container.style.display = 'none';
};

const handleGuidelineSubmit = async (event) => {
  const form = event.target;
  const mode = form.dataset.mode || 'create';
  const id = form.dataset.id;

  const payload = {
    title: form.title.value.trim(),
    content: form.content.value.trim()
  };

  if (!payload.title || !payload.content) {
    alert('Please fill in all required fields.');
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  const original = button.textContent;
  button.disabled = true;
  button.textContent = mode === 'edit' ? 'Saving…' : 'Creating…';

  try {
    await getJson(`${API_BASE_URL}/guidelines${mode === 'edit' ? `/${id}` : ''}`, {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    hideGuidelineForm();
    await loadAdminGuidelines();
    alert(mode === 'edit' ? 'Guideline updated.' : 'Guideline created.');
  } catch (error) {
    alert(error.message);
  } finally {
    button.disabled = false;
    button.textContent = original;
  }
};

const editGuideline = async (id) => {
  try {
    const guideline = await getJson(`${API_BASE_URL}/guidelines/${id}`);
    showEditGuidelineForm(guideline);
  } catch (error) {
    alert(error.message);
  }
};

const deleteGuideline = async (id) => {
  if (!confirm('Delete this guideline?')) return;
  try {
    await getJson(`${API_BASE_URL}/guidelines/${id}`, { method: 'DELETE' });
    await loadAdminGuidelines();
    alert('Guideline deleted.');
  } catch (error) {
    alert(error.message);
  }
};

// --- Consultations -------------------------------------------------------

const loadAdminConsultations = async () => {
  const container = document.getElementById('admin-consultations');
  if (!container) return;

  container.innerHTML = '<p>Loading consultations...</p>';

  try {
    const consultations = await getJson(`${API_BASE_URL}/consultations`);

    if (!consultations.length) {
      container.innerHTML = '<p>No consultation requests yet.</p>';
      return;
    }

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Project Type</th>
            <th>Message</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${consultations
            .map(
              (consultation) => `
                <tr>
                  <td>${escapeHTML(consultation.name)}</td>
                  <td>${escapeHTML(consultation.email)}</td>
                  <td>${escapeHTML(consultation.phone || '')}</td>
                  <td>${escapeHTML(consultation.projectType || '')}</td>
                  <td>${escapeHTML(consultation.message || '')}</td>
                  <td>${escapeHTML(new Date(consultation.createdAt).toLocaleString())}</td>
                  <td>
                    <button class="btn btn-secondary" style="padding:0.4rem 1rem" onclick="deleteConsultation('${consultation._id}')">Delete</button>
                  </td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    container.innerHTML = `<p class="form-error">${escapeHTML(error.message)}</p>`;
  }
};

const deleteConsultation = async (id) => {
  if (!confirm('Delete this consultation request?')) return;
  try {
    await getJson(`${API_BASE_URL}/consultations/${id}`, { method: 'DELETE' });
    await loadAdminConsultations();
    alert('Consultation removed.');
  } catch (error) {
    alert(error.message);
  }
};

// --- Auth ---------------------------------------------------------------

const adminLogin = async (username, password) => {
  return getJson(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
};

const initLoginForm = () => {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = form.username.value.trim();
    const password = form.password.value.trim();

    if (!username || !password) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const original = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in…';

    try {
      await adminLogin(username, password);
      window.location.href = '/admin';
    } catch (error) {
      const errorBox = document.getElementById('login-error');
      if (errorBox) {
        errorBox.innerHTML = `<div class="form-error">${escapeHTML(error.message)}</div>`;
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  });
};

const adminLogout = async () => {
  try {
    await getJson(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    window.location.href = '/login';
  } catch (error) {
    alert(error.message);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAdminEventListeners();
    initLoginForm();
  });
} else {
  initAdminEventListeners();
  initLoginForm();
}
