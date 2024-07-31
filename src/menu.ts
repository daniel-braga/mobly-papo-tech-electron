import { app, Menu, MenuItemConstructorOptions } from 'electron'
import { closeFile, openFile, saveFile } from './actions'

export function createMenu(): void {
  const isMac = process.platform === 'darwin'
  const macAppMenuTemplate: MenuItemConstructorOptions[] = [
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }
  ]

  const defaultTemplate: MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open...',
          click: openFile
        },
        {
          label: 'Save',
          click: saveFile
        },
        {
          type: 'separator'
        },
        {
          label: 'Close File',
          click: closeFile
        },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async (): Promise<void> => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(
    isMac ? [...macAppMenuTemplate, ...defaultTemplate] : defaultTemplate
  )
  Menu.setApplicationMenu(menu)
}
