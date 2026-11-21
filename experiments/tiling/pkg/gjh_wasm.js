/* @ts-self-types="./gjh_wasm.d.ts" */

export class TilingSession {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TilingSessionFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tilingsession_free(ptr, 0);
    }
    /**
     * Short git commit hash of the rust-gomjauhogg revision this WASM was
     * built from (`+dirty` suffix when built off an uncommitted tree).
     * Baked in at build time by `build.rs`; surfaced as a tiny label in
     * the JS shell for deploy provenance.
     * @returns {string}
     */
    static buildHash() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.tilingsession_buildHash();
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The currently-selected config string (for display).
     * @returns {string}
     */
    currentConfig() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.tilingsession_currentConfig(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Export the current view as an AutoCAD DXF (AC1015 / R2000) document.
     * Uses the same draw pipeline as `render`, so the geometry matches the
     * on-screen view. The output is ASCII DXF text — write it to disk as
     * `.dxf` and open in AutoCAD, BricsCAD, LibreCAD, FreeCAD, etc.
     * @returns {string}
     */
    exportDxf() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.tilingsession_exportDxf(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Exports exactly the current on-screen view (canvas size, pan and
     * zoom): the viewBox is the canvas centred on the origin and the root
     * transform is `translate(pan) scale(zoom)`. Uses the same draw pipeline
     * as `render`, with offsets stamped for the exported frame itself.
     * @returns {string}
     */
    exportSvg() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.tilingsession_exportSvg(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Generate a tilework palette from a seed: 12 "#rrggbb" strings in the
     * order background, tile3, tile4, tile6, tile8, tile12, star_fill,
     * interstitial, star_ribbon_fill, star_ribbon_stroke, tile_ribbon_fill,
     * tile_ribbon_stroke. A pure function of `seed`.
     * @param {number} seed
     * @returns {any[]}
     */
    static generatePalette(seed) {
        const ret = wasm.tilingsession_generatePalette(seed);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Returns the 91 library configs as a JS array of strings, one per
     * notation. Used to populate the dropdown.
     * @returns {any[]}
     */
    static listConfigs() {
        const ret = wasm.tilingsession_listConfigs();
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Build a session for the given library config index. Panics in JS on
     * out-of-range index (the JS shell only ever passes indices it sourced
     * from `list_configs`).
     * @param {number} config_idx
     */
    constructor(config_idx) {
        const ret = wasm.tilingsession_new(config_idx);
        this.__wbg_ptr = ret;
        TilingSessionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Pick a uniformly-random palette from the curated set baked into the
     * WASM bundle and return it as `[star_fill, interstitial_fill,
     * ribbon_fill, ribbon_stroke]` — four `#rrggbb` strings the JS shell
     * drops directly into its colour inputs.
     * @returns {any[]}
     */
    static randomPalette() {
        const ret = wasm.tilingsession_randomPalette();
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Imperatively draw the current state to a canvas 2D context. Must be
     * allocation-free per frame: the only heap traffic is the `Path2d`
     * cache rebuild inside `CanvasRenderer::begin`, which clears + rebuilds
     * once per cell polygon definition (small N).
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        wasm.tilingsession_render(this.__wbg_ptr, ctx);
    }
    /**
     * Lee's ideal code angles for the rosette-eligible tiles of the current
     * tiling at the current s, as a flat `[n, degrees, n, degrees, …]`
     * sorted by ascending n, with degrees = 90 − 180/n. Computed straight
     * from the cell polygons: independent of whether rosettes are on and of
     * the dirty flags.
     * @returns {Float64Array}
     */
    rosetteIdealAngles() {
        const ret = wasm.tilingsession_rosetteIdealAngles(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * Rosette readout as JSON, e.g.
     * `{"on":true,"s":3,"eligible":{"6":1},"built":{"6":0},"fallback":{"6":1},"reasons":{"InnerDegenerate":1}}`.
     * Rebuilds the star layer first when it is dirty, so the readout is
     * never stale (for instance straight after a setter). With rosettes
     * off the count maps are empty.
     * @returns {string}
     */
    rosetteInfo() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.tilingsession_rosetteInfo(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Set the canvas background colour.
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    setBackground(r, g, b) {
        wasm.tilingsession_setBackground(this.__wbg_ptr, r, g, b);
    }
    /**
     * Switch to a different library config. Cell polygons are rebuilt;
     * star layer is rebuilt against them.
     * @param {number} config_idx
     */
    setConfig(config_idx) {
        wasm.tilingsession_setConfig(this.__wbg_ptr, config_idx);
    }
    /**
     * Set the fill colour for the inter-star corner polygons — the
     * quadrilaterals that fill the space between adjacent inscribed stars
     * within each parent tile. Only visible when `show_stars` is on.
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    setInterstitialFillColor(r, g, b) {
        wasm.tilingsession_setInterstitialFillColor(this.__wbg_ptr, r, g, b);
    }
    /**
     * Turn the KS04 rosette design element on or off. Tiles where the
     * rosette is invalid at the current angle keep their Hankin star.
     * @param {boolean} on
     */
    setRosette(on) {
        wasm.tilingsession_setRosette(this.__wbg_ptr, on);
    }
    /**
     * Rosette shoulder position h (MG' = h MG). Clamped to [0.2, 2];
     * non-finite values are ignored.
     * @param {number} h
     */
    setRosetteH(h) {
        wasm.tilingsession_setRosetteH(this.__wbg_ptr, h);
    }
    /**
     * Rosette taper φ in radians. Clamped to ±45 degrees; non-finite values
     * are ignored.
     * @param {number} radians
     */
    setRosettePhi(radians) {
        wasm.tilingsession_setRosettePhi(this.__wbg_ptr, radians);
    }
    /**
     * Rosette ring count s: 2 or 3 (anything else is clamped to the
     * nearest).
     * @param {number} s
     */
    setRosetteS(s) {
        wasm.tilingsession_setRosetteS(this.__wbg_ptr, s);
    }
    /**
     * Toggle the star-layer Cromwell weave.
     * @param {boolean} show
     */
    setShowStarWeave(show) {
        wasm.tilingsession_setShowStarWeave(this.__wbg_ptr, show);
    }
    /**
     * Toggle whether Hankin stars are drawn on top of the cell tiling.
     * Cell polygons stay visible regardless.
     * @param {boolean} show
     */
    setShowStars(show) {
        wasm.tilingsession_setShowStars(this.__wbg_ptr, show);
    }
    /**
     * Toggle the tile-layer Cromwell weave. The first activation builds the
     * strand-trace + clipped ribbon polygons (one-shot O(E) cost); turning
     * it back on after a polygon change rebuilds lazily.
     * @param {boolean} show
     */
    setShowTileWeave(show) {
        wasm.tilingsession_setShowTileWeave(this.__wbg_ptr, show);
    }
    /**
     * Toggle whether the base tiles (cell polygons) are drawn. When off, only
     * stars (if enabled) appear; useful for emphasising the Hankin overlay.
     * @param {boolean} show
     */
    setShowTiles(show) {
        wasm.tilingsession_setShowTiles(this.__wbg_ptr, show);
    }
    /**
     * Update the Hankin star angle (radians). Marks the star layer dirty;
     * the actual rebuild is deferred to the next `render`/`export_svg`.
     * @param {number} radians
     */
    setStarAngle(radians) {
        wasm.tilingsession_setStarAngle(this.__wbg_ptr, radians);
    }
    /**
     * Update the stroke width applied to star polygon outlines and the
     * star-weave ribbon half-width. Clamped to `≥ 0`.
     * @param {number} width
     */
    setStarBandWidth(width) {
        wasm.tilingsession_setStarBandWidth(this.__wbg_ptr, width);
    }
    /**
     * Set the fill colour for star polygons.
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    setStarFillColor(r, g, b) {
        wasm.tilingsession_setStarFillColor(this.__wbg_ptr, r, g, b);
    }
    /**
     * Set the fill colour of the star-layer ribbon body.
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    setStarRibbonFillColor(r, g, b) {
        wasm.tilingsession_setStarRibbonFillColor(this.__wbg_ptr, r, g, b);
    }
    /**
     * Set the stroke colour of the star-layer ribbon rails.
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    setStarRibbonStrokeColor(r, g, b) {
        wasm.tilingsession_setStarRibbonStrokeColor(this.__wbg_ptr, r, g, b);
    }
    /**
     * Update the stroke width applied to tile polygon outlines and the
     * tile-weave ribbon half-width. Clamped to `≥ 0`.
     * @param {number} width
     */
    setTileBandWidth(width) {
        wasm.tilingsession_setTileBandWidth(this.__wbg_ptr, width);
    }
    /**
     * Set the fill colour for tiles with `edge_count` edges. Triggers a
     * per-frame re-paint; cell polygons / star layer are unaffected.
     * @param {number} edge_count
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    setTilePaletteColor(edge_count, r, g, b) {
        wasm.tilingsession_setTilePaletteColor(this.__wbg_ptr, edge_count, r, g, b);
    }
    /**
     * Set the fill colour of the tile-layer ribbon body. Only takes
     * visual effect when `show_tile_weave` is on. The matching
     * `tile_ribbon_stroke` colour also drives the tile polygon outline.
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    setTileRibbonFillColor(r, g, b) {
        wasm.tilingsession_setTileRibbonFillColor(this.__wbg_ptr, r, g, b);
    }
    /**
     * Set the stroke colour of the tile-layer ribbon rails.
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    setTileRibbonStrokeColor(r, g, b) {
        wasm.tilingsession_setTileRibbonStrokeColor(this.__wbg_ptr, r, g, b);
    }
    /**
     * Update the viewport. `pan_x`/`pan_y` are in canvas pixels (positive
     * values move the world to the right / down). `zoom` is multiplicative
     * over `WORLD_SCALE` — `zoom = 1.0` is the default scale.
     * @param {number} canvas_w
     * @param {number} canvas_h
     * @param {number} pan_x
     * @param {number} pan_y
     * @param {number} zoom
     */
    setViewport(canvas_w, canvas_h, pan_x, pan_y, zoom) {
        wasm.tilingsession_setViewport(this.__wbg_ptr, canvas_w, canvas_h, pan_x, pan_y, zoom);
    }
    /**
     * Star center positions, in CSS-pixel screen coordinates (after pan/zoom).
     * Returned as a flat `[x0, y0, x1, y1, ...]` `Vec<f64>` (one pair per
     * stamped star instance). Each cell-polygon centroid is translated by
     * every lattice/fallback offset and then mapped through `view_transform`
     * so the consumer can hit-test against pointer positions directly.
     * @returns {Float64Array}
     */
    starCenters() {
        const ret = wasm.tilingsession_starCenters(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * Sorted unique edge counts present in the current cell polygons. The
     * JS shell uses this to render one colour picker per shape kind.
     * @returns {Uint32Array}
     */
    tileShapeEdgeCounts() {
        const ret = wasm.tilingsession_tileShapeEdgeCounts(this.__wbg_ptr);
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Render the current state to an SVG document and return it as a string.
     * Diagnostic counters for the most recent weave build, as a JSON string.
     * Shape: `{"tile_motif": {...} | null, "star_motif": {...} | null,
     * "rosette_weave_fallbacks": N}`, where N counts rosette tiles that fell
     * back to Hankin in the clamped-angle star weave (0 when not clamped).
     * `null` for a layer means its weave has not been built yet (it was
     * disabled, or no rebuild happened since session creation) or the
     * non-lattice fallback geometry is active (no weave is drawn there).
     * @returns {string}
     */
    weaveStatsJson() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.tilingsession_weaveStatsJson(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) TilingSession.prototype[Symbol.dispose] = TilingSession.prototype.free;
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_9c31b086c2b26051: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_clearRect_1ea64f387215d3b8: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.clearRect(arg1, arg2, arg3, arg4);
        },
        __wbg_fillRect_4f7134801b257e68: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.fillRect(arg1, arg2, arg3, arg4);
        },
        __wbg_fill_061bfd3132ac2ece: function(arg0, arg1) {
            arg0.fill(arg1);
        },
        __wbg_fill_4468eb64d6ad19e2: function(arg0, arg1, arg2) {
            arg0.fill(arg1, __wbindgen_enum_CanvasWindingRule[arg2]);
        },
        __wbg_new_with_path_string_2da4d10f4ce12609: function() { return handleError(function (arg0, arg1) {
            const ret = new Path2D(getStringFromWasm0(arg0, arg1));
            return ret;
        }, arguments); },
        __wbg_random_a8dfe52b70cb65a5: function() {
            const ret = Math.random();
            return ret;
        },
        __wbg_restore_6a7dd2b862e161a3: function(arg0) {
            arg0.restore();
        },
        __wbg_save_14924e966ab6b8b7: function(arg0) {
            arg0.save();
        },
        __wbg_scale_fc1a54fbad588f52: function() { return handleError(function (arg0, arg1, arg2) {
            arg0.scale(arg1, arg2);
        }, arguments); },
        __wbg_set_fillStyle_ac68c79af375566e: function(arg0, arg1, arg2) {
            arg0.fillStyle = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_lineJoin_a3878786eac23080: function(arg0, arg1, arg2) {
            arg0.lineJoin = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_lineWidth_e101692cb4fcf2b8: function(arg0, arg1) {
            arg0.lineWidth = arg1;
        },
        __wbg_set_miterLimit_75d5333780d1658c: function(arg0, arg1) {
            arg0.miterLimit = arg1;
        },
        __wbg_set_strokeStyle_c6ed1f71bc678b73: function(arg0, arg1, arg2) {
            arg0.strokeStyle = getStringFromWasm0(arg1, arg2);
        },
        __wbg_stroke_1e9a53ffb709ce84: function(arg0, arg1) {
            arg0.stroke(arg1);
        },
        __wbg_translate_60b6d2cb9b18fba1: function() { return handleError(function (arg0, arg1, arg2) {
            arg0.translate(arg1, arg2);
        }, arguments); },
        __wbindgen_cast_0000000000000001: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./gjh_wasm_bg.js": import0,
    };
}

const __wbindgen_enum_CanvasWindingRule = ["nonzero", "evenodd"];
const TilingSessionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_tilingsession_free(ptr, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat64ArrayMemory0 = null;
function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
        cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedFloat64ArrayMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('gjh_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
