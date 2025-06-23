import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Chuyển từ module URL thành __dirname (vì đang dùng ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadRoutesFromDir(app, dirName, basePath) {
  const fullPath = path.join(__dirname, dirName);
  const files = await fs.readdir(fullPath);

  for (const file of files) {
    if (file.endsWith(".js")) {
      try {
        const routeModule = await import(path.join(fullPath, file));
        const route = routeModule.default;
        const routeName = file.replace(".js", "");

        if (!route) {
          console.warn(`⚠️ Route "${routeName}" không export default`);
          continue;
        }

        app.use(`/api/${basePath}/${routeName}`, route);
        console.log(`✅ Đã mount route: /api/${basePath}/${routeName}`);
      } catch (err) {
        console.error(`❌ Lỗi khi load route ${file}:`, err.message);
      }
    }
  }
}

export default async function route(app) {
  await loadRoutesFromDir(app, "./app", "app");
  await loadRoutesFromDir(app, "./cms", "cms");
}
