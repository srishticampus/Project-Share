import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), "");
  
  return {
    plugins: [react(), tailwindcss()],
    base: env.VITE_BASE_URL || "/project_share/", // Fallback if env var not set
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      open: env.VITE_BASE_URL || "/project_share/", // Open browser at correct path
    },
  };
});