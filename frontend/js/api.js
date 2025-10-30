// API utility functions for GM Consultants

const API_BASE_URL = '/api';

const escapeHTML = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Admin Dashboard Functions
const initAdminEventListeners = () => {
  if (window.__gmAdminListenersAttached) {
    return;
  }

  // Service management
  const addServiceBtn = document.getElementById('add-service-btn');
  if (addServiceBtn) {
    addServiceBtn.addEventListener('click', showAddServiceForm);
  }
  
  // Guideline management
  const addGuidelineBtn = document.getElementById('add-guideline-btn');
  if (addGuidelineBtn) {
    addGuidelineBtn.addEventListener('click', showAddGuidelineForm);
  }
  
  // Add event delegation for dynamically created forms
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'service-form') {
      e.preventDefault();
      handleServiceSubmit(e);
    } else if (e.target.id === 'guideline-form') {
      e.preventDefault();
      handleGuidelineSubmit(e);
    }
  });

  window.__gmAdminListenersAttached = true;
};

// Service Management
const loadAdminServices = async () => {
  const servicesContainer = document.getElementById('admin-services');
  if (!servicesContainer) {
    console.error('admin-services container not found');
    return;
  }
  
  servicesContainer.innerHTML = '<p>Loading services...</p>';
  
  try {
    console.log('Fetching services from:', `${API_BASE_URL}/services`);
    const response = await fetch(`${API_BASE_URL}/services`, {
      credentials: 'include'
    });
    console.log('Services response status:', response.status);
    
    const services = await response.json();
    console.log('Services data:', services);
    
    if (services.length === 0) {
      servicesContainer.innerHTML = '<p>No services available.</p>';
      return;
    }
    
    servicesContainer.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${services.map(service => `
            <tr>
              <td>${escapeHTML(service.title)}</td>
              <td>${escapeHTML(service.description)}</td>
              <td>
                <button onclick="editService('${service._id}')" class="btn" style="padding: 0.3rem 0.8rem; margin-right: 0.5rem;">Edit</button>
                <button onclick="deleteService('${service._id}')" class="btn" style="padding: 0.3rem 0.8rem; background-color: #dc3545;">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
  } catch (error) {
    console.error('Error loading services:', error);
    servicesContainer.innerHTML = `<p style="color: red;">Error: ${escapeHTML(error.message || 'Failed to load services.')}</p>`;
  }
};

const renderServiceForm = (mode, service = {}) => {
  const formContainer = document.getElementById('service-form-container');
  if (!formContainer) return;

  const isEdit = mode === 'edit';

  formContainer.style.display = 'block';
  formContainer.innerHTML = `
      <div class="admin-section">
        <h3>${isEdit ? 'Edit Service' : 'Add New Service'}</h3>
        <form id="service-form" data-mode="${mode}" ${isEdit ? `data-id="${service._id}"` : ''}>
          <div class="form-group">
            <label for="service-title">Title *</label>
            <input type="text" id="service-title" name="title" required placeholder="Enter service title" value="${escapeHTML(service.title || '')}">
          </div>
          <div class="form-group">
            <label for="service-description">Description *</label>
            <textarea id="service-description" name="description" required placeholder="Enter service description" rows="4">${escapeHTML(service.description || '')}</textarea>
          </div>
          <div class="form-group">
            <label for="service-image">Image URL (optional)</label>
            <input type="url" id="service-image" name="imageURL" placeholder="https://example.com/image.jpg" value="${escapeHTML(service.imageURL || '')}">
          </div>
          <div style="display: flex; gap: 1rem;">
            <button type="submit" class="btn">${isEdit ? 'Save Changes' : 'Add Service'}</button>
            <button type="button" onclick="hideServiceForm()" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    `;

  setTimeout(() => {
    const firstInput = formContainer.querySelector('input');
    if (firstInput) firstInput.focus();
  }, 100);
};

const showAddServiceForm = () => {
  renderServiceForm('create');
};

const showEditServiceForm = (service) => {
  renderServiceForm('edit', service);
};

const hideServiceForm = () => {
  const formContainer = document.getElementById('service-form-container');
  if (formContainer) {
    formContainer.innerHTML = '';
    formContainer.style.display = 'none';
  }
};

const handleServiceSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = {
    title: formData.get('title').trim(),
    description: formData.get('description').trim(),
    imageURL: formData.get('imageURL').trim()
  };
  const mode = e.target.dataset.mode || 'create';
  const serviceId = e.target.dataset.id;

  // Validation
  if (!data.title || !data.description) {
    alert('Please fill in all required fields (Title and Description)');
    return;
  }
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  try {
    submitBtn.textContent = mode === 'edit' ? 'Saving...' : 'Adding...';
    submitBtn.disabled = true;
    
    const endpoint = mode === 'edit' ? `${API_BASE_URL}/services/${serviceId}` : `${API_BASE_URL}/services`;
    const method = mode === 'edit' ? 'PUT' : 'POST';

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      hideServiceForm();
      loadAdminServices();
      alert(mode === 'edit' ? 'Service updated successfully!' : 'Service added successfully!');
    } else {
      const error = await response.json();
      alert(`Error ${mode === 'edit' ? 'updating' : 'adding'} service: ` + (error.message || 'Unknown error'));
    }
  } catch (error) {
    console.error(`Error ${mode === 'edit' ? 'updating' : 'adding'} service:`, error);
    alert(`Error ${mode === 'edit' ? 'updating' : 'adding'} service. Please check your connection and try again.`);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
};

const editService = async (serviceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      alert('Unable to load service: ' + (error.message || 'Unknown error'));
      return;
    }

    const service = await response.json();
    showEditServiceForm(service);
  } catch (error) {
    console.error('Error loading service for edit:', error);
    alert('Error loading service details. Please try again.');
  }
};

const deleteService = async (serviceId) => {
  if (!confirm('Are you sure you want to delete this service?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (response.ok) {
      loadAdminServices();
      alert('Service deleted successfully!');
    } else {
      const error = await response.json();
      alert('Error deleting service: ' + error.message);
    }
  } catch (error) {
    console.error('Error deleting service:', error);
    alert('Error deleting service. Please try again.');
  }
};

// Guideline Management
const loadAdminGuidelines = async () => {
  const guidelinesContainer = document.getElementById('admin-guidelines');
  if (!guidelinesContainer) {
    console.error('admin-guidelines container not found');
    return;
  }
  
  guidelinesContainer.innerHTML = '<p>Loading guidelines...</p>';
  
  try {
    console.log('Fetching guidelines from:', `${API_BASE_URL}/guidelines`);
    const response = await fetch(`${API_BASE_URL}/guidelines`, {
      credentials: 'include'
    });
    console.log('Guidelines response status:', response.status);
    
    const guidelines = await response.json();
    console.log('Guidelines data:', guidelines);
    
    if (guidelines.length === 0) {
      guidelinesContainer.innerHTML = '<p>No guidelines available.</p>';
      return;
    }
    
    guidelinesContainer.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content Preview</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${guidelines.map(guideline => {
            const preview = guideline.content.length > 120 ? `${guideline.content.substring(0, 120)}...` : guideline.content;
            return `
            <tr>
              <td>${escapeHTML(guideline.title)}</td>
              <td>${escapeHTML(preview)}</td>
              <td>
                <button onclick="editGuideline('${guideline._id}')" class="btn" style="padding: 0.3rem 0.8rem; margin-right: 0.5rem;">Edit</button>
                <button onclick="deleteGuideline('${guideline._id}')" class="btn" style="padding: 0.3rem 0.8rem; background-color: #dc3545;">Delete</button>
              </td>
            </tr>
          `;
          }).join('')}
        </tbody>
      </table>
    `;
    
  } catch (error) {
    console.error('Error loading guidelines:', error);
    guidelinesContainer.innerHTML = `<p style="color: red;">Error: ${escapeHTML(error.message || 'Failed to load guidelines.')}</p>`;
  }
};

const renderGuidelineForm = (mode, guideline = {}) => {
  const formContainer = document.getElementById('guideline-form-container');
  if (!formContainer) return;

  const isEdit = mode === 'edit';

  formContainer.style.display = 'block';
  formContainer.innerHTML = `
      <div class="admin-section">
        <h3>${isEdit ? 'Edit Guideline' : 'Add New Guideline'}</h3>
        <form id="guideline-form" data-mode="${mode}" ${isEdit ? `data-id="${guideline._id}"` : ''}>
          <div class="form-group">
            <label for="guideline-title">Title *</label>
            <input type="text" id="guideline-title" name="title" required placeholder="Enter guideline title" value="${escapeHTML(guideline.title || '')}">
          </div>
          <div class="form-group">
            <label for="guideline-content">Content *</label>
            <textarea id="guideline-content" name="content" required placeholder="Enter detailed guideline content" rows="8">${escapeHTML(guideline.content || '')}</textarea>
          </div>
          <div style="display: flex; gap: 1rem;">
            <button type="submit" class="btn">${isEdit ? 'Save Changes' : 'Add Guideline'}</button>
            <button type="button" onclick="hideGuidelineForm()" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    `;

  setTimeout(() => {
    const firstInput = formContainer.querySelector('input');
    if (firstInput) firstInput.focus();
  }, 100);
};

const showAddGuidelineForm = () => {
  renderGuidelineForm('create');
};

const showEditGuidelineForm = (guideline) => {
  renderGuidelineForm('edit', guideline);
};

const hideGuidelineForm = () => {
  const formContainer = document.getElementById('guideline-form-container');
  if (formContainer) {
    formContainer.innerHTML = '';
    formContainer.style.display = 'none';
  }
};

const handleGuidelineSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = {
    title: formData.get('title').trim(),
    content: formData.get('content').trim()
  };
  const mode = e.target.dataset.mode || 'create';
  const guidelineId = e.target.dataset.id;
  
  // Validation
  if (!data.title || !data.content) {
    alert('Please fill in all required fields (Title and Content)');
    return;
  }
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  try {
    submitBtn.textContent = mode === 'edit' ? 'Saving...' : 'Adding...';
    submitBtn.disabled = true;
    
    const endpoint = mode === 'edit' ? `${API_BASE_URL}/guidelines/${guidelineId}` : `${API_BASE_URL}/guidelines`;
    const method = mode === 'edit' ? 'PUT' : 'POST';

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      hideGuidelineForm();
      loadAdminGuidelines();
      alert(mode === 'edit' ? 'Guideline updated successfully!' : 'Guideline added successfully!');
    } else {
      const error = await response.json();
      alert(`Error ${mode === 'edit' ? 'updating' : 'adding'} guideline: ` + (error.message || 'Unknown error'));
    }
  } catch (error) {
    console.error(`Error ${mode === 'edit' ? 'updating' : 'adding'} guideline:`, error);
    alert(`Error ${mode === 'edit' ? 'updating' : 'adding'} guideline. Please check your connection and try again.`);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
};

const editGuideline = async (guidelineId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/guidelines/${guidelineId}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      alert('Unable to load guideline: ' + (error.message || 'Unknown error'));
      return;
    }

    const guideline = await response.json();
    showEditGuidelineForm(guideline);
  } catch (error) {
    console.error('Error loading guideline for edit:', error);
    alert('Error loading guideline details. Please try again.');
  }
};

