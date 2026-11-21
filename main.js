const { app, BrowserWindow } = require('electron')
const path = require('node:path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 700,
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {

  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(__dirname, 'img/tomato1.png'));
  }

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  
})
