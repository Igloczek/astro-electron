# astro-electron

Astro-Electron is an integration designed to seamlessly incorporate Electron into Astro projects. It simplifies the process of setting up Electron, providing a streamlined development experience for building cross-platform desktop applications with Astro and Electron.

## Features

- Effortless integration of Electron with Astro projects.
- Automatic setup of the Electron environment during package installation.
- Customizable Electron configuration with sensible defaults.

## Installation

```bash
npm add astro-electron electron
```

> Electron doesn't really work with anything other than npm or Yarn Classic, so if you're pnpm user, I feel you, but there is not much you can do about it, just say hi to your old friend npm, you are going to spend a lot of time together 😅

## Setup

Your app won't run in Electron without some additional setup. Follow the steps below to get started.

### Add integration

Modify your `astro.config.js` to include the `astro-electron` integration:

```javascript
import { defineConfig } from "astro/config";
import electron from "astro-electron";

export default defineConfig({
  integrations: [electron()],
});
```

### Define entry point

Modify your `package.json` to include an entrypoint:

```json
{
  "main": "dist-electron/main.js"
}
```

### Update `.gitignore`

Add the `dist-electron` directory to your `.gitignore` file:

```
# Electron
dist-electron/
```

### Create electron scripts

Create the `src/electron` directory and add the required `main.ts` file and the optional `preload.ts` file.

Please note this is just an minimal example, refer to [Electron docs](https://www.electronjs.org/docs/latest) for more information.

```typescript
// src/electron/main.ts
import * as url from "url";
import { app, BrowserWindow } from "electron";

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    title: "Main window",
    webPreferences: {
      preload: url.fileURLToPath(new URL("preload.mjs", import.meta.url)),
    },
  });

  // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
  if (process.env.VITE_DEV_SERVER_URL) {
    await win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    // Load your file
    await win.loadFile("dist/index.html");
  }
});
```

```typescript
// src/electron/preload.ts
console.log("preload.ts");
```

## Customizing Electron Configuration

`astro-electron` allows for customization of the Electron setup. You can pass specific configuration options to tailor the integration to your project's needs:

```javascript
export default defineConfig({
  integrations: [
    electron({
      main: {
        entry: "src/electron/main.ts", // Path to your Electron main file
        vite: {}, // Vite-specific configurations (by default we use the same config as your Astro project)
      },
      preload: {
        input: "src/electron/preload.ts", // Path to your Electron preload file
        vite: {}, // Vite-specific configurations (by default we use the same config as your Astro project)
      },
      renderer: {
        // Renderer-specific configurations (if needed)
      },
    }),
  ],
});
```

For more information on the available configuration options, refer to the [vite-plugin-electron docs](https://github.com/electron-vite/vite-plugin-electron).

## Static assets

Your app will most likely need some static assets like fonts, videos etc. (for images you should use `Image` from `astro:assets`)
To make them available in Electron you need to explicitly use a `/public` directory in your paths, unlike in a regular Astro project.

## Building and publishing your Electron app

This integration does not include any building or publishing functionality, it's up to you to choose the best option for your project, but we recommend using [Electron Forge](https://www.electronforge.io/).

## License

`astro-electron` is open-source software licensed under the MIT License.
