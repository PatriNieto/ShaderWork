#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
varying vec2 vUv;

void main() {
    vec2 uv = vUv - 0.5;
    
    // Ajustar aspect ratio correctamente
    float aspect = u_resolution.x / u_resolution.y;
    
    if (aspect > 1.0) {
        uv.x *= aspect;
    } else {
        uv.y /= aspect;
    }

    vec3 color = vec3(0.0);
    int numSquares = 10;
    float maxSize = 0.45;

    for(int i = 0; i < 10; i++) {
        float t = float(i) / float(numSquares - 1);
        float size = maxSize * (1.0 - t);
        float thickness = 0.02;

        float outerX = step(-size, uv.x) * step(uv.x, size);
        float outerY = step(-size, uv.y) * step(uv.y, size);
        float outer = outerX * outerY;

        float innerSize = size - thickness;
        float innerX = step(-innerSize, uv.x) * step(uv.x, innerSize);
        float innerY = step(-innerSize, uv.y) * step(uv.y, innerSize);
        float inner = innerX * innerY;

        float border = clamp(outer - inner, 0.0, 1.0);
        float alpha = mix(0.1, 1.0, t);
        
        vec3 squareColor = vec3(0.3 + t * 0.5, 0.5, 0.8 - t * 0.3);
        color += squareColor * border * alpha;
    }

    color += vec3(0.05, 0.05, 0.1);
    color = min(color, vec3(1.0));

    gl_FragColor = vec4(color, 1.0);
}