#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vUv;

float rect(in vec2 st, in vec2 size){
	size = 0.25-size*0.25;
    vec2 uv = smoothstep(size,size+size*vec2(0.001),st*(1.0-st));
	return uv.x*uv.y;
}

void main(){

        vec2 st = vUv;

float aspect = u_resolution.x/u_resolution.y;
vec2 uv = st -0.5;
    uv.x *= aspect;
    uv += 0.5;

  float cycleDuration = 3.0; 
    float t = mod(u_time * 0.3, cycleDuration);
    
    // Primer rectángulo (rojo): crece de 0 a 1 seg y PARA
    float growth1 = clamp(t, 0.0, 1.0);
    
    // Segundo rectángulo (blanco): empieza después de 1 seg
    float growth2 = clamp(t - 1.0, 0.0, 1.0);
    float growth3 = clamp(t - 2.0, 0.0, 1.0);
     if (t >= 3.0 - 0.01) {
        growth3 = 1.0; 
    }
    
    vec3 rojo = vec3(1.0, 0.0, 0.0);
    vec3 blanco = vec3(1.0);
    vec3 negro = vec3(0.0);

    vec3 color = mix(blanco, negro, step(0.5, uv.x));
    
    // Primer rectángulo (rojo) - centro abajo
    color = mix(color, rojo, 
                rect(uv - vec2(0.0, -0.25), vec2(growth1, 0.5)));
    
    // Segundo rectángulo (blanco) - esquina superior izquierda
    // Invertimos las coordenadas Y para que empiece desde arriba
    vec2 st_invertido = vec2(uv.x+0.5, 1.0 - uv.y);
    color = mix(color, blanco, 
                rect(st_invertido - vec2(0.0, 0.0), vec2(0.5, growth2)));
                 vec2 st_invertido2 = vec2(uv.x-0.5, 1.0 - uv.y);
    color = mix(color, negro, 
                rect(st_invertido2 - vec2(0.0, 0.0), vec2(0.5, growth3)));

    gl_FragColor = vec4(color, 1.0);
}