const deleteGuideline = async (guidelineId) => {
  if (!confirm('Are you sure you want to delete this guideline?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/guidelines/${guidelineId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (response.ok) {
      loadAdminGuidelines();
      alert('Guideline deleted successfully!');
    } else {
      const error = await response.json();
      alert('Error deleting guideline: ' + error.message);
    }
  } catch (error) {
    console.error('Error deleting guideline:', error);
    alert('Error deleting guideline. Please try again.');
  }
};

// Consultation Management
const loadAdminConsultations = async () => {
  const consultationsContainer = document.getElementById('admin-consultations');
  if (!consultationsContainer) {
    console.error('admin-consultations container not found');
    return;
  }
  
  consultationsContainer.innerHTML = '<p>Loading consultations...</p>';
  
  try {
    console.log('Fetching consultations from:', `${API_BASE_URL}/consultations`);
    const response = await fetch(`${API_BASE_URL}/consultations`, {
      credentials: 'include'
    });
    console.log('Consultations response status:', response.status);
    
    const consultations = await response.json();
    console.log('Consultations data:', consultations);

    if (!response.ok) {
      throw new Error(consultations.message || 'Not authenticated. Please login.');
    }
    
    if (consultations.length === 0) {
      consultationsContainer.innerHTML = '<p>No consultation requests available.</p>';
      return;
    }
    
    consultationsContainer.innerHTML = `
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
          ${consultations.map(consultation => `
            <tr>
              <td>${escapeHTML(consultation.name)}</td>
              <td>${escapeHTML(consultation.email)}</td>
              <td>${escapeHTML(consultation.phone)}</td>
              <td>${escapeHTML(consultation.projectType)}</td>
              <td>${escapeHTML(consultation.message)}</td>
              <td>${escapeHTML(new Date(consultation.createdAt).toLocaleString())}</td>
              <td>
                <button onclick="deleteConsultation('${consultation._id}')" class="btn" style="padding: 0.3rem 0.8rem; background-color: #dc3545;">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
  } catch (error) {
    console.error('Error loading consultations:', error);
    consultationsContainer.innerHTML = `<p style="color: red;">Error: ${escapeHTML(error.message || 'Failed to load consultation requests.')}</p>`;
  }
};

