
precision highp float;
uniform int m;
float t = float(m) / 44100.0;

float d;
vec3 mt;
vec3 n;
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

float scene(vec3 path) {    
    vec3 size = vec3(75.0);
    vec3 pathR = rot(path, vec3(t / 2.0, t, -t));
    vec3 boxR = mod(pathR + size * 0.5, size) - size * 0.5;
    vec3 boxO = floor((pathR + size * 0.5) / size);
    vec3 d2 = abs(rot(boxR, vec3(boxO) + t * 2.0) + length(sin((uv.xy + t) * 13.0))) - vec3(10.0);
    mt = abs(boxO);
    return (min(max(d2.x, max(d2.y, d2.z)), 0.0) + length(max(d2, 0.0)) - 2.0);
}

void main() {
    vec2 resolution = vec2(1280, 720);
    uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;
        for(int i = 0; i <= 64; i++) {
        vec3 p = vec3(0.0, 30.0, 50.0) + normalize(vec3(0.0, -0.5145, -0.8575) + uv.x * vec3(-0.75, 0.0, 0.0) + uv.y * vec3(0.0, 0.6443, -0.3859)) * d;
        float k = scene(p);
        d += k;
        if(k < 0.001) {
            vec2 e = vec2(0.001, 0);
            n = normalize(
                vec3(scene(p + e.xyy) - k,
                     scene(p + e.yxy) - k,
                     scene(p + e.yyx) - k
            ));
            break;
        } 
    }
    gl_FragColor = vec4(vec3(smoothstep(300.0, 0.0, d)) * (mt * 0.5 + max(dot(n, vec3(0.0, 1.0, 0.1)), 0.0)), 1.0); 
}
