import { mat4 } from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/esm/index.js";
import { Sphere } from "./geometry.js";

const canvas = document.getElementById("glcanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext("webgl");

// Create sphere
const sphere = new Sphere(1);
const vertices = new Float32Array(sphere.vertices.length * 3);
sphere.vertices.forEach((v, i) => {
    vertices[i*3 + 0] = v[0];
    vertices[i*3 + 1] = v[1];
    vertices[i*3 + 2] = v[2];
});
const indices  = new Uint16Array(sphere.triangles);

// ---- Buffers ----
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

// ---- Shaders ----
const vsSource = await (await fetch("vertex.glsl.vert")).text();
const fsSource = await (await fetch("fragment.glsl.frag")).text();

function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
    }
    return shader;
}

const program = gl.createProgram();
gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vsSource));
gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fsSource));
gl.linkProgram(program);
gl.useProgram(program);

// ---- Attributes ----
const posLoc = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(posLoc);
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

// ---- Uniform ----
const uMVP = gl.getUniformLocation(program, "u_modelViewProjection");

// ---- Enable depth ----
gl.enable(gl.DEPTH_TEST);
gl.clearColor(0, 0, 0, 1);

// ---- Render loop ----
function render(time) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Projection
    const projection = mat4.create();
    mat4.perspective(projection, Math.PI/4, canvas.width/canvas.height, 0.1, 100);

    // View
    const view = mat4.create();
    mat4.lookAt(view, [0,0,5], [0,0,0], [0,1,0]);

    // Model (rotate over time)
    const model = mat4.create();
    mat4.rotateY(model, model, time * 0.001);
    mat4.rotateX(model, model, time * 0.0007);

    // MVP
    const mvp = mat4.create();
    mat4.multiply(mvp, projection, view);
    mat4.multiply(mvp, mvp, model);

    gl.uniformMatrix4fv(uMVP, false, mvp);

    // Draw
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);
