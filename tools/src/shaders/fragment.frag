
precision lowp float;
uniform int m;
float t = float(m) / 44100.0 / 2.0;

float d;
float mt;
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
    );;
}

float scene(vec3 path) {    
    path += sin(rot(path, vec3(t)) * 2.0) * 0.08;
    path = rot(path, vec3(-t));
    mt = length(tan(path * 20.0) / 4.0);
    return (abs(dot(sin(path), cos(path.zxy)) - 2.8) - 1.8);
}

void main() {
    uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;
    for(int i = 0; i <= 64; i++) {
        n = vec3(t / 6.2) + normalize(vec3(0.0, -0.5145, -0.8575) + uv.x * vec3(-0.75, 0.0, 0.0) + uv.y * vec3(0.0, 0.6443, -0.3859)) * d;
        float k = scene(n);
        d += k;
        vec2 e = vec2(0.1, 0.0);
        n = normalize(
            vec3(scene(n + e.xyy) - k,
                 scene(n + e.yxy) - k,
                 scene(n + e.yyx) - k
        ));
       
    }

    gl_FragColor = vec4(vec3(smoothstep(25.0, 0.0, d)) * (mt * n * max(dot(n, vec3(0.0, 1.0, 1.0)), 0.0)), 1.0); 
}
