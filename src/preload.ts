import { contextBridge, ipcRenderer } from 'electron';
import fs from 'node:fs'

export type onSaveFileProps = {
  filePath: string;
  fileContent: string;
}

contextBridge.exposeInMainWorld('api', {
  onOpenFile: (callback: (filepath: string, filecontent: string) => void): void => {
    ipcRenderer.on('menu:open-file', (_event, filepath) => {
      fs.readFile(filepath, 'utf8', (err, filecontent) => {
        if (err) {
          console.error(err);
          return;
        }
        callback(filepath, filecontent)
      });
    })
  },
  
  onSaveFile: (callback: () => onSaveFileProps): void => {
    ipcRenderer.on('menu:save-file', async () => {
      const fileData = callback()
      if (!fileData.filePath) {
        const filePath = await ipcRenderer.invoke('dialog:save-file')
        if (!filePath) return
        fileData.filePath = filePath
      }
      ipcRenderer.send('save-file', fileData)
    })
  },

  onCloseFile: (callback: () => void): void => {
    ipcRenderer.on('menu:close-file',  (event) => {
      console.log(event)
      callback()
    })
  },

  onFileSaved: (callback: (filepath: string) => void): void => {
    ipcRenderer.on('file-saved', (_event, filepath) => {
      callback(filepath)
    })
  },
})