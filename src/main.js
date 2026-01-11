import * as THREE from 'three';

// Importa tus shaders como texto raw
import vertexShader1 from './shaders/shader1/vertex.glsl?raw';
import fragmentShader1 from './shaders/shader1/frag.glsl?raw';

import vertexShader2 from './shaders/shader2/vertex.glsl?raw';
import fragmentShader2 from './shaders/shader2/frag.glsl?raw';

import vertexShader3 from './shaders/shader3/vertex.glsl?raw';
import fragmentShader3 from './shaders/shader3/frag.glsl?raw';

// Define tus shaders
const shaders = [
  {
    name: 'Gradient Wave',
    vertex: vertexShader1,
    fragment: fragmentShader1,
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2() }
    }
  },
  {
    name: 'Gradient Wave 2',
    vertex: vertexShader2,
    fragment: fragmentShader2,
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2() }
    }
  },
    {
    name: 'Pyramid',
    vertex: vertexShader3,
    fragment: fragmentShader3,
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2() }
    }
  }
];

class ShaderPreview {
  constructor(container, shaderConfig, index) {
    this.container = container;
    this.config = shaderConfig;
    this.index = index;
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    
    this.clock = new THREE.Clock();
    
    this.init();
  }
  
  init() {
    const canvas = this.container.querySelector('.shader-canvas');
    const rect = this.container.getBoundingClientRect();
    
    const size = Math.min(rect.width, rect.height);
    
    this.renderer.setSize(size, size);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // IMPORTANTE: Añadir color de fondo
    this.renderer.setClearColor(0x000000);
    
    canvas.replaceWith(this.renderer.domElement);
    this.renderer.domElement.className = 'shader-canvas';
    
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: this.config.vertex,
      fragmentShader: this.config.fragment,
      uniforms: this.config.uniforms
    });
    
    this.config.uniforms.u_resolution.value.set(size, size);
    
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    
    this.animate();
  }
  
  animate = () => {
    requestAnimationFrame(this.animate);
    this.config.uniforms.u_time.value = this.clock.getElapsedTime();
    this.renderer.render(this.scene, this.camera);
  }
  
  resize() {
    const rect = this.container.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    this.renderer.setSize(size, size);
    this.config.uniforms.u_resolution.value.set(size, size);
  }
}

// Fullscreen viewer - SOLO ERRORES CRÍTICOS CORREGIDOS
class FullscreenViewer {
  constructor(shaders, startIndex) {
    this.shaders = shaders;
    this.currentIndex = startIndex;
    this.isScrolling = false;
    this.isActive = true; // AÑADIDO: variable para controlar animación
    
      this.canScroll = true;
  this.scrollThreshold = 100; // Scroll mínimo necesario
  this.scrollDelay = 500; // Tiempo entre cambios
  
    this.createDOM();
    this.createRenderer();
    this.setupEvents();
    this.show();
  }
  
  createDOM() {
    this.container = document.createElement('div');
    this.container.className = 'fullscreen-viewer';
    this.container.innerHTML = `
      <div class="fullscreen-title"></div>
      <div class="fullscreen-hint">Scroll para navegar • ESC o click para salir</div>
    `;
    document.body.appendChild(this.container);
  }
  
  createRenderer() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    // CORREGIDO: Crear canvas y renderer correctamente
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false
    });
    
    // IMPORTANTE: Establecer color de fondo NEGRO
    this.renderer.setClearColor(0x000000);
    
    this.clock = new THREE.Clock();
    
    // Añadir el canvas al DOM
    const canvas = this.renderer.domElement;
    canvas.className = 'fullscreen-canvas';
    this.container.insertBefore(canvas, this.container.firstChild);
    
    this.loadShader(this.currentIndex);
    this.resize();
    this.animate();
  }
  
  loadShader(index) {
    
    
    // Limpiar escena anterior
    while(this.scene.children.length > 0) { 
      const child = this.scene.children[0];
      this.scene.remove(child); 
    }
    
    const shader = this.shaders[index];
    
    // CORREGIDO: Usar los uniforms del shader correctamente
    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2() }
    };
    
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: shader.vertex,
      fragmentShader: shader.fragment,
      uniforms: uniforms
    });
    
    this.currentUniforms = uniforms;
    this.resize(); // Actualizar resolución
    
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    
    // Actualizar título
    this.container.querySelector('.fullscreen-title').textContent = shader.name;
    
    // Resetear reloj
    this.clock = new THREE.Clock();
  }
  
