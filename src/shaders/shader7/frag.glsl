#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

uniform vec2 u_mouse;

uniform float u_time;




float random(float seed) {
    return fract(sin(seed) * 43758.5453123);
}


void main(){
 vec2 st = gl_FragCoord.xy/u_resolution.xy;
 
 
vec3 color = vec3(0.0);

vec3 pct = vec3(st.y);

float speed = 0.5;
float pulse = abs(sin(u_time *speed));

//fondo
vec3 color1 = vec3(0.0, 0.0, 0.0);

//cuadrado
vec3 color2 = vec3(random(u_time),
        random(u_time + 1.0),
        random(u_time + 2.0));

color = vec3(mix(color1,color2, step(0.5,st.x)));
  
gl_FragColor = vec4(color2, 1.0);

}