/**
 * Starts the renderer (WebGPU if it works, else WebGL2: `backend::create`) and the app.
 * `web/main.js` awaits the returned promise before it publishes `window.__sm64Ready`.
 * @returns {Promise<any>}
 */
export function boot() {
    const ret = wasm.boot();
    return ret;
}

/**
 * Milliseconds the audio frames of all ticks cost so far (a benchmark hook).
 * @returns {number}
 */
export function debug_audio_ms() {
    const ret = wasm.debug_audio_ms();
    return ret;
}

/**
 * Benchmark hook (T7.y, D5): draws the current frame `n` times back to back (no game ticks)
 * and resolves, once the GPU has finished them all, to the milliseconds per frame (CPU
 * encode plus GPU time at full rate). NaN without a booted game.
 * @param {number} n
 * @returns {Promise<any>}
 */
export function debug_bench_render(n) {
    const ret = wasm.debug_bench_render(n);
    return ret;
}

/**
 * Test hook (read-only, T4.4): the camera as JSON: the playing cutscene id (0 none), the
 * shot index, the cutscene timer, Lakitu's position and focus and the fov.
 * @returns {string}
 */
export function debug_camera() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.debug_camera();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Test hook: records star `star` (0-based) of Bob-omb Battlefield for save file `file`
 * (1..=4) through the game's own save path (`save_file_collect_star_or_key` +
 * `save_file_do_save`), which writes the EEPROM and so localStorage; returns
 * [`debug_save`].
 * @param {number} file
 * @param {number} star
 * @returns {string}
 */
