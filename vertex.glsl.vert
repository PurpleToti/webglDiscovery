attribute vec3 a_position;
uniform mat4 u_modelViewProjection;

varying vec3 v_normal;

void main() {
    vec4 clip_pos = u_modelViewProjection * vec4(a_position, 1.0);  
    gl_Position = clip_pos;
    v_normal = normalize(a_position);
}