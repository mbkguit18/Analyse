import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const fs = require('fs')
import { avrage, group, sort } from './utils/functions'
import { genDocx } from './utils/genDocx'

const XLSX = require('xlsx')
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration:true,
      contextIsolation:true,
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  ipcMain.on("openDialog",async(event,params)=>{
    try {
      const result=await dialog.showOpenDialog(params)
      event.sender.send("dialogResponse",result.filePaths)
    } catch (error) {
      console.error(error)
      event.sender.send("dialogResponse",[])
    }
  })

  ipcMain.on('Transform', async (event, params) => {
    const number = 3
    const classes = []
    const remarks = ['ضعيف جدا', 'ضعيف', 'متوسط', 'مرتفع', 'مرتفع جدا']
    let from = 1
    let to = 1.79
    for (let i = 1; i <= number; i++) {
      const obj = { from: from.toFixed(2), to: to.toFixed(2) }
      //@ts-ignore
      classes.push(obj)
      //@ts-ignore
      classes[classes.length - 1].remark = remarks[classes.length - 1]
      from += 0.8
      to += 0.8
    }
    console.log(classes)
    const workbook = XLSX.readFile(params.file)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    let data = XLSX.utils.sheet_to_json(worksheet)
    const groupedArray = group(data, classes)
    const avrages = avrage(groupedArray, classes)
    sort(groupedArray, avrages)
    console.log(groupedArray)

    const base64 = await genDocx(groupedArray)
    const buffer = Buffer.from(base64, 'base64')
    fs.writeFile('./test.docx', buffer, (err) => {
      if (err) {
        console.error('Error writing file:', err)
      } else {
        console.log('File saved successfully!')
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
