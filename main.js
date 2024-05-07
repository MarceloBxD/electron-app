const { app, Tray, Menu } = require("electron");
const { resolve } = require("path");

console.log();

let tray = null;

app
  .whenReady()
  .then(() => {
    tray = new Tray(
      resolve(__dirname, "assets/images", "trayiconTemplate.png")
    );

    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Fiat Titano",
        type: "radio",
      },
      {
        label: "Jeep Compass 4XE",
        type: "radio",
      },
      {
        label: "Fiat Argo",
        type: "radio",
      },
    ]);

    tray.setToolTip("Main Folders - VS Code");
    tray.setContextMenu(contextMenu);
  })
  .catch((err) => {
    console.log("Error creating tray", err);
  });
