#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// Signed Distance Function (SDF) for a sphere
float sphereSDF(vec3 p, float r) {
    return length(p) - r;
}

// Raymarching function
float raymarch(vec3 ro, vec3 rd) {
    float t = 0.0;             // distance traveled along ray
    for (int i = 0; i < 64; i++) {  // 64 steps max
        vec3 p = ro + rd * t;      // current point along ray
        float d = sphereSDF(p, 1.0); // distance to sphere of radius 1
        if (d < 0.001) return t;   // hit threshold
        t += d;                    // move forward
        if (t > 20.0) break;       // escape (too far)
    }
    return -1.0; // no hit
}

// Estimate normal from SDF (numerical gradient)
vec3 getNormal(vec3 p) {
    float eps = 0.001;
    return normalize(vec3(
        sphereSDF(p + vec3(eps,0.0,0.0), 1.0) - sphereSDF(p - vec3(eps,0.0,0.0), 1.0),
        sphereSDF(p + vec3(0.0,eps,0.0), 1.0) - sphereSDF(p - vec3(0.0,eps,0.0), 1.0),
        sphereSDF(p + vec3(0.0,0.0,eps), 1.0) - sphereSDF(p - vec3(0.0,0.0,eps), 1.0)
    ));
}

void main() {
    // Normalized pixel coordinates (-1 to 1)
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

    // Camera setup
    vec3 ro = vec3(0.0, 0.0, 3.0); // ray origin (camera at z=3)
    vec3 rd = normalize(vec3(uv, -1.0)); // ray direction

    // March ray
    float t = raymarch(ro, rd);
    vec3 col;

    if (t > 0.0) {
        // Hit: compute position & normal
        vec3 p = ro + rd * t;
        vec3 n = getNormal(p);

        // Light setup
        vec3 lightDir = normalize(vec3(
            cos(u_time) * 0.5,
            0.8,
            sin(u_time) * 0.5 + 1.0
        ));
        float diff = max(dot(n, lightDir), 0.0);
        float ambient = 0.02; // base brightness
        col = vec3(0.2, 0.4, 1.0) * (ambient + diff);
    } else {
        // Miss: background
        col = vec3(0.0);
    }

    gl_FragColor = vec4(col, 1.0);
}
