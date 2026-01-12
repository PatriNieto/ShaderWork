#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

varying vec2 vUv;


float hash(float n) {
    return fract(sin(n) * 43758.5453);
}


void main() {

      vec2 uv = vUv - 0.5;

    // Ajustar aspect ratio
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;

 


    // Número de celdas
    float grid = 20.0;

    // Pasamos a espacio de grid
    vec2 gridUV = uv * grid;

    // Coordenadas locales dentro de cada celda [0,1]
    vec2 cell = fract(gridUV + 0.5);

    // Centramos la celda
    cell -= 0.5;

    float id = floor(gridUV.x) + floor(gridUV.y) * grid;
    float rnd = hash(id);
float pulse = sin(u_time * (0.5 + rnd));
float size = mix(0.15, 0.35, pulse);




    // Máscara del cuadrado
    float maskX = step(-size, cell.x) * step(cell.x, size);
    float maskY = step(-size, cell.y) * step(cell.y, size);
    float square = maskX * maskY;

vec3 base = vec3(square);

   


    float bigSize = 0.4;

    float bigX = step(-bigSize, uv.x) * step(uv.x, bigSize);
float bigY = step(-bigSize, uv.y) * step(uv.y, bigSize);
float bigSquare = bigX * bigY;

float grad = uv.y + 0.5 * sin(u_time * 0.6);
grad = smoothstep(-0.5, 0.5, grad);

float overlay = bigSquare * grad;
vec3 overlayColor = vec3(overlay);


// -------- CAPA SUPERIOR: cuadrados flotantes --------

float s = 0.08;

// posiciones animadas
vec2 pos1 = vec2(
    0.25 * sin(u_time * 0.6),
    0.25 * cos(u_time * 0.4)
);

vec2 pos2 = vec2(
    -0.3 * sin(u_time * 0.4 + 1.5),
     0.3 * cos(u_time * 0.3 + 2.0)
);

// cuadrado 1
float q1x = step(-s, uv.x - pos1.x) * step(uv.x - pos1.x, s);
float q1y = step(-s, uv.y - pos1.y) * step(uv.y - pos1.y, s);
float q1 = q1x * q1y;

// cuadrado 2
float q2x = step(-s, uv.x - pos2.x) * step(uv.x - pos2.x, s);
float q2y = step(-s, uv.y - pos2.y) * step(uv.y - pos2.y, s);
float q2 = q2x * q2y;

float topLayer = clamp(q1 + q2, 0.0, 1.0);
vec3 topColor = vec3(1.0);

vec3 color = mix(base, overlayColor, 0.4);
color = mix(color, topColor, topLayer);

    gl_FragColor = vec4(color, 1.0);
}