const deleteConsultation = async (consultationId) => {
  if (!confirm('Delete this consultation request? This action cannot be undone.')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/consultations/${consultationId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (response.ok) {
      loadAdminConsultations();
      alert('Consultation request deleted successfully.');
    } else {
      const error = await response.json();
      alert('Error deleting consultation request: ' + (error.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error deleting consultation:', error);
    alert('Error deleting consultation request. Please try again.');
  }
};

// Admin Login Function
const adminLogin = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      localStorage.setItem('adminAuthenticated', 'true');
      window.location.href = '/admin';
    } else {
      throw new Error(result.message || 'Login failed');
    }
    
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Login Form
const initLoginForm = () => {
  const form = document.getElementById('login-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
      submitBtn.textContent = 'Logging in...';
      submitBtn.disabled = true;
      
      await adminLogin(username, password);
    } catch (error) {
      const errorDiv = document.getElementById('login-error');
      if (errorDiv) {
        errorDiv.innerHTML = `<div class="form-error">${error.message}</div>`;
      }
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
};

// Admin Logout Function
const adminLogout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      window.location.href = '/login';
    } else {
      alert('Logout failed. Please try again.');
    }
  } catch (error) {
    console.error('Logout error:', error);
    alert('Error logging out. Please try again.');
  }
};

// Initialize event listeners when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAdminEventListeners();
    initLoginForm();
  });
} else {
  initAdminEventListeners();
  initLoginForm();
}
