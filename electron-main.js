// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'public/appicon.ico'),
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false
    },
    autoHideMenuBar: true,
    frame: false,
    hasShadow: true,
    resizable: false,
    movable: true,
    roundedCorners: true
  })

  // and load the index.html of the app.
  mainWindow.loadFile('dist/index.html')

  mainWindow.webContents.setFrameRate(60)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
ipcMain.on('close', () => {
  app.quit()
})

app.on('browser-window-focus', function () {
    globalShortcut.register("CommandOrControl+R", () => {
    });
    globalShortcut.register("CommandOrControl+Shift+R", () => {
    });
    globalShortcut.register("F5", () => {
    });
});

app.on('browser-window-blur', function () {
    globalShortcut.unregister('CommandOrControl+R');
    globalShortcut.unregister('CommandOrControl+Shift+R');
    globalShortcut.unregister('F5');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.