setupEvents() {
  // --- SCROLL ---
  this.wheelLock = false;
  this.lastDirection = 0;
  this.cooldown = 400;

  this.onWheel = (e) => {
    e.preventDefault(); // evita scroll de la página

    if (this.wheelLock) return;

    const delta = e.deltaY;

    // ignorar micro-scrolls
    if (Math.abs(delta) < 20) return;

    const direction = Math.sign(delta);

    if (direction !== this.lastDirection) {
      this.lastDirection = direction;
    }

    this.wheelLock = true;

    if (direction > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.shaders.length;
    } else {
      this.currentIndex = (this.currentIndex - 1 + this.shaders.length) % this.shaders.length;
    }

    this.loadShader(this.currentIndex);

    // reset para evitar inercia
    this.lastDirection = 0;

    setTimeout(() => {
      this.wheelLock = false;
    }, this.cooldown);
  };

  // Escucha del wheel en container
  this.container.addEventListener('wheel', this.onWheel, { passive: false });

  // --- CLICK PARA CERRAR ---
  this.onClick = (e) => {
    // si clicas en el fondo o canvas, cerrar
    if (e.target === this.container || e.target.classList.contains('fullscreen-canvas')) {
      this.close();
    }
  };
  this.container.addEventListener('click', this.onClick);

  // --- ESC PARA CERRAR ---
  this.onKeyDown = (e) => {
    if (e.key === 'Escape') {
      this.close();
    }
  };
  document.addEventListener('keydown', this.onKeyDown);

  // --- REDIMENSIONAMIENTO ---
  window.addEventListener('resize', () => this.resize());
}


  
  animate = () => {
    if (!this.isActive) return;
    
    requestAnimationFrame(this.animate);
    
    if (this.currentUniforms) {
      this.currentUniforms.u_time.value = this.clock.getElapsedTime();
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    if (this.currentUniforms) {
      this.currentUniforms.u_resolution.value.set(width, height);
    }
  }
  
  show() {
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      this.container.classList.add('active');
    }, 10);
  }
  
  close() {
    this.isActive = false;
    this.container.classList.remove('active');
    
    setTimeout(() => {
      // Limpiar event listeners
      this.container.removeEventListener('wheel', this.onWheel);
      this.container.removeEventListener('click', this.onClick);
      document.removeEventListener('keydown', this.onKeyDown);
      window.removeEventListener('resize', this.onResize);
      
      // Limpiar Three.js
      this.renderer.dispose();
      
      // Remover del DOM
      if (this.container && this.container.parentNode) {
        document.body.removeChild(this.container);
      }
      
      document.body.style.overflow = '';
    }, 300);
  }
}

// Crear la galería
const grid = document.getElementById('shader-grid');
const previews = [];

shaders.forEach((shader, index) => {
  const container = document.createElement('div');
  container.className = 'shader-container';
  
  container.innerHTML = `
    <canvas class="shader-canvas"></canvas>
    <div class="shader-title">${shader.name}</div>
  `;
  
  grid.appendChild(container);
  
  const preview = new ShaderPreview(container, shader, index);
  previews.push(preview);
  
  // Click para abrir en fullscreen
  container.addEventListener('click', () => {
    new FullscreenViewer(shaders, index);
  });
});

// Manejar redimensionamiento
window.addEventListener('resize', () => {
  previews.forEach(preview => preview.resize());
});

