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
     * Render the current state to an SVG document and return it as a string.
     * Uses the same draw pipeline as `render`, so the export matches the
     * on-screen view.
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
     * Update the stroke width applied to both tile and star polygon outlines.
     * At higher values the strokes read as visible mitred bands hugging the
     * polygon edges. Clamped to `≥ 0`; a value of 0 hides the outline (the
     * renderer treats it as a zero-width stroke).
     * @param {number} width
     */
    setBandWidth(width) {
        wasm.tilingsession_setBandWidth(this.__wbg_ptr, width);
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
     * Toggle whether Hankin stars are drawn on top of the cell tiling.
     * Cell polygons stay visible regardless.
     * @param {boolean} show
     */
    setShowStars(show) {
        wasm.tilingsession_setShowStars(this.__wbg_ptr, show);
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
}
if (Symbol.dispose) TilingSession.prototype[Symbol.dispose] = TilingSession.prototype.free;
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_9c31b086c2b26051: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_beginPath_0362b3134ed67152: function(arg0) {
            arg0.beginPath();
        },
        __wbg_clearRect_1ea64f387215d3b8: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.clearRect(arg1, arg2, arg3, arg4);
        },
        __wbg_closePath_404039b8951c60c5: function(arg0) {
            arg0.closePath();
        },
        __wbg_closePath_ab8775c8f9ce941f: function(arg0) {
            arg0.closePath();
        },
        __wbg_fillRect_4f7134801b257e68: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.fillRect(arg1, arg2, arg3, arg4);
        },
        __wbg_fill_061bfd3132ac2ece: function(arg0, arg1) {
            arg0.fill(arg1);
        },
        __wbg_lineTo_72d6b123d28ab168: function(arg0, arg1, arg2) {
            arg0.lineTo(arg1, arg2);
        },
        __wbg_lineTo_f83e8a14258ea4ae: function(arg0, arg1, arg2) {
            arg0.lineTo(arg1, arg2);
        },
        __wbg_moveTo_11bf5a977e6b8610: function(arg0, arg1, arg2) {
            arg0.moveTo(arg1, arg2);
        },
        __wbg_moveTo_930aede484e3c1bc: function(arg0, arg1, arg2) {
            arg0.moveTo(arg1, arg2);
        },
        __wbg_new_cc42efbe5a7cd793: function() { return handleError(function () {
            const ret = new Path2D();
            return ret;
        }, arguments); },
        __wbg_restore_6a7dd2b862e161a3: function(arg0) {
            arg0.restore();
        },
        __wbg_save_14924e966ab6b8b7: function(arg0) {
            arg0.save();
        },
        __wbg_scale_fc1a54fbad588f52: function() { return handleError(function (arg0, arg1, arg2) {
            arg0.scale(arg1, arg2);
        }, arguments); },
        __wbg_setTransform_f58d3fff89c964b4: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.setTransform(arg1, arg2, arg3, arg4, arg5, arg6);
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
        __wbg_stroke_82139a335b371e81: function(arg0) {
            arg0.stroke();
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

const TilingSessionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_tilingsession_free(ptr, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
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

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
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
