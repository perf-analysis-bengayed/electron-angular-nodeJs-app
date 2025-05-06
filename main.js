// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fetch = require('node-fetch');

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

  const indexPath = path.join(__dirname, 'dist/electron-angular-app/index.html');
  win.loadFile(indexPath).catch((err) => console.error('Failed to load index.html:', err));
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// In-memory storage for projects
const projects = new Map();

// Handle 'createProject' channel
ipcMain.on('createProject', (event, projectData) => {
  console.log('Received project data:', projectData);
  try {
    const parsedData = JSON.parse(projectData);
    // Store project in memory
    projects.set(parsedData.id, parsedData);

    // Send project data to a mock server
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Server response:', data);
        event.sender.send('createProjectResponse', { success: true, project: parsedData });
      })
      .catch((error) => {
        console.error('Error sending project to server:', error);
        event.sender.send('createProjectResponse', { success: false, error: error.message });
      });
  } catch (err) {
    console.error('Failed to parse project data:', err);
    event.sender.send('createProjectResponse', { success: false, error: 'Error processing project data' });
  }
});

// Handle 'fetchProject' channel
ipcMain.on('fetchProject', (event, projectId) => {
  const project = projects.get(projectId);
  if (project) {
    event.sender.send('fetchProjectResponse', { success: true, project });
  } else {
    event.sender.send('fetchProjectResponse', { success: false, error: 'Project not found' });
  }
});

// Handle 'toMain' channel
ipcMain.on('toMain', (event, message) => {
  console.log('Received message:', message);
  event.sender.send('fromMain', `Echo: ${message}`);
});