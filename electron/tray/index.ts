import { app, Menu, BrowserWindow, Tray, nativeImage } from 'electron';

const getFirstWindow = () => {
  const windows = BrowserWindow.getAllWindows();
  return windows.length > 0 ? windows[0] : null;
};

const openWin = () => {
  const firstWindow = getFirstWindow();
  if (!firstWindow?.isVisible() || !firstWindow?.isFocused()) firstWindow?.show();
  if (firstWindow?.isMinimized()) firstWindow.restore();
};

const menuTray = Menu.buildFromTemplate([
  {
    label: '打开Util',
    click: openWin,
  },
  { type: 'separator' },
  {
    label: '退出Utils',
    click: function () {
      app.quit();
    },
  },
]);

let tray: Tray | null = null;

export const createTray = (iconPath: string) => {
  if (tray) return;
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 24, height: 24 });
  tray = new Tray(trayIcon);
  tray.setImage(trayIcon);
  tray.setContextMenu(menuTray);
  tray.setToolTip('TGUtils');
  tray.on('double-click', openWin);
};

export const destroyTray = () => {
  tray?.destroy();
  tray = null;
};
