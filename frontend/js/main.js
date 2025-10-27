// Main JavaScript file for GM Constructions

// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Utility Functions
const showLoading = (element) => {
  element.innerHTML = '<div class="loading"></div>';
};

const showError = (element, message) => {
  element.innerHTML = `<div class="form-error">${message}</div>`;
};

const showSuccess = (element, message) => {
  element.innerHTML = `<div class="form-success">${message}</div>`;
};

// Navigation
const initNavigation = () => {
  const navLinks = document.querySelectorAll('.nav a');
  const currentPath = window.location.pathname;
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    }
  });
};

// Services Page
const loadServices = async () => {
  const servicesContainer = document.getElementById('services-container');
  if (!servicesContainer) return;
  
  try {
    showLoading(servicesContainer);
    
    const response = await fetch(`${API_BASE_URL}/services`);
    const services = await response.json();
    
    if (services.length === 0) {
      servicesContainer.innerHTML = '<p>No services available at the moment.</p>';
      return;
    }
    
    servicesContainer.innerHTML = services.map(service => `
      <div class="service-card">
        <div class="service-icon">
          <i class="fas fa-building"></i>
        </div>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
        <a href="/consultation" class="btn">Request Consultation</a>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Error loading services:', error);
    showError(servicesContainer, 'Failed to load services. Please try again later.');
  }
};

// Guidelines Page
const loadGuidelines = async () => {
  const guidelinesContainer = document.getElementById('guidelines-container');
  if (!guidelinesContainer) return;
  
  try {
    showLoading(guidelinesContainer);
    
    const response = await fetch(`${API_BASE_URL}/guidelines`);
    const guidelines = await response.json();
    
    if (guidelines.length === 0) {
      guidelinesContainer.innerHTML = '<p>No guidelines available at the moment.</p>';
      return;
    }
    
    guidelinesContainer.innerHTML = guidelines.map(guideline => `
      <div class="guideline-item">
        <div class="guideline-header" onclick="toggleGuideline(this)">
          <h3 class="guideline-title">${guideline.title}</h3>
          <span class="guideline-toggle">▼</span>
        </div>
        <div class="guideline-content">
          <p>${guideline.content}</p>
        </div>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Error loading guidelines:', error);
    showError(guidelinesContainer, 'Failed to load guidelines. Please try again later.');
  }
};

// Toggle guideline accordion
const toggleGuideline = (header) => {
  const guidelineItem = header.parentElement;
  const content = guidelineItem.querySelector('.guideline-content');
  
  // Close all other guidelines
  document.querySelectorAll('.guideline-item').forEach(item => {
    if (item !== guidelineItem) {
      item.classList.remove('active');
    }
  });
  
  // Toggle current guideline
  guidelineItem.classList.toggle('active');
};

// Consultation Form
const initConsultationForm = () => {
  const form = document.getElementById('consultation-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    const statusDiv = document.getElementById('form-status');
    
    // Get form data
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      projectType: formData.get('projectType'),
      message: formData.get('message')
    };
    
    // Validate form
    if (!validateConsultationForm(data)) {
      return;
    }
    
    try {
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      
      const response = await fetch(`${API_BASE_URL}/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        showSuccess(statusDiv, 'Your consultation request has been submitted. We\'ll contact you soon.');
        form.reset();
      } else {
        showError(statusDiv, result.message || 'Failed to submit consultation request.');
      }
      
    } catch (error) {
      console.error('Error submitting consultation:', error);
      showError(statusDiv, 'Failed to submit consultation request. Please try again later.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
};

// Form validation
const validateConsultationForm = (data) => {
  const errors = [];
  
  if (!data.name.trim()) {
    errors.push('Name is required');
  }
  
  if (!data.email.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!data.phone.trim()) {
    errors.push('Phone number is required');
  }
  
  if (!data.projectType) {
    errors.push('Project type is required');
  }
  
  if (!data.message.trim()) {
    errors.push('Message is required');
  }
  
  if (errors.length > 0) {
    const statusDiv = document.getElementById('form-status');
    showError(statusDiv, errors.join('<br>'));
    return false;
  }
  
  return true;
};

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Admin Authentication
const adminLogin = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      localStorage.setItem('adminToken', result.token);
      window.location.href = '/admin';
    } else {
      throw new Error(result.message || 'Login failed');
    }
    
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Check admin authentication
const checkAdminAuth = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = '/login';
    return false;
  }
  return true;
};

// Logout admin
const adminLogout = () => {
  localStorage.removeItem('adminToken');
  window.location.href = '/login';
};

// Initialize page based on current path
const initPage = () => {
  const currentPath = window.location.pathname;
  
  switch (currentPath) {
    case '/services':
      loadServices();
      break;
    case '/guidelines':
      loadGuidelines();
      break;
    case '/consultation':
      initConsultationForm();
      break;
    case '/admin':
      if (checkAdminAuth()) {
        initAdminDashboard();
      }
      break;
    case '/login':
      initLoginForm();
      break;
  }
  
  initNavigation();
};

// Initialize login form
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

// Initialize admin dashboard
const initAdminDashboard = () => {
  // This will be handled by api.js
  if (typeof loadAdminServices === 'function') {
    loadAdminServices();
    loadAdminGuidelines();
    loadAdminConsultations();
    initAdminEventListeners();
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);
