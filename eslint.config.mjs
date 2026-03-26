import { createRequire } from "module";

const require = createRequire(import.meta.url);
const coreWebVitals = require("eslint-config-next/core-web-vitals");
const typescript = require("eslint-config-next/typescript");

const config = [
  { ignores: [".source/**", ".next/**", "node_modules/**"] },
  ...coreWebVitals,
  ...typescript,
];

export default config;
