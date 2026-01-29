
import React, { useEffect, useState } from 'react';

const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<{ id: number; left: string; duration: string; size: string }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        left: `${Math.random() * 100}%`,
        duration: `${10 + Math.random() * 20}s`,
        size: `${10 + Math.random() * 30}px`,
      };
      setHearts(prev => [...prev.slice(-20), newHeart]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="heart-particle text-rose-300 opacity-20"
          style={{
            left: heart.left,
            animationDuration: heart.duration,
            fontSize: heart.size,
            bottom: '-50px'
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;
