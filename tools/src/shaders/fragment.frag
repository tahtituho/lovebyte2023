#version 400
uniform int m;
out vec4 FragColor;

const float PI = 3.14159265359;

float time = m / float(44100);
vec2 resolution = vec2(1280, 720);

float cameraFov = 0.75;

vec3 cameraPosition = vec3(0.0, 30.0, 60.0); 
vec3 cameraLookAt = vec3(0.0, 0.0, 0.0);

vec3 omniLightPosition = vec3(0.0, 10.0, 0.0);

const float RAY_MAX_STEPS = 64.0;
const float RAY_THRESHOLD = 0.001;
const float RAY_MAX_DISTANCE = 200.0;

//palette
const vec3 BLUE = vec3(0.09, 0.52, 0.97);
const vec3 PURPLE = vec3(0.24, 0.08, 0.30);
const vec3 BLACK = vec3(0.00, 0.00, 0.00);
const vec3 WHITE = vec3(1.00, 1.00, 1.00);

struct v2t {
    vec2 fr;
    vec2 sd;
};

struct v3t {
    vec3 fr;
    vec3 sd;
};

struct to {
    int dx;
    vec3 bc;
    vec3 offset;
    vec3 scale;
};

struct amo {
    vec3 color;
    float strength;
};

struct dio {
    vec3 color;
    float strength;
};

struct so {
    vec3 color;
    float strength;
    float shininess;
};

struct pl {
    vec3 position;
    vec3 color;
    float strength;
    float constant;
    float linear;
    float quadratic;
};

struct mt {
    amo ambient;
    dio diffuse;
    so specular;
    to texture;
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

en opSubtraction(en m1, en m2) {
    if(-m1.dist > m2.dist) {
        m1.dist *= -1.0;
        return m1;
    }
    else {
        return m2;
    }
    
}

en mBox(vec3 path, vec3 size, float r, float scale, mt mt) {
    en m;
    vec3 p1 = path / scale;
    vec3 d = abs(p1) - size;
    m.dist = (min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0)) - r) * scale;
    m.point = p1;
    m.mt = mt;
    return m;
}

en mTorus(vec3 path, vec2 size, float r, float scale, mt mt) {
    en m;
    vec3 p1 = path / scale;
    m.dist = (length(vec2(length(p1.xz) - size.x, p1.y)) - size.y) * scale;
    m.point = p1;
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
        ),
        so(
            vec3(0.25, 0.23, 0.77),
            0.0,
            0.0
        ),
        to(
            0,
            WHITE,
            vec3(1.0, 1.0, 1.0),
            vec3(1.0, 1.0, 1.0)
        )
    );

    v3t boxR = repeat(rotZ(rotY(path, time / 2), 3.2), vec3(3.5, 0.0, 3.5));
    vec3 sd = boxR.sd;
    float time2 = time * 10.0;
    float d = sin((sd.x + time2) / 10.0) * cos((sd.z + time2) / 5.0);
    //float d2 = sin((sd.x + time2) / 12.0) * cos((sd.z + time2) / 12.0);
    en boxes = mBox(
        rot(translate(boxR.fr, vec3(0.0, (sin(time) * 10.0) + d * 10.0, 0.0)), vec3((sin(time) * 4) * d)),
        vec3(1.0, 1.0, 1.0),
        0.15,
        1.0,
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
        ),
        so(
            vec3(0.25, 0.23, 0.77),
            0.0,
            0.0
        ),
        to(
            0,
            WHITE,
            vec3(1.0, 1.0, 1.0),
            vec3(1.0, 1.0, 1.0)
        )
    );
    en torus = mTorus(
        rot(path, vec3(time)), 
        vec2(16.0, 6.0),
        1,
        1.0, 
        torusM
    );
    en complete = opSmoothUnion(boxes, torus, 3.0, 0.1);
    return complete;
} 

vec3 calculatePointNormals(vec3 point, float threshold) {
    const vec2 k = vec2(1, -1);
    return normalize(
        k.xyy * scene(point + k.xyy * threshold, vec2(0)).dist + 
        k.yyx * scene(point + k.yyx * threshold, vec2(0)).dist + 
        k.yxy * scene(point + k.yxy * threshold, vec2(0)).dist + 
        k.xxx * scene(point + k.xxx * threshold, vec2(0)).dist
    );
}

