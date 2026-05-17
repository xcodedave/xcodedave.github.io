# rust-gameboy

A WebGPU + Rust + WASM single-page app that renders a Game Boy with modern
physically-based shading: Cook-Torrance / GGX, multi-scatter energy
compensation, split-sum IBL from a real HDRI, a Filament-style clear coat
layer over the LCD perspex, soft contact shadow on a white page, Khronos
**PBR Neutral** tonemap, and orbit camera controls.

## Prerequisites

- Rust 1.78+ with the `wasm32-unknown-unknown` target  
  `rustup target add wasm32-unknown-unknown`
- `wasm-pack`  
  `cargo install wasm-pack`
- A static HTTP server (Python's built-in works fine)
- A WebGPU-capable browser:
  - Chrome / Edge 113+
  - Safari 18+ (or Safari Technology Preview)

## Build & run

```sh
./build.sh                 # wasm-pack build --target web --release → ./pkg
python3 -m http.server 8080
open http://127.0.0.1:8080/
```

For an iteration loop during development, `./build.sh dev` is much faster.

## Controls

| Input            | Action                  |
| ---------------- | ----------------------- |
| Mouse drag       | Orbit                   |
| Mouse wheel      | Zoom                    |
| One-finger drag  | Orbit (touch)           |
| Two-finger pinch | Zoom (touch)            |

## What's in here

Most of the interesting work is done **at build time** so the runtime can
fit in a single static page:

- **`build.rs`** — parses the OBJ, swizzles Z-up → Y-up, weld + cleans
  triangles, generates MikkTSpace tangents, traces 256-sample ambient
  occlusion against the body BVH, bakes a binary clear-coat UV mask for
  the LCD perspex region, runs a mip pyramid over every PBR map, and
  prebakes the HDR equirect into a `Rgba16Float` blob. All of these land
  in `OUT_DIR` and get `include_bytes!`'d into the wasm.
- **`src/shaders/mesh.wgsl`** — Cook-Torrance + Smith GGX, Schlick
  Fresnel, Fdez-Aguera multi-scatter compensation, split-sum IBL,
  Filament-style clear coat over the LCD region, Kaplanyan specular
  antialiasing, horizon + Lagarde specular occlusion, PCF 5×5 shadow
  sampling, Khronos PBR Neutral tonemap.
- **`src/ibl.rs`** — compute-shader irradiance / prefiltered cube /
  BRDF LUT bake at startup from the prebaked HDR equirect.
- **`src/shadow.rs`** — directional shadow map (2048² D32 once at
  startup; the scene is static), tight-fit ortho frustum from body AABB
  corners, soft contact-shadow disc on the white page with view-angle
  fade.

## Milestones

- [x] **M1** — Project scaffold; canvas clears via WebGPU.
- [x] **M2** — Orbit camera + reference cube.
- [x] **M3** — Build-time OBJ bake + MikkTSpace tangents.
- [x] **M4** — Texture upload + base color.
- [x] **M5** — Full PBR maps + Cook-Torrance direct lighting.
- [x] **M6** — HDR environment → split-sum IBL.
- [x] **M7** — Multi-scatter compensation + clear coat on the LCD.
- [x] **M8** — Directional shadow map + soft contact shadow.
- [x] **M9** — Khronos PBR Neutral tonemap.
- [x] **M10** — Touch input, perf pass, screenshots.

Side milestones along the way:

- [x] Build-time ambient-occlusion bake (BVH + 256-sample tracing).
- [x] Specular antialiasing (Kaplanyan / Filament).

## Screenshots

Stored in `screenshots/` (drag a render off the page and drop it there
to refresh).

## Asset attribution

The Game Boy mesh and textures live in
`../Yokoi/Assets/uploads_files_2642468_*` and ship into `./assets/` at build
time. They are not redistributed in this repo.
