const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
if (process.resourcesPath) {
  dotenv.config({ path: path.join(process.resourcesPath, ".env") });
}

const fs = require("fs");
const { PrismaPg } = require("@prisma/adapter-pg");

let PrismaClient;
try {
  PrismaClient = require("@prisma/client").PrismaClient;
} catch (err) {
  const possiblePaths = [
    path.join(__dirname, "..", "node_modules", ".prisma", "client"),
    process.resourcesPath ? path.join(process.resourcesPath, "node_modules", ".prisma", "client") : null,
    process.resourcesPath ? path.join(process.resourcesPath, "app.asar.unpacked", "node_modules", ".prisma", "client") : null,
    process.resourcesPath ? path.join(process.resourcesPath, "app", "node_modules", ".prisma", "client") : null,
    path.join(process.cwd(), "node_modules", ".prisma", "client"),
  ].filter(Boolean);

  let loaded = false;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const clientMod = require(p);
        PrismaClient = clientMod.PrismaClient;
        loaded = true;
        break;
      } catch (_) {}
    }
  }
  if (!loaded) throw err;
}

const dbUrl = process.env.DATABASE_URL || "postgresql://postgres.pgdxrszdbaijejrwhpxs:Superbase%40123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres";
const adapter = new PrismaPg({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