hit raymarch(vec3 rayOrigin, vec3 rayDirection, vec2 uv) {
    hit h;
    int steps = 0;
    for(int i = 0; i <= RAY_MAX_STEPS; i++) {
        vec3 point = rayOrigin + rayDirection * h.dist;
        h.en = scene(point, uv);
        steps += 1;
        h.dist += h.en.dist;

        if(abs(h.en.dist) < RAY_THRESHOLD) {
            h.en.normal = calculatePointNormals(point, RAY_THRESHOLD);
            break;
        }
        if(h.dist > RAY_MAX_DISTANCE) {
            break;
        }
    }
    return h;
}

float attenuation(vec3 lightPosition, vec3 position, float constant, float linear, float quadratic) {
    float distance = length(lightPosition - position);
    float attenuation = 1.0 / (constant + linear * distance + quadratic * (distance * distance)); 
    return attenuation;
}

vec3 ambient(amo amo) {
    return amo.color * amo.strength;
} 

vec3 diffuse(vec3 normal, vec3 hit, vec3 lightDir, dio dio) {
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * dio.color * dio.strength;
    return diffuse;
}

vec3 specular(vec3 normal, vec3 hit, vec3 lightDir, vec3 eye, so so) {
    if (so.strength <= 0.0)
    {
        return vec3(0.0);
    }
    vec3 viewDir = normalize(eye - hit);
    vec3 halfwayDir = normalize(lightDir + viewDir);

    float spec = pow(max(dot(normal, halfwayDir), 0.0), so.shininess);
    vec3 specular = spec * so.strength * so.color;
    return specular;
} 

vec3 calculateOmniLight(vec3 normal, vec3 eye, vec3 lightPosition, vec3 hit, amo amo, dio dio, so so) {
    vec3 lightDir = normalize(lightPosition - hit);
    vec3 ambient = ambient(amo);
    vec3 diffuse = diffuse(normal, hit, lightDir, dio);
    vec3 specular = specular(normal, hit, lightDir, eye, so);

    vec3 lights = (ambient + diffuse + specular);
    return lights;
}

vec3 calculatePointLights(vec3 normal, vec3 eye, pl light, vec3 hit, float attenuation, dio dio, so so) {
    vec3 lightDir = normalize(light.position - hit);
    vec3 diffuse = diffuse(normal, hit, lightDir, dio);
    vec3 specular = specular(normal, hit, lightDir, eye, so);

    diffuse *= attenuation;
    specular *= attenuation;

    vec3 lights = (diffuse + specular) * (light.color * light.strength);
    return lights;
}

vec3 generateTexture(vec3 point, to to) {
    vec3 r = to.bc;
    vec3 p = (point / to.scale) + to.offset;

    return r;
}

vec4 processColor(hit h, vec3 rd, vec3 eye, vec2 uv) { 
    if(h.dist > RAY_MAX_DISTANCE) {
        return vec4(0.0, 0.0, 0.0, 1.0);
    }

    en en = h.en;
    mt em = en.mt;
    vec3 texture = generateTexture(en.point, em.texture);

    vec3 result = texture * (1.0 - smoothstep(0.0, RAY_MAX_DISTANCE, h.dist));
    vec3 normal = en.normal;
    vec3 lights = calculateOmniLight(normal, eye, omniLightPosition, en.point, em.ambient, em.diffuse, em.specular);     

    result *= lights;

    return vec4(vec3(result), 1.0);
}

vec4 drawMarching(vec2 uv) {
    vec3 forward = normalize(cameraLookAt - cameraPosition);   
    vec3 right = normalize(vec3(forward.z, 0.0, -forward.x));
    vec3 up = normalize(cross(forward, right)); 
    
    vec3 rayDirection = normalize(forward + cameraFov * uv.x * right + cameraFov * uv.y * up);
    hit marchHit = raymarch(cameraPosition, rayDirection, uv);
    return processColor(marchHit, rayDirection, cameraPosition, uv); 
}

void main() {
    float aspectRatio = resolution.x / resolution.y;
    vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    uv.x *= aspectRatio;
    FragColor = drawMarching(uv);
}
