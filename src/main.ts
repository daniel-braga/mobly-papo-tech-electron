import { app, BrowserWindow, ipcMain, dialog, IpcMainEvent } from 'electron';
import path from 'path';
import fs from 'node:fs';
import { createMenu } from './menu';
import { onSaveFileProps } from './preload';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const handleSaveFileDialog = async () => {
  const { canceled, filePath } = await dialog.showSaveDialog({ properties: ['createDirectory', 'showOverwriteConfirmation'], filters: [{ name: 'Markdown files', extensions: ['*.md'] }], })
  if (!canceled && filePath) {
    return filePath
  }
  return '';
}

const onSaveFile = (event: IpcMainEvent, fileData: onSaveFileProps) => {
  fs.writeFile(fileData.filePath, fileData.fileContent, err => {
    if (err) {
      console.error(err);
    }
    const win = BrowserWindow.fromWebContents(event.sender)
    event.sender.send('file-saved', fileData.filePath)
    win.setTitle(`Editor: ${fileData.filePath}`)
  });
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 960,
    height: 640,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  createMenu()

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  ipcMain.on('save-file', onSaveFile)
  ipcMain.handle('dialog:save-file', handleSaveFileDialog)
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
