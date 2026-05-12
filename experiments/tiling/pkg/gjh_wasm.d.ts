/* tslint:disable */
/* eslint-disable */

export class TilingSession {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Short git commit hash of the rust-gomjauhogg revision this WASM was
     * built from (`+dirty` suffix when built off an uncommitted tree).
     * Baked in at build time by `build.rs`; surfaced as a tiny label in
     * the JS shell for deploy provenance.
     */
    static buildHash(): string;
    /**
     * The currently-selected config string (for display).
     */
    currentConfig(): string;
    /**
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
     * Pick a uniformly-random palette from the curated set baked into the
     * WASM bundle and return it as `[star_fill, interstitial_fill,
     * ribbon_fill, ribbon_stroke]` — four `#rrggbb` strings the JS shell
     * drops directly into its colour inputs.
     */
    static randomPalette(): any[];
    /**
     * Imperatively draw the current state to a canvas 2D context. Must be
     * allocation-free per frame: the only heap traffic is the `Path2d`
     * cache rebuild inside `CanvasRenderer::begin`, which clears + rebuilds
     * once per cell polygon definition (small N).
     */
    render(ctx: CanvasRenderingContext2D): void;
    /**
     * Set the canvas background colour.
     */
    setBackground(r: number, g: number, b: number): void;
    /**
     * Switch to a different library config. Cell polygons are rebuilt;
     * star layer is rebuilt against them.
     */
    setConfig(config_idx: number): void;
    /**
     * Set the fill colour for the inter-star corner polygons — the
     * quadrilaterals that fill the space between adjacent inscribed stars
     * within each parent tile. Only visible when `show_stars` is on.
     */
    setInterstitialFillColor(r: number, g: number, b: number): void;
    /**
     * Toggle the star-layer Cromwell weave.
     */
    setShowStarWeave(show: boolean): void;
    /**
     * Toggle whether Hankin stars are drawn on top of the cell tiling.
     * Cell polygons stay visible regardless.
     */
    setShowStars(show: boolean): void;
    /**
     * Toggle the tile-layer Cromwell weave. The first activation builds the
     * strand-trace + clipped ribbon polygons (one-shot O(E) cost); turning
     * it back on after a polygon change rebuilds lazily.
     */
    setShowTileWeave(show: boolean): void;
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
     * Update the stroke width applied to star polygon outlines and the
     * star-weave ribbon half-width. Clamped to `≥ 0`.
     */
    setStarBandWidth(width: number): void;
    /**
     * Set the fill colour for star polygons.
     */
    setStarFillColor(r: number, g: number, b: number): void;
    /**
     * Set the fill colour of the star-layer ribbon body.
     */
    setStarRibbonFillColor(r: number, g: number, b: number): void;
    /**
     * Set the stroke colour of the star-layer ribbon rails.
     */
    setStarRibbonStrokeColor(r: number, g: number, b: number): void;
    /**
     * Update the stroke width applied to tile polygon outlines and the
     * tile-weave ribbon half-width. Clamped to `≥ 0`.
     */
    setTileBandWidth(width: number): void;
    /**
     * Set the fill colour for tiles with `edge_count` edges. Triggers a
     * per-frame re-paint; cell polygons / star layer are unaffected.
     */
    setTilePaletteColor(edge_count: number, r: number, g: number, b: number): void;
    /**
     * Set the fill colour of the tile-layer ribbon body. Only takes
     * visual effect when `show_tile_weave` is on. The matching
     * `tile_ribbon_stroke` colour also drives the tile polygon outline.
     */
    setTileRibbonFillColor(r: number, g: number, b: number): void;
    /**
     * Set the stroke colour of the tile-layer ribbon rails.
     */
    setTileRibbonStrokeColor(r: number, g: number, b: number): void;
    /**
     * Update the viewport. `pan_x`/`pan_y` are in canvas pixels (positive
     * values move the world to the right / down). `zoom` is multiplicative
     * over `WORLD_SCALE` — `zoom = 1.0` is the default scale.
     */
    setViewport(canvas_w: number, canvas_h: number, pan_x: number, pan_y: number, zoom: number): void;
    /**
     * Sorted unique edge counts present in the current cell polygons. The
     * JS shell uses this to render one colour picker per shape kind.
     */
    tileShapeEdgeCounts(): Uint32Array;
    /**
     * Render the current state to an SVG document and return it as a string.
     * Diagnostic counters for the most recent weave build, as a JSON string.
     * Shape:
     *   {"tile":{"strands":N, "components":C, "crossings":T,
     *            "violations_zero":Z, "violations_many":M, ...} | null,
     *    "star":{...} | null}
     * `null` for a layer means that layer's weave has not been built yet
     * (either it was disabled or no rebuild happened since session creation),
     * or it was built via the non-lattice fallback path which does not emit
     * stats.
     */
    weaveStatsJson(): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_tilingsession_free: (a: number, b: number) => void;
    readonly tilingsession_buildHash: () => [number, number];
    readonly tilingsession_currentConfig: (a: number) => [number, number];
    readonly tilingsession_exportSvg: (a: number) => [number, number];
    readonly tilingsession_listConfigs: () => [number, number];
    readonly tilingsession_new: (a: number) => number;
    readonly tilingsession_randomPalette: () => [number, number];
    readonly tilingsession_render: (a: number, b: any) => void;
    readonly tilingsession_setBackground: (a: number, b: number, c: number, d: number) => void;
    readonly tilingsession_setConfig: (a: number, b: number) => void;
    readonly tilingsession_setInterstitialFillColor: (a: number, b: number, c: number, d: number) => void;
    readonly tilingsession_setShowStarWeave: (a: number, b: number) => void;
    readonly tilingsession_setShowStars: (a: number, b: number) => void;
    readonly tilingsession_setShowTileWeave: (a: number, b: number) => void;
    readonly tilingsession_setShowTiles: (a: number, b: number) => void;
    readonly tilingsession_setStarAngle: (a: number, b: number) => void;
    readonly tilingsession_setStarBandWidth: (a: number, b: number) => void;
    readonly tilingsession_setStarFillColor: (a: number, b: number, c: number, d: number) => void;
    readonly tilingsession_setStarRibbonFillColor: (a: number, b: number, c: number, d: number) => void;
    readonly tilingsession_setStarRibbonStrokeColor: (a: number, b: number, c: number, d: number) => void;
    readonly tilingsession_setTileBandWidth: (a: number, b: number) => void;
    readonly tilingsession_setTilePaletteColor: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly tilingsession_setTileRibbonFillColor: (a: number, b: number, c: number, d: number) => void;
    readonly tilingsession_setTileRibbonStrokeColor: (a: number, b: number, c: number, d: number) => void;
    readonly tilingsession_setViewport: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly tilingsession_tileShapeEdgeCounts: (a: number) => [number, number];
    readonly tilingsession_weaveStatsJson: (a: number) => [number, number];
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
