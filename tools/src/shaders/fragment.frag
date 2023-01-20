
precision lowp float;
uniform int m;
float t = float(m) / 44100.0;

float d;
vec3 mt;
vec3 n;
vec2 uv;
vec2 resolution = vec2(1280, 720);
vec3 rot(vec3 zp, vec3 a) {
    vec3 as = sin(a);
    vec3 ac = cos(a);
    zp = vec3(
        ac.z*zp.x-as.z*zp.y,
        as.z*zp.x+ac.z*zp.y,
        zp.z);
    zp = vec3(
        ac.y*zp.x+as.y*zp.z,
        zp.y,
        -as.y*zp.x+ac.y*zp.z
    );
    return vec3(
        zp.x,
        ac.x*zp.y-as.x*zp.z,
        as.x*zp.y+ac.x*zp.z
    );
}

float scene(vec3 path) {    
    vec3 size = vec3(75.0);
    path = rot(path, vec3(t / 2.0, t, -t));
    vec3 boxO = floor((path + size * 0.5) / size);
    mt = abs(boxO + sin(t));
    boxO = abs(rot(mod(path + size * 0.5, size) - size * 0.5, vec3(boxO) + t * 2.0) + length(sin((uv.xy + t) * 13.0))) - vec3(10.0);
    return (min(max(boxO.x, max(boxO.y, boxO.z)), 0.0) + length(max(boxO, 0.0)) - 2.0);
}

void main() {
    uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;
    for(int i = 0; i <= 64; i++) {
        n = vec3(25.0,  t * 8.0, t * 3.0) + normalize(vec3(0.0, -0.5145, -0.8575) + uv.x * vec3(-0.75, 0.0, 0.0) + uv.y * vec3(0.0, 0.6443, -0.3859)) * d;
        float k = scene(n);
        d += k;
        vec2 e = vec2(0.001, 0);
        n = normalize(
            vec3(scene(n + e.xyy) - k,
                 scene(n + e.yxy) - k,
                 scene(n + e.yyx) - k
        ));
    }
    gl_FragColor = vec4(vec3(smoothstep(300.0, 0.0, d)) * (mt * max(dot(n, vec3(0.0, 1.0, 0.1)), 0.0)), 1.0); 
}
