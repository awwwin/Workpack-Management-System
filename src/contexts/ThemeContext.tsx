import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
  async function loadTheme() {
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      setThemeState('light');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('theme')
      .eq('id', authData.user.id)
      .single();

    setThemeState((profile?.theme as Theme) || 'light');
  }

  loadTheme();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(() => {
    loadTheme();
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);

  useEffect(() => {
   
    // Calculate effective theme
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setEffectiveTheme(mediaQuery.matches ? 'dark' : 'light');

      const handler = (e: MediaQueryListEvent) => {
        setEffectiveTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      setEffectiveTheme(theme);
    }
  }, [theme]);

useEffect(() => {
  const root = document.documentElement;

  root.classList.remove('light', 'dark');

  root.classList.add(effectiveTheme);
}, [effectiveTheme]);

const setTheme = async (newTheme: Theme) => {
  setThemeState(newTheme);

  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) return;

  await supabase
    .from('profiles')
    .update({ theme: newTheme })
    .eq('id', authData.user.id);
};
  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
