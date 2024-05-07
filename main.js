const { app, Tray, Menu, dialog } = require("electron");
const { resolve } = require("path");

let tray = null;

app
  .whenReady()
  .then(() => {
    tray = new Tray(
      resolve(__dirname, "assets/images", "trayiconTemplate.png")
    );

    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Add File",
        accelerator: "CmdOrCtrl+O",
        click: () => {
          dialog
            .showOpenDialog({
              properties: ["openDirectory"],
            })
            .then((fileObj) => {
              if (!fileObj.canceled) {
                console.log(fileObj.filePaths[0]);
              }
            });
        },
      },
      {
        label: "Fiat Titano",
        type: "normal",
      },
      {
        label: "Jeep Compass 4XE",
        type: "normal",
      },
      {
        label: "Fiat Argo",
        type: "normal",
      },
    ]);

    tray.setToolTip("Main Folders - VS Code");
    tray.setContextMenu(contextMenu);
  })
  .catch((err) => {
    console.log("Error creating tray", err);
  });
