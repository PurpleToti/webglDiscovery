import { vec3 } from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/esm/index.js";

export class Mesh {
    constructor(vertices, triangles) {
        this.vertices = vertices;
        this.triangles = triangles;
    }
}

export class Sphere extends Mesh {
    static baseIcosphereVertices = [
        vec3.fromValues(0.8506508,  0.5257311, 0.0), 
        vec3.fromValues(0.0,        0.8506507, -0.525731),
        vec3.fromValues(0.0,        0.8506506,  0.525731),
        vec3.fromValues(0.5257309, -0.00000006, -0.85065067),
        vec3.fromValues(0.52573115,-0.00000006,  0.85065067),
        vec3.fromValues(0.8506508, -0.5257311,  0.0),
        vec3.fromValues(-0.52573115, 0.00000006, -0.85065067),
        vec3.fromValues(-0.8506508,  0.5257311,  0.0),
        vec3.fromValues(-0.5257309,  0.00000006,  0.85065067),
        vec3.fromValues(0.0,       -0.8506506,  -0.525731),
        vec3.fromValues(0.0,       -0.8506507,   0.525731),
        vec3.fromValues(-0.8506508, -0.5257311,  0.0)
    ];

    static baseIcosphereTriangles = [
         0,  1,  2,  0,  3,  1,  0,  2,  4,  3,  0,  5,  0,  4,  5,
         1,  3,  6,  1,  7,  2,  7,  1,  6,  4,  2,  8,  7,  8,  2,
         9,  3,  5,  6,  3,  9,  5,  4, 10,  4,  8, 10,  9,  5, 10,
         7,  6, 11,  7, 11,  8, 11,  6,  9,  8, 11, 10, 10, 11,  9
    ];

    constructor(radius = 1) {
        const scaledVertices = Sphere.baseIcosphereVertices.map(v => {
            const out = vec3.create();
            vec3.scale(out, v, radius);
            return out;
        });
        super(scaledVertices, Sphere.baseIcosphereTriangles);
        this.radius = radius;
    }
}
