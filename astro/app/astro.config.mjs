import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  vite: {
    server:{
      host: "0.0.0.0",
      hmr: { clientPort: 4321 },
      port: 4321, 
      watch: { usePolling: true }
    }
  }
});
