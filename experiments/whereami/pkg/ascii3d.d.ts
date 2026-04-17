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
     * Advances the simulation by `dt` seconds and returns the rendered ASCII frame.
     *
     * This is the main game loop: it updates movement, camera, terrain, particles,
     * and then rasterizes everything into a single string of ASCII characters
     * (one row per line, separated by newlines).
     */
    update(dt: number): string;
}

/**
 * Returns a build identifier string (version + timestamp) for cache-busting.
 */
export function build_id(): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_engine_free: (a: number, b: number) => void;
    readonly build_id: () => [number, number];
    readonly engine_key_down: (a: number, b: number, c: number) => void;
    readonly engine_key_up: (a: number, b: number, c: number) => void;
    readonly engine_new: (a: number, b: number) => number;
    readonly engine_resize: (a: number, b: number, c: number) => void;
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
