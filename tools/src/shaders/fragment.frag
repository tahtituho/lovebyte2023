
precision highp float;
uniform int m;
float time = float(m) / 44100.0;

struct v3t {
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

struct hit {
    float d;
    en en;
};
vec2 uv;

en opSmoothUnion(en m1, en m2, float k, float threshold) {
    float a = clamp(0.5 + 0.5 * (m2.d - m1.d) / k, 0.0, 1.0);
    float h = mix(m2.d, m1.d, a) - k * a * (1.0 - a);
    if (smoothstep(m1.d, m2.d, h + threshold) > 0.5) {
        m2.d = h;
        return m2;
    }
    else {
        m1.d = h;
        return m1;
    }
}

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

v3t repeat(vec3 p, vec3 size) {
    return v3t(mod(p + size * 0.5, size) - size * 0.5, floor((p + size * 0.5) / size));
}

en mBox(vec3 path, vec3 size, vec4 m1, vec4 m2) {
    en m;
    vec3 d = abs(path) - size;
    m.d = (min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0)) - 0.3);
    m.m1 = m1;
    m.m2 = m2;
    return m;
}

en scene(vec3 path) {    
    float time3 = time / 2.0;
    v3t boxR = repeat(rot(path, vec3(0.0, time3, 3.2)), vec3(3.5, 0.0, 3.5));
    float time2 = time * 10.0;
    
    float d = sin((boxR.sd.x + time2) / 10.0) * cos((boxR.sd.z + time2) / 5.0);
    en boxes = mBox(
        rot(boxR.fr + (vec3(0.0, (sin(time) * 10.0) + d * 10.0 + 25.0, 0.0) * -1.0), vec3((sin(time) * 4.0) * d)),
        vec3(1.0),
        vec4(0.01, 0.0, 0.17, 0.25),
        vec4(0.95, 0.73, 0.77, 0.05)
    );

    boxR = repeat(rot(path, vec3(time3, time, -time)), vec3(75.0));
    en buildings = mBox(
        rot(boxR.fr, vec3(boxR.sd) + time) + length(sin((uv.xy + time) * 13.0)),
        vec3(10.0),
        vec4(abs(boxR.sd.xyz), 0.05),
        vec4(vec3(1.0), 0.05)
    );
    return opSmoothUnion(boxes, buildings, 10.0, 0.0);
} 

vec3 calculatePointNormals(vec3 point) {
    vec3 k = vec3(1, -1, 0.001);
    return normalize(
        k.xyy * scene(point + k.xyy * k.z).d + 
        k.yyx * scene(point + k.yyx * k.z).d + 
        k.yxy * scene(point + k.yxy * k.z).d + 
        k.xxx * scene(point + k.xxx * k.z).d
    );
}

hit raymarch(vec3 rayDirection) {
    hit h;
    for(int i = 0; i <= 64; i++) {
        vec3 point = vec3(0.0, 30.0, 50.0) + rayDirection * h.d;
        h.en = scene(point);
        h.d += h.en.d;

        if(abs(h.en.d) < 0.001) {
            h.en.n = calculatePointNormals(point);
            break;
        } 
    }
    return h;
}

void main() {
    vec2 resolution = vec2(1280, 720);
    uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;
    hit h = raymarch(normalize(vec3(0.0, -0.5145, -0.8575) + uv.x * vec3(-0.75, 0.0, 0.0) + 0.75 * uv.y * vec3(0.0, 0.8575, -0.5145)));
    vec3 ambient = h.en.m1.rgb * h.en.m1.a * 10.0;
    float diff = max(dot(h.en.n, normalize(vec3(0.0, 100.0, 10.0) - h.en.po)), 0.0);
    vec3 diffuse = diff * h.en.m2.rgb * h.en.m2.a * 10.0;
    vec3 result = vec3((1.0 - smoothstep(0.0, 300.0, h.d))) * (ambient + diffuse);
    gl_FragColor = vec4(result, 1.0); 
}
