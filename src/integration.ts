import fs from 'fs/promises';
import path from 'path';
import vitePluginElectron from 'vite-plugin-electron/simple';
import type { AstroIntegration, AstroConfig, RouteData } from 'astro';
import type { UserConfig as ViteUserConfig } from 'vite';

interface ElectronIntegrationConfig {
  main?: {
    entry?: string;
    vite?: Partial<ViteUserConfig>;
  };
  preload?: {
    input?: string;
    vite?: Partial<ViteUserConfig>;
  };
  renderer?: Partial<ViteUserConfig>;
}

export const integration = (
  integrationConfig: ElectronIntegrationConfig = {}
): AstroIntegration => ({
  name: 'astro-electron',
  hooks: {
    'astro:config:setup': ({
      config,
      command,
      updateConfig,
    }: {
      config: AstroConfig;
      command: string;
      updateConfig: (newConfig: Partial<AstroConfig>) => void;
    }) => {
      if (command === 'build') {
        updateConfig({
          base: '/',
        });
      }

      // Add Vite plugin for Electron
      updateConfig({
        vite: {
          plugins: [
            vitePluginElectron({
              main: {
                entry: integrationConfig?.main?.entry || 'src/electron/main.ts',
                vite: integrationConfig?.main?.vite || config.vite,
              },
              preload: {
                input:
                  integrationConfig?.preload?.input ||
                  'src/electron/preload.ts',
                vite: integrationConfig?.preload?.vite || config.vite,
              },
              renderer: integrationConfig?.renderer || undefined,
            }),
          ],
        },
      });
    },
    'astro:build:done': async ({
      dir,
      routes,
    }: {
      dir: URL;
      routes: RouteData[];
      // ... other properties
    }) => {
      await Promise.all(
        routes.map(async (route) => {
          if (route.distURL) {
            const filePath = new URL(route.distURL).pathname;
            const file = await fs.readFile(filePath, 'utf-8');
            const localDir = path.dirname(filePath);
            const relativePath = path.relative(localDir, new URL(dir).pathname);

            await fs.writeFile(
              route.distURL,
              file.replaceAll(/\/(astro-electron|public)/g, relativePath || '.')
            );
          }
        })
      );
    },
  },
});
