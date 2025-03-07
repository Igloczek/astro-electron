import fs from "fs/promises";
import path from "path";
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
          envPrefix: ["VITE_", "PUBLIC_", ...(config.vite?.envPrefix || [])],
          plugins: [
            vitePluginElectron({
              main: {
                entry: integrationConfig?.main?.entry || "src/electron/main.ts",
                vite: integrationConfig?.main?.vite || config.vite,
              },
              preload: {
                input:
                  integrationConfig?.preload?.input ||
                  "src/electron/preload.ts",
                vite: integrationConfig?.preload?.vite || config.vite,
              },
              renderer: integrationConfig?.renderer || undefined,
            }),
          ],
        },
      });
    },
    "astro:build:done": async ({ dir, routes }) => {
      const distURLs = routes.flatMap((route) => route?.distURL);

      await Promise.all(
        distURLs.map(async (url) => {
          const file = await fs.readFile(url, "utf-8");
          const localDir = path.dirname(url.pathname);
          const relativePath = path.relative(localDir, dir.pathname);

          await fs.writeFile(
            url,
            file.replaceAll(/\/(astro-electron|public)/g, relativePath || ".")
          );
        })
      );
    },
  },
});
