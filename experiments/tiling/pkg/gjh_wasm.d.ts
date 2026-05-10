/* tslint:disable */
/* eslint-disable */

export class TilingSession {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The currently-selected config string (for display).
     */
    currentConfig(): string;
    /**
     * Render the current state to an SVG document and return it as a string.
     * Uses the same draw pipeline as `render`, so the export matches the
     * on-screen view.
     */
    exportSvg(): string;
    /**
     * Returns the 91 library configs as a JS array of strings, one per
     * notation. Used to populate the dropdown.
     */
    static listConfigs(): any[];
    /**
     * Build a session for the given library config index. Panics in JS on
     * out-of-range index (the JS shell only ever passes indices it sourced
     * from `list_configs`).
     */
    constructor(config_idx: number);
    /**
     * Imperatively draw the current state to a canvas 2D context. Must be
     * allocation-free per frame: the only heap traffic is the `Path2d`
     * cache rebuild inside `CanvasRenderer::begin`, which clears + rebuilds
     * once per cell polygon definition (small N).
     */
    render(ctx: CanvasRenderingContext2D): void;
    /**
     * Update the stroke width applied to both tile and star polygon outlines.
     * At higher values the strokes read as visible mitred bands hugging the
     * polygon edges. Clamped to `≥ 0`; a value of 0 hides the outline (the
     * renderer treats it as a zero-width stroke).
     */
    setBandWidth(width: number): void;
    /**
     * Switch to a different library config. Cell polygons are rebuilt;
     * star layer is rebuilt against them.
     */
    setConfig(config_idx: number): void;
    /**
     * Toggle whether Hankin stars are drawn on top of the cell tiling.
     * Cell polygons stay visible regardless.
     */
    setShowStars(show: boolean): void;
    /**
     * Toggle whether the base tiles (cell polygons) are drawn. When off, only
     * stars (if enabled) appear; useful for emphasising the Hankin overlay.
     */
    setShowTiles(show: boolean): void;
    /**
     * Update the Hankin star angle (radians). Marks the star layer dirty;
     * the actual rebuild is deferred to the next `render`/`export_svg`.
     */
    setStarAngle(radians: number): void;
    /**
     * Update the viewport. `pan_x`/`pan_y` are in canvas pixels (positive
     * values move the world to the right / down). `zoom` is multiplicative
     * over `WORLD_SCALE` — `zoom = 1.0` is the default scale.
     */
    setViewport(canvas_w: number, canvas_h: number, pan_x: number, pan_y: number, zoom: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_tilingsession_free: (a: number, b: number) => void;
    readonly tilingsession_currentConfig: (a: number) => [number, number];
    readonly tilingsession_exportSvg: (a: number) => [number, number];
    readonly tilingsession_listConfigs: () => [number, number];
    readonly tilingsession_new: (a: number) => number;
    readonly tilingsession_render: (a: number, b: any) => void;
    readonly tilingsession_setBandWidth: (a: number, b: number) => void;
    readonly tilingsession_setConfig: (a: number, b: number) => void;
    readonly tilingsession_setShowStars: (a: number, b: number) => void;
    readonly tilingsession_setShowTiles: (a: number, b: number) => void;
    readonly tilingsession_setStarAngle: (a: number, b: number) => void;
    readonly tilingsession_setViewport: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_drop_slice: (a: number, b: number) => void;
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
