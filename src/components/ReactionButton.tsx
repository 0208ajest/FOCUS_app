import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface ReactionButtonProps {
  initialLikes?: number;
  onLike?: (newCount: number) => void;
  className?: string;
}

export function ReactionButton({ initialLikes = 0, onLike, className = '' }: ReactionButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flyingHearts, setFlyingHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleLike = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newLikes = likes + 1;
    setLikes(newLikes);
    onLike?.(newLikes);

    // ハートが飛んでいくエフェクト
    const heartCount = 3 + Math.floor(Math.random() * 3); // 3-5個のハート
    const newFlyingHearts = Array.from({ length: heartCount }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100, // -100 to 100
      y: Math.random() * 200 - 100, // -100 to 100
    }));
    
    setFlyingHearts(prev => [...prev, ...newFlyingHearts]);

    // アニメーション終了後にハートを削除
    setTimeout(() => {
      setFlyingHearts(prev => prev.filter(heart => !newFlyingHearts.some(newHeart => newHeart.id === heart.id)));
    }, 2000);

    // ボタンのアニメーション終了
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className={`relative ${className}`}>
      {/* 飛んでいくハート */}
      <AnimatePresence>
        {flyingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute pointer-events-none z-50"
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0,
              opacity: 1 
            }}
            animate={{ 
              x: heart.x, 
              y: heart.y - 100, 
              scale: [0, 1.2, 1],
              opacity: [1, 1, 0],
              rotate: [0, 360]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2,
              ease: "easeOut"
            }}
          >
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* リアクションボタン */}
      <motion.button
        onClick={handleLike}
        disabled={isAnimating}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-full
          bg-white/10 backdrop-blur-md border border-white/20
          text-white hover:bg-white/20 transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart className={`h-4 w-4 ${likes > 0 ? 'text-red-500 fill-red-500' : 'text-white'}`} />
        </motion.div>
        <span className="text-sm font-medium">
          {likes > 0 ? likes : ''}
        </span>
      </motion.button>
    </div>
  );
}
