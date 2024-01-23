# astro-electron

Astro-Electron is an integration designed to seamlessly incorporate Electron into Astro projects. It simplifies the process of setting up Electron, providing a streamlined development experience for building cross-platform desktop applications with Astro and Electron.

## Features

- Effortless integration of Electron with Astro projects.
- Automatic setup of the Electron environment during package installation.
- Customizable Electron configuration with sensible defaults.

## Installation

To install `astro-electron`, run the following command in your Astro project:

```bash
npm install astro-electron electron --save
```

Upon installation, it will automatically set up the initial Electron files (`main.ts` and `preload.ts`) in the `src/electron` directory of your Astro project.

## Setup

### Update `astro.config.js`

Modify your `astro.config.js` to include the `astro-electron` integration:

```javascript
import { defineConfig } from "astro/config";
import electron from "astro-electron";

export default defineConfig({
  integrations: [electron()],
});
```

### Update `package.json`

Modify your `package.json` to include the following scripts:

```json
{
  "main": "dist-electron/main.js"
}
```

### Update `.gitignore`

```
# Electron
/dist-electron
```

### Electron main and preload files

Crete directory `src/electron` and add `main.ts` and `preload.ts` files.

```typescript
// src/electron/main.ts
import { app, BrowserWindow } from "electron";

app.whenReady().then(() => {
  const win = new BrowserWindow({
    title: "Main window",
  });

  // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // Load your file
    win.loadFile("dist/index.html");
  }
});
```

```typescript
// src/electron/preload.ts
console.log("preload.ts");
```

### Customizing Electron Configuration

`astro-electron` allows for customization of the Electron setup. You can pass specific configuration options to tailor the integration to your project's needs:

```javascript
export default defineConfig({
  integrations: [
    astroElectron({
      main: {
        entry: "src/electron/main.ts", // Path to your Electron main file
      },
      preload: {
        input: "src/electron/preload.ts", // Path to your Electron preload file
      },
      renderer: {
        // Renderer-specific configurations (if needed)
      },
    }),
  ],
});
```

For more information on the available configuration options, refer to the [vite-plugin-electron docs](https://github.com/electron-vite/vite-plugin-electron).

## Important Notes

- During installation, `astro-electron` modifies your `package.json` and `.gitignore` files to include configurations necessary for Electron.
- Ensure that `electron` and `astro` packages are present dependencies to guarantee compatibility.

## License

`astro-electron` is open-source software licensed under the MIT License.
