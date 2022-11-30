#version 400
uniform int m;
out vec4 FragColor;

const float PI = 3.14159265359;

float time = m / float(44100);
vec2 resolution = vec2(1280, 720);

struct v2t {
    vec2 fr;
    vec2 sd;
};

struct v3t {
    vec3 fr;
    vec3 sd;
};

struct amo {
    vec3 color;
    float strength;
};

struct dio {
    vec3 color;
    float strength;
};

struct mt {
    amo ambient;
    dio diffuse;
};

struct en {
    float dist;
    vec3 point;
    vec3 normal;
    mt mt;
};

struct hit {
    float dist;
    en en;
};

float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h);
}

en opSmoothUnion(en m1, en m2, float k, float threshold) {
    float h = opSmoothUnion(m1.dist, m2.dist, k);
    if (smoothstep(m1.dist, m2.dist, h + threshold) > 0.5) {
        m2.dist = h;
        return m2;
    }
    else {
        m1.dist = h;
        return m1;
    }
}

vec3 rotX(vec3 p, float a) {
    float s = sin(a);
    float c = cos(a);
    return vec3(
        p.x,
        c*p.y-s*p.z,
        s*p.y+c*p.z
    );
}

vec3 rotY(vec3 p, float a) {
    float s = sin(a);
    float c = cos(a);
    return vec3(
        c*p.x+s*p.z,
        p.y,
        -s*p.x+c*p.z
    );
}
 
vec3 rotZ(vec3 p, float a) {
    float s = sin(a);
    float c = cos(a);
    return vec3(
        c*p.x-s*p.y,
        s*p.x+c*p.y,
        p.z
    );
}

vec3 rot(vec3 p, vec3 a) {
    return rotX(rotY(rotZ(p, a.z), a.y), a.x);
}

vec3 translate(vec3 p, vec3 p1) {
    return p + (p1 * -1.0);
}

v3t repeat(vec3 p, vec3 size) {
    return v3t(mod(p + size * 0.5, size) - size * 0.5, floor((p + size * 0.5 ) / size));
}

en opUnion(en m1, en m2) {
    return m1.dist < m2.dist ? m1 : m2;
}

en mBox(vec3 path, vec3 size, float r, mt mt) {
    en m;
    vec3 d = abs(path) - size;
    m.dist = (min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0)) - r);
    m.point = path;
    m.mt = mt;
    return m;
}

en mTorus(vec3 path, vec2 size, mt mt) {
    en m;
    m.dist = (length(vec2(length(path.xz) - size.x, path.y)) - size.y);
    m.point = path;
    m.mt = mt;
    return m;
}

en scene(vec3 path, vec2 uv) {    
    mt boxesM = mt(
        amo(
            vec3(0.01, 0, 0.17),
            2.5
        ),
        dio(
            vec3(0.25, 0.73, 0.77),
            0.5
        )
    );

    v3t boxR = repeat(rotZ(rotY(path, time / 2.0), 3.2), vec3(3.5, 0.0, 3.5));
    vec3 sd = boxR.sd;
    float time2 = time * 10.0;
    float d = sin((sd.x + time2) / 10.0) * cos((sd.z + time2) / 5.0);
    en boxes = mBox(
        rot(translate(boxR.fr, vec3(0.0, (sin(time) * 10.0) + d * 10.0, 0.0)), vec3((sin(time) * 4) * d)),
        vec3(1.0, 1.0, 1.0),
        0.15,
        boxesM
    );

    mt torusM = mt(
        amo(
            vec3(0.55, 0.07, 0.59),
            1.0
        ),
        dio(
            vec3(1, 0.99, 0),
            1.0
        )
    );
    vec3 tTor = rot(path, vec3(-time));
    en torus1 = mTorus(
        translate(tTor, vec3(8.0, 0.0, 0.0)), 
        vec2(16.0, 5.0),
        torusM
    );
     en torus2 = mTorus(
        translate(rotX(tTor, PI / 2), vec3(-8.0, 0.0, 0.0)), 
        vec2(16.0, 5.0),
        torusM
    );
    en complete = opSmoothUnion(boxes, opUnion(torus1, torus2), 1.5, 0.0);
    return complete;
} 

vec3 calculatePointNormals(vec3 point) {
    const vec2 k = vec2(1, -1);
    return normalize(
        k.xyy * scene(point + k.xyy * 0.001, vec2(0)).dist + 
        k.yyx * scene(point + k.yyx * 0.001, vec2(0)).dist + 
        k.yxy * scene(point + k.yxy * 0.001, vec2(0)).dist + 
        k.xxx * scene(point + k.xxx * 0.001, vec2(0)).dist
    );
}

hit raymarch(vec3 rayOrigin, vec3 rayDirection, vec2 uv) {
    hit h;
    int steps = 0;
    for(int i = 0; i <= 64; i++) {
        vec3 point = rayOrigin + rayDirection * h.dist;
        h.en = scene(point, uv);
        h.dist += h.en.dist;

        if(abs(h.en.dist) < 0.001) {
            h.en.normal = calculatePointNormals(point);
            break;
        } 
    }
    return h;
}

vec3 calculateOmniLight(vec3 normal, hit hit) {
    vec3 ambient = hit.en.mt.ambient.color * hit.en.mt.ambient.strength;
    float diff = max(dot(normal, normalize(vec3(0.0, 10.0, 0.0) - hit.en.point)), 0.0);
    vec3 diffuse = diff * hit.en.mt.diffuse.color * hit.en.mt.diffuse.strength;
    return (ambient + diffuse);
}

vec4 processColor(hit h, vec3 rd) { 
    if(h.dist > 200.0) {
        return vec4(0.0, 0.0, 0.0, 1.0);
    }

    vec3 result = vec3((1.0 - smoothstep(0.0, 200.0, h.dist))) * calculateOmniLight(h.en.normal, h);

    return vec4(vec3(result), 1.0);
}

vec4 drawMarching(vec2 uv) {
    vec3 forward = normalize(vec3(0.0) - vec3(0.0, 30.0, 60.0));   
    vec3 right = normalize(vec3(forward.z, 0.0, -forward.x));
    vec3 up = normalize(cross(forward, right)); 
    
    vec3 rayDirection = normalize(forward + 0.75 * uv.x * right + 0.75 * uv.y * up);
    hit marchHit = raymarch(vec3(0.0, 30.0, 60.0), rayDirection, uv);
    return processColor(marchHit, rayDirection); 
}

void main() {
    float aspectRatio = resolution.x / resolution.y;
    vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    uv.x *= aspectRatio;
    FragColor = drawMarching(uv);
}
