import * as THREE from 'three';

// Importa tus shaders como texto raw
import vertexShader1 from './shaders/shader1/vertex.glsl?raw';
import fragmentShader1 from './shaders/shader1/frag.glsl?raw';
import vertexShader2 from './shaders/shader2/vertex.glsl?raw';
import fragmentShader2 from './shaders/shader2/frag.glsl?raw';
import vertexShader3 from './shaders/shader3/vertex.glsl?raw';
import fragmentShader3 from './shaders/shader3/frag.glsl?raw';
import vertexShader4 from './shaders/shader4/vertex.glsl?raw';
import fragmentShader4 from './shaders/shader4/frag.glsl?raw';
import fragmentShader5 from './shaders/shader5/frag.glsl?raw';
import fragmentShader6 from './shaders/shader6/frag.glsl?raw';
import fragmentShader7 from './shaders/shader7/frag.glsl?raw';
import fragmentShader8 from './shaders/shader8/frag.glsl?raw';
import fragmentShader9 from './shaders/shader9/frag.glsl?raw';
import fragmentShader10 from './shaders/shader10/frag.glsl?raw';
import fragmentShader11 from './shaders/shader11/frag.glsl?raw';

// Define tus shaders
const shaders = [
     {
    name: 'Colores opuestos',
    vertex: vertexShader4,
    fragment: fragmentShader11,
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2() }
    }
  },
    {
    name: 'Secuencia',
    vertex: vertexShader4,
    fragment: fragmentShader10,
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2() }
    }
  },
      {
    name: 'Mondrian',
    vertex: vertexShader4,
    fragment: fragmentShader9,
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2() }
    }
  },
    {
    name: 'Random Color Closings',
    vertex: vertexShader4,
    fragment: fragmentShader8,
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2() }
    }
  },
  {
    name: 'Strobo',
    vertex: vertexShader4,
    fragment: fragmentShader7,
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2() }
    }
  },
     {
    name: 'ChakrasColors',
    vertex: vertexShader4,
    fragment: fragmentShader6,
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2() }
    }
  },
   {
    name: 'Squared',
    vertex: vertexShader4,
    fragment: fragmentShader5,
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2() }
    }
  },
  {
    name: 'World, U and I',
    vertex: vertexShader4,
    fragment: fragmentShader4,
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2() }
    }
  },
  {
    name: 'Hypnosapo',
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

// Fullscreen viewer
class FullscreenViewer {
  constructor(shaders, startIndex) {
    this.shaders = shaders;
    this.currentIndex = startIndex;
    this.isActive = true;
    
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
    
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false
    });
    
    this.renderer.setClearColor(0x000000);
    this.clock = new THREE.Clock();
    
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
    this.scene.remove(this.scene.children[0]); 
  }
  
  const shader = this.shaders[index];
  
  // Obtener dimensiones ANTES de crear uniforms
  const width = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  
  // Crear uniforms CON valores correctos desde el inicio
  const uniforms = {
    u_time: { value: 0.0 },
    u_resolution: { value: new THREE.Vector2(width, height) }
  };
  
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    vertexShader: shader.vertex,
    fragmentShader: shader.fragment,
    uniforms: uniforms
  });
  
  this.currentUniforms = uniforms;
  
  const mesh = new THREE.Mesh(geometry, material);
  this.scene.add(mesh);
  
  // Actualizar título
  this.container.querySelector('.fullscreen-title').textContent = shader.name;
  
  // Resetear reloj
  this.clock = new THREE.Clock();
  
  // Forzar un render inmediato
  this.renderer.render(this.scene, this.camera);
}
  
  setupEvents() {
    // WHEEL para desktop
    this.wheelLock = false;
    this.cooldown = 400;

    this.onWheel = (e) => {
      e.preventDefault();
      if (this.wheelLock) return;
      if (Math.abs(e.deltaY) < 20) return;

      this.wheelLock = true;

      if (e.deltaY > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.shaders.length;
      } else {
        this.currentIndex = (this.currentIndex - 1 + this.shaders.length) % this.shaders.length;
      }

      this.loadShader(this.currentIndex);

      setTimeout(() => {
        this.wheelLock = false;
      }, this.cooldown);
    };

    this.container.addEventListener('wheel', this.onWheel, { passive: false });

    // TOUCH para móvil
    this.touchStartY = 0;
    this.touchLock = false;

    this.onTouchStart = (e) => {
      this.touchStartY = e.touches[0].clientY;
    };

    this.onTouchMove = (e) => {
      if (this.touchLock) return;
      
      const touchY = e.touches[0].clientY;
      const deltaY = this.touchStartY - touchY;

      if (Math.abs(deltaY) > 50) {
        e.preventDefault();
        this.touchLock = true;

        if (deltaY > 0) {
          this.currentIndex = (this.currentIndex + 1) % this.shaders.length;
        } else {
          this.currentIndex = (this.currentIndex - 1 + this.shaders.length) % this.shaders.length;
        }

        this.loadShader(this.currentIndex);

        setTimeout(() => {
          this.touchLock = false;
        }, this.cooldown);
      }
    };

    this.onTouchEnd = () => {
      this.touchStartY = 0;
    };

    this.container.addEventListener('touchstart', this.onTouchStart, { passive: true });
    this.container.addEventListener('touchmove', this.onTouchMove, { passive: false });
    this.container.addEventListener('touchend', this.onTouchEnd, { passive: true });

    // CLICK para cerrar
    this.onClick = (e) => {
      if (e.target === this.container || e.target.classList.contains('fullscreen-canvas')) {
        this.close();
      }
    };
    this.container.addEventListener('click', this.onClick);

    // ESC para cerrar
    this.onKeyDown = (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    };
    document.addEventListener('keydown', this.onKeyDown);

    // RESIZE
 this.onResize = () => this.resize();
  window.addEventListener('resize', this.onResize);
  
  // VISUAL VIEWPORT para móvil (importante)
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', this.onResize);
  }
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
  // Usar visualViewport para móvil (excluye barras del navegador)
  const width = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  
  this.renderer.setSize(width, height);
  this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  if (this.currentUniforms) {
    this.currentUniforms.u_resolution.value.set(width, height);
  }
  
  // Render inmediato después de resize
  if (this.isActive && this.scene && this.camera) {
    this.renderer.render(this.scene, this.camera);
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
      // Limpiar TODOS los event listeners
      this.container.removeEventListener('wheel', this.onWheel);
      this.container.removeEventListener('touchstart', this.onTouchStart);
      this.container.removeEventListener('touchmove', this.onTouchMove);
      this.container.removeEventListener('touchend', this.onTouchEnd);
      this.container.removeEventListener('click', this.onClick);
      document.removeEventListener('keydown', this.onKeyDown);
      
      window.removeEventListener('resize', this.onResize);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', this.onResize);
    }
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
  
  container.addEventListener('click', () => {
    new FullscreenViewer(shaders, index);
  });
});

window.addEventListener('resize', () => {
  previews.forEach(preview => preview.resize());
});