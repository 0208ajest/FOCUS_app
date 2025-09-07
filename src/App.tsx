import { useState } from "react";
import { motion } from "framer-motion";
import { FocusMode } from "./components/FocusMode";
import { SleepMode } from "./components/SleepMode";
import { Dashboard } from "./components/Dashboard";
import { DigitalClock } from "./components/DigitalClock";
import { LanguageSelector } from "./components/LanguageSelector";
import { ReactionButton } from "./components/ReactionButton";
import { Language } from "./components/translations";
import { useTranslation } from "./components/translations";
import { BarChart3, Focus, Moon, Waves } from "lucide-react";

type Mode = "home" | "focus" | "sleep" | "dashboard";

export default function App() {
  const [currentMode, setCurrentMode] = useState<Mode>("home");
  const [language, setLanguage] = useState<Language>("en");
  const [isWaveActive, setIsWaveActive] = useState(false);
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
            <div className="absolute top-6 right-6 z-20 flex items-center space-x-3">
              <ReactionButton pageId="home" />
              <motion.button
                onClick={() => setCurrentMode("dashboard")}
                className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <BarChart3 className="h-5 w-5" />
              </motion.button>
            </div>

            {/* 水滴の波紋エフェクト */}
            {isWaveActive && (
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute border-2 border-blue-400/30 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: 0,
                      height: 0,
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                      width: [0, 100, 200, 300, 400, 500],
                      height: [0, 100, 200, 300, 400, 500],
                      opacity: [0.8, 0.7, 0.5, 0.3, 0.1, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      delay: i * 1.8,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}

            {/* 波打つアイコン（左上） */}
            <div className="absolute top-6 left-6 z-20">
              <motion.button
                onClick={() => setIsWaveActive(!isWaveActive)}
                className={`w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 border ${
                  isWaveActive 
                    ? 'bg-blue-500/20 text-blue-300 border-blue-300/30' 
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Waves className="h-5 w-5" />
              </motion.button>
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
              <div className="flex gap-12 items-center">
                {/* Focus Mode */}
                <motion.button
                  onClick={() => setCurrentMode("focus")}
                  className="group relative w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  <Focus className="h-8 w-8 relative z-10" />
                </motion.button>

                {/* Sleep Mode */}
                <motion.button
                  onClick={() => setCurrentMode("sleep")}
                  className="group relative w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-slate-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  <Moon className="h-8 w-8 relative z-10" />
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
