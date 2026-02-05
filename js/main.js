// ========================================
// Dental Clinic Website - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavigation();
  initScrollEffects();
  initForms();
  initAppointmentBooking();
  initRevealAnimations();
});

// ========================================
// Navigation
// ========================================
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Navbar scroll effect
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ========================================
// Scroll Effects
// ========================================
function initScrollEffects() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ========================================
// Reveal Animations
// ========================================
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

// ========================================
// Form Validation & Handling
// ========================================
function initForms() {
  // Contact Form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }
}

function handleContactForm(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  
  // Basic validation
  let isValid = true;
  const requiredFields = form.querySelectorAll('[required]');
  
  requiredFields.forEach(field => {
    const errorEl = field.parentElement.querySelector('.form-error');
    
    if (!field.value.trim()) {
      isValid = false;
      field.style.borderColor = 'var(--error)';
      if (errorEl) errorEl.textContent = 'This field is required';
    } else {
      field.style.borderColor = 'var(--gray-200)';
      if (errorEl) errorEl.textContent = '';
    }
  });

  // Email validation
  const emailField = form.querySelector('[type="email"]');
  if (emailField && emailField.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value)) {
      isValid = false;
      emailField.style.borderColor = 'var(--error)';
      const errorEl = emailField.parentElement.querySelector('.form-error');
      if (errorEl) errorEl.textContent = 'Please enter a valid email address';
    }
  }

  if (isValid) {
    // Show success message
    const successMessage = document.getElementById('formSuccess');
    if (successMessage) {
      successMessage.classList.add('show');
      form.reset();
      
      setTimeout(() => {
        successMessage.classList.remove('show');
      }, 5000);
    }
  }
}

// ========================================
// Appointment Booking
// ========================================
function initAppointmentBooking() {
  const appointmentForm = document.getElementById('appointmentForm');
  const dateInput = document.getElementById('appointmentDate');
  const timeSlots = document.querySelectorAll('.time-slot');
  const selectedTimeInput = document.getElementById('selectedTime');

  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    
    // Set max date to 3 months from now
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);

    // Update available time slots when date changes
    dateInput.addEventListener('change', function() {
      updateTimeSlots(this.value);
    });
  }

  // Time slot selection
  timeSlots.forEach(slot => {
    slot.addEventListener('click', function() {
      if (this.classList.contains('unavailable')) return;
      
      timeSlots.forEach(s => s.classList.remove('selected'));
      this.classList.add('selected');
      
      if (selectedTimeInput) {
        selectedTimeInput.value = this.dataset.time;
      }
    });
  });

  // Form submission
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', handleAppointmentSubmit);
  }
}

function updateTimeSlots(selectedDate) {
  const timeSlots = document.querySelectorAll('.time-slot');
  const dayOfWeek = new Date(selectedDate).getDay();
  
  // Simple simulation: weekends have fewer slots
  timeSlots.forEach(slot => {
    slot.classList.remove('unavailable', 'selected');
    
    // Simulate some unavailable slots
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekend - only morning slots available
      const time = slot.dataset.time;
      if (time && parseInt(time.split(':')[0]) >= 14) {
        slot.classList.add('unavailable');
      }
    } else {
      // Randomly make some slots unavailable for demo
      if (Math.random() < 0.2) {
        slot.classList.add('unavailable');
      }
    }
  });
}

function handleAppointmentSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  let isValid = true;
  
  // Clear previous errors
  form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  form.querySelectorAll('.form-input, .form-select').forEach(el => {
    el.style.borderColor = 'var(--gray-200)';
  });

  // Validate required fields
  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      field.style.borderColor = 'var(--error)';
      const errorEl = field.parentElement.querySelector('.form-error');
      if (errorEl) errorEl.textContent = 'This field is required';
    }
  });

  // Validate email
  const emailField = form.querySelector('[type="email"]');
  if (emailField && emailField.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value)) {
      isValid = false;
      emailField.style.borderColor = 'var(--error)';
      const errorEl = emailField.parentElement.querySelector('.form-error');
      if (errorEl) errorEl.textContent = 'Please enter a valid email address';
    }
  }

  // Validate phone
  const phoneField = form.querySelector('[type="tel"]');
  if (phoneField && phoneField.value) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(phoneField.value)) {
      isValid = false;
      phoneField.style.borderColor = 'var(--error)';
      const errorEl = phoneField.parentElement.querySelector('.form-error');
      if (errorEl) errorEl.textContent = 'Please enter a valid phone number';
    }
  }

  // Validate time selection
  const selectedTime = document.getElementById('selectedTime');
  if (selectedTime && !selectedTime.value) {
    isValid = false;
    const timeSlotsContainer = document.querySelector('.time-slots');
    if (timeSlotsContainer) {
      const errorEl = timeSlotsContainer.parentElement.querySelector('.form-error');
      if (errorEl) errorEl.textContent = 'Please select a time slot';
    }
  }

  if (isValid) {
    // Collect form data
    const formData = {
      name: form.querySelector('#patientName')?.value,
      email: form.querySelector('#patientEmail')?.value,
      phone: form.querySelector('#patientPhone')?.value,
      service: form.querySelector('#serviceType')?.value,
      dentist: form.querySelector('#preferredDentist')?.value,
      date: form.querySelector('#appointmentDate')?.value,
      time: selectedTime?.value,
      notes: form.querySelector('#additionalNotes')?.value,
      isNewPatient: form.querySelector('#isNewPatient')?.checked
    };

    // Show success message
    showAppointmentConfirmation(formData);
    form.reset();
    
    // Reset time slots
    document.querySelectorAll('.time-slot').forEach(slot => {
      slot.classList.remove('selected');
    });
    if (selectedTime) selectedTime.value = '';
  }
}

function showAppointmentConfirmation(data) {
  const successMessage = document.getElementById('appointmentSuccess');
  const confirmationDetails = document.getElementById('confirmationDetails');
  
  if (successMessage) {
    if (confirmationDetails) {
      const dateFormatted = new Date(data.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      confirmationDetails.innerHTML = `
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Service:</strong> ${data.service}</p>
        <p><strong>Date:</strong> ${dateFormatted}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p>A confirmation email will be sent to ${data.email}</p>
      `;
    }
    
    successMessage.classList.add('show');
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Hide after 10 seconds
    setTimeout(() => {
      successMessage.classList.remove('show');
    }, 10000);
  }
}

// ========================================
// Utility Functions
// ========================================
function formatPhoneNumber(input) {
  // Format phone number as user types
  let value = input.value.replace(/\D/g, '');
  if (value.length >= 6) {
    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
  } else if (value.length >= 3) {
    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
  }
  input.value = value;
}

// Expose utility functions globally if needed
window.formatPhoneNumber = formatPhoneNumber;
