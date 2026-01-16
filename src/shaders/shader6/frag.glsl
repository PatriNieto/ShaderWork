#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main(){


   const vec3 chakras[7] = vec3[7](
    vec3(0.776, 0.157, 0.157), // Raíz
    vec3(0.937, 0.424, 0.0),   // Sacro
    vec3(0.984, 0.753, 0.176), // Plexo Solar
    vec3(0.180, 0.490, 0.196), // Corazón
    vec3(0.082, 0.396, 0.753), // Garganta
    vec3(0.157, 0.208, 0.584), // Tercer Ojo
    vec3(0.416, 0.106, 0.604)  // Corona
   );

   float t = mod(u_time * 0.2, 7.0);

   //indice 
   int i = int(t);


    // Interpolación
    vec3 color = mix(chakras[i], chakras[(i + 1)%7], fract(t));

    gl_FragColor = vec4(color, 1.0);
}