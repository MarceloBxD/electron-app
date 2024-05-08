import { app, Tray, Menu, dialog, globalShortcut } from "electron";
import { resolve } from "path";
import Store from "electron-store";

import spawn from "cross-spawn";

import { fileURLToPath } from "url";
import { dirname, basename } from "path";

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
    const projects = store.get("projects");

    globalShortcut.register("CmdOrCtrl+O", () => {
      dialog
        .showOpenDialog({
          properties: ["openDirectory"],
        })
        .then((res) => {
          store.set("projects", [
            ...projects,
            {
              title: basename(res.filePaths[0]),
              path: res.filePaths[0],
            },
          ]);
        })
        .catch((err) => {
          console.log("Error opening dialog", err);
        });
    });

    const items = projects.map((project) => {
      return {
        label: project.title,
        click: () => {
          spawn("code", [project.path]);
        },
      };
    });

    const contextMenu = Menu.buildFromTemplate([
      ...items,
      {
        label: "Add File",
        accelerator: "CmdOrCtrl+O",
        click: () => {
          dialog
            .showOpenDialog({
              properties: ["openDirectory"],
            })
            .then((res) => {
              store.set("projects", [
                ...projects,
                {
                  title: basename(res.filePaths[0]),
                  path: res.filePaths[0],
                },
              ]);
            })
            .catch((err) => {
              console.log("Error opening dialog", err);
            });
        },
      },
      {
        label: "Remove All Files",
        click: () => {
          return store.set("projects", []);
        },
      },
    ]);

    tray.setToolTip("Main Folders - VS Code");
    tray.setContextMenu(contextMenu);
  })
  .catch((err) => {
    console.log("Error creating tray", err);
  });
