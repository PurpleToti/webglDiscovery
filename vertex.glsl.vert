attribute vec3 a_position;

uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

varying vec3 v_normal;

void main() {
    vec4 world_pos = u_modelMatrix * vec4(a_position, 1.0);
    v_normal = normalize(vec3(world_pos.x, world_pos.y, world_pos.z));
    vec4 view_pos = u_viewMatrix * world_pos;
    vec4 clip_pos = u_projectionMatrix * view_pos;  
    gl_Position = clip_pos;
}