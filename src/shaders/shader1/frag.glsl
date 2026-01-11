#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
varying vec2 vUv;

void main() {
    // Centrar y normalizar coordenadas
    vec2 uv = (vUv - 0.5) * 2.0;
    
    // Corregir aspect ratio (funciona en cualquier orientación)
    float aspect = u_resolution.x / u_resolution.y;
    if (aspect > 1.0) {
        // Horizontal (desktop)
        uv.x *= aspect;
    } else {
        // Vertical (móvil)
        uv.y /= aspect;
    }
    
    float d = length(uv);
    float pulse = 0.5 + 0.5 * sin(u_time - d * 20.0);
    float circle = smoothstep(0.6 + pulse * 0.1, 0.61, d);
    
    vec3 background = vec3(0.1, 0.1, 0.15);
    vec3 shapeColor = vec3(1.0);
    vec3 color = mix(shapeColor, background, circle);
    
    gl_FragColor = vec4(color, 1.0);
}