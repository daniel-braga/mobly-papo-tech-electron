import { BrowserWindow, dialog, MenuItem, OpenDialogReturnValue } from "electron"


export function openFile(_menuItem: MenuItem, window?: BrowserWindow): void {
  dialog
    .showOpenDialog({
      filters: [{ name: 'Markdown files', extensions: ['*.md'] }],
      properties: ['openFile']
    })
    .then(({canceled, filePaths}: OpenDialogReturnValue) => {
      if (canceled === false && filePaths.length > 0) {
        window?.setTitle(`Editor: ${filePaths[0]}`)
        window?.webContents.send('menu:open-file', filePaths[0])
      }
    })
}

export function saveFile(_menuItem: MenuItem, window?: BrowserWindow): void {
  window?.webContents.send('menu:save-file')
}

export function closeFile(_menuItem: MenuItem, window?: BrowserWindow): void {
  window?.webContents.send('menu:close-file')
  window?.setTitle('Editor')
}