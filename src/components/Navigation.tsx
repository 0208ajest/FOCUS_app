import { Button } from './ui/button';
import { Focus, Moon, Leaf, BarChart3 } from 'lucide-react';
import { Language } from './translations';
import { useTranslation } from './translations';

interface NavigationProps {
  onModeChange: (mode: 'focus' | 'sleep' | 'relax' | 'dashboard') => void;
  language: Language;
}

export function Navigation({ onModeChange, language }: NavigationProps) {
  const t = useTranslation(language);
  
  const modes = [
    {
      id: 'focus' as const,
      label: t.focus,
      icon: Focus,
      description: t.focusDescription,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'sleep' as const,
      label: t.sleep,
      icon: Moon,
      description: t.sleepDescription,
      gradient: 'from-slate-600 to-slate-800',
    },
    {
      id: 'relax' as const,
      label: t.relax,
      icon: Leaf,
      description: t.relaxDescription,
      gradient: 'from-emerald-500 to-green-600',
    },
    {
      id: 'dashboard' as const,
      label: t.dashboard,
      icon: BarChart3,
      description: t.dashboardDescription,
      gradient: 'from-violet-500 to-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <Button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`
                group relative h-20 w-full bg-gradient-to-br ${mode.gradient} 
                hover:scale-105 transition-all duration-300 shadow-xl
                border-0 flex flex-col items-center justify-center space-y-1
                text-white rounded-xl overflow-hidden
              `}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Icon className="h-5 w-5 relative z-10" />
              <div className="relative z-10 text-center">
                <div className="text-sm font-medium">{mode.label}</div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
