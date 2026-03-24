/* tslint:disable */
/* eslint-disable */

/**
 * Camera orbit — called from JS touch/pointer drag.
 */
export function js_camera_orbit(dx: number, dy: number): void;

/**
 * Camera pan — called from JS two-finger drag.
 */
export function js_camera_pan(dx: number, dy: number): void;

/**
 * Camera zoom — called from JS pinch or scroll.
 */
export function js_camera_zoom(delta: number): void;

/**
 * Export the current scene as MagicaVoxel .vox bytes.
 */
export function js_export_vox(): Uint8Array;

/**
 * Return current editor state as JSON: {tool, colorIndex, lightingEnabled, tileCount}
 */
export function js_get_editor_state_json(): string;

/**
 * Return the palette as a JSON array of 256 "#rrggbb" strings.
 */
export function js_get_palette_json(): string;

/**
 * Import a scene from MagicaVoxel .vox bytes. Returns true on success.
 */
export function js_import_vox(data: Uint8Array): boolean;

/**
 * Returns true once the renderer (WebGPU) is fully initialised.
 */
export function js_is_ready(): boolean;

/**
 * Load a scene from .svox bytes. Returns true on success.
 */
export function js_load_svox(data: Uint8Array): boolean;

/**
 * Pointer/touch down on the canvas — triggers a sculpt or paint action.
 * `button`: 0 = add/paint, 1 = remove/erase.
 */
export function js_pointer_down(x: number, y: number, button: number): void;

/**
 * Pointer/touch move on the canvas — continues drag.
 */
export function js_pointer_move(x: number, y: number, dx: number, dy: number): void;

/**
 * Pointer/touch up — ends drag.
 */
export function js_pointer_up(): void;

/**
 * Serialise the current scene to .svox bytes.
 */
export function js_save_svox(): Uint8Array;

/**
 * Set the active palette color index (1–255).
 */
export function js_set_color_index(index: number): void;

/**
 * Set the active tool: "sculpt" or "paint".
 */
export function js_set_tool(tool: string): void;

/**
 * Toggle ambient/diffuse lighting.
 */
export function js_toggle_lighting(): void;

export function wasm_main(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly wasm_main: () => void;
    readonly js_camera_orbit: (a: number, b: number) => void;
    readonly js_camera_pan: (a: number, b: number) => void;
    readonly js_camera_zoom: (a: number) => void;
    readonly js_export_vox: () => [number, number];
    readonly js_get_editor_state_json: () => [number, number];
    readonly js_get_palette_json: () => [number, number];
    readonly js_import_vox: (a: number, b: number) => number;
    readonly js_is_ready: () => number;
    readonly js_load_svox: (a: number, b: number) => number;
    readonly js_pointer_down: (a: number, b: number, c: number) => void;
    readonly js_pointer_move: (a: number, b: number, c: number, d: number) => void;
    readonly js_pointer_up: () => void;
    readonly js_save_svox: () => [number, number];
    readonly js_set_color_index: (a: number) => void;
    readonly js_set_tool: (a: number, b: number) => void;
    readonly js_toggle_lighting: () => void;
    readonly wasm_bindgen__closure__destroy__h0f224a482f54dc30: (a: number, b: number) => void;
    readonly wasm_bindgen__closure__destroy__h33b70e22126fc759: (a: number, b: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__hae2313f37fa2cae4: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h29592b5c27100957: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen__convert__closures_____invoke__h003434427ccedf0f: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h003434427ccedf0f_2: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h003434427ccedf0f_3: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h003434427ccedf0f_4: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h003434427ccedf0f_5: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h003434427ccedf0f_6: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h003434427ccedf0f_7: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h003434427ccedf0f_8: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__hc3f9d08f04d479c9: (a: number, b: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
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
