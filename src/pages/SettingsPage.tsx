import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Utility to get the initial theme from localStorage or system preference
const getInitialTheme = (): 'dark' | 'light' => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('color-theme');
    if (typeof storedPrefs === 'string') {
      return storedPrefs as 'dark' | 'light';
    }
    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }
  return 'light';
};

const SettingsPage = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('color-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const isDarkMode = theme === 'dark';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
      
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-switch" className="flex items-center gap-2 cursor-pointer">
              {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span>{isDarkMode ? 'Mode Sombre' : 'Mode Clair'}</span>
            </Label>
            <Switch
              id="theme-switch"
              checked={isDarkMode}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;

