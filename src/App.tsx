import { useState } from "react";
import { motion } from "framer-motion";
import { FocusMode } from "./components/FocusMode";
import { SleepMode } from "./components/SleepMode";
import { Dashboard } from "./components/Dashboard";
import { DigitalClock } from "./components/DigitalClock";
import { LanguageSelector } from "./components/LanguageSelector";
import { Language } from "./components/translations";
import { useTranslation } from "./components/translations";
import { BarChart3, Focus, Moon } from "lucide-react";

type Mode = "home" | "focus" | "sleep" | "dashboard";

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
      case "dashboard":
        return (
          <Dashboard
            onBack={() => setCurrentMode("home")}
            language={language}
          />
        );
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* ダッシュボードボタン（右上） */}
            <div className="absolute top-6 right-6 z-20">
              <motion.button
                onClick={() => setCurrentMode("dashboard")}
                className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <BarChart3 className="h-5 w-5" />
              </motion.button>
            </div>

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
            
            <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10">
              {/* タイトル */}
              <div className="text-center mb-16">
                <h1 className="text-6xl font-light text-white tracking-wider mb-4">
                  {t.appTitle}
                </h1>
                <DigitalClock theme="default" />
              </div>

              {/* メインボタン（Focus & Sleep） */}
              <div className="flex flex-col sm:flex-row gap-8 items-center">
                {/* Focus Mode */}
                <motion.button
                  onClick={() => setCurrentMode("focus")}
                  className="group relative w-48 h-48 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex flex-col items-center justify-center space-y-4 text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-500"
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                  <Focus className="h-12 w-12 relative z-10" />
                  <div className="relative z-10 text-center">
                    <div className="text-xl font-medium">{t.focus}</div>
                    <div className="text-sm opacity-80 mt-1">{t.focusDescription}</div>
                  </div>
                </motion.button>

                {/* Sleep Mode */}
                <motion.button
                  onClick={() => setCurrentMode("sleep")}
                  className="group relative w-48 h-48 bg-gradient-to-br from-slate-600 to-slate-800 rounded-3xl flex flex-col items-center justify-center space-y-4 text-white shadow-2xl hover:shadow-slate-500/25 transition-all duration-500"
                  whileHover={{ scale: 1.05, rotateY: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                  <Moon className="h-12 w-12 relative z-10" />
                  <div className="relative z-10 text-center">
                    <div className="text-xl font-medium">{t.sleep}</div>
                    <div className="text-sm opacity-80 mt-1">{t.sleepDescription}</div>
                  </div>
                </motion.button>
              </div>
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
