import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';
import { cn } from '../../lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 bg-secondary-100 dark:bg-secondary-800 rounded-xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme('light')}
        className={cn(
          'h-8 w-8 p-0',
          theme === 'light' && 'bg-white dark:bg-secondary-700 shadow-sm'
        )}
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme('dark')}
        className={cn(
          'h-8 w-8 p-0',
          theme === 'dark' && 'bg-white dark:bg-secondary-700 shadow-sm'
        )}
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme('system')}
        className={cn(
          'h-8 w-8 p-0',
          theme === 'system' && 'bg-white dark:bg-secondary-700 shadow-sm'
        )}
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  );
}