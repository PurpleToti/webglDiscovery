attribute vec4 a_position;

void main() {
    // Minimal vertex shader: pass through positions
    gl_Position = a_position;
}
