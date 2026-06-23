/* tslint:disable */
/* eslint-disable */

/**
 * The main engine that owns all game state and produces ASCII frames.
 *
 * Created once from JavaScript via `new Engine(width, height)`, then driven
 * each animation frame by calling `update(dt)` which returns the rendered
 * ASCII string.
 */
export class Engine {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Disables surface-id capture. Existing tagged cells stay until the next
     * `clear_with` (start of next frame).
     */
    disable_surface_id_capture(): void;
    /**
     * Test/debug: turns on per-cell surface-id capture. Each depth-winning
     * triangle fill writes the global triangle index into a parallel buffer,
     * so tests can identify exactly which triangle painted any cell.
     * Cleared automatically by `clear_with` at the start of each frame; the
     * `surface_id_base` toggle persists until disabled.
     */
    enable_surface_id_capture(): void;
    get_far_bias(): number;
    get_near_bias(): number;
    /**
     * Returns a compact state string encoding player position, camera, weather, and viewport.
     * Format: "px,pz,yaw,cyaw,cpitch,torch,rain,cols,rows" as comma-separated values.
     * Viewport dims (cols/rows) are included for diagnostic/testing purposes — the
     * loader (`set_state`) does NOT consume them.
     */
    get_state(): string;
    get_tomb_debug_rooms(): boolean;
    /**
     * Returns true if the figure is currently moving.
     */
    is_moving(): boolean;
    /**
     * Handles a key-down event from JavaScript.
     * WASD/arrows move the stick figure; Q/E orbit the camera; T toggles the torch.
     */
    key_down(key: string): void;
    /**
     * Handles a key-up event from JavaScript, clearing the corresponding movement flag.
     */
    key_up(key: string): void;
    /**
     * Creates a new engine with the given character-grid dimensions.
     *
     * `width` and `height` are measured in character cells, not pixels.
     * The aspect ratio is corrected for monospace characters being ~2x taller
     * than they are wide.
     */
    constructor(width: number, height: number);
    /**
     * Resizes the character grid without resetting game state.
     */
    resize(width: number, height: number): void;
    /**
     * Test/debug toggle: when true, edges always paint regardless of the depth
     * buffer. Used for the staircase-occlusion exploration test.
     */
    set_edges_force_visible(v: boolean): void;
    set_far_bias(val: number): void;
    /**
     * Sets the camera field of view in degrees.
     */
    set_fov(degrees: number): void;
    set_near_bias(val: number): void;
    /**
     * Sets the spawn position without marking as walked.
     * Used for random start — preserves "HOW DID I GET HERE?" speech and
     * delays rain/ambience until the player first moves.
     */
    set_spawn(px: number, pz: number, yaw: number, cam_yaw: number): void;
    /**
     * Restores state from a compact state string.
     */
    set_state(state: string): void;
    /**
     * Toggles per-room debug edge rendering inside the tomb. When enabled,
     * each room's silhouette edges draw as a unique digit ('0'–'9') so it's
     * visually obvious which polygons belong to which room.
     */
    set_tomb_debug_rooms(on: boolean): void;
    /**
     * Returns the surface id at the given cell, or `None` if no tagged
     * triangle painted it. Test/debug only.
     */
    surface_id_at(x: number, y: number): number | undefined;
    /**
     * Maps a tomb triangle id (as stored in the surface-id buffer) back to
     * its room index. Returns `None` if the tomb is not loaded or the id is
     * out of range. Test/debug only.
     */
    tomb_tri_room(tri_id: number): number | undefined;
    /**
     * Applies touch camera orbit (top half of screen).
     * `delta_yaw` is in radians.
     */
    touch_camera(delta_yaw: number): void;
    /**
     * Sets touch joystick input (bottom half of screen).
     * `dx` and `dy` are normalized [-1, 1] relative to the camera.
     */
    touch_input(dx: number, dy: number): void;
    /**
     * Advances the simulation by `dt` seconds and returns the rendered ASCII frame.
     *
     * This is the main game loop: it updates movement, camera, terrain, particles,
     * and then rasterizes everything into a single string of ASCII characters
     * (one row per line, separated by newlines).
     */
    update(dt: number): string;
    /**
     * Edge bias at far distance
     */
    far_bias: number;
    /**
     * Edge bias at near distance
     */
    near_bias: number;
}

/**
 * Returns a build identifier string (version + commit + timestamp) for
 * cache-busting and traceability of deployed builds.
 */
export function build_id(): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_engine_free: (a: number, b: number) => void;
    readonly __wbg_get_engine_far_bias: (a: number) => number;
    readonly __wbg_get_engine_near_bias: (a: number) => number;
    readonly __wbg_set_engine_far_bias: (a: number, b: number) => void;
    readonly __wbg_set_engine_near_bias: (a: number, b: number) => void;
    readonly build_id: () => [number, number];
    readonly engine_disable_surface_id_capture: (a: number) => void;
    readonly engine_enable_surface_id_capture: (a: number) => void;
    readonly engine_get_far_bias: (a: number) => number;
    readonly engine_get_near_bias: (a: number) => number;
    readonly engine_get_state: (a: number) => [number, number];
    readonly engine_get_tomb_debug_rooms: (a: number) => number;
    readonly engine_is_moving: (a: number) => number;
    readonly engine_key_down: (a: number, b: number, c: number) => void;
    readonly engine_key_up: (a: number, b: number, c: number) => void;
    readonly engine_new: (a: number, b: number) => number;
    readonly engine_resize: (a: number, b: number, c: number) => void;
    readonly engine_set_edges_force_visible: (a: number, b: number) => void;
    readonly engine_set_far_bias: (a: number, b: number) => void;
    readonly engine_set_fov: (a: number, b: number) => void;
    readonly engine_set_near_bias: (a: number, b: number) => void;
    readonly engine_set_spawn: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly engine_set_state: (a: number, b: number, c: number) => void;
    readonly engine_set_tomb_debug_rooms: (a: number, b: number) => void;
    readonly engine_surface_id_at: (a: number, b: number, c: number) => number;
    readonly engine_tomb_tri_room: (a: number, b: number) => number;
    readonly engine_touch_camera: (a: number, b: number) => void;
    readonly engine_touch_input: (a: number, b: number, c: number) => void;
    readonly engine_update: (a: number, b: number) => [number, number];
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
