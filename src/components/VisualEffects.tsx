import { motion } from 'framer-motion';
import { memo } from 'react';

interface VisualEffectsProps {
  type: 'focus' | 'sleep' | 'relax';
  scene?: 'fire' | 'stars' | 'rain';
}

export const VisualEffects = memo(function VisualEffects({ type, scene }: VisualEffectsProps) {
  if (type === 'focus') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Random sized floating bubbles - 25個のランダムサイズの泡 */}
        {Array.from({ length: 25 }).map((_, i) => {
          const size = Math.random() * 20 + 8; // 8px to 28px
          const opacity = Math.random() * 0.3 + 0.1; // 0.1 to 0.4
          return (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: size,
                height: size,
                opacity: opacity,
              }}
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50,
              }}
              animate={{
                y: -50,
                x: Math.random() * window.innerWidth,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 15 + 10, // 10-25秒
                repeat: Infinity,
                delay: Math.random() * 8,
              }}
            />
          );
        })}
        
        {/* Underwater currents */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`current-${i}`}
            className="absolute w-full h-24 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent"
            style={{
              top: `${30 + i * 20}%`,
            }}
            animate={{
              x: [-100, window.innerWidth + 100],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 12,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
        
        {/* Wave effect */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-600/20 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
      </div>
    );
  }

  if (type === 'sleep') {
    if (scene === 'stars') {
      return (
        <div className="absolute inset-0 overflow-hidden">
          {/* Distant stars - 80個の小さな点滅 */}
          {Array.from({ length: 80 }).map((_, i) => {
            const size = Math.random() * 2 + 0.5;
            return (
              <motion.div
                key={`star-${i}`}
                className="absolute bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: size,
                  height: size,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.5, 0.8],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            );
          })}
          
          {/* Bright twinkling stars - 15個の明るい星（十字光線付き） */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`bright-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 80}%`,
              }}
            >
              <motion.div
                className="w-2 h-2 bg-white rounded-full relative"
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.8, 1],
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              >
                {/* Star cross effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-0.5 bg-white/60 absolute"></div>
                  <div className="w-0.5 h-8 bg-white/60 absolute"></div>
                </div>
              </motion.div>
            </motion.div>
          ))}
          
          {/* Nebula effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-blue-900/10 to-transparent"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
          
          {/* Shooting stars - 3個の流れ星（対角線移動） */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`shooting-${i}`}
              className="absolute w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
              style={{
                left: `${Math.random() * 50}%`,
                top: `${Math.random() * 50}%`,
                transform: 'rotate(45deg)',
              }}
              initial={{ opacity: 0, x: -100 }}
              animate={{
                opacity: [0, 1, 0],
                x: [0, 200],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: Math.random() * 10 + 5,
                repeatDelay: Math.random() * 15 + 10,
              }}
            />
          ))}
        </div>
      );
    }

    if (scene === 'fire') {
      return (
        <div className="absolute inset-0 overflow-hidden">
          {/* Simple dark atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-slate-900/30 to-black/40" />
        </div>
      );
    }

    if (scene === 'rain') {
      return (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-8 bg-blue-300/20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -50,
              }}
              animate={{
                y: window.innerHeight + 50,
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      );
    }
  }

  if (type === 'relax') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating leaves - 15個の大きな葉 */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: -50,
              y: Math.random() * window.innerHeight,
              rotate: 0,
            }}
            animate={{
              x: window.innerWidth + 50,
              y: Math.random() * window.innerHeight + Math.sin(i) * 100,
              rotate: 360,
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
          >
            {/* Leaf shape using CSS - border-radius: 0 100% 0 100%, rotation: 45度, vein: 中央線 */}
            <div
              className="w-4 h-6 bg-gradient-to-br from-green-300/30 to-emerald-400/20"
              style={{
                borderRadius: '0 100% 0 100%',
                transform: 'rotate(45deg)',
                position: 'relative',
              }}
            >
              {/* Leaf vein - 中央線 */}
              <div
                className="absolute w-0.5 h-full bg-green-400/40 left-1/2 top-0 transform -translate-x-1/2"
                style={{ borderRadius: '1px' }}
              />
            </div>
          </motion.div>
        ))}
        
        {/* Additional smaller leaves - 20個の小さな葉 */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`small-${i}`}
            className="absolute"
            initial={{
              x: -30,
              y: Math.random() * window.innerHeight,
              rotate: 0,
            }}
            animate={{
              x: window.innerWidth + 30,
              y: Math.random() * window.innerHeight + Math.cos(i) * 50,
              rotate: 180,
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              delay: Math.random() * 8,
            }}
          >
            {/* Small leaf shape */}
            <div
              className="w-2 h-3 bg-gradient-to-br from-green-200/25 to-emerald-300/15"
              style={{
                borderRadius: '0 100% 0 100%',
                transform: 'rotate(45deg)',
              }}
            />
          </motion.div>
        ))}
        
        {/* Gentle gradient waves */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-600/5"
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
      </div>
    );
  }

  return null;
});
