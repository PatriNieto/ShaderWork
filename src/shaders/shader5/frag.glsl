#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vUv;

// Función hash simple
float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

// Función de suavizado para transiciones naturales
float smoothLoop(float t, float speed) {
    return sin(t * speed) * 0.5 + 0.5;
}

// Función para renderizar una capa del grid
vec3 renderLayer(vec2 uv, float timeOffset, float depthScale) {
    // Escala basada en profundidad
    vec2 scaledST = uv* depthScale;
    
    // Número de celdas
    float gridPhase = smoothLoop(u_time + timeOffset, 0.08);
    float grid = mix(20.0, 80.0, gridPhase);
    vec2 gridUV = scaledST * grid;
    
    // Coordenadas locales
    vec2 cell = fract(gridUV + 0.5) - 0.5;
    
    // ID y aleatorio
    float id = floor(gridUV.x) + floor(gridUV.y) * grid;
    float rnd = hash(id);
    
    // Animación de tamaño
    float pulse = smoothLoop(u_time + timeOffset + rnd * 6.28, 0.3 + rnd * 0.3);
    float size = mix(0.15, 0.35, pulse);
    
    // Cuadrados flotantes en esta capa
    float s = 0.08 * depthScale;
    float angle1 = (u_time + timeOffset) * 0.5;
    vec2 pos1 = vec2(0.3 * cos(angle1), 0.3 * sin(angle1)) * depthScale;
    
    float angle2 = (u_time + timeOffset) * 0.4 + 3.14;
    vec2 pos2 = vec2(0.35 * cos(angle2 * 0.8), 0.35 * sin(angle2 * 1.2)) * depthScale;
    
    float q1 = smoothstep(s * 1.2, 0.0, abs(scaledST.x - pos1.x)) *
               smoothstep(s * 1.2, 0.0, abs(scaledST.y - pos1.y));
    float q2 = smoothstep(s * 1.2, 0.0, abs(scaledST.x - pos2.x)) *
               smoothstep(s * 1.2, 0.0, abs(scaledST.y - pos2.y));
    
    float topLayer = clamp(q1 + q2, 0.0, 1.0);
    
    // Interacción
    vec2 toPos1 = scaledST - pos1;
    vec2 toPos2 = scaledST - pos2;
    float d1 = length(toPos1);
    float d2 = length(toPos2);
    
    float influence1 = exp(-d1 * 5.0) * 0.15;
    float influence2 = exp(-d2 * 5.0) * 0.15;
    
    vec2 displacement = normalize(toPos1) * influence1 + normalize(toPos2) * influence2;
    cell += displacement * grid * 0.5;
    
    // Cuadrado de fondo
    float animPhase = (u_time + timeOffset) * 0.4 + rnd * 6.28;
    float animX = 0.15 * sin(animPhase);
    float animY = 0.15 * cos(animPhase * 1.3);
    
    animX += (influence1 + influence2) * 0.3 * sin((u_time + timeOffset) * 0.7);
    animY += (influence1 + influence2) * 0.3 * cos((u_time + timeOffset) * 0.5);
    
    vec2 topRight = vec2(size + animX, size + animY);
    vec2 bottomLeft = vec2(-size - animX * 0.5, -size - animY * 0.5);
    
    float smoothEdge = 0.05;
    float square = 
        smoothstep(bottomLeft.x - smoothEdge, bottomLeft.x, cell.x) *
        smoothstep(topRight.x + smoothEdge, topRight.x, cell.x) *
        smoothstep(bottomLeft.y - smoothEdge, bottomLeft.y, cell.y) *
        smoothstep(topRight.y + smoothEdge, topRight.y, cell.y);
    
    vec3 base = vec3(square);
    
    // Overlay
    float bigSize = 0.4 * depthScale;
    float overlayMask = 
        smoothstep(bigSize + 0.1, bigSize, abs(scaledST.x)) *
        smoothstep(bigSize + 0.1, bigSize, abs(scaledST.y));
    
    float gradPhase = (u_time + timeOffset) * 0.3;
    float grad = (scaledST.y + sin(gradPhase) * 0.4) * 1.5;
    grad = smoothstep(-0.5, 0.5, grad);
    grad += sin(scaledST.x * 5.0 + (u_time + timeOffset) * 0.5) * 0.05;
    grad = clamp(grad, 0.0, 1.0);
    
    float overlay = overlayMask * grad;
    vec3 overlayColor = vec3(overlay);
    
    vec3 color = mix(base, overlayColor, 0.35);
    color = mix(color, vec3(1.0), topLayer);
    
    return color;
}

void main() {
      vec2 uv = vUv - 0.5;

    // Ajustar aspect ratio
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    
    // --- EFECTO DE ZOOM INFINITO CON 5 CAPAS ---
    float zoomSpeed = u_time * 0.015;
    float zoom = u_time * zoomSpeed;
    
    // 5 capas para transición más suave
    float layer1Depth = mod(zoom, 1.0);
    float layer2Depth = mod(zoom + 0.2, 1.0);
    float layer3Depth = mod(zoom + 0.4, 1.0);
    float layer4Depth = mod(zoom + 0.6, 1.0);
    float layer5Depth = mod(zoom + 0.8, 1.0);
    
    // Escala suave
    float scale1 = mix(0.4, 1.3, layer1Depth);
    float scale2 = mix(0.4, 1.3, layer2Depth);
    float scale3 = mix(0.4, 1.3, layer3Depth);
    float scale4 = mix(0.4, 1.3, layer4Depth);
    float scale5 = mix(0.4, 1.3, layer5Depth);
    
    // Renderizar cada capa
    vec3 color1 = renderLayer(uv, 0.0, scale1);
    vec3 color2 = renderLayer(uv, 8.0, scale2);
    vec3 color3 = renderLayer(uv, 16.0, scale3);
    vec3 color4 = renderLayer(uv, 24.0, scale4);
    vec3 color5 = renderLayer(uv, 32.0, scale5);
    
    // Fade suave y constante - CLAVE PARA MANTENER BRILLO CONSTANTE
    // Usa una curva que siempre suma a ~1.0
    float alpha1 = smoothstep(0.0, 0.2, layer1Depth) * smoothstep(1.0, 0.8, layer1Depth);
    float alpha2 = smoothstep(0.0, 0.2, layer2Depth) * smoothstep(1.0, 0.8, layer2Depth);
    float alpha3 = smoothstep(0.0, 0.2, layer3Depth) * smoothstep(1.0, 0.8, layer3Depth);
    float alpha4 = smoothstep(0.0, 0.2, layer4Depth) * smoothstep(1.0, 0.8, layer4Depth);
    float alpha5 = smoothstep(0.0, 0.2, layer5Depth) * smoothstep(1.0, 0.8, layer5Depth);
    
    // Normalizar alphas para que siempre sumen ~1.0
    float totalAlpha = alpha1 + alpha2 + alpha3 + alpha4 + alpha5;
    totalAlpha = max(totalAlpha, 0.01); // Evitar división por cero
    
    alpha1 /= totalAlpha;
    alpha2 /= totalAlpha;
    alpha3 /= totalAlpha;
    alpha4 /= totalAlpha;
    alpha5 /= totalAlpha;
    
    // Componer capas con pesos normalizados
    vec3 finalColor = 
        color1 * alpha1 +
        color2 * alpha2 +
        color3 * alpha3 +
        color4 * alpha4 +
        color5 * alpha5;
    
    // Viñeta muy sutil
    float vignette = 1.0 - length(uv) * 0.15;
    finalColor *= vignette;
    
    gl_FragColor = vec4(finalColor, 1.0);
}