import { useRef, useState } from 'react';

import { Theme } from '@const/publicConst.ts';
import sessionKey from '@const/sessionKey.ts';
import { useMount } from 'ahooks';

type ThemeType = keyof typeof Theme;

const useTheme = (elementId: string) => {
  const dom = useRef<HTMLElement | null>();

  const [theme, setThemeFunc] = useState<ThemeType>(() => {
    const sessionTheme = localStorage.getItem(sessionKey.theme);
    return (sessionTheme as ThemeType) ?? Theme.light;
  });

  const setTheme = (theme: ThemeType) => {
    if (dom) {
      dom.current?.removeAttribute('class');
      dom.current?.setAttribute('class', `${theme} text-foreground bg-background`);
      window.localStorage.setItem(sessionKey.theme, theme);
      setThemeFunc(theme);
    }
  };

  useMount(() => {
    dom.current = document.getElementById(elementId);
  });

  return [theme, setTheme] as const;
};

export default useTheme;
