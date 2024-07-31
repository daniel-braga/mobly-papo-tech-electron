// eslint-disable-next-line import/no-unresolved
import { onSaveFileProps } from "src/preload"

export {}

declare global {
  interface Window {
    api: {
      onOpenFile: (callback: (filepath: string, filecontent: string) => void) => void,
      onSaveFile: (callback: () => onSaveFileProps) => void,
      onCloseFile: (callback: () => void) => void,
      onFileSaved: (callback: (filepath: string) => void) => void,
    }
  }
}
