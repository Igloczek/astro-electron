const fs = require("fs");
const path = require("path");

function copyTemplateFiles() {
  const templateDir = path.join(__dirname, "templates");
  const targetDir = path.join(process.cwd(), "src", "electron");

  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filesToCopy = ["main.ts", "preload.ts"];
    filesToCopy.forEach((file) => {
      const src = path.join(templateDir, file);
      const dest = path.join(targetDir, file);

      if (!fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
      }
    });
  } catch (error) {
    console.error("Error copying template files:", error);
  }
}

function updatePackageJson() {
  const packageJsonPath = path.join(process.cwd(), "package.json");

  try {
    const packageJsonData = fs.readFileSync(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonData);

    packageJson.main = "dist-electron/main.js";
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  } catch (error) {
    console.error("Error updating package.json:", error);
  }
}

function updateGitignore() {
  const gitignorePath = path.join(process.cwd(), ".gitignore");

  try {
    let gitignoreContent = "";

    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
    }

    if (!gitignoreContent.includes("dist-electron/")) {
      fs.appendFileSync(
        gitignorePath,
        "\n# Added by astro-electron-integration\n/dist-electron/\n"
      );
    }
  } catch (error) {
    console.error("Error updating .gitignore:", error);
  }
}

// Run the functions
copyTemplateFiles();
updatePackageJson();
updateGitignore();
