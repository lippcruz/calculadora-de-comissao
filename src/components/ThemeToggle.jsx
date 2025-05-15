
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext.jsx';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const ariaLabel = theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro';

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="bg-card/80 backdrop-blur-sm hover:bg-card text-foreground shadow-lg rounded-full w-12 h-12"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;
