import { statSync } from "node:fs";

const MAX = 300 * 1024;
const big = process.argv.slice(2).filter((f) => statSync(f).size > MAX);
if (big.length) {
  console.error("Imágenes > 300 KB:\n" + big.join("\n"));
  process.exit(1);
}
