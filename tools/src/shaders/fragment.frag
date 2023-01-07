
precision highp float;
uniform int m;
float time = float(m) / 44100.0;

struct v3 {
    vec3 fr;
    vec3 sd;
};

struct en {
    float d;
    vec3 po;
    vec3 n;
    vec4 m1;
    vec4 m2;
};

struct ht {
    float d;
    en en;
};
vec2 uv;

vec3 rot(vec3 zp, vec3 a) {
    float zs = sin(a.z);
    float zc = cos(a.z);
    vec3 yp = vec3(
        zc*zp.x-zs*zp.y,
        zs*zp.x+zc*zp.y,
        zp.z);
    float ys = sin(a.y);
    float yc = cos(a.y);
    vec3 xp = vec3(
        yc*yp.x+ys*yp.z,
        yp.y,
        -ys*yp.x+yc*yp.z
    );
    float xs = sin(a.x);
    float xc = cos(a.x);
    return vec3(
        xp.x,
        xc*xp.y-xs*xp.z,
        xs*xp.y+xc*xp.z
    );
}

v3 repeat(vec3 p, vec3 size) {
    return v3(mod(p + size * 0.5, size) - size * 0.5, floor((p + size * 0.5) / size));
}

en scene(vec3 path) {    
    v3 boxR = repeat(rot(path, vec3(time / 2.0, time, -time)), vec3(75.0));
    en cubes;
    vec3 d = abs(rot(boxR.fr, vec3(boxR.sd) + time * 2.0) + length(sin((uv.xy + time) * 13.0))) - vec3(10.0);
    cubes.d = (min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0)) - 0.3);
    cubes.m1 = vec4(abs(boxR.sd.xyz), 0.05);
    cubes.m2 = vec4(vec3(1.0), 0.1);
    return cubes;
} 

ht raymarch(vec3 rd) {
    ht h;
    for(int i = 0; i <= 64; i++) {
        vec3 p = vec3(0.0, 30.0, 50.0) + rd * h.d;
        h.en = scene(p);
        h.d += h.en.d;

        if(abs(h.en.d) < 0.001) {
            vec2 h2 = vec2(0.0001, 0);
            h.en.n = normalize(
                vec3(scene(p + h2.xyy).d - scene(p - h2.xyy).d,
                     scene(p + h2.yxy).d - scene(p - h2.yxy).d,
                     scene(p + h2.yyx).d - scene(p - h2.yyx).d
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
    gl_FragColor = vec4(vec3((1.0 - smoothstep(0.0, 300.0, h.d))) * (h.en.m1.rgb * h.en.m1.a * 10.0 + max(dot(h.en.n, normalize(vec3(0.0, 100.0, 10.0) - h.en.po)), 0.0) * h.en.m2.rgb * h.en.m2.a * 10.0), 1.0); 
}
