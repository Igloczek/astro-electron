import vitePluginElectron from "vite-plugin-electron/simple";

export default (config) => ({
  name: "astro-electron",
  hooks: {
    "astro:config:setup": ({ updateConfig }) => {
      // Add Vite plugin for Electron
      updateConfig({
        vite: {
          plugins: [
            vitePluginElectron({
              main: config.main || {
                entry: "src/electron/main.ts",
              },
              preload: config.preload || {
                input: "src/electron/preload.ts",
              },
              renderer: config.renderer || undefined,
            }),
          ],
        },
      });
    },
  },
});
