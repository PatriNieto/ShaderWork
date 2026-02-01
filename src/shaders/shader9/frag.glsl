#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;



void main(){
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    

    const vec3 negro = vec3(0.0);
    const vec3 blanco = vec3(1.0);
    const vec3 rojo = vec3(0.788, 0.027, 0.0);
    const vec3 amarillo = vec3(1.0, 1.0, 0.0);
    const vec3 azul =vec3(0.024, 0.055, 0.541);
    
    float s1 = step(0.1, st.y);
    float s5 = step(0.5, st.y);
    float s7 = step(0.7, st.y);
    float s78 = step(0.78, st.x);
    float s8 = step(0.8, st.x);
    float s9 = step(0.9, st.y);
 
    vec3 color1 = mix(negro, rojo,step(0.15, st.y) );
    vec3 color2 = mix(blanco, color1,step(0.10, st.y) );
    vec3 color3 = mix(negro, color2,step(0.15, st.y) );
    vec3 color4 = mix(blanco, color2,step(0.1, st.y) );

    vec3 colorDcha = mix(color4, color3,step(0.1, st.y) );

    vec3 color5 = mix(negro, amarillo,step(0.550, st.y) );
    vec3 color6 = mix(blanco, color5,step(0.50, st.y) );
    vec3 color7 = mix(negro, color6,step(0.15, st.y) );
    vec3 color8 = mix(azul, color7,step(0.1, st.y) );


    vec3 colorIzqda = mix(color8, color7,step(0.1, st.y) );


    vec3 colorA = mix(negro, colorDcha,step(0.45, st.x) );
    vec3 colorB = mix(negro, colorIzqda,step(0.05, st.x) );
    vec3 color = mix(colorB, colorA,step(0.4, st.x));

    
    gl_FragColor = vec4(color, 1.0);
}