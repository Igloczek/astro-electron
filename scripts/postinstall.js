import fs from "fs/promises";
import path from "path";

async function copyTemplateFiles() {
  const templateDir = path.join(__dirname, "templates");
  const targetDir = path.join(process.cwd(), "src", "electron");

  try {
    await fs.mkdir(targetDir, { recursive: true });

    const filesToCopy = ["main.ts", "preload.ts"];
    for (const file of filesToCopy) {
      const src = path.join(templateDir, file);
      const dest = path.join(targetDir, file);

      if (!(await fileExists(dest))) {
        await fs.copyFile(src, dest);
      }
    }
  } catch (error) {
    console.error("Error copying template files:", error);
  }
}

async function updatePackageJson() {
  const packageJsonPath = path.join(process.cwd(), "package.json");

  try {
    const packageJsonData = await fs.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonData);

    packageJson.main = "dist-electron/main.js";
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  } catch (error) {
    console.error("Error updating package.json:", error);
  }
}

async function updateGitignore() {
  const gitignorePath = path.join(process.cwd(), ".gitignore");

  try {
    let gitignoreContent = "";

    if (await fileExists(gitignorePath)) {
      gitignoreContent = await fs.readFile(gitignorePath, "utf8");
    }

    if (!gitignoreContent.includes("dist-electron/")) {
      await fs.appendFile(
        gitignorePath,
        "\n# Added by astro-electron-integration\n/dist-electron/\n"
      );
    }
  } catch (error) {
    console.error("Error updating .gitignore:", error);
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

await copyTemplateFiles();
await updatePackageJson();
await updateGitignore();
