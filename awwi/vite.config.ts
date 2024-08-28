import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import resolve from "vite-plugin-resolve";
import { AZTEC_VERSION } from "./src/constants";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [
    react(),
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
