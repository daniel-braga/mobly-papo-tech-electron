import gfm from '@bytemd/plugin-gfm'
import mermaid from '@bytemd/plugin-mermaid'
import { Editor } from 'bytemd'
import 'bytemd/dist/index.css'
import './index.css'
import { onSaveFileProps } from './preload'

const plugins = [
  gfm(),
  mermaid(),
]


window.addEventListener('DOMContentLoaded', () => {
  let filePath = '';
  let fileContent = '';

  // @ts-ignore
  const editor = new Editor({
    target: document.getElementById('editor'), // DOM to render
    props: {
      value: '',
      plugins,
    }
  })

  window.api.onOpenFile((filepath: string, filecontent: string) => {
    filePath = filepath
    fileContent = filecontent
    // @ts-ignore
    editor.$set({ value: filecontent})
  })

  window.api.onSaveFile((): onSaveFileProps => {
    return {
      filePath: filePath,
      fileContent: fileContent,
    }
  })
  
  window.api.onCloseFile((): void => {
    console.log('onCloseFile')
    filePath = ''
    fileContent = ''
    // @ts-ignore
    editor.$set({ value: '' })
  })

  window.api.onFileSaved((filepath: string) => {
    filePath = filepath
  })

  // @ts-ignore
  editor.$on('change', (e) => {
    fileContent = e.detail.value
    // @ts-ignore
    editor.$set({ value: e.detail.value })
  })

})
