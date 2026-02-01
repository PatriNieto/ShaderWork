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
//corregimos el rango de -1,1 a 0,1
float pulse = 0.5 + 0.5 * sin(u_time * 30.0);
    vec3 influenced = vec3(0.0,0.0,0.0);
    vec3 influence1=vec3(1.0,0.0,0.0);
    vec3 influence2=vec3(0.0,0.0,1.0);

    vec3 colorA = mix(influenced, influence1, pulse);
    vec3 colorB = mix(influence2, influenced, pulse);

    vec3 color = mix(
        colorA, colorB, step(.5,st.x)
    );

    gl_FragColor = vec4(color, 1.0);
}