/*[[Launchers/Desktop/main.js]]*/
const { app, BrowserWindow, globalShortcut, Menu, Tray } = require("electron");
const path = require("path");

const URL = "http://localhost:9090";

let mainWindow = null;
let tray = null; // Declare tray outside the app.whenReady() scope

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 350,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets/logo.png'), // Path to your app icon (ICNS for macOS)
    alwaysOnTop: true, // Add this line
  });

  mainWindow.loadURL(URL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}



app.whenReady().then(() => {
  createWindow();

  // Set up the tray icon
  tray = new Tray(path.join(__dirname, 'assets/logo.png')); // Use the same icon

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open App', click: () => {
        if (!mainWindow || mainWindow.isDestroyed()) {
          createWindow();
        } else {
            mainWindow.show();
            mainWindow.focus();
        }
    } },
    { type: 'separator' },
    { label: 'Quit', click: () => {
        app.quit();
    } }
  ]);
  tray.setToolTip('VibQod');
  tray.setContextMenu(contextMenu);

  globalShortcut.register("CommandOrControl+Shift+.", () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
        createWindow();
    } else {
      if(mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      mainWindow.loadURL(URL);
    }
  });

  globalShortcut.register("CommandOrControl+Shift+,", () => {
      if (mainWindow) {
          mainWindow.minimize();
      }
  });


  app.on("activate", () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      createWindow();
    }
  });
});

app.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
});

app.on('show', () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      createWindow();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});


app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
