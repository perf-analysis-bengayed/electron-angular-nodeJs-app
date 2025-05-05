const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  let indexPath = path.join(__dirname, 'dist/electron-angular-app/index.html');
  const distDir = path.join(__dirname, 'dist/electron-angular-app');

  if (fs.existsSync(distDir)) {
    console.log('dist/electron-angular-app contents:', fs.readdirSync(distDir));
  } else {
    console.error('dist/electron-angular-app does not exist');
  }

  if (!fs.existsSync(indexPath)) {
    console.error('Error: index.html not found at', indexPath);
    return;
  }

  win.loadFile(indexPath).catch((err) => {
    console.error('Failed to load index.html:', err);
  });
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('toMain', (event, message) => {
  console.log('Message from renderer:', message);
  event.sender.send('fromMain', `Received: ${message}`);
});