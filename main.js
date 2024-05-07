const { app, Tray } = require("electron");

let tray = null;

app.whenReady().then(() => {
  tray = new Tray("/assets/icon.png");
});
