const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const api = fs.readFileSync(path.join(root, "constants/api.ts"), "utf8");
const service = fs.readFileSync(path.join(root, "services/formService.ts"), "utf8");

assert.match(api, /API_CF7_URL = ".+\/contact-form-7\/v1"/);
assert.match(service, /\/contact-forms\/\$\{formId\}\/feedback/);
assert.match(service, /new FormData\(\)/);
assert.match(service, /data\?\.status !== "mail_sent"/);
assert.doesNotMatch(service, /body:\s*JSON\.stringify\(payload\)/);

console.log("Package enquiry submission uses the CF7 mail endpoint and verifies delivery.");
