const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

let timeoutCallback;
let timeoutMs;
let rejectFetch;

class AbortController {
  constructor() {
    this.signal = {};
  }

  abort() {
    // React Native can surface an aborted request through XHR's generic error event.
    rejectFetch(new TypeError("Network request failed"));
  }
}

const source = fs.readFileSync("services/authService.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const context = {
  exports: {},
  require(name) {
    if (name === "@/constants/api") {
      return {
        API_GRANTH_URL: "https://example.test",
        API_ENDPOINTS: { VERIFY_OTP: "/verify" },
        DEFAULT_HEADERS: {},
      };
    }
    if (name === "@/utils/storage") return {};
    throw new Error(`Unexpected dependency: ${name}`);
  },
  AbortController,
  fetch() {
    return new Promise((_, reject) => {
      rejectFetch = reject;
    });
  },
  setTimeout(callback, ms) {
    timeoutCallback = callback;
    timeoutMs = ms;
    return 1;
  },
  clearTimeout() {},
  console,
};

vm.runInNewContext(compiled, context);

async function check() {
  const resultPromise = context.exports.verifyOtp("9999999999", "123456");
  assert.equal(timeoutMs, 30_000, "OTP verification must allow slow mobile HTTPS handshakes");
  timeoutCallback();
  const result = await resultPromise;
  assert.deepEqual(
    { success: result.success, message: result.message },
    { success: false, message: "The server took too long to respond. Please try again." },
    "A timer-triggered React Native network error must be reported as a timeout"
  );
  console.log("OTP service timeout window and React Native abort classification passed.");
}

check().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
