import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'full';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, variant = 'icon' }) => {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'full') {
    return (
      <Button
        variant="outline"
        onClick={toggleTheme}
        className={cn('gap-2', className)}
      >
        {theme === 'dark' ? (
          <>
            <Sun className="w-4 h-4" />
            Light Mode
          </>
        ) : (
          <>
            <Moon className="w-4 h-4" />
            Dark Mode
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn('relative', className)}
    >
      <Sun className={cn(
        'w-5 h-5 transition-all',
        theme === 'dark' ? 'scale-0 rotate-90' : 'scale-100 rotate-0'
      )} />
      <Moon className={cn(
        'absolute w-5 h-5 transition-all',
        theme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'
      )} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
