import fs from "fs/promises";
import vitePluginElectron from "vite-plugin-electron/simple";

export default (integrationConfig) => ({
  name: "astro-electron",
  hooks: {
    "astro:config:setup": ({ config, command, updateConfig }) => {
      if (command === "build") {
        updateConfig({
          base: "/astro-electron",
        });
      }

      // Add Vite plugin for Electron
      updateConfig({
        vite: {
          plugins: [
            vitePluginElectron({
              main: integrationConfig?.main || {
                entry: "src/electron/main.ts",
                vite: config.vite,
              },
              preload: integrationConfig?.preload || {
                input: "src/electron/preload.ts",
                vite: config.vite,
              },
              renderer: integrationConfig?.renderer || undefined,
            }),
          ],
        },
      });
    },
    "astro:build:done": async ({ routes }) => {
      await Promise.all(
        routes.map(async (route) => {
          const file = await fs.readFile(route.distURL, "utf-8");
          await fs.writeFile(
            route.distURL,
            file.replaceAll(/\/astro-electron/g, ".")
          );
        })
      );
    },
  },
});
