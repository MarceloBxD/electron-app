import { app, Tray, Menu, dialog, shell } from "electron";
import { resolve } from "path";
import Store from "electron-store";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schema = {
  projects: {
    type: "array",
  },
};

const store = new Store({ schema });

let tray = null;

app
  .whenReady()
  .then(() => {
    tray = new Tray(
      resolve(__dirname, "assets/images", "trayiconTemplate.png")
    );

    console.log(store.get("projects"));

    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Add File",
        accelerator: "CmdOrCtrl+O",
        click: () => {
          const [path] = dialog
            .showOpenDialog({
              properties: ["openDirectory"],
            })
            .then((fileObj) => {
              if (!fileObj.canceled) {
                console.log("path", path);
                // shell.openPath(fileObj.filePaths[0]);
                // store.set("projects[]", path);
              }
            });
        },
      },
      {
        label: "Help",
        click: async () => {
          await shell.openExternal("https://www.electronjs.org/docs");
        },
      },
    ]);

    tray.setToolTip("Main Folders - VS Code");
    tray.setContextMenu(contextMenu);
  })
  .catch((err) => {
    console.log("Error creating tray", err);
  });
