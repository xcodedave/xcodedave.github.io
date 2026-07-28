// Entry point for the transcription Web Worker. This is the one piece of
// hand-written JS the project needs: Workers require a JS module as their
// entry point, and that module has to `import` the wasm-bindgen "web"-target
// glue itself (a wasm module can't be a Worker's entry point directly). All
// actual logic lives in Rust (`crates/worker`) - this file just boots the
// wasm module and forwards incoming messages to it.
import init, { handle_message } from "./worker-pkg/worker.js";

let ready = init();

self.onmessage = async (event) => {
  await ready;
  handle_message(event.data);
};
