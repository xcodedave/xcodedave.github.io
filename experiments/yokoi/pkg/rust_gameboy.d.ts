/* tslint:disable */
/* eslint-disable */

/**
 * Load a cartridge from raw bytes (treated as a .gb/.gbc or a .zip that
 * contains one). Same parsing path as drag-and-drop. Logs and ignores on
 * any failure so a bad pick can't kill the running emulator.
 */
export function gbLoadCart(bytes: Uint8Array): void;

/**
 * Apply a named theme. Currently `"dark"` swaps the clear color to a
 * mid-dark grey (sRGB #2a2a2a, matching the CSS `--page-bg`); anything
 * else falls back to white. Idempotent — safe to call from arbitrary JS
 * gestures.
 */
export function gbSetTheme(name: string): void;

export function start(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly gbLoadCart: (a: number, b: number) => void;
    readonly gbSetTheme: (a: number, b: number) => void;
    readonly start: () => void;
    readonly wasm_bindgen__convert__closures_____invoke__h06cba96c46839720: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen__convert__closures_____invoke__ha33953a1035d0234: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h3777747f8e871399: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__ha33953a1035d0234_3: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h3777747f8e871399_4: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h3777747f8e871399_5: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h3777747f8e871399_6: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h3777747f8e871399_7: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__hb0be27a6c43925c3: (a: number, b: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_destroy_closure: (a: number, b: number) => void;
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
