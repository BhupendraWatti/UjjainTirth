const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(process.cwd());
const packageJson = require(path.join(root, "package.json"));
const nativeLoader = fs.readFileSync(
  path.join(root, "modules", "otp-autofill", "src", "OtpAutofillModule.ts"),
  "utf8"
);
const androidService = fs.readFileSync(
  path.join(root, "services", "otpAutofill.android.ts"),
  "utf8"
);

assert.match(packageJson.scripts.start, /--dev-client/);
assert.match(nativeLoader, /requireOptionalNativeModule/);
assert.match(androidService, /if \(!module\)/);

console.log("OTP native runtime guard is configured correctly.");
