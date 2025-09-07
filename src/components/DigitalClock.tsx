import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

interface DigitalClockProps {
  theme?: 'default' | 'focus' | 'sleep' | 'relax';
}

export const DigitalClock = memo(function DigitalClock({ theme = 'default' }: DigitalClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // テーマ別のスタイル設定
  const getThemeStyles = () => {
    switch (theme) {
      case 'focus':
        return {
          timeClass: "text-4xl md:text-6xl font-light text-blue-100 font-mono tracking-wider drop-shadow-lg",
          dateClass: "text-sm md:text-lg text-blue-200/70 font-light",
          containerClass: "glass-card text-center space-y-2 p-4 md:p-6",
          animation: {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { duration: 0.8 }
          }
        };
      case 'sleep':
        return {
          timeClass: "text-4xl md:text-6xl font-light text-orange-100 font-mono tracking-wider drop-shadow-lg",
          dateClass: "text-sm md:text-lg text-orange-200/70 font-light",
          containerClass: "glass-card text-center space-y-2 p-4 md:p-6",
          animation: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 1 }
          }
        };
      case 'relax':
        return {
          timeClass: "text-4xl md:text-6xl font-light text-green-100 font-mono tracking-wider drop-shadow-lg",
          dateClass: "text-sm md:text-lg text-green-200/70 font-light",
          containerClass: "glass-card text-center space-y-2 p-4 md:p-6",
          animation: {
            initial: { scale: 0.95, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { duration: 0.6 }
          }
        };
      default:
        return {
          timeClass: "text-4xl md:text-6xl font-light text-white font-mono tracking-wider drop-shadow-lg",
          dateClass: "text-sm md:text-lg text-white/70 font-light",
          containerClass: "glass-card text-center space-y-2 p-4 md:p-6",
          animation: {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { duration: 0.8 }
          }
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <motion.div 
      className={styles.containerClass}
      initial={styles.animation.initial}
      animate={styles.animation.animate}
      transition={styles.animation.transition}
    >
      <div className={styles.timeClass}>
        {formatTime(time)}
      </div>
      <div className={styles.dateClass}>
        {formatDate(time)}
      </div>
    </motion.div>
  );
});
