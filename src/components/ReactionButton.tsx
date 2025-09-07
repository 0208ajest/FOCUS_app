import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface ReactionButtonProps {
  pageId?: string; // ページ識別子（'home', 'focus', 'sleep'など）
  onLike?: (newCount: number) => void;
  className?: string;
}

// グローバルないいね数を管理するためのAPI（簡易版）
const GLOBAL_LIKES_KEY = 'global_likes';
const LOCAL_LIKES_KEY = 'local_likes';

// ローカルストレージからいいね数を取得
const getLocalLikes = (pageId: string): number => {
  try {
    const localLikes = JSON.parse(localStorage.getItem(LOCAL_LIKES_KEY) || '{}');
    return localLikes[pageId] || 0;
  } catch {
    return 0;
  }
};

// ローカルストレージにいいね数を保存
const saveLocalLikes = (pageId: string, count: number): void => {
  try {
    const localLikes = JSON.parse(localStorage.getItem(LOCAL_LIKES_KEY) || '{}');
    localLikes[pageId] = count;
    localStorage.setItem(LOCAL_LIKES_KEY, JSON.stringify(localLikes));
  } catch (error) {
    console.error('Failed to save local likes:', error);
  }
};

// グローバルいいね数を取得（簡易版 - 実際のアプリではAPIを使用）
const getGlobalLikes = (pageId: string): number => {
  try {
    const globalLikes = JSON.parse(localStorage.getItem(GLOBAL_LIKES_KEY) || '{}');
    return globalLikes[pageId] || 0;
  } catch {
    return 0;
  }
};

// グローバルいいね数を更新（簡易版 - 実際のアプリではAPIを使用）
const updateGlobalLikes = (pageId: string, increment: number): void => {
  try {
    const globalLikes = JSON.parse(localStorage.getItem(GLOBAL_LIKES_KEY) || '{}');
    globalLikes[pageId] = (globalLikes[pageId] || 0) + increment;
    localStorage.setItem(GLOBAL_LIKES_KEY, JSON.stringify(globalLikes));
  } catch (error) {
    console.error('Failed to update global likes:', error);
  }
};

export function ReactionButton({ pageId = 'default', onLike, className = '' }: ReactionButtonProps) {
  const [localLikes, setLocalLikes] = useState(0);
  const [globalLikes, setGlobalLikes] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flyingHearts, setFlyingHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // 初期化時にローカルとグローバルのいいね数を読み込み
  useEffect(() => {
    setLocalLikes(getLocalLikes(pageId));
    setGlobalLikes(getGlobalLikes(pageId));
  }, [pageId]);

  const handleLike = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // ローカルといいね数を更新
    const newLocalLikes = localLikes + 1;
    const newGlobalLikes = globalLikes + 1;
    
    setLocalLikes(newLocalLikes);
    setGlobalLikes(newGlobalLikes);
    
    // ローカルストレージに保存
    saveLocalLikes(pageId, newLocalLikes);
    updateGlobalLikes(pageId, 1);
    
    onLike?.(newGlobalLikes);

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
          <Heart className={`h-4 w-4 ${globalLikes > 0 ? 'text-red-500 fill-red-500' : 'text-white'}`} />
        </motion.div>
        <span className="text-sm font-medium">
          {globalLikes > 0 ? globalLikes : ''}
        </span>
      </motion.button>
    </div>
  );
}
