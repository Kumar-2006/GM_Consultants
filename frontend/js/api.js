// API utility functions for GM Constructions

const API_BASE_URL = 'http://localhost:3000/api';

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

// Make authenticated API request
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
  
  return fetch(url, { ...defaultOptions, ...options });
};

// Admin Dashboard Functions
const initAdminDashboard = () => {
  loadAdminServices();
  loadAdminGuidelines();
  loadAdminConsultations();
  initAdminEventListeners();
};

const initAdminEventListeners = () => {
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
};

// Service Management
const loadAdminServices = async () => {
  const servicesContainer = document.getElementById('admin-services');
  if (!servicesContainer) return;
  
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/services`);
    const services = await response.json();
    
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
              <td>${service.title}</td>
              <td>${service.description}</td>
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
    servicesContainer.innerHTML = '<p>Error loading services.</p>';
  }
};

const showAddServiceForm = () => {
  const formContainer = document.getElementById('service-form-container');
  if (formContainer) {
    formContainer.style.display = 'block';
    formContainer.innerHTML = `
      <div class="admin-section">
        <h3>Add New Service</h3>
        <form id="service-form">
          <div class="form-group">
            <label for="service-title">Title *</label>
            <input type="text" id="service-title" name="title" required placeholder="Enter service title">
          </div>
          <div class="form-group">
            <label for="service-description">Description *</label>
            <textarea id="service-description" name="description" required placeholder="Enter service description" rows="4"></textarea>
          </div>
          <div class="form-group">
            <label for="service-image">Image URL (optional)</label>
            <input type="url" id="service-image" name="imageURL" placeholder="https://example.com/image.jpg">
          </div>
          <div style="display: flex; gap: 1rem;">
            <button type="submit" class="btn">Add Service</button>
            <button type="button" onclick="hideServiceForm()" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    `;
    
    // Focus on first input
    setTimeout(() => {
      const firstInput = formContainer.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 100);
  }
};

const hideServiceForm = () => {
  const formContainer = document.getElementById('service-form-container');
  if (formContainer) {
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
  
  // Validation
  if (!data.title || !data.description) {
    alert('Please fill in all required fields (Title and Description)');
    return;
  }
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  try {
    submitBtn.textContent = 'Adding...';
    submitBtn.disabled = true;
    
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/services`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      hideServiceForm();
      loadAdminServices();
      alert('Service added successfully!');
    } else {
      const error = await response.json();
      alert('Error adding service: ' + (error.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error adding service:', error);
    alert('Error adding service. Please check your connection and try again.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
};

const editService = async (serviceId) => {
  // Implementation for editing service
  alert('Edit service functionality - Service ID: ' + serviceId);
};

const deleteService = async (serviceId) => {
  if (!confirm('Are you sure you want to delete this service?')) {
    return;
  }
  
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/services/${serviceId}`, {
      method: 'DELETE'
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
  if (!guidelinesContainer) return;
  
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/guidelines`);
    const guidelines = await response.json();
    
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
          ${guidelines.map(guideline => `
            <tr>
              <td>${guideline.title}</td>
              <td>${guideline.content.substring(0, 100)}...</td>
              <td>
                <button onclick="editGuideline('${guideline._id}')" class="btn" style="padding: 0.3rem 0.8rem; margin-right: 0.5rem;">Edit</button>
                <button onclick="deleteGuideline('${guideline._id}')" class="btn" style="padding: 0.3rem 0.8rem; background-color: #dc3545;">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
  } catch (error) {
    console.error('Error loading guidelines:', error);
    guidelinesContainer.innerHTML = '<p>Error loading guidelines.</p>';
  }
};

const showAddGuidelineForm = () => {
  const formContainer = document.getElementById('guideline-form-container');
  if (formContainer) {
    formContainer.style.display = 'block';
    formContainer.innerHTML = `
      <div class="admin-section">
        <h3>Add New Guideline</h3>
        <form id="guideline-form">
          <div class="form-group">
            <label for="guideline-title">Title *</label>
            <input type="text" id="guideline-title" name="title" required placeholder="Enter guideline title">
          </div>
          <div class="form-group">
            <label for="guideline-content">Content *</label>
            <textarea id="guideline-content" name="content" required placeholder="Enter detailed guideline content" rows="8"></textarea>
          </div>
          <div style="display: flex; gap: 1rem;">
            <button type="submit" class="btn">Add Guideline</button>
            <button type="button" onclick="hideGuidelineForm()" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    `;
    
    // Focus on first input
    setTimeout(() => {
      const firstInput = formContainer.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 100);
  }
};

const hideGuidelineForm = () => {
  const formContainer = document.getElementById('guideline-form-container');
  if (formContainer) {
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
  
  // Validation
  if (!data.title || !data.content) {
    alert('Please fill in all required fields (Title and Content)');
    return;
  }
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  try {
    submitBtn.textContent = 'Adding...';
    submitBtn.disabled = true;
    
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/guidelines`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      hideGuidelineForm();
      loadAdminGuidelines();
      alert('Guideline added successfully!');
    } else {
      const error = await response.json();
      alert('Error adding guideline: ' + (error.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error adding guideline:', error);
    alert('Error adding guideline. Please check your connection and try again.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
};

const editGuideline = async (guidelineId) => {
  // Implementation for editing guideline
  alert('Edit guideline functionality - Guideline ID: ' + guidelineId);
};

const deleteGuideline = async (guidelineId) => {
  if (!confirm('Are you sure you want to delete this guideline?')) {
    return;
  }
  
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/guidelines/${guidelineId}`, {
      method: 'DELETE'
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
  if (!consultationsContainer) return;
  
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/consultations`);
    const consultations = await response.json();
    
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
          </tr>
        </thead>
        <tbody>
          ${consultations.map(consultation => `
            <tr>
              <td>${consultation.name}</td>
              <td>${consultation.email}</td>
              <td>${consultation.phone}</td>
              <td>${consultation.projectType}</td>
              <td>${consultation.message.substring(0, 50)}...</td>
              <td>${new Date(consultation.createdAt).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
  } catch (error) {
    console.error('Error loading consultations:', error);
    consultationsContainer.innerHTML = '<p>Error loading consultation requests.</p>';
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
