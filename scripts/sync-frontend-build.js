const fs = require("fs");
const path = require("path");

const sourceDir = path.resolve(__dirname, "../frontend-react/build");
const targetDir = path.resolve(__dirname, "../backend/public/app");

(async () => {
  try {
    if (!fs.existsSync(sourceDir)) {
      console.error("React build not found at", sourceDir);
      process.exit(1);
    }

    await fs.promises.rm(targetDir, { recursive: true, force: true });
    await fs.promises.mkdir(targetDir, { recursive: true });
    await fs.promises.cp(sourceDir, targetDir, { recursive: true });

    console.log("Copied React build into backend/public/app");
  } catch (error) {
    console.error("Failed to copy React build:", error);
    process.exit(1);
  }
})();
