import { useState } from "react";
import { motion } from "framer-motion";
import { FocusMode } from "./components/FocusMode";
import { SleepMode } from "./components/SleepMode";
import { Dashboard } from "./components/Dashboard";
import { DigitalClock } from "./components/DigitalClock";
import { LanguageSelector } from "./components/LanguageSelector";
import { ReactionButton } from "./components/ReactionButton";
import { GlobalAudioControl } from "./components/GlobalAudioControl";
import { Language } from "./components/translations";
import { useTranslation } from "./components/translations";
import { BarChart3, Focus, Moon, Waves, CloudRain, Flame, Droplets } from "lucide-react";
import { AudioProvider, useAudioContext } from "./contexts/AudioContext";

type Mode = "home" | "focus" | "sleep" | "dashboard";

function AppContent() {
  const [currentMode, setCurrentMode] = useState<Mode>("home");
  const [language, setLanguage] = useState<Language>("en");
  const [isWaveActive, setIsWaveActive] = useState(false);
  const [isRainActive, setIsRainActive] = useState(false);
  const [isBubbleActive, setIsBubbleActive] = useState(false);
  const [isFireplaceActive, setIsFireplaceActive] = useState(false);
  const [isHomeRainActive, setIsHomeRainActive] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState<'purple' | 'black' | 'blue' | 'green'>('purple');
  const t = useTranslation(language);
  const { playTrack } = useAudioContext();

  // 背景色に応じたグラデーション
  const getBackgroundGradient = () => {
    switch (backgroundColor) {
      case 'black':
        return 'from-gray-900 via-black to-gray-900';
      case 'blue':
        return 'from-blue-900 via-blue-800 to-cyan-900';
      case 'green':
        return 'from-emerald-900 via-green-800 to-teal-900';
      default:
        return 'from-slate-900 via-purple-900 to-slate-900';
    }
  };

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
          <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} relative overflow-hidden`}>
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
                {Array.from({ length: 8 }).map((_, i) => {
                  // 固定のランダム値を生成（レンダリングごとに変わらない）
                  const leftPosition = 20 + (i * 12) % 60; // 20-80%の範囲で均等に分散
                  const topPosition = 20 + (i * 15) % 60; // 20-80%の範囲で均等に分散
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute border-2 border-blue-400/30 rounded-full"
                      style={{
                        left: `${leftPosition}%`,
                        top: `${topPosition}%`,
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
                  );
                })}
              </div>
            )}

            {/* 雨エフェクト */}
            {isRainActive && (
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 50 }).map((_, i) => {
                  // 固定のランダム値を生成（レンダリングごとに変わらない）
                  const leftPosition = (i * 7.3) % 100; // 均等に分散
                  const duration = 1.5 + (i % 3) * 0.5; // 1.5-2.5秒
                  const delay = (i * 0.1) % 2; // 0-2秒の遅延
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute bg-blue-300/40"
                      style={{
                        left: `${leftPosition}%`,
                        top: '-10px',
                        width: '2px',
                        height: '20px',
                        borderRadius: '1px',
                      }}
                      animate={{
                        y: [0, window.innerHeight + 20],
                        opacity: [0, 0.8, 0.8, 0],
                      }}
                      transition={{
                        duration: duration,
                        repeat: Infinity,
                        delay: delay,
                        ease: "linear"
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* 泡エフェクト */}
            {isBubbleActive && (
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 60 }).map((_, i) => {
                  // 固定のランダム値を生成（レンダリングごとに変わらない）
                  const leftPosition = (i * 7.3) % 100; // 0-100%の範囲で均等に分散
                  const size = 8 + (i % 8) * 2.5; // 8-25.5pxの固定サイズ
                  const opacity = 0.1 + (i % 5) * 0.08; // 0.1-0.42の固定透明度
                  const duration = 30 + (i % 10) * 3; // 30-57秒の固定持続時間
                  const delay = (i * 0.5) % 10; // 0-10秒の固定遅延
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute bg-blue-300/30 rounded-full"
                      style={{
                        left: `${leftPosition}%`,
                        bottom: '-20px', // 画面下から開始
                        width: `${size}px`,
                        height: `${size}px`,
                      }}
                      animate={{
                        y: [0, -window.innerHeight - 100], // 下から上に移動
                        opacity: [opacity, opacity], // 透明度を維持（消えない）
                        scale: [1, 1.1], // わずかに大きくなる
                      }}
                      transition={{
                        duration: duration,
                        repeat: Infinity,
                        delay: delay,
                        ease: "linear" // 一定速度で上昇
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* 蛍エフェクト */}
            {isFireplaceActive && (
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 25 }).map((_, i) => {
                  // 固定のランダム値を生成（レンダリングごとに変わらない）
                  const startX = (i * 7.3 + Math.sin(i * 0.8) * 15) % 100; // 0-100%の範囲で星空のように分散
                  const startY = (i * 5.7 + Math.cos(i * 1.2) * 20) % 100; // 0-100%の範囲で星空のように分散
                  const size = 4 + (i % 3) * 2; // 4-8pxの固定サイズ
                  const duration = 8 + (i % 6) * 2; // 8-18秒の固定持続時間
                  const delay = (i * 0.8) % 5; // 0-5秒の固定遅延
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute bg-yellow-300/80 rounded-full shadow-lg"
                      style={{
                        left: `${startX}%`,
                        top: `${startY}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        boxShadow: '0 0 10px rgba(255, 255, 0, 0.8), 0 0 20px rgba(255, 255, 0, 0.4)',
                      }}
                      animate={{
                        x: [
                          0, 
                          (Math.sin(i * 0.5) * 30), 
                          (Math.cos(i * 0.3) * 25), 
                          (Math.sin(i * 0.7) * 20), 
                          0
                        ],
                        y: [
                          0, 
                          (Math.cos(i * 0.4) * 40), 
                          (Math.sin(i * 0.6) * 35), 
                          (Math.cos(i * 0.8) * 30), 
                          0
                        ],
                        opacity: [0.8, 0.3, 0.9, 0.2, 0.8],
                        scale: [1, 1.2, 0.8, 1.1, 1],
                      }}
                      transition={{
                        duration: duration,
                        repeat: Infinity,
                        delay: delay,
                        ease: "easeInOut"
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* ホーム雨エフェクト */}
            {isHomeRainActive && (
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 30 }).map((_, i) => {
                  // 固定のランダム値を生成（レンダリングごとに変わらない）
                  const leftPosition = (i * 7.3 + Math.sin(i * 1.5) * 20) % 100; // 0-100%の範囲でまばらに分散
                  const duration = 1.2 + (i % 3) * 0.4; // 1.2-2.0秒の固定持続時間
                  const delay = (i * 0.3) % 2; // 0-2秒の固定遅延
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute bg-blue-200/50"
                      style={{
                        left: `${leftPosition}%`,
                        top: '-10px',
                        width: '1.5px',
                        height: '15px',
                        borderRadius: '0.75px',
                      }}
                      animate={{
                        y: [0, window.innerHeight + 20],
                        opacity: [0, 0.7, 0.7, 0],
                      }}
                      transition={{
                        duration: duration,
                        repeat: Infinity,
                        delay: delay,
                        ease: "linear"
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* 波打つアイコン（左上） */}
            <div className="absolute top-6 left-6 z-20 flex flex-col space-y-3">
              <motion.button
                onClick={() => {
                  setIsWaveActive(!isWaveActive);
                  playTrack('home-ocean-zen');
                }}
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
              
              {/* 雨ボタン */}
              <motion.button
                onClick={() => {
                  setIsRainActive(!isRainActive);
                  playTrack('home-rain-zen');
                }}
                className={`w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 border ${
                  isRainActive 
                    ? 'bg-blue-500/20 text-blue-300 border-blue-300/30' 
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <CloudRain className="h-5 w-5" />
              </motion.button>
              
              {/* 泡ボタン */}
              <motion.button
                onClick={() => {
                  setIsBubbleActive(!isBubbleActive);
                  playTrack('focus-ambient');
                }}
                className={`w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 border ${
                  isBubbleActive 
                    ? 'bg-blue-500/20 text-blue-300 border-blue-300/30' 
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Droplets className="h-5 w-5" />
              </motion.button>
              
              {/* 焚き火ボタン */}
              <motion.button
                onClick={() => {
                  setIsFireplaceActive(!isFireplaceActive);
                  playTrack('sleep-fireplace');
                }}
                className={`w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 border ${
                  isFireplaceActive 
                    ? 'bg-orange-500/20 text-orange-300 border-orange-300/30' 
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Flame className="h-5 w-5" />
              </motion.button>
              
              {/* ホーム雨ボタン */}
              <motion.button
                onClick={() => {
                  setIsHomeRainActive(!isHomeRainActive);
                  playTrack('sleep-rain');
                }}
                className={`w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 border ${
                  isHomeRainActive 
                    ? 'bg-blue-500/20 text-blue-300 border-blue-300/30' 
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <CloudRain className="h-5 w-5" />
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

            {/* 背景色変更ボタン（右下） */}
            <div className="absolute bottom-6 right-6 z-30 flex flex-col space-y-2">
              {/* 紫（デフォルト） */}
              <motion.button
                onClick={() => setBackgroundColor('purple')}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  backgroundColor === 'purple' 
                    ? 'bg-purple-500 border-purple-300 shadow-lg' 
                    : 'bg-purple-500/30 border-purple-300/50 hover:bg-purple-500/50'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
              
              {/* 黒 */}
              <motion.button
                onClick={() => setBackgroundColor('black')}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  backgroundColor === 'black' 
                    ? 'bg-gray-800 border-gray-300 shadow-lg' 
                    : 'bg-gray-800/30 border-gray-300/50 hover:bg-gray-800/50'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
              
              {/* 青 */}
              <motion.button
                onClick={() => {
                  console.log('Blue button clicked');
                  setBackgroundColor('blue');
                }}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  backgroundColor === 'blue' 
                    ? 'bg-blue-500 border-blue-300 shadow-lg' 
                    : 'bg-blue-500/30 border-blue-300/50 hover:bg-blue-500/50'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
              
              {/* 緑 */}
              <motion.button
                onClick={() => {
                  console.log('Green button clicked');
                  setBackgroundColor('green');
                }}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  backgroundColor === 'green' 
                    ? 'bg-green-500 border-green-300 shadow-lg' 
                    : 'bg-green-500/30 border-green-300/50 hover:bg-green-500/50'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            </div>
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
      <GlobalAudioControl />
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
}
