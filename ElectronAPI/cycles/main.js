const { app, BrowserWindow, Notification } = require('electron');
const path = require('node:path');

const createWindow = () => {
    const window = new BrowserWindow({
        width: 640,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "./preload.js")
        },
        resizable: false,
    });

    window.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", () => {
    if(process.platform !== "darwin") app.quit();
})
