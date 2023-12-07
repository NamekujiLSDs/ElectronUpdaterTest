const { electron, app, ipcMain, BrowserWindow } = require("electron");
const autoUpdater = require("electron-updater");
const path = require("path");

let splashWin;
let gameWin;

function checkUpdate() {
  autoUpdater.checkForUpdates();
}
function createSplash() {
  splashWin = new BrowserWindow({
    show: false,
    frame: false,
    width: 600,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, "splashWin/preload.js"),
    },
  });

  // スプラッシュ用のHTMLを表示
  splashWin.loadFile("splashWin/splash.html");

  // 準備が整ったら表示
  splashWin.once("ready-to-show", () => {
    splashWin.show();
    splashWin.webContents.openDevTools();
  });
}

function createWindow() {
  const gameWin = new BrowserWindow({
    show: false,
    fullscreen: true,
  });
  gameWin.loadURL("electon");
  gameWin.once("ready-to-show", () => {
    gameWin.show;
  });
}
app.whenReady().then(() => {
  // スプラッシュを最初に表示
  createSplash();
});

ipcMain.handle("appVer", () => {
  const version = app.getVersion();
  return version;
});
