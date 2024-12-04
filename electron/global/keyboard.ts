import { globalShortcut } from 'electron';

const registerKeyboard = () => {
  globalShortcut.register('CommandOrControl+R', () => false);

  globalShortcut.register('F5', () => false);

  globalShortcut.register('CommandOrControl+W', () => false);

  globalShortcut.register('CommandOrControl+-', () => false);

  globalShortcut.register('CommandOrControl+=', () => false);
};

export { registerKeyboard };
