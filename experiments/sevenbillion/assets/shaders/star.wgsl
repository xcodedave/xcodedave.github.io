struct Uniforms {
    mvp: mat4x4<f32>,
    normal_col0: vec4<f32>,
    normal_col1: vec4<f32>,
    normal_col2: vec4<f32>,
};

@group(0) @binding(0) var<uniform> u: Uniforms;

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) color: vec4<f32>,
};

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) frag_color: vec4<f32>,
    @location(1) fog: f32,
};

@vertex
fn vs_main(in: VertexInput) -> VertexOutput {
    var out: VertexOutput;

    let normal_matrix = mat3x3<f32>(
        u.normal_col0.xyz,
        u.normal_col1.xyz,
        u.normal_col2.xyz,
    );

    let world_normal = normalize(in.normal * normal_matrix) * -1.0;
    out.clip_position = u.mvp * vec4<f32>(in.position, 1.0);

    // Fog based on clip-space depth
    var fog = out.clip_position.z * 0.0058;
    fog = fog * fog * fog;
    fog = clamp(fog, 0.0, 1.0);
    out.fog = fog;

    let light_dir = vec3<f32>(0.0, 0.0, -1.0);
    let diffuse = max(dot(light_dir, world_normal), 0.0) + 0.2;

    out.frag_color = vec4<f32>(in.color.rgb * diffuse, in.color.a);
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    return mix(in.frag_color, vec4<f32>(0.0, 0.0, 0.0, 1.0), in.fog);
}
