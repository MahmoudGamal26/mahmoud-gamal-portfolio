/**
 * Cyber Security & Cloud Network Interactive Canvas Visualizer
 * Mahmoud Gamal Portfolio - Official Cyber Sapphire Theme
 */

class CyberNetworkCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.packets = [];
    this.numNodes = 38;
    this.maxDistance = 145;
    this.mouse = { x: null, y: null, radius: 180 };
    
    this.init();
    this.setupEventListeners();
    this.animate();
  }

  init() {
    this.resize();
    this.nodes = [];
    
    // Create Nodes with Cloud & Security properties
    for (let i = 0; i < this.numNodes; i++) {
      const isCloudNode = i % 5 === 0;
      const isSecurityNode = i % 7 === 0;
      
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius: isCloudNode ? 3.5 : isSecurityNode ? 3.0 : 2.0,
        type: isCloudNode ? 'cloud' : isSecurityNode ? 'shield' : 'node',
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02
      });
    }
  }

  resize() {
    const parent = this.canvas.parentElement;
    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    
    this.width = rect.width;
    this.height = rect.height;
    
    this.numNodes = this.width < 768 ? 22 : 38;
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.resize());
    
    const parent = this.canvas.parentElement;
    parent.addEventListener('mousemove', (e) => {
      const rect = parent.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    parent.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Update and draw nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];

      // Move nodes
      node.x += node.vx;
      node.y += node.vy;

      // Bounce off walls
      if (node.x < 0 || node.x > this.width) node.vx *= -1;
      if (node.y < 0 || node.y > this.height) node.vx *= -1;

      // Mouse interaction
      if (this.mouse.x !== null) {
        const dx = this.mouse.x - node.x;
        const dy = this.mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          node.x -= (dx / dist) * force * 1.6;
          node.y -= (dy / dist) * force * 1.6;
        }
      }

      // Draw node connection links
      for (let j = i + 1; j < this.nodes.length; j++) {
        const other = this.nodes[j];
        const dx = other.x - node.x;
        const dy = other.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDistance) {
          const alpha = (1 - dist / this.maxDistance) * 0.3;
          this.ctx.beginPath();
          this.ctx.moveTo(node.x, node.y);
          this.ctx.lineTo(other.x, other.y);
          
          if (node.type === 'shield' || other.type === 'shield') {
            this.ctx.strokeStyle = `rgba(52, 211, 153, ${alpha * 1.4})`; // Emerald Green Line
          } else {
            this.ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`; // Cyan Sapphire Line
          }
          
          this.ctx.lineWidth = 1;
          this.ctx.stroke();

          // Spawn security data packet along line occasionally
          if (Math.random() < 0.0015) {
            this.packets.push({
              x: node.x,
              y: node.y,
              targetX: other.x,
              targetY: other.y,
              progress: 0,
              speed: 0.012 + Math.random() * 0.015,
              color: node.type === 'shield' ? '#34d399' : '#38bdf8'
            });
          }
        }
      }

      // Pulse size animation
      node.pulse += node.pulseSpeed;
      const pulseRadius = node.radius + Math.sin(node.pulse) * 0.8;

      // Draw Node
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
      
      if (node.type === 'shield') {
        this.ctx.fillStyle = '#34d399'; // Emerald
        this.ctx.shadowColor = '#34d399';
        this.ctx.shadowBlur = 9;
      } else if (node.type === 'cloud') {
        this.ctx.fillStyle = '#38bdf8'; // Cyan Sapphire
        this.ctx.shadowColor = '#38bdf8';
        this.ctx.shadowBlur = 8;
      } else {
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.shadowBlur = 0;
      }
      
      this.ctx.fill();
      this.ctx.shadowBlur = 0; // reset
    }

    // Animate data packets
    for (let p = this.packets.length - 1; p >= 0; p--) {
      const pkt = this.packets[p];
      pkt.progress += pkt.speed;

      if (pkt.progress >= 1) {
        this.packets.splice(p, 1);
        continue;
      }

      const currentX = pkt.x + (pkt.targetX - pkt.x) * pkt.progress;
      const currentY = pkt.y + (pkt.targetY - pkt.y) * pkt.progress;

      this.ctx.beginPath();
      this.ctx.arc(currentX, currentY, 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = pkt.color;
      this.ctx.shadowColor = pkt.color;
      this.ctx.shadowBlur = 7;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new CyberNetworkCanvas('cyber-canvas');
});
