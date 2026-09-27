/**
 * Mahmoud Gamal - Portfolio Main Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  setupNavigation();
  setupActiveSectionSpy();
  setupProjectModals();
  setupSkillsInteraction();
  setupContactActions();
  setupBackToTop();
  setupScrollAnimations();
});

/* ==========================================================================
   1. Navbar & Mobile Menu Setup
   ========================================================================== */
function setupNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link-item');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('shadow-lg', 'border-burgundy-primary/30', 'bg-slate-950/90');
    } else {
      navbar.classList.remove('shadow-lg', 'border-burgundy-primary/30', 'bg-slate-950/90');
    }
  });

  // Mobile menu toggle
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
      mobileBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   2. Active Section ScrollSpy
   ========================================================================== */
function setupActiveSectionSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   3. Interactive Skills Filter & Cards
   ========================================================================== */
function setupSkillsInteraction() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button state
      filterBtns.forEach(b => {
        b.classList.remove('bg-burgundy-primary', 'text-white', 'border-burgundy-accent');
        b.classList.add('bg-slate-900/60', 'text-slate-400', 'border-slate-800');
      });
      btn.classList.remove('bg-slate-900/60', 'text-slate-400', 'border-slate-800');
      btn.classList.add('bg-burgundy-primary', 'text-white', 'border-burgundy-accent');

      // Filter skills
      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   4. Project Details Modal System
   ========================================================================== */
const projectData = {
  'networking-labs': {
    title: 'Networking Labs & Protocol Architecture',
    category: 'Networking',
    description: 'Practical networking exercises focused on network configuration, connectivity, protocols, troubleshooting, and security.',
    tech: ['TCP/IP', 'Networking', 'Routing & Switching', 'Troubleshooting', 'Subnetting', 'Wireshark'],
    highlights: [
      'Configured static & dynamic routing protocols across multi-router topology.',
      'Analyzed TCP/IP handshake packets and protocol headers using Wireshark.',
      'Diagnosed complex network connectivity failures and packet loss scenarios.',
      'Implemented VLAN segmentation, access lists (ACLs), and firewall rules.'
    ],
    statusPlaceholder: 'Repository link: [Placeholder - Add your GitHub link here]'
  },
  'cybersecurity-labs': {
    title: 'Cybersecurity & Security Analysis Labs',
    category: 'Cybersecurity',
    description: 'Practical security labs covering cybersecurity fundamentals, vulnerabilities, network security, and security analysis.',
    tech: ['Cybersecurity', 'Networking', 'Linux', 'Security Analysis', 'Nmap', 'Vulnerability Assessment'],
    highlights: [
      'Executed detailed network reconnaissance and service enumeration using Nmap.',
      'Evaluated system vulnerabilities and prioritized remediation strategies.',
      'Configured Linux iptables and UFW firewall rules for network isolation.',
      'Investigated simulated security incidents and analyzed system log anomalies.'
    ],
    statusPlaceholder: 'Lab Documentation link: [Placeholder - Add your Lab report / GitHub link here]'
  },
  'aws-cloud-projects': {
    title: 'AWS Cloud Infrastructure & IAM Security Projects',
    category: 'Cloud Computing',
    description: 'Hands-on implementations using AWS services to understand cloud infrastructure, security, networking, and deployment concepts.',
    tech: ['AWS', 'Cloud Computing', 'IAM', 'VPC Networking', 'EC2', 'S3', 'Security Groups'],
    highlights: [
      'Architected custom AWS Virtual Private Clouds (VPC) with public/private subnets.',
      'Enforced Least Privilege access policies using granular AWS IAM roles and policies.',
      'Configured Security Groups and Network ACLs to lock down workload ingress/egress.',
      'Implemented resilient storage and compute instances with high availability considerations.'
    ],
    statusPlaceholder: 'AWS Architecture Diagram link: [Placeholder - Add your AWS Lab / GitHub link here]'
  }
};

function setupProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const viewBtns = document.querySelectorAll('.view-project-btn');

  if (!modal) return;

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];

      if (data) {
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-category').textContent = data.category;
        document.getElementById('modal-description').textContent = data.description;
        document.getElementById('modal-placeholder').textContent = data.statusPlaceholder;

        // Render tech tags
        const techContainer = document.getElementById('modal-tech');
        techContainer.innerHTML = data.tech
          .map(t => `<span class="px-2.5 py-1 text-xs font-mono rounded-md bg-burgundy-primary/30 border border-burgundy-accent/40 text-red-200">${t}</span>`)
          .join('');

        // Render highlights
        const highlightsContainer = document.getElementById('modal-highlights');
        highlightsContainer.innerHTML = data.highlights
          .map(h => `<li class="flex items-start gap-2.5 text-slate-300 text-sm"><i data-lucide="shield-check" class="w-4 h-4 text-rose-500 shrink-0 mt-0.5"></i><span>${h}</span></li>`)
          .join('');

        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Show modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. Contact Actions & Toast Clipboard
   ========================================================================== */
function setupContactActions() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast('Failed to copy text.');
        });
      }
    });
  });

  // Contact Form handler (Simulation)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value || 'Guest';
      const email = document.getElementById('form-email')?.value || '';
      const message = document.getElementById('form-message')?.value || '';

      if (!email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      // Create mailto link as direct action option
      const mailtoUrl = `mailto:m.ezzeldin4630@su.edu.eg?subject=Portfolio Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nSender Email: ' + email)}`;
      window.location.href = mailtoUrl;

      showToast('Opening your default email client...');
      contactForm.reset();
    });
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  if (toast && toastText) {
    toastText.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
}

/* ==========================================================================
   6. Back To Top Floating Button
   ========================================================================== */
function setupBackToTop() {
  const backBtn = document.getElementById('back-to-top');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      backBtn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
    } else {
      backBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      backBtn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   7. Scroll Reveal Animation Trigger
   ========================================================================== */
function setupScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(el => revealObserver.observe(el));
}
