const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(".");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const layout = read("app/_layout.tsx");
const products = read("hooks/useProducts.ts");
const loader = read("components/common/AvailabilityLoader.tsx");

for (const queryKey of [
  "services",
  "packages",
  "temples",
  "poojas",
  "accommodation",
  "transport_services",
  "narmada_parikrama",
]) {
  assert.match(layout, new RegExp(`queryKey: \\[\\"${queryKey}\\"`));
}

assert.match(layout, /gcTime:\s*1000 \* 60 \* 30/);
assert.doesNotMatch(layout, /Promise\.all\(/);
assert.equal((layout.match(/retry: false/g) || []).length, 7);
assert.match(products, /queryKey:\s*\["packages"\]/);
assert.match(loader, /const \[showContent, setShowContent\] = useState\(false\)/);

for (const file of [
  "services/templeService.ts",
  "services/onboarding.ts",
  "services/jyotirlingTourService.ts",
]) {
  assert.doesNotMatch(read(file), /nocache/);
}

console.log("Prefetch/cache contract verified.");
