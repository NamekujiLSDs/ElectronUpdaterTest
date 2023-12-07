const { app, ipcMain, BrowserWindow } = require("electron");
const { autoUpdater } = require('electron-updater');
const path = require("path");
const { clearTimeout } = require("timers");

let splashWin = null;
let gameWin = null;

Object.defineProperty(app, 'isPackaged', {
    get() {
        return true;
    }
});


function createSplash() {
    splashWin = new BrowserWindow({
        show: false,
        frame: false,
        width: 600,
        height: 300,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, "splashWin/preload.js"),
        },
    });
    const update = async () => {
        let updateCheck = null
        autoUpdater.on('checking-for-update', () => {
            splashWin.webContents.send("status", "Checking for updates...");
            updateCheck = setTimeout(() => {
                splashWin.webContents.send("status", "Update check error!")
                setTimeout(() => {
                    createWindow()
                }, 1000);
            }, 15000);
        });
        autoUpdater.on("update-available", (i) => {
            if (updateCheck) clearTimeout(updateCheck);
            splashWin.webContents.send("status", `Found new verison v${i.version}`)
        });
        autoUpdater.on("update-not-available", () => {
            if (updateCheck) clearTimeout(updateCheck);
            splashWin.webContents.send('status', "You using latest version.");
            setTimeout(() => {
                createWindow();
            }, 1000);
        });

        autoUpdater.on('error', (e) => {
            if (updateCheck) clearTimeout(updateCheck);
            splashWin.webContents.send('status', "Error!" + e.name);
            setTimeout(() => {
                createWindow();
            }, 1000);
        });
        autoUpdater.on('download-progress', (i) => {
            if (updateCheck) clearTimeout(updateCheck);
            splashWin.webContents.send('status', "Downloading new version...");
        });
        autoUpdater.on('update-downloaded', (i) => {
            if (updateCheck) clearTimeout(updateCheck);
            splashWin.webContents.send("status", "Update downloaded");
            setTimeout(() => {
                autoUpdater.quitAndInstall();
            }, 1000);
        });
        autoUpdater.autoDownload = "download";
        autoUpdater.allowPrerelease = false;
        autoUpdater.checkForUpdates();
    };
    // スプラッシュ用のHTMLを表示
    splashWin.loadFile(path.join(__dirname, "splashWin/splash.html"))

    // 準備が整ったら表示
    splashWin.webContents.on("did-finish-load", () => {
        splashWin.show();
        update()
    })

}

function createWindow() {
    gameWin = new BrowserWindow({
        show: false,
        fullscreen: true,
    });
    gameWin.loadURL(path.join(__dirname, "index.html"));
    gameWin.once("ready-to-show", () => {
        splashWin.destroy();
        gameWin.show();
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
