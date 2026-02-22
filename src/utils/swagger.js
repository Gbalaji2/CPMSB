import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupSwagger = (app) => {
  const swaggerPath = path.join(__dirname, "../docs/swagger.json");
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};