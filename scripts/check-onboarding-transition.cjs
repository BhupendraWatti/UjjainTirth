const assert = require("node:assert/strict");
const fs = require("node:fs");

const authLayout = fs.readFileSync("app/(auth)/_layout.tsx", "utf8");

assert.match(authLayout, /import\s*{\s*Slot\s*}\s*from\s*"expo-router"/);
assert.match(authLayout, /return\s*<Slot\s*\/>/);
assert.doesNotMatch(
  authLayout,
  /\bStack\b/,
  "Auth routes must not use a nested native stack: react-native-screens can leave the outgoing Fabric view parented"
);

console.log("Onboarding transition: auth routes bypass the native removal transition.");
