precision mediump float;

varying vec3 v_normal;

void main() {
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0)); // simple directional light
    float diff = max(dot(v_normal, lightDir), 0.0); // Lambertian shading
    vec3 baseColor = vec3(0.2, 0.6, 1.0);          // your sphere color
    vec3 color = baseColor * diff + baseColor * 0.1; // add small ambient
    gl_FragColor = vec4(color, 1.0);
}