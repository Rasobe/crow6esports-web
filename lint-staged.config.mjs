export default {
  "*.{js,mjs,ts,tsx,astro}": ["eslint --fix --max-warnings=0", "prettier --write"],
  "*.{json,md,mdx,css,yml,yaml}": "prettier --write",
  "*.{png,jpg,jpeg,webp}": "node scripts/check-image-size.mjs",
};
