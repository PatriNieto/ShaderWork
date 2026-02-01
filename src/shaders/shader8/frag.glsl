#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

uniform vec2 u_mouse;

uniform float u_time;

varying vec2 vUv;


float rect(in vec2 st, in vec2 size){
  //st Coordenadas normalizadas del píxel (de 0 a 1 en x e y)
	size = 0.25-size*0.25;
   vec2 uv = smoothstep(size,size+size*vec2(0.7),st*(1.0-st));
	return uv.x*uv.y;
}

float random(float seed) {
    return fract(sin(seed) * 43758.5453123);
}

vec3 randomColor(float seed) {
    return vec3(
        random(seed),
        random(seed + 1.0),
        random(seed + 2.0)
    );
}


void main(){

 vec2 st = vUv;
float delay = 2.0;
  
 
vec3 color = vec3(0.0);

vec3 pct = vec3(st.y);

float speed = 0.5;
float pulse = abs(sin(u_time *speed));

  // Cambia de color cada vez que pulse vuelve a 0
    // floor() crea un índice que incrementa en cada ciclo completo
    float colorIndex = floor((u_time * speed + 1.5708) / 3.14159); // Divide por PI para contar ciclos completos
    

//fondo
vec3 color1 = vec3(0.0, 0.0, 0.0);

//cuadrado
vec3 color2 = randomColor(colorIndex);

color = vec3(mix(color1,color2, step(pulse,st.x)));
  
gl_FragColor = vec4(color, 1.0);

}