import { app, Tray, Menu, dialog, globalShortcut, MenuItem } from "electron";
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
    const menu = Menu.getApplicationMenu();

    tray = new Tray(
      resolve(__dirname, "assets/images", "trayiconTemplate.png")
    );
    const projects = store.get("projects");

    globalShortcut.register("CmdOrCtrl+N", () => {
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

          const path = res.filePaths[0];
          const items = new MenuItem({
            label: basename(path),
            click: () => {
              spawn("code", [path]);
            },
          });

          contextMenu.append(items);
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
      {
        label: "Add New Project",
        accelerator: "CmdOrCtrl+N",
        click: () => {
          dialog
            .showOpenDialog({
              properties: ["openDirectory"],
            })
            .then((res) => {
              if (!res.filePaths.length)
                return dialog.showMessageBox({
                  message: "No folder selected",
                });

              store.set("projects", [
                ...projects,
                {
                  title: basename(res.filePaths[0]),
                  click: () => {
                    spawn("code", [res.filePaths[0]]);
                  },
                },
              ]);

              const path = basename(res.filePaths[0]);

              const item = new MenuItem({
                label: basename(path),
                click: () => {
                  spawn("code", [path]);
                },
              });

              contextMenu.append(item);
            })
            .catch(() => {
              return dialog.showMessageBox({
                message: "Error opening dialog",
              });
            });
        },
      },
      {
        label: "Remove All Files",
        click: () => {
          store.set("projects", []);
        },
      },
      {
        type: "separator",
      },
      ...items,
    ]);

    tray.setToolTip("Mjrs Folders - VSCode");
    tray.setContextMenu(contextMenu);
  })
  .catch((err) => {
    console.log("Error creating tray", err);
  });