export function debug_collect_star(file, star) {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.debug_collect_star(file, star);
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Test hook (read-only): the HUD and UI state as JSON: lives, coins, stars, power-meter
 * wedges, HUD flags, the open dialog id (-1 none), the dialog/menu state, the menu mode and
 * the level-update play mode (2 = paused).
 * @returns {string}
 */
export function debug_hud() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.debug_hud();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Test hook: destroys the WebGPU device, as a GPU reset would (the shell then continues
 * on WebGL2). No effect on WebGL2.
 */
export function debug_lose_gpu_device() {
    wasm.debug_lose_gpu_device();
}

/**
 * Test hook (read-only): the objects the last frame drew only because of the wide
 * frustum, as a JSON array of `{slot, anim_id, anim_frame}` (their real animation state:
 * the game advances it whether or not the object is in the N64's view).
 * @returns {string}
 */
export function debug_margin_objects() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.debug_margin_objects();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Test hook (read-only): Mario and the game camera as JSON: position, action,
 * facing, speed, the camera's yaw in degrees and mode, the last controller sample, the
 * game frame counter and the level (`level_num`, `area_index`, T4.1) Mario is in. `{"status":"no game"}` before the level is up.
 * @returns {string}
 */
export function debug_mario() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.debug_mario();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Test hook (read-only): where the menus are, as JSON: the file select timer (0 until it
 * is up), its selected button, the title screen's idle countdown and the level number.
 * @returns {string}
 */
export function debug_menu() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.debug_menu();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Test hook (read-only): the positions of the live objects with the behaviour `bhv`
 * (e.g. `bhvYellowCoin`) as a JSON array of `[x, y, z]`.
 * @param {string} bhv
 * @returns {string}
 */
export function debug_object_positions(bhv) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(bhv, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.debug_object_positions(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Test hook: opens dialog `id` the way a signpost does (the sign's own reading action is
 * not ported yet); returns [`debug_hud`].
 * @param {number} id
 * @returns {string}
 */
export function debug_open_dialog(id) {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.debug_open_dialog(id);
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Test hook (read-only): game ticks still queued by [`debug_queue_pads`].
 * @returns {number}
 */
export function debug_pad_queue_len() {
    const ret = wasm.debug_pad_queue_len();
    return ret >>> 0;
}

/**
 * Test hook (read-only, T4.5): whether the game ticks are paused.
 * @returns {boolean}
 */
export function debug_paused() {
    const ret = wasm.debug_paused();
    return ret !== 0;
}

/**
 * Test hook: queues scripted controller samples, consumed one per game tick ahead of the
 * live input (so a test steers menus exactly, however late the browser runs its ticks).
 * `runs` is an array of `{button, stick_x, stick_y, ticks}` (missing fields are 0; one
 * tick if `ticks` is missing); returns the queue length afterwards ([`debug_pad_queue_len`]).
 * @param {any} runs
 * @returns {number}
 */
export function debug_queue_pads(runs) {
    const ret = wasm.debug_queue_pads(runs);
    return ret >>> 0;
}

/**
 * Test hook (T4.5): queues a pause between the tick queued before it and the tick queued
 * after it: the game stops there (the last tick's frame stays on screen) until
 * [`debug_set_paused`]`(false)`, so a test can take an exact-tick screenshot.
 */
export function debug_queue_pause() {
    wasm.debug_queue_pause();
}

/**
 * Test hook (T4.5): queues "put Mario at (x, y, z) facing `yaw`, at rest" between the
 * tick queued before it and the tick queued after it (the route hooks of the oracle's
 * recorded runs). A teleport with no tick after it waits until one is queued.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} yaw
 */
export function debug_queue_teleport(x, y, z, yaw) {
    wasm.debug_queue_teleport(x, y, z, yaw);
}

/**
 * Test hook: re-clears to the Phase 0 colour (#1e90ff) and returns the canvas centre
 * pixel as RGBA (4 bytes). Proves WebGL2 runs even without assets.pack. Returns an
 * empty vector (and logs an error) if no GL context exists.
 * @returns {Uint8Array}
 */
export function debug_read_center_pixel() {
    const ret = wasm.debug_read_center_pixel();
    var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v1;
}

/**
 * Test hook: an `n`×`n` grid of RGBA samples (row-major, top row first) at the cell
 * centres of the last rendered frame (the drawing buffer is preserved).
 * @param {number} n
 * @returns {Uint8Array}
 */
export function debug_read_pixels_grid(n) {
    const ret = wasm.debug_read_pixels_grid(n);
    var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v1;
}

/**
 * Test hook: a `w`×`h` block of RGBA pixels of the last rendered frame whose top-left is
 * the canvas pixel `(x, y)` (origin top-left; rows top first). The block is clipped to
 * the canvas and limited to 4 Mpixels; an empty vector if nothing is left.
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @returns {Uint8Array}
 */
export function debug_read_rect(x, y, w, h) {
    const ret = wasm.debug_read_rect(x, y, w, h);
    var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v1;
}

/**
 * Test hook (T4.1): queues a controller script, one sample per game tick, in the format of
 * the oracle tests' input scripts (`<frames> <stickX> <stickY> <buttons>` per line, `#`
 * comments, buttons hex with `0x`). A thin wrapper over the [`debug_queue_pads`] pad queue.
 * Returns the number of ticks queued, or 0 for a malformed script (nothing is queued).
 * @param {string} text
 * @returns {number}
 */
export function debug_run_script(text) {
    const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.debug_run_script(ptr0, len0);
    return ret >>> 0;
}

/**
 * Test hook (read-only): the four save files as JSON, `[{"exists":bool,"stars":n},...]`.
 * @returns {string}
 */
export function debug_save() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.debug_save();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Test hook (T4.5): pauses (`true`) or resumes the game ticks. `?pause=1` starts paused.
 * Rendering of the last frame continues; the pad queue and the game stand still.
 * @param {boolean} paused
 */
export function debug_set_paused(paused) {
    wasm.debug_set_paused(paused);
}

/**
 * Test hook (T4.5): spawns a course star `dist` units in front of Mario
 * (`spawn_default_star`); grabbing it saves it and the dance ends with the star exit.
 * @param {number} dist
 */
export function debug_spawn_exit_star(dist) {
    wasm.debug_spawn_exit_star(dist);
}

/**
 * Test hook (T4.4): spawns a star `dist` units in front of Mario (`spawn_default_star`),
 * which Mario can then collect to play the star dance.
 * @param {number} dist
 */
export function debug_spawn_star(dist) {
    wasm.debug_spawn_star(dist);
}

/**
 * Test hook: the shell's state as JSON (see tools/browser-smoke/tests).
 * @returns {string}
 */
export function debug_state() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.debug_state();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Test hook: puts Mario at (x, y, z) (to reach a coin without a scripted route).
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
export function debug_teleport(x, y, z) {
    wasm.debug_teleport(x, y, z);
}

/**
 * Game ticks run so far (a benchmark hook).
 * @returns {number}
 */
export function debug_ticks_run() {
    const ret = wasm.debug_ticks_run();
    return ret;
}

export function start() {
    wasm.start();
}
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_boolean_get_5b446f51afd21013: function(arg0) {
            const v = arg0;
            const ret = typeof(v) === 'boolean' ? v : undefined;
            return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
        },
        __wbg___wbindgen_debug_string_4687d8d8c2017d52: function(arg0, arg1) {
            const ret = debugString(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_is_function_1f9d30630b8b1d3d: function(arg0) {
            const ret = typeof(arg0) === 'function';
            return ret;
        },
        __wbg___wbindgen_is_null_e343b7d08827ba72: function(arg0) {
            const ret = arg0 === null;
            return ret;
        },
        __wbg___wbindgen_is_undefined_8865fb403f8fe9d8: function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        },
        __wbg___wbindgen_number_get_2e0e7dee9f701a71: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'number' ? obj : undefined;
            getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
        },
        __wbg___wbindgen_string_get_0380ccaa2f57f0d9: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_throw_41e9ee4f547fc59a: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg__wbg_cb_unref_dcc1a90847f04c41: function(arg0) {
            arg0._wbg_cb_unref();
        },
        __wbg_activeTexture_11079673eac5c921: function(arg0, arg1) {
            arg0.activeTexture(arg1 >>> 0);
        },
        __wbg_activeTexture_2fad46c01cafe6b1: function(arg0, arg1) {
            arg0.activeTexture(arg1 >>> 0);
        },
        __wbg_addEventListener_4d0db17c671ea324: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3);
        }, arguments); },
        __wbg_appendChild_fb8c52e7dd8484ea: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.appendChild(arg1);
            return ret;
        }, arguments); },
        __wbg_architecture_b07b04f3e0c317f5: function(arg0, arg1) {
            const ret = arg1.architecture;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_arrayBuffer_f07be74819944ea2: function() { return handleError(function (arg0) {
            const ret = arg0.arrayBuffer();
            return ret;
        }, arguments); },
        __wbg_attachShader_8920a5beea54aba7: function(arg0, arg1, arg2) {
            arg0.attachShader(arg1, arg2);
        },
        __wbg_attachShader_9567ae57af6746d5: function(arg0, arg1, arg2) {
            arg0.attachShader(arg1, arg2);
        },
        __wbg_axes_1544d2030f316eff: function(arg0) {
            const ret = arg0.axes;
            return ret;
        },
        __wbg_beginRenderPass_46bc75d13eaf7381: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.beginRenderPass(arg1);
            return ret;
        }, arguments); },
        __wbg_bindBuffer_0324f62b876c4403: function(arg0, arg1, arg2) {
            arg0.bindBuffer(arg1 >>> 0, arg2);
        },
        __wbg_bindBuffer_2195e89b585ce0c3: function(arg0, arg1, arg2) {
            arg0.bindBuffer(arg1 >>> 0, arg2);
        },
        __wbg_bindTexture_3cf008f256f3ed99: function(arg0, arg1, arg2) {
            arg0.bindTexture(arg1 >>> 0, arg2);
        },
        __wbg_bindTexture_613a47b8917a0ccd: function(arg0, arg1, arg2) {
            arg0.bindTexture(arg1 >>> 0, arg2);
        },
        __wbg_blendFunc_491ee1105079ce76: function(arg0, arg1, arg2) {
            arg0.blendFunc(arg1 >>> 0, arg2 >>> 0);
        },
        __wbg_blendFunc_589e4252bb396484: function(arg0, arg1, arg2) {
            arg0.blendFunc(arg1 >>> 0, arg2 >>> 0);
        },
        __wbg_body_e549239eaff082e1: function(arg0) {
            const ret = arg0.body;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_bufferData_53e0f7a06b58fe81: function(arg0, arg1, arg2, arg3) {
            arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
        },
        __wbg_bufferData_5fa44d94fe7a3878: function(arg0, arg1, arg2, arg3) {
            arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
        },
        __wbg_buttons_d32d3eb4f6cb5c35: function(arg0) {
            const ret = arg0.buttons;
            return ret;
        },
        __wbg_call_187d372bd5fdd4aa: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.call(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_call_6137034ef55c9d0f: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.call(arg1);
            return ret;
        }, arguments); },
        __wbg_catch_92594c2d17f55f12: function(arg0, arg1) {
            const ret = arg0.catch(arg1);
            return ret;
        },
        __wbg_classList_8a097a4837412bf6: function(arg0) {
            const ret = arg0.classList;
            return ret;
        },
        __wbg_clearColor_3f6aa096dc12e8b7: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.clearColor(arg1, arg2, arg3, arg4);
        },
        __wbg_clearColor_796427e8ac60fe14: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.clearColor(arg1, arg2, arg3, arg4);
        },
        __wbg_clear_175cf3cb6d98d72b: function(arg0, arg1) {
            arg0.clear(arg1 >>> 0);
        },
        __wbg_clear_cb96796cc568b7c8: function(arg0, arg1) {
            arg0.clear(arg1 >>> 0);
        },
        __wbg_clientHeight_33dd2a2c8630a1f1: function(arg0) {
            const ret = arg0.clientHeight;
            return ret;
        },
        __wbg_clientWidth_08d5512595aacb73: function(arg0) {
            const ret = arg0.clientWidth;
            return ret;
        },
        __wbg_clientX_667e5633f888238d: function(arg0) {
            const ret = arg0.clientX;
            return ret;
        },
        __wbg_clientY_2cdc00632f185e67: function(arg0) {
            const ret = arg0.clientY;
            return ret;
        },
        __wbg_cloneNode_36b409d13a42e5ef: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.cloneNode(arg1 !== 0);
            return ret;
        }, arguments); },
        __wbg_code_422d539f5d7bacbb: function(arg0, arg1) {
            const ret = arg1.code;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_compileShader_073a75409aaf96d2: function(arg0, arg1) {
            arg0.compileShader(arg1);
        },
        __wbg_compileShader_c2b53ff3a8851f60: function(arg0, arg1) {
            arg0.compileShader(arg1);
        },
        __wbg_configure_a4e26031ba2da6a2: function() { return handleError(function (arg0, arg1) {
            arg0.configure(arg1);
        }, arguments); },
        __wbg_connected_5a26e8e31af93dbc: function(arg0) {
            const ret = arg0.connected;
            return ret;
        },
        __wbg_createBindGroupLayout_dd6a685e68699be9: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.createBindGroupLayout(arg1);
            return ret;
        }, arguments); },
        __wbg_createBindGroup_297f726263493b7a: function(arg0, arg1) {
            const ret = arg0.createBindGroup(arg1);
            return ret;
        },
        __wbg_createBuffer_7d58b37b7042f31f: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.createBuffer(arg1);
            return ret;
        }, arguments); },
        __wbg_createBuffer_d1dd23bf8704564c: function(arg0) {
            const ret = arg0.createBuffer();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createBuffer_ffe613371d42cfd3: function(arg0) {
            const ret = arg0.createBuffer();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createCommandEncoder_e9f5d561e0436021: function(arg0) {
            const ret = arg0.createCommandEncoder();
            return ret;
        },
        __wbg_createElement_74049073a11f9c31: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.createElement(getStringFromWasm0(arg1, arg2));
            return ret;
        }, arguments); },
        __wbg_createPipelineLayout_39a9a7f694e28389: function(arg0, arg1) {
            const ret = arg0.createPipelineLayout(arg1);
            return ret;
        },
        __wbg_createProgram_cbf448e6f18a9402: function(arg0) {
            const ret = arg0.createProgram();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createProgram_e0c81b0d2b8d0fd0: function(arg0) {
            const ret = arg0.createProgram();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createRenderPipeline_e7c57f75917917e4: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.createRenderPipeline(arg1);
            return ret;
        }, arguments); },
        __wbg_createSampler_1271407d57de5444: function(arg0, arg1) {
            const ret = arg0.createSampler(arg1);
            return ret;
        },
        __wbg_createShaderModule_274373c4cacce3a0: function(arg0, arg1) {
            const ret = arg0.createShaderModule(arg1);
            return ret;
        },
        __wbg_createShader_6c1a2295587878a5: function(arg0, arg1) {
            const ret = arg0.createShader(arg1 >>> 0);
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createShader_7c9d99a21ecb08c0: function(arg0, arg1) {
            const ret = arg0.createShader(arg1 >>> 0);
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createTexture_01e8e591b64237de: function(arg0) {
            const ret = arg0.createTexture();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createTexture_272b1f1151792884: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.createTexture(arg1);
            return ret;
        }, arguments); },
        __wbg_createTexture_5f2583508ebe379b: function(arg0) {
            const ret = arg0.createTexture();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createView_7520397d720e9d7d: function() { return handleError(function (arg0) {
            const ret = arg0.createView();
            return ret;
        }, arguments); },
        __wbg_data_9ce11d34b90054d4: function(arg0, arg1) {
            const ret = arg1.data;
            const ptr1 = passArray8ToWasm0(ret, wasm.__wbindgen_malloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_depthFunc_92e96d8f46a23300: function(arg0, arg1) {
            arg0.depthFunc(arg1 >>> 0);
        },
        __wbg_depthFunc_a41fb5adacb22e09: function(arg0, arg1) {
            arg0.depthFunc(arg1 >>> 0);
        },
        __wbg_depthMask_06ecff4d4514c38f: function(arg0, arg1) {
            arg0.depthMask(arg1 !== 0);
        },
        __wbg_depthMask_0d7c3dec3b8405ee: function(arg0, arg1) {
            arg0.depthMask(arg1 !== 0);
        },
        __wbg_description_5b772983c6c8c35b: function(arg0, arg1) {
            const ret = arg1.description;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_destroy_4f73b79fa24aeb09: function(arg0) {
            arg0.destroy();
        },
        __wbg_destroy_f83fd85ed8ee84cb: function(arg0) {
            arg0.destroy();
        },
        __wbg_devicePixelRatio_7d39e9af5448d3d4: function(arg0) {
            const ret = arg0.devicePixelRatio;
            return ret;
        },
        __wbg_disableVertexAttribArray_11c9f11bee30c9d8: function(arg0, arg1) {
            arg0.disableVertexAttribArray(arg1 >>> 0);
        },
        __wbg_disableVertexAttribArray_c4c8af1f9e4120d4: function(arg0, arg1) {
            arg0.disableVertexAttribArray(arg1 >>> 0);
        },
        __wbg_disable_19fe787eccdf0272: function(arg0, arg1) {
            arg0.disable(arg1 >>> 0);
        },
        __wbg_disable_81b2cb5f8cea15ae: function(arg0, arg1) {
            arg0.disable(arg1 >>> 0);
        },
        __wbg_documentElement_3f718a9a39a893d3: function(arg0) {
            const ret = arg0.documentElement;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_document_9854e03c05fc8834: function(arg0) {
            const ret = arg0.document;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_drawArrays_08872e02fb57b847: function(arg0, arg1, arg2, arg3) {
            arg0.drawArrays(arg1 >>> 0, arg2, arg3);
        },
        __wbg_drawArrays_741af5c3f8db636f: function(arg0, arg1, arg2, arg3) {
            arg0.drawArrays(arg1 >>> 0, arg2, arg3);
        },
        __wbg_drawImage_3fed5f1f3393a907: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.drawImage(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
        }, arguments); },
        __wbg_draw_b3ff1fa9ff891153: function(arg0, arg1) {
            arg0.draw(arg1 >>> 0);
        },
        __wbg_enableVertexAttribArray_1496b78a8dbab9fd: function(arg0, arg1) {
            arg0.enableVertexAttribArray(arg1 >>> 0);
        },
        __wbg_enableVertexAttribArray_d52693866bc8b8dd: function(arg0, arg1) {
            arg0.enableVertexAttribArray(arg1 >>> 0);
        },
        __wbg_enable_6eeb9c0e9b483cee: function(arg0, arg1) {
            arg0.enable(arg1 >>> 0);
        },
        __wbg_enable_cb4fc19b51148c37: function(arg0, arg1) {
            arg0.enable(arg1 >>> 0);
        },
        __wbg_end_a97f51ac1f092bfe: function(arg0) {
            arg0.end();
        },
        __wbg_error_c9cf3fc2064683a9: function(arg0) {
            console.error(arg0);
        },
        __wbg_error_fb1c947d6e1e6ae6: function(arg0) {
            const ret = arg0.error;
            return ret;
        },
        __wbg_fetch_4178962c570137ca: function(arg0, arg1, arg2) {
            const ret = arg0.fetch(getStringFromWasm0(arg1, arg2));
            return ret;
        },
        __wbg_finish_173a156040775de3: function(arg0) {
            arg0.finish();
        },
        __wbg_finish_31ffb964be7e9749: function(arg0) {
            arg0.finish();
        },
        __wbg_finish_489db1750712613c: function(arg0) {
            const ret = arg0.finish();
            return ret;
        },
        __wbg_from_296ca31f8d0f1c52: function(arg0) {
            const ret = Array.from(arg0);
            return ret;
        },
        __wbg_getAttribLocation_5071f5fc51f90b1a: function(arg0, arg1, arg2, arg3) {
            const ret = arg0.getAttribLocation(arg1, getStringFromWasm0(arg2, arg3));
            return ret;
        },
        __wbg_getAttribLocation_ee9dfb2293fb9f7f: function(arg0, arg1, arg2, arg3) {
            const ret = arg0.getAttribLocation(arg1, getStringFromWasm0(arg2, arg3));
            return ret;
        },
        __wbg_getContext_051324720aa5b7e8: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.getContext(getStringFromWasm0(arg1, arg2), arg3);
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_getContext_635e36719cad2623: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_getCurrentTexture_f9b3ddbfb8575837: function() { return handleError(function (arg0) {
            const ret = arg0.getCurrentTexture();
            return ret;
        }, arguments); },
        __wbg_getElementById_cc94972b404e4eaa: function(arg0, arg1, arg2) {
            const ret = arg0.getElementById(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_getExtension_abfda2c5db286b07: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.getExtension(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_getGamepads_912bbd8a90a857f7: function() { return handleError(function (arg0) {
            const ret = arg0.getGamepads();
            return ret;
        }, arguments); },
        __wbg_getImageData_e3d068a7241cd3d4: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = arg0.getImageData(arg1, arg2, arg3, arg4);
            return ret;
        }, arguments); },
        __wbg_getItem_4c80b7663197c7ff: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg1.getItem(getStringFromWasm0(arg2, arg3));
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments); },
        __wbg_getParameter_974595a6624c6c10: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.getParameter(arg1 >>> 0);
            return ret;
        }, arguments); },
        __wbg_getParameter_a97f491753b05668: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.getParameter(arg1 >>> 0);
            return ret;
        }, arguments); },
        __wbg_getPreferredCanvasFormat_4d28b652aa67cc74: function(arg0) {
            const ret = arg0.getPreferredCanvasFormat();
            return (__wbindgen_enum_GpuTextureFormat.indexOf(ret) + 1 || 102) - 1;
        },
        __wbg_getProgramInfoLog_208fb1ff31006495: function(arg0, arg1, arg2) {
            const ret = arg1.getProgramInfoLog(arg2);
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_getProgramInfoLog_3276b294d6d42fe2: function(arg0, arg1, arg2) {
            const ret = arg1.getProgramInfoLog(arg2);
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_getProgramParameter_50bafab01cf88652: function(arg0, arg1, arg2) {
            const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
            return ret;
        },
        __wbg_getProgramParameter_fc7124bb9fb7c675: function(arg0, arg1, arg2) {
            const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
            return ret;
        },
        __wbg_getShaderInfoLog_7e0cbba353ca95da: function(arg0, arg1, arg2) {
            const ret = arg1.getShaderInfoLog(arg2);
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_getShaderInfoLog_bb64c5a52df0b7a3: function(arg0, arg1, arg2) {
            const ret = arg1.getShaderInfoLog(arg2);
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_getShaderParameter_745acf10b8e45e31: function(arg0, arg1, arg2) {
            const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
            return ret;
        },
        __wbg_getShaderParameter_e55ea9c456df5484: function(arg0, arg1, arg2) {
            const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
            return ret;
        },
        __wbg_getSupportedExtensions_1459bad37860c0c3: function(arg0) {
            const ret = arg0.getSupportedExtensions();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_getUniformLocation_50ba45dade572703: function(arg0, arg1, arg2, arg3) {
            const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_getUniformLocation_cb4e3e121235f91a: function(arg0, arg1, arg2, arg3) {
            const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_get_31af05bd4842a84f: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(arg0, arg1);
            return ret;
        }, arguments); },
        __wbg_get_6c896e0571ddae51: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        },
        __wbg_get_c750d30d265eb0c2: function(arg0, arg1, arg2, arg3) {
            const ret = arg1.get(getStringFromWasm0(arg2, arg3));
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_get_unchecked_288889d017702237: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        },
        __wbg_height_bd5d010e070a30f4: function(arg0) {
            const ret = arg0.height;
            return ret;
        },
        __wbg_height_fc97e1a0c2e7331f: function(arg0) {
            const ret = arg0.height;
            return ret;
        },
        __wbg_info_26925f73a2eee895: function(arg0) {
            console.info(arg0);
        },
        __wbg_info_4ee20f8d99eff464: function(arg0) {
            const ret = arg0.info;
            return ret;
        },
        __wbg_innerHeight_7f20e0f1a7c5a573: function() { return handleError(function (arg0) {
            const ret = arg0.innerHeight;
            return ret;
        }, arguments); },
        __wbg_innerWidth_1bc526614080537c: function() { return handleError(function (arg0) {
            const ret = arg0.innerWidth;
            return ret;
        }, arguments); },
        __wbg_instanceof_CanvasRenderingContext2d_769208c72dcbf5e6: function(arg0) {
            let result;
            try {
                result = arg0 instanceof CanvasRenderingContext2D;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_GamepadButton_194af99e75be79f5: function(arg0) {
            let result;
            try {
                result = arg0 instanceof GamepadButton;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Gamepad_379e1510b278c518: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Gamepad;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_GpuCanvasContext_ca72bf95eb3891ce: function(arg0) {
            let result;
            try {
                result = arg0 instanceof GPUCanvasContext;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_HtmlCanvasElement_0a30c11fbbf41841: function(arg0) {
            let result;
            try {
                result = arg0 instanceof HTMLCanvasElement;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_HtmlElement_32fb153a5a0e2349: function(arg0) {
            let result;
            try {
                result = arg0 instanceof HTMLElement;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Int32Array_4b9a86620726269b: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Int32Array;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Promise_e1dc6893aa1ece28: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Promise;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Response_b8758567269c30b2: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Response;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_WebGl2RenderingContext_64c994c14c0790fb: function(arg0) {
            let result;
            try {
                result = arg0 instanceof WebGL2RenderingContext;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Window_82d71df4eddf88bc: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Window;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_length_0acba72356589f9c: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_7f3c00c40364105e: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_d4bdea10311bd9cf: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_limits_a6925d5282828173: function(arg0) {
            const ret = arg0.limits;
            return ret;
        },
        __wbg_linkProgram_571a9ea00d38ff83: function(arg0, arg1) {
            arg0.linkProgram(arg1);
        },
        __wbg_linkProgram_acdc299c43d734a0: function(arg0, arg1) {
            arg0.linkProgram(arg1);
        },
        __wbg_localStorage_567c24950edbc178: function() { return handleError(function (arg0) {
            const ret = arg0.localStorage;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_location_9c46e8ada95d3174: function(arg0) {
            const ret = arg0.location;
            return ret;
        },
        __wbg_log_17c30ef363c61cf4: function(arg0) {
            console.log(arg0);
        },
        __wbg_lost_d8471d0116956ca8: function(arg0) {
            const ret = arg0.lost;
            return ret;
        },
        __wbg_mapping_2e4a8809afd7ba7a: function(arg0) {
            const ret = arg0.mapping;
            return (__wbindgen_enum_GamepadMappingType.indexOf(ret) + 1 || 3) - 1;
        },
        __wbg_matchMedia_8a4857f947f11f82: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.matchMedia(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_matches_778d0873b064b1bf: function(arg0) {
            const ret = arg0.matches;
            return ret;
        },
        __wbg_maxTextureDimension2D_0d9c34da173cba65: function(arg0) {
            const ret = arg0.maxTextureDimension2D;
            return ret;
        },
        __wbg_message_3c85b42fd16e8e14: function(arg0, arg1) {
            const ret = arg1.message;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_navigator_2156486643462a87: function(arg0) {
            const ret = arg0.navigator;
            return ret;
        },
        __wbg_new_1dbf7428bba60a42: function(arg0) {
            const ret = new Uint8Array(arg0);
            return ret;
        },
        __wbg_new_617a8cdb8bb1130e: function() {
            const ret = new Object();
            return ret;
        },
        __wbg_new_from_slice_2443ca2017fac0fd: function(arg0, arg1) {
            const ret = new Int16Array(getArrayI16FromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_new_typed_b01cb72a8af741a3: function(arg0, arg1) {
            try {
                var state0 = {a: arg0, b: arg1};
                var cb0 = (arg0, arg1) => {
                    const a = state0.a;
                    state0.a = 0;
                    try {
                        return wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___js_sys_5383572784e8feb6___Function_fn_wasm_bindgen_4ce2be26dcabc0e4___JsValue_____wasm_bindgen_4ce2be26dcabc0e4___sys__Undefined___js_sys_5383572784e8feb6___Function_fn_wasm_bindgen_4ce2be26dcabc0e4___JsValue_____wasm_bindgen_4ce2be26dcabc0e4___sys__Undefined_______true_(a, state0.b, arg0, arg1);
                    } finally {
                        state0.a = a;
                    }
                };
                const ret = new Promise(cb0);
                return ret;
            } finally {
                state0.a = 0;
            }
        },
        __wbg_new_with_str_bb707702009e7af7: function() { return handleError(function (arg0, arg1) {
            const ret = new URLSearchParams(getStringFromWasm0(arg0, arg1));
            return ret;
        }, arguments); },
        __wbg_now_d0b7f4bea9f38490: function(arg0) {
            const ret = arg0.now();
            return ret;
        },
        __wbg_ok_125878a7db256ecb: function(arg0) {
            const ret = arg0.ok;
            return ret;
        },
        __wbg_onSubmittedWorkDone_d185d0b92c93b668: function(arg0) {
            const ret = arg0.onSubmittedWorkDone();
            return ret;
        },
        __wbg_performance_d0d7b03fc649b694: function(arg0) {
            const ret = arg0.performance;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_pointerId_1b91f6b6c8f92501: function(arg0) {
            const ret = arg0.pointerId;
            return ret;
        },
        __wbg_pointerType_2e8b8270da489520: function(arg0, arg1) {
            const ret = arg1.pointerType;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_polygonOffset_81dc8ca84e29572b: function(arg0, arg1, arg2) {
            arg0.polygonOffset(arg1, arg2);
        },
        __wbg_polygonOffset_8f922d9173d8849d: function(arg0, arg1, arg2) {
            arg0.polygonOffset(arg1, arg2);
        },
        __wbg_pressed_e774166b0a6c08fc: function(arg0) {
            const ret = arg0.pressed;
            return ret;
        },
        __wbg_preventDefault_af59afb0f0a02e20: function(arg0) {
            arg0.preventDefault();
        },
        __wbg_prototypesetcall_13adbfb002dee200: function(arg0, arg1, arg2) {
            Int32Array.prototype.set.call(getArrayI32FromWasm0(arg0, arg1), arg2);
        },
        __wbg_prototypesetcall_bc27214492979395: function(arg0, arg1, arg2) {
            Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
        },
        __wbg_queueMicrotask_9833f9a49df95a49: function(arg0) {
            const ret = arg0.queueMicrotask;
            return ret;
        },
        __wbg_queueMicrotask_a72f977e97f23c5f: function(arg0) {
            queueMicrotask(arg0);
        },
        __wbg_queue_17ba8833afbd540b: function(arg0) {
            const ret = arg0.queue;
            return ret;
        },
        __wbg_readPixels_31e44e70558ac590: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
            arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
        }, arguments); },
        __wbg_readPixels_3321086a7818a739: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
            arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
        }, arguments); },
        __wbg_readPixels_eb030cd9976eeca5: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
            arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
        }, arguments); },
        __wbg_reason_a07fa80561c7b159: function(arg0) {
            const ret = arg0.reason;
            return (__wbindgen_enum_GpuDeviceLostReason.indexOf(ret) + 1 || 3) - 1;
        },
        __wbg_repeat_8e70ccf8a9875d04: function(arg0) {
            const ret = arg0.repeat;
            return ret;
        },
        __wbg_replaceWith_44b171f026e3cbce: function() { return handleError(function (arg0, arg1) {
            arg0.replaceWith(arg1);
        }, arguments); },
        __wbg_requestAdapter_ed5bc205588abf80: function(arg0) {
            const ret = arg0.requestAdapter();
            return ret;
        },
        __wbg_requestAnimationFrame_7b526ab7aa550c74: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.requestAnimationFrame(arg1);
            return ret;
        }, arguments); },
        __wbg_requestDevice_a6f2e5cbbbf80722: function(arg0) {
            const ret = arg0.requestDevice();
            return ret;
        },
        __wbg_resolve_0076e10020304ede: function(arg0) {
            const ret = Promise.resolve(arg0);
            return ret;
        },
        __wbg_scissor_12ddc324094acd50: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.scissor(arg1, arg2, arg3, arg4);
        },
        __wbg_scissor_a9468482697c2bdb: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.scissor(arg1, arg2, arg3, arg4);
        },
        __wbg_search_31c06ba77ebf51f4: function() { return handleError(function (arg0, arg1) {
            const ret = arg1.search;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments); },
        __wbg_setAttribute_9e7d603908f63705: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            arg0.setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        }, arguments); },
        __wbg_setBindGroup_1fe45e27dbc2a7b2: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.setBindGroup(arg1 >>> 0, arg2, getArrayJsValueViewFromWasm0(arg3, arg4));
        },
        __wbg_setItem_c5fb0966b484ecd3: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            arg0.setItem(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        }, arguments); },
        __wbg_setPipeline_9870f87d9e0a49ab: function(arg0, arg1) {
            arg0.setPipeline(arg1);
        },
        __wbg_setPointerCapture_a53e23b7bccef290: function() { return handleError(function (arg0, arg1) {
            arg0.setPointerCapture(arg1);
        }, arguments); },
        __wbg_setProperty_097bc3d55ce44513: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            arg0.setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        }, arguments); },
        __wbg_setScissorRect_78603d18fd6477a3: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.setScissorRect(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
        },
        __wbg_setVertexBuffer_a626937b64028452: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.setVertexBuffer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 >>> 0);
        },
        __wbg_setViewport_a10f0909ea1d3836: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.setViewport(arg1, arg2, arg3, arg4, arg5, arg6);
        },
        __wbg_set_145a351398b48c65: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(arg0, arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_set_a_d2dae9a62946ba86: function(arg0, arg1) {
            arg0.a = arg1;
        },
        __wbg_set_address_mode_u_38bbe83e7cb70867: function(arg0, arg1) {
            arg0.addressModeU = __wbindgen_enum_GpuAddressMode[arg1];
        },
        __wbg_set_address_mode_v_e4dc81ae95d4e2d1: function(arg0, arg1) {
            arg0.addressModeV = __wbindgen_enum_GpuAddressMode[arg1];
        },
        __wbg_set_alpha_b14827cf8b4ac26a: function(arg0, arg1) {
            arg0.alpha = arg1;
        },
        __wbg_set_alpha_mode_16c3966c224ad4a9: function(arg0, arg1) {
            arg0.alphaMode = __wbindgen_enum_GpuCanvasAlphaMode[arg1];
        },
        __wbg_set_array_stride_c30294b65e05ecbf: function(arg0, arg1) {
            arg0.arrayStride = arg1 >>> 0;
        },
        __wbg_set_attributes_9f3751b5d4cb6fbf: function(arg0, arg1, arg2) {
            arg0.attributes = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_b_670dfc0631dcb9c1: function(arg0, arg1) {
            arg0.b = arg1;
        },
        __wbg_set_bind_group_layouts_60a4869809302d79: function(arg0, arg1, arg2) {
            arg0.bindGroupLayouts = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_binding_1d51e1a2d1c0cdaf: function(arg0, arg1) {
            arg0.binding = arg1 >>> 0;
        },
        __wbg_set_binding_348f002e688081ac: function(arg0, arg1) {
            arg0.binding = arg1 >>> 0;
        },
        __wbg_set_blend_3f83603fc878c51d: function(arg0, arg1) {
            arg0.blend = arg1;
        },
        __wbg_set_buffer_22331adbf81699d2: function(arg0, arg1) {
            arg0.buffer = arg1;
        },
        __wbg_set_buffer_b8d40a54af365605: function(arg0, arg1) {
            arg0.buffer = arg1;
        },
        __wbg_set_buffers_c1346a3c65c0829a: function(arg0, arg1, arg2) {
            arg0.buffers = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_bytes_per_row_95041361899e65c1: function(arg0, arg1) {
            arg0.bytesPerRow = arg1 >>> 0;
        },
        __wbg_set_className_541fce5cd31918aa: function(arg0, arg1, arg2) {
            arg0.className = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_clear_value_gpu_color_dict_c17321221601e286: function(arg0, arg1) {
            arg0.clearValue = arg1;
        },
        __wbg_set_code_4510e93549b3066e: function(arg0, arg1, arg2) {
            arg0.code = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_color_14d2fdcfc7117305: function(arg0, arg1) {
            arg0.color = arg1;
        },
        __wbg_set_color_attachments_367a5baf85bca057: function(arg0, arg1, arg2) {
            arg0.colorAttachments = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_count_d8af002c4b4b808d: function(arg0, arg1) {
            arg0.count = arg1 >>> 0;
        },
        __wbg_set_cull_mode_7a9f5499205a7f66: function(arg0, arg1) {
            arg0.cullMode = __wbindgen_enum_GpuCullMode[arg1];
        },
        __wbg_set_depth_bias_1994cc72067a977b: function(arg0, arg1) {
            arg0.depthBias = arg1;
        },
        __wbg_set_depth_bias_slope_scale_7aa61e8c4189f10f: function(arg0, arg1) {
            arg0.depthBiasSlopeScale = arg1;
        },
        __wbg_set_depth_clear_value_5063e6b8ebc5e409: function(arg0, arg1) {
            arg0.depthClearValue = arg1;
        },
        __wbg_set_depth_compare_6bbd783f803d2663: function(arg0, arg1) {
            arg0.depthCompare = __wbindgen_enum_GpuCompareFunction[arg1];
        },
        __wbg_set_depth_load_op_a1b09a7ef6e4c3d4: function(arg0, arg1) {
            arg0.depthLoadOp = __wbindgen_enum_GpuLoadOp[arg1];
        },
        __wbg_set_depth_stencil_attachment_d17d58f9212bc033: function(arg0, arg1) {
            arg0.depthStencilAttachment = arg1;
        },
        __wbg_set_depth_stencil_feb50d4de7e35eb1: function(arg0, arg1) {
            arg0.depthStencil = arg1;
        },
        __wbg_set_depth_store_op_da4447aff70c723d: function(arg0, arg1) {
            arg0.depthStoreOp = __wbindgen_enum_GpuStoreOp[arg1];
        },
        __wbg_set_depth_write_enabled_88916d207b076ce9: function(arg0, arg1) {
            arg0.depthWriteEnabled = arg1 !== 0;
        },
        __wbg_set_device_53f6c9076263d322: function(arg0, arg1) {
            arg0.device = arg1;
        },
        __wbg_set_dst_factor_cfb1cd4ae3e673d9: function(arg0, arg1) {
            arg0.dstFactor = __wbindgen_enum_GpuBlendFactor[arg1];
        },
        __wbg_set_entries_7c51a3643c761ecf: function(arg0, arg1, arg2) {
            arg0.entries = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_entries_cc80db0de96ea4ff: function(arg0, arg1, arg2) {
            arg0.entries = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_entry_point_a7593f073d0352f7: function(arg0, arg1, arg2) {
            arg0.entryPoint = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_entry_point_edfb9dd004493bc8: function(arg0, arg1, arg2) {
            arg0.entryPoint = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_format_036434fd3db220e7: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        },
        __wbg_set_format_67f2d982476ea95a: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        },
        __wbg_set_format_6bbbd4df6747733e: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        },
        __wbg_set_format_d1ce90a1fc3dd2cc: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuVertexFormat[arg1];
        },
        __wbg_set_format_d4c8ef73b087dab0: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        },
        __wbg_set_fragment_9bc5cc98c7c59fef: function(arg0, arg1) {
            arg0.fragment = arg1;
        },
        __wbg_set_g_ac69babc4a0b2338: function(arg0, arg1) {
            arg0.g = arg1;
        },
        __wbg_set_has_dynamic_offset_e2a0bd85eaf36f34: function(arg0, arg1) {
            arg0.hasDynamicOffset = arg1 !== 0;
        },
        __wbg_set_height_c9789c1c77eaedff: function(arg0, arg1) {
            arg0.height = arg1 >>> 0;
        },
        __wbg_set_id_60955e6018d03b26: function(arg0, arg1, arg2) {
            arg0.id = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_layout_4e86f7c1671a06d0: function(arg0, arg1) {
            arg0.layout = arg1;
        },
        __wbg_set_layout_f2b50454b73e9111: function(arg0, arg1) {
            arg0.layout = arg1;
        },
        __wbg_set_load_op_18ff54287ff40151: function(arg0, arg1) {
            arg0.loadOp = __wbindgen_enum_GpuLoadOp[arg1];
        },
        __wbg_set_mag_filter_91c348b29e1a6e57: function(arg0, arg1) {
            arg0.magFilter = __wbindgen_enum_GpuFilterMode[arg1];
        },
        __wbg_set_min_filter_fdbe96994784b13c: function(arg0, arg1) {
            arg0.minFilter = __wbindgen_enum_GpuFilterMode[arg1];
        },
        __wbg_set_module_168054323d22d57d: function(arg0, arg1) {
            arg0.module = arg1;
        },
        __wbg_set_module_1ad4e7343951303d: function(arg0, arg1) {
            arg0.module = arg1;
        },
        __wbg_set_multisample_ac97d83121c016de: function(arg0, arg1) {
            arg0.multisample = arg1;
        },
        __wbg_set_offset_618dd5b4444a70c9: function(arg0, arg1) {
            arg0.offset = arg1 >>> 0;
        },
        __wbg_set_onuncapturederror_cb90b60ddf08d90e: function(arg0, arg1) {
            arg0.onuncapturederror = arg1;
        },
        __wbg_set_operation_d8894b0f9aa3db27: function(arg0, arg1) {
            arg0.operation = __wbindgen_enum_GpuBlendOperation[arg1];
        },
        __wbg_set_preserve_drawing_buffer_e24a9888a6cb18b6: function(arg0, arg1) {
            arg0.preserveDrawingBuffer = arg1 !== 0;
        },
        __wbg_set_primitive_3b6c52880715b903: function(arg0, arg1) {
            arg0.primitive = arg1;
        },
        __wbg_set_r_ccf9fe3e4d993555: function(arg0, arg1) {
            arg0.r = arg1;
        },
        __wbg_set_resolve_target_gpu_texture_view_3f66a54e8fb729d5: function(arg0, arg1) {
            arg0.resolveTarget = arg1;
        },
        __wbg_set_resource_3367d3d5c5114a05: function(arg0, arg1) {
            arg0.resource = arg1;
        },
        __wbg_set_resource_gpu_buffer_binding_c689b0dc9379a99b: function(arg0, arg1) {
            arg0.resource = arg1;
        },
        __wbg_set_resource_gpu_texture_view_2ed0c241a5831597: function(arg0, arg1) {
            arg0.resource = arg1;
        },
        __wbg_set_rows_per_image_97b4a26f53457ed3: function(arg0, arg1) {
            arg0.rowsPerImage = arg1 >>> 0;
        },
        __wbg_set_sample_count_06bd5decdb9d2471: function(arg0, arg1) {
            arg0.sampleCount = arg1 >>> 0;
        },
        __wbg_set_sample_type_1e16dd736b699077: function(arg0, arg1) {
            arg0.sampleType = __wbindgen_enum_GpuTextureSampleType[arg1];
        },
        __wbg_set_sampler_e7e837391d5b7c70: function(arg0, arg1) {
            arg0.sampler = arg1;
        },
        __wbg_set_shader_location_c7d2a36952c56851: function(arg0, arg1) {
            arg0.shaderLocation = arg1 >>> 0;
        },
        __wbg_set_size_4716cf40ee7a64be: function(arg0, arg1) {
            arg0.size = arg1 >>> 0;
        },
        __wbg_set_size_c2eb75980b76e0ac: function(arg0, arg1, arg2) {
            arg0.size = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_size_cde62ab9f3c247b5: function(arg0, arg1) {
            arg0.size = arg1 >>> 0;
        },
        __wbg_set_src_factor_b29ea819b1b5d6f6: function(arg0, arg1) {
            arg0.srcFactor = __wbindgen_enum_GpuBlendFactor[arg1];
        },
        __wbg_set_store_op_6d2fb6cc3e66341e: function(arg0, arg1) {
            arg0.storeOp = __wbindgen_enum_GpuStoreOp[arg1];
        },
        __wbg_set_targets_0328c60fcfc0f564: function(arg0, arg1, arg2) {
            arg0.targets = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_textContent_6d6fc559f198055f: function(arg0, arg1, arg2) {
            arg0.textContent = arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_texture_9f67e0e92f7c2af3: function(arg0, arg1) {
            arg0.texture = arg1;
        },
        __wbg_set_texture_e6c25e637d8a26a4: function(arg0, arg1) {
            arg0.texture = arg1;
        },
        __wbg_set_topology_36f1b64a3f922a23: function(arg0, arg1) {
            arg0.topology = __wbindgen_enum_GpuPrimitiveTopology[arg1];
        },
        __wbg_set_type_8e9e3a274f528f3e: function(arg0, arg1) {
            arg0.type = __wbindgen_enum_GpuSamplerBindingType[arg1];
        },
        __wbg_set_type_ff9e8f3110ad0cbf: function(arg0, arg1) {
            arg0.type = __wbindgen_enum_GpuBufferBindingType[arg1];
        },
        __wbg_set_usage_7177d2b5a0cb7ed1: function(arg0, arg1) {
            arg0.usage = arg1 >>> 0;
        },
        __wbg_set_usage_aad5221dc614bcd1: function(arg0, arg1) {
            arg0.usage = arg1 >>> 0;
        },
        __wbg_set_usage_e842e619c53799e7: function(arg0, arg1) {
            arg0.usage = arg1 >>> 0;
        },
        __wbg_set_vertex_5b13839ffaff5f37: function(arg0, arg1) {
            arg0.vertex = arg1;
        },
        __wbg_set_view_dimension_07b5c66946c78442: function(arg0, arg1) {
            arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
        },
        __wbg_set_view_gpu_texture_view_8d8dd7c0c832a505: function(arg0, arg1) {
            arg0.view = arg1;
        },
        __wbg_set_view_gpu_texture_view_9f7613e516713508: function(arg0, arg1) {
            arg0.view = arg1;
        },
        __wbg_set_visibility_78cfb96740c9deb5: function(arg0, arg1) {
            arg0.visibility = arg1 >>> 0;
        },
        __wbg_set_width_b0e1267db4b196b5: function(arg0, arg1) {
            arg0.width = arg1 >>> 0;
        },
        __wbg_shaderSource_06379dac249994dd: function(arg0, arg1, arg2, arg3) {
            arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
        },
        __wbg_shaderSource_c8812639b47d87b9: function(arg0, arg1, arg2, arg3) {
            arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
        },
        __wbg_static_accessor_GLOBAL_266715b9d96ba635: function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_GLOBAL_THIS_10fb7dc1ae063179: function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_SELF_0b583911f537483a: function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_WINDOW_d7f903d1508cbdc4: function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_status_ce0a98d3c57125f3: function(arg0) {
            const ret = arg0.status;
            return ret;
        },
        __wbg_style_4bce24230e493a7c: function(arg0) {
            const ret = arg0.style;
            return ret;
        },
        __wbg_submit_46ecaa46ea244579: function(arg0, arg1, arg2) {
            arg0.submit(getArrayJsValueViewFromWasm0(arg1, arg2));
        },
        __wbg_texImage2D_82bf2b4c8aa9a1db: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
        }, arguments); },
        __wbg_texImage2D_a856af552acdc9d9: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
        }, arguments); },
        __wbg_texImage2D_ca3d0fe24620ec85: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
        }, arguments); },
        __wbg_texParameteri_647fdb1426809cb5: function(arg0, arg1, arg2, arg3) {
            arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
        },
        __wbg_texParameteri_7864076abcdb03e0: function(arg0, arg1, arg2, arg3) {
            arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
        },
        __wbg_then_c8a35d4ad59c6b8e: function(arg0, arg1) {
            const ret = arg0.then(arg1);
            return ret;
        },
        __wbg_then_c949d5a25a4e78f8: function(arg0, arg1, arg2) {
            const ret = arg0.then(arg1, arg2);
            return ret;
        },
        __wbg_then_e71170d78fcf8954: function(arg0, arg1) {
            const ret = arg0.then(arg1);
            return ret;
        },
        __wbg_toggle_40db1492f54c657f: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.toggle(getStringFromWasm0(arg1, arg2), arg3 !== 0);
            return ret;
        }, arguments); },
        __wbg_uniform1i_531b98c4a7177366: function(arg0, arg1, arg2) {
            arg0.uniform1i(arg1, arg2);
        },
        __wbg_uniform1i_fc2dc8cadc49d8ec: function(arg0, arg1, arg2) {
            arg0.uniform1i(arg1, arg2);
        },
        __wbg_useProgram_5bdae58fd9f9826f: function(arg0, arg1) {
            arg0.useProgram(arg1);
        },
        __wbg_useProgram_e075c2902e420761: function(arg0, arg1) {
            arg0.useProgram(arg1);
        },
        __wbg_userAgent_cde4c65cc98db425: function() { return handleError(function (arg0, arg1) {
            const ret = arg1.userAgent;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments); },
        __wbg_vendor_0f28bae5f0bebe8f: function(arg0, arg1) {
            const ret = arg1.vendor;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_vertexAttribPointer_24b495e18df325dc: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
        },
        __wbg_vertexAttribPointer_54d56b18f71a946d: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
        },
        __wbg_viewport_16936692526e2ce6: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.viewport(arg1, arg2, arg3, arg4);
        },
        __wbg_viewport_e35d16c542d2ce70: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.viewport(arg1, arg2, arg3, arg4);
        },
        __wbg_warn_13abc63e0d4b3527: function(arg0) {
            console.warn(arg0);
        },
        __wbg_width_3d0dce3d9892e35e: function(arg0) {
            const ret = arg0.width;
            return ret;
        },
        __wbg_width_f1234333517222c4: function(arg0) {
            const ret = arg0.width;
            return ret;
        },
        __wbg_writeBuffer_2c02702ce0fa25c3: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            arg0.writeBuffer(arg1, arg2 >>> 0, getArrayU8FromWasm0(arg3, arg4));
        }, arguments); },
        __wbg_writeTexture_2bebcfd79754afa7: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.writeTexture(arg1, getArrayU8FromWasm0(arg2, arg3), arg4, getArrayJsValueViewFromWasm0(arg5, arg6));
        }, arguments); },
        __wbindgen_generic_0000000000000001: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 128, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue______true_);
            return ret;
        },
        __wbindgen_generic_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 751, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue__core_9b3796e30d99ddb7___result__Result_____wasm_bindgen_4ce2be26dcabc0e4___JsError___true_);
            return ret;
        },
        __wbindgen_generic_0000000000000003: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [F64], shim_idx: 138, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___f64______true_);
            return ret;
        },
        __wbindgen_generic_0000000000000004: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("Event")], shim_idx: 128, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue______true__33);
            return ret;
        },
        __wbindgen_generic_0000000000000005: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("GPUDevice")], shim_idx: 130, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___sys__JsNullable_web_sys_7d5d0dc68e3bdfdb___features__gen_GpuAdapter__GpuAdapter___core_9b3796e30d99ddb7___result__Result_____wasm_bindgen_4ce2be26dcabc0e4___JsError___true_);
            return ret;
        },
        __wbindgen_generic_0000000000000006: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("GPUDeviceLostInfo")], shim_idx: 130, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___sys__JsNullable_web_sys_7d5d0dc68e3bdfdb___features__gen_GpuAdapter__GpuAdapter___core_9b3796e30d99ddb7___result__Result_____wasm_bindgen_4ce2be26dcabc0e4___JsError___true__35);
            return ret;
        },
        __wbindgen_generic_0000000000000007: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("GPUUncapturedErrorEvent")], shim_idx: 128, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue______true__36);
            return ret;
        },
        __wbindgen_generic_0000000000000008: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("KeyboardEvent")], shim_idx: 128, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue______true__37);
            return ret;
        },
        __wbindgen_generic_0000000000000009: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("PointerEvent")], shim_idx: 128, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue______true__38);
            return ret;
        },
        __wbindgen_generic_000000000000000a: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("any")], shim_idx: 130, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___sys__JsNullable_web_sys_7d5d0dc68e3bdfdb___features__gen_GpuAdapter__GpuAdapter___core_9b3796e30d99ddb7___result__Result_____wasm_bindgen_4ce2be26dcabc0e4___JsError___true__39);
            return ret;
        },
        __wbindgen_generic_000000000000000b: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("undefined")], shim_idx: 130, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___sys__JsNullable_web_sys_7d5d0dc68e3bdfdb___features__gen_GpuAdapter__GpuAdapter___core_9b3796e30d99ddb7___result__Result_____wasm_bindgen_4ce2be26dcabc0e4___JsError___true__40);
            return ret;
        },
        __wbindgen_generic_000000000000000c: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_generic_000000000000000d: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(F32)) -> NamedExternref("Float32Array")`.
            const ret = getArrayF32FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_000000000000000e: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(I16)) -> NamedExternref("Int16Array")`.
            const ret = getArrayI16FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_000000000000000f: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(I32)) -> NamedExternref("Int32Array")`.
            const ret = getArrayI32FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_0000000000000010: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(I8)) -> NamedExternref("Int8Array")`.
            const ret = getArrayI8FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_0000000000000011: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(U16)) -> NamedExternref("Uint16Array")`.
            const ret = getArrayU16FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_0000000000000012: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(U32)) -> NamedExternref("Uint32Array")`.
            const ret = getArrayU32FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_0000000000000013: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(U8)) -> NamedExternref("Uint8Array")`.
            const ret = getArrayU8FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_0000000000000014: function(arg0, arg1) {
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
        "./sm64_web_bg.js": import0,
    };
}

function wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue______true_(arg0, arg1, arg2) {
    wasm.wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue______true_(arg0, arg1, arg2);
}

function wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue______true__33(arg0, arg1, arg2) {
    wasm.wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue______true__33(arg0, arg1, arg2);
}

function wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue______true__36(arg0, arg1, arg2) {
    wasm.wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue______true__36(arg0, arg1, arg2);
}

function wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue______true__37(arg0, arg1, arg2) {
    wasm.wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue______true__37(arg0, arg1, arg2);
}

function wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue______true__38(arg0, arg1, arg2) {
    wasm.wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue______true__38(arg0, arg1, arg2);
}

function wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue__core_9b3796e30d99ddb7___result__Result_____wasm_bindgen_4ce2be26dcabc0e4___JsError___true_(arg0, arg1, arg2) {
    const ret = wasm.wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___JsValue__core_9b3796e30d99ddb7___result__Result_____wasm_bindgen_4ce2be26dcabc0e4___JsError___true_(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___sys__JsNullable_web_sys_7d5d0dc68e3bdfdb___features__gen_GpuAdapter__GpuAdapter___core_9b3796e30d99ddb7___result__Result_____wasm_bindgen_4ce2be26dcabc0e4___JsError___true_(arg0, arg1, arg2) {
    const ret = wasm.wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___sys__JsNullable_web_sys_7d5d0dc68e3bdfdb___features__gen_GpuAdapter__GpuAdapter___core_9b3796e30d99ddb7___result__Result_____wasm_bindgen_4ce2be26dcabc0e4___JsError___true_(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___sys__JsNullable_web_sys_7d5d0dc68e3bdfdb___features__gen_GpuAdapter__GpuAdapter___core_9b3796e30d99ddb7___result__Result_____wasm_bindgen_4ce2be26dcabc0e4___JsError___true__35(arg0, arg1, arg2) {
    const ret = wasm.wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___sys__JsNullable_web_sys_7d5d0dc68e3bdfdb___features__gen_GpuAdapter__GpuAdapter___core_9b3796e30d99ddb7___result__Result_____wasm_bindgen_4ce2be26dcabc0e4___JsError___true__35(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___sys__JsNullable_web_sys_7d5d0dc68e3bdfdb___features__gen_GpuAdapter__GpuAdapter___core_9b3796e30d99ddb7___result__Result_____wasm_bindgen_4ce2be26dcabc0e4___JsError___true__39(arg0, arg1, arg2) {
    const ret = wasm.wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___sys__JsNullable_web_sys_7d5d0dc68e3bdfdb___features__gen_GpuAdapter__GpuAdapter___core_9b3796e30d99ddb7___result__Result_____wasm_bindgen_4ce2be26dcabc0e4___JsError___true__39(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___sys__JsNullable_web_sys_7d5d0dc68e3bdfdb___features__gen_GpuAdapter__GpuAdapter___core_9b3796e30d99ddb7___result__Result_____wasm_bindgen_4ce2be26dcabc0e4___JsError___true__40(arg0, arg1, arg2) {
    const ret = wasm.wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___wasm_bindgen_4ce2be26dcabc0e4___sys__JsNullable_web_sys_7d5d0dc68e3bdfdb___features__gen_GpuAdapter__GpuAdapter___core_9b3796e30d99ddb7___result__Result_____wasm_bindgen_4ce2be26dcabc0e4___JsError___true__40(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___js_sys_5383572784e8feb6___Function_fn_wasm_bindgen_4ce2be26dcabc0e4___JsValue_____wasm_bindgen_4ce2be26dcabc0e4___sys__Undefined___js_sys_5383572784e8feb6___Function_fn_wasm_bindgen_4ce2be26dcabc0e4___JsValue_____wasm_bindgen_4ce2be26dcabc0e4___sys__Undefined_______true_(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___js_sys_5383572784e8feb6___Function_fn_wasm_bindgen_4ce2be26dcabc0e4___JsValue_____wasm_bindgen_4ce2be26dcabc0e4___sys__Undefined___js_sys_5383572784e8feb6___Function_fn_wasm_bindgen_4ce2be26dcabc0e4___JsValue_____wasm_bindgen_4ce2be26dcabc0e4___sys__Undefined_______true_(arg0, arg1, arg2, arg3);
}

function wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___f64______true_(arg0, arg1, arg2) {
    wasm.wasm_bindgen_4ce2be26dcabc0e4___convert__closures_____invoke___f64______true_(arg0, arg1, arg2);
}


const __wbindgen_enum_GamepadMappingType = ["", "standard"];


const __wbindgen_enum_GpuAddressMode = ["clamp-to-edge", "repeat", "mirror-repeat"];


const __wbindgen_enum_GpuBlendFactor = ["zero", "one", "src", "one-minus-src", "src-alpha", "one-minus-src-alpha", "dst", "one-minus-dst", "dst-alpha", "one-minus-dst-alpha", "src-alpha-saturated", "constant", "one-minus-constant", "src1", "one-minus-src1", "src1-alpha", "one-minus-src1-alpha"];


const __wbindgen_enum_GpuBlendOperation = ["add", "subtract", "reverse-subtract", "min", "max"];


const __wbindgen_enum_GpuBufferBindingType = ["uniform", "storage", "read-only-storage"];


const __wbindgen_enum_GpuCanvasAlphaMode = ["opaque", "premultiplied"];


const __wbindgen_enum_GpuCompareFunction = ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"];


const __wbindgen_enum_GpuCullMode = ["none", "front", "back"];


const __wbindgen_enum_GpuDeviceLostReason = ["unknown", "destroyed"];


const __wbindgen_enum_GpuFilterMode = ["nearest", "linear"];


const __wbindgen_enum_GpuLoadOp = ["load", "clear"];


const __wbindgen_enum_GpuPrimitiveTopology = ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"];


const __wbindgen_enum_GpuSamplerBindingType = ["filtering", "non-filtering", "comparison"];


const __wbindgen_enum_GpuStoreOp = ["store", "discard"];


const __wbindgen_enum_GpuTextureFormat = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16unorm", "r16snorm", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16unorm", "rg16snorm", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16unorm", "rgba16snorm", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"];


const __wbindgen_enum_GpuTextureSampleType = ["float", "unfilterable-float", "depth", "sint", "uint"];


const __wbindgen_enum_GpuTextureViewDimension = ["1d", "2d", "2d-array", "cube", "cube-array", "3d"];


const __wbindgen_enum_GpuVertexFormat = ["uint8", "uint8x2", "uint8x4", "sint8", "sint8x2", "sint8x4", "unorm8", "unorm8x2", "unorm8x4", "snorm8", "snorm8x2", "snorm8x4", "uint16", "uint16x2", "uint16x4", "sint16", "sint16x2", "sint16x4", "unorm16", "unorm16x2", "unorm16x4", "snorm16", "snorm16x2", "snorm16x4", "float16", "float16x2", "float16x4", "float32", "float32x2", "float32x3", "float32x4", "uint32", "uint32x2", "uint32x3", "uint32x4", "sint32", "sint32x2", "sint32x3", "sint32x4", "unorm10-10-10-2", "unorm8x4-bgra"];

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => wasm.__wbindgen_destroy_closure(state.a, state.b));

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayI16FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt16ArrayMemory0().subarray(ptr / 2, ptr / 2 + len);
}

function getArrayI32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayI8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function getArrayJsValueViewFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    return result;
}

function getArrayU16FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint16ArrayMemory0().subarray(ptr / 2, ptr / 2 + len);
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat32ArrayMemory0 = null;
function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

let cachedInt16ArrayMemory0 = null;
function getInt16ArrayMemory0() {
    if (cachedInt16ArrayMemory0 === null || cachedInt16ArrayMemory0.byteLength === 0) {
        cachedInt16ArrayMemory0 = new Int16Array(wasm.memory.buffer);
    }
    return cachedInt16ArrayMemory0;
}

let cachedInt32ArrayMemory0 = null;
function getInt32ArrayMemory0() {
    if (cachedInt32ArrayMemory0 === null || cachedInt32ArrayMemory0.byteLength === 0) {
        cachedInt32ArrayMemory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32ArrayMemory0;
}

let cachedInt8ArrayMemory0 = null;
function getInt8ArrayMemory0() {
    if (cachedInt8ArrayMemory0 === null || cachedInt8ArrayMemory0.byteLength === 0) {
        cachedInt8ArrayMemory0 = new Int8Array(wasm.memory.buffer);
    }
    return cachedInt8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint16ArrayMemory0 = null;
function getUint16ArrayMemory0() {
    if (cachedUint16ArrayMemory0 === null || cachedUint16ArrayMemory0.byteLength === 0) {
        cachedUint16ArrayMemory0 = new Uint16Array(wasm.memory.buffer);
    }
    return cachedUint16ArrayMemory0;
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

function isLikeNone(x) {
    return x === undefined || x === null;
}

function makeMutClosure(arg0, arg1, f) {
    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            wasm.__wbindgen_destroy_closure(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
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

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedFloat32ArrayMemory0 = null;
    cachedInt16ArrayMemory0 = null;
    cachedInt32ArrayMemory0 = null;
    cachedInt8ArrayMemory0 = null;
    cachedUint16ArrayMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (!module.ok) {
            throw new Error(`failed to fetch Wasm: ${module.status} ${module.statusText} fetching '${module.url}'`);
        }

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = expectedResponseType(module.type);

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
        module_or_path = new URL('sm64_web_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
