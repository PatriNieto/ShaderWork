#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
varying vec2 vUv;

void main() {
    vec2 uv = vUv - 0.5;
    
    // Solo multiplicar X por aspect ratio
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    
    float d = length(uv);
    float pulse = 0.5 + 0.5 * sin(u_time - d * 20.0);
    float circle = smoothstep(0.3 + pulse * 0.05, 0.31, d);
    
    vec3 background = vec3(0.1, 0.1, 0.15);
    vec3 shapeColor = vec3(1.0);
    vec3 color = mix(shapeColor, background, circle);
    
    gl_FragColor = vec4(color, 1.0);
}