import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="fixed bottom-6 right-6 z-[100] p-4 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 glass-panel border border-white/20 dark:border-slate-700/50 text-slate-800 dark:text-white group"
      title="Alternar tema"
    >
      {theme === 'light' ? (
        <Moon size={24} className="group-hover:text-brand transition-colors" />
      ) : (
        <Sun size={24} className="group-hover:text-brand transition-colors" />
      )}
    </button>
  );
}
