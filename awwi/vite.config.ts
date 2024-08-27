import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import resolve from "vite-plugin-resolve";
import { AZTEC_VERSION } from "./src/constants";

export default defineConfig({
  plugins: [
    process.env.NODE_ENV === "production"
      ? /** @type {any} */ resolve({
          "@aztec/bb.js": `export * from "https://unpkg.com/@aztec/bb.js@${AZTEC_VERSION}/dest/browser/index.js"`,
        })
      : undefined,
    nodePolyfills(),
  ],
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
});
