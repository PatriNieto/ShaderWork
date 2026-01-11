#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;  // Canvas size (width,height)
uniform vec2 u_mouse;       // mouse position in screen pixels
uniform float u_time;       // Time in seconds since load

vec3 red(){
    return vec3(1.0,0.0,0.0);
}



  


void main() {
    
    vec2 st = gl_FragCoord.xy/u_resolution;
    float y = st.y;
    //n horizontal float y = st.x;

    vec3 colorA =red();
    vec3 colorB = vec3(0.0,1.0,0.0);

    //para suavizar el degradado
    float t = smoothstep(0.0, 1.0, y + 0.91 * sin(u_time));
    vec3 color = mix(colorA, colorB, t);

   
   
    gl_FragColor = vec4(color, 1.0);
}
