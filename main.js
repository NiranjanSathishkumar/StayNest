const { app, BrowserWindow, shell, dialog } = require("electron");
const path = require("path");
const http = require("http");
const fs = require("fs");
const os = require("os");

// ─── File-based debug log (survives when no console is attached) ───────────────
const LOG_PATH = path.join(os.homedir(), "AppData", "Roaming", "StayNest", "debug.log");
function log(...args) {
  const line = `[${new Date().toISOString()}] ${args.map(a => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ")}\n`;
  try { fs.appendFileSync(LOG_PATH, line); } catch (_) {}
  console.log(...args);
}
try { fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true }); } catch (_) {}
try { fs.writeFileSync(LOG_PATH, `=== StayNest startup ${new Date().toISOString()} ===\n`); } catch (_) {}
log("Electron version:", process.versions.electron);
log("Node version:", process.versions.node);
log("resourcesPath:", process.resourcesPath);
log("__dirname:", __dirname);

// Global error handlers so failures are shown as visible dialogs rather than a silent white screen
process.on("uncaughtException", (err) => {
  log("Uncaught Exception:", err.stack || err.toString());
  // dialog may not be ready if error fires before app.whenReady()
  try { dialog.showErrorBox("Application Error", err.stack || err.toString()); } catch (_) {}
});

process.on("unhandledRejection", (err) => {
  log("Unhandled Rejection:", err && (err.stack || err.toString()));
});

// 1. Ensure environment variables are loaded before loading Express / Prisma
const dotenv = require("dotenv");
dotenv.config();
if (process.resourcesPath) {
  dotenv.config({ path: path.join(process.resourcesPath, ".env") });
}

// Fallback defaults for standalone packaging (ensures professor can run .exe with 0 configuration)
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres.pgdxrszdbaijejrwhpxs:Superbase%40123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres";
process.env.SECRET = process.env.SECRET || "mySuperSecretCodeIsPassword";
process.env.CLOUD_NAME = process.env.CLOUD_NAME || "mj9jb9ik";
process.env.CLOUD_API_KEY = process.env.CLOUD_API_KEY || "255973885311815";
process.env.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || "zuMw_z1BXY7LR7i7iMXzANKTkY8";

let expressServer = null;

// 2. Start the Express server
function startServer() {
  try {
    log("Starting Express backend...");
    const backend = require("./app.js");
    expressServer = backend.server || backend;
    log("Express backend loaded. expressServer type:", typeof expressServer);
  } catch (err) {
    log("Failed to start Express backend:", err.stack || err.toString());
    try { dialog.showErrorBox("Backend Startup Error", `Failed to initialize server backend:\n\n${err.stack || err.toString()}`); } catch (_) {}
  }
}

// Helper to get actual port (handles case where 8080 was busy and server fell back to a free port)
function getPort() {
  if (expressServer && expressServer.address && typeof expressServer.address === "function") {
    const addr = expressServer.address();
    if (addr && addr.port) return addr.port;
  }
  return process.env.PORT || 8080;
}

// 3. Helper to wait until Express is responding before rendering the window
function waitForServer(callback, maxRetries = 40) {
  let retries = 0;
  const check = () => {
    const port = getPort();
    const url = `http://localhost:${port}/`;
    const req = http.get(url, (res) => {
      log(`Server responded on ${url} (status ${res.statusCode}), opening window`);
      res.resume();
      callback(port);
    });
    req.on("error", (e) => {
      retries++;
      if (retries >= maxRetries) {
        log(`Max retries reached (${maxRetries}) waiting for server on port ${port}, opening window anyway. Last error: ${e.message}`);
        callback(port);
      } else {
        setTimeout(check, 250);
      }
    });
  };
  check();
}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    title: "StayNest",
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Open external links (e.g. documentation, social links) in the system default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http") && !url.includes("localhost") && !url.includes("127.0.0.1")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
    console.error(`Failed to load ${validatedURL}: ${errorDescription} (${errorCode})`);
    if (errorCode !== -3) { // ignore ABORTED (-3)
      dialog.showErrorBox(
        "Loading Error",
        `Could not connect to the StayNest server at:\n${validatedURL}\n\nReason: ${errorDescription} (${errorCode})\n\nPlease ensure your internet connection is active so the database can be reached.`
      );
    }
  });

  waitForServer((port) => {
    const targetUrl = `http://localhost:${port}/`;
    log("Loading URL:", targetUrl);
    mainWindow.loadURL(targetUrl);
    mainWindow.once("ready-to-show", () => {
      log("Window ready-to-show, showing window");
      mainWindow.show();
    });
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Ensure single instance lock so double-clicking doesn't launch duplicate servers
const gotTheLock = app.requestSingleInstanceLock();
log("Single instance lock acquired:", gotTheLock);

if (!gotTheLock) {
  log("Could not acquire single instance lock. Another instance is already running. Quitting.");
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    startServer();
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      if (expressServer && typeof expressServer.close === "function") {
        expressServer.close();
      }
      app.quit();
    }
  });
}
