import { defineConfig, loadEnv } from "vite";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig(({ mode }) => {
  // Load environment variables based on mode (development/production)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      port: parseInt(env.VITE_PORT) || 3000, // Fallback to 3000 if not set
    },
    plugins: [
      VitePluginNode({
        adapter: "express",
        appPath: "./app.js",
        exportName: "app",
        // ... other plugin options
      }),
    ],
  };
});