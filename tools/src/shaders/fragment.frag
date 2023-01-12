
precision highp float;
uniform int m;
float t = float(m) / 44100.0;

struct en {
    float d;
    vec3 n;
    vec3 m;
};

struct ht {
    float d;
    en e;
};
vec2 uv;

vec3 rot(vec3 zp, vec3 a) {
    vec3 as = sin(a);
    vec3 ac = cos(a);
    vec3 yp = vec3(
        ac.z*zp.x-as.z*zp.y,
        as.z*zp.x+ac.z*zp.y,
        zp.z);
    vec3 xp = vec3(
        ac.y*yp.x+as.y*yp.z,
        yp.y,
        -as.y*yp.x+ac.y*yp.z
    );
    return vec3(
        xp.x,
        ac.x*xp.y-as.x*xp.z,
        as.x*xp.y+ac.x*xp.z
    );
}

en scene(vec3 path) {    
    vec3 size = vec3(75.0);
    vec3 pathR = rot(path, vec3(t / 2.0, t, -t));
    vec3 boxR = mod(pathR + size * 0.5, size) - size * 0.5;
    vec3 boxO = floor((pathR + size * 0.5) / size);
    en cubes;
   
    vec3 d = abs(rot(boxR, vec3(boxO) + t * 2.0) + length(sin((uv.xy + t) * 13.0))) - vec3(10.0);
    cubes.d = (min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0)) - 0.3);
    cubes.m = abs(boxO);
    return cubes;
} 

ht raymarch(vec3 rd) {
    ht h;
    for(int i = 0; i <= 64; i++) {
        vec3 p = vec3(0.0, 30.0, 50.0) + rd * h.d;
        h.e = scene(p);
        h.d += h.e.d;
        if(abs(h.e.d) < 0.001) {
            vec2 e = vec2(0.001, 0);
            h.e.n = normalize(
                vec3(scene(p + e.xyy).d - h.e.d,
                     scene(p + e.yxy).d - h.e.d,
                     scene(p + e.yyx).d - h.e.d
            ));
            break;
        } 
    }
    return h;
}

void main() {
    vec2 resolution = vec2(1280, 720);
    uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;
    ht h = raymarch(normalize(vec3(0.0, -0.5145, -0.8575) + uv.x * vec3(-0.75, 0.0, 0.0) + 0.75 * uv.y * vec3(0.0, 0.8575, -0.5145)));
    gl_FragColor = vec4(vec3((1.0 - smoothstep(0.0, 300.0, h.d))) * (h.e.m * 0.5 + max(dot(h.e.n, vec3(0.0, 1.0, 0.1)), 0.0)), 1.0); 
}
