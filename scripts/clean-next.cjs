/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const targets = [path.join(process.cwd(), ".next"), path.join(process.cwd(), "node_modules", ".cache")];

for (const dir of targets) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log("Removed:", dir);
  } catch {
    // yoksa sorun değil
  }
}
