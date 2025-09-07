import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "./components/Navigation";
import { FocusMode } from "./components/FocusMode";
import { SleepMode } from "./components/SleepMode";
import { RelaxMode } from "./components/RelaxMode";
import { Dashboard } from "./components/Dashboard";
import { DigitalClock } from "./components/DigitalClock";
import { LanguageSelector } from "./components/LanguageSelector";
import { Language } from "./components/translations";
import { useTranslation } from "./components/translations";

type Mode = "home" | "focus" | "sleep" | "relax" | "dashboard";

export default function App() {
  const [currentMode, setCurrentMode] = useState<Mode>("home");
  const [language, setLanguage] = useState<Language>("en");
  const t = useTranslation(language);

  const renderMode = () => {
    switch (currentMode) {
      case "focus":
        return (
          <FocusMode
            onBack={() => setCurrentMode("home")}
            language={language}
          />
        );
      case "sleep":
        return (
          <SleepMode
            onBack={() => setCurrentMode("home")}
            language={language}
          />
        );
      case "relax":
        return (
          <RelaxMode
            onBack={() => setCurrentMode("home")}
            language={language}
          />
        );
      case "dashboard":
        return (
          <Dashboard
            onBack={() => setCurrentMode("home")}
            language={language}
          />
        );
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* 砂時計エフェクト */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-16 h-20">
                {/* Hourglass outline */}
                <div className="absolute inset-0 border-2 border-white/30 rounded-t-full rounded-b-full"
                     style={{
                       clipPath: 'polygon(20% 0%, 80% 0%, 60% 20%, 60% 80%, 80% 100%, 20% 100%, 40% 80%, 40% 20%)'
                     }}>
                </div>
                
                {/* Sand particles falling */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-amber-300/60 rounded-full"
                    style={{
                      left: '50%',
                      top: '45%',
                    }}
                    animate={{
                      y: [0, 20],
                      x: [0, Math.random() * 4 - 2],
                      opacity: [0.6, 0],
                    }}
                    transition={{
                      duration: Math.random() * 1 + 1,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
                
                {/* Top sand */}
                <motion.div
                  className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-amber-300/40 rounded-t-full"
                  animate={{
                    height: ['12px', '8px', '12px'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
                
                {/* Bottom sand */}
                <motion.div
                  className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-amber-300/40 rounded-b-full"
                  animate={{
                    height: ['8px', '12px', '8px'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
              </div>
            </div>
            
            <div className="text-center space-y-8 relative z-10">
              <div className="space-y-4">
                <h1 className="text-6xl font-light text-white tracking-wider">
                  {t.appTitle}
                </h1>
                <p className="text-xl text-slate-300 font-light">
                  {t.appSubtitle}
                </p>
              </div>
              <DigitalClock theme="default" />
              <Navigation
                onModeChange={setCurrentMode}
                language={language}
              />
            </div>
            <LanguageSelector
              language={language}
              onLanguageChange={setLanguage}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {renderMode()}
      {currentMode !== "home" && (
        <LanguageSelector
          language={language}
          onLanguageChange={setLanguage}
        />
      )}
    </div>
  );
}
