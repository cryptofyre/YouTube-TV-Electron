const { app, BrowserWindow, globalShortcut } = require('electron')
const electron = require('electron');
const path = require('path')
const fs = require('fs')
const client = require('discord-rich-presence')('784894350718533632');

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    icon: path.join(__dirname, './assets/icon.png'),
    width: 1024,
    height: 600,
    minWidth: 300,
    minHeight: 300,
    frame: true,
  // Enables DRM
    webPreferences: {
      plugins: true,
    }
  })

  // Hide toolbar tooltips / bar
  win.setMenuBarVisibility(false);

  // Fix scrollbars
  
  win.webContents.once('did-stop-loading', async () => {
    await win.webContents.insertCSS('::-webkit-scrollbar { display: none; }')
  })

  // Set userAgent
  win.webContents.userAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.11 Safari/537.36 Edg/88.0.705.9"

  // Load YouTube TV site
  win.loadURL("https://tv.youtube.com");

          // Update rich presence when YouTube TV is playing.
  win.webContents.on('media-started-playing', function() {
    client.updatePresence({
        state: "on YouTube TV",
        details: "Watching TV",
        startTimestamp: Date.now(),
        largeImageKey: 'yttv',
        smallImageKey: 'play',
        instance: false,
      });
  });

          // Update rich presence when YouTube TV is paused or turned off.
  win.webContents.on('media-paused', function() {
      client.updatePresence({
        state: "on YouTube TV",
        details: "Watching TV (Paused)",
        StartTimestamp: Date.now(),
        largeImageKey: 'yttv',
        smallImageKey: 'pause',
        instance: false,
      });
  });

        // Start rich presence service into idle mode.
  client.updatePresence({
    state: 'on YouTube TV',
    details: 'Browsing Channels and TV Shows',
    startTimestamp: Date.now(),
    largeImageKey: 'yttv',
    smallImageKey: 'stop',
    instance: false,
  });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    app.quit()
})
