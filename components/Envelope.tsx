
import React, { useState } from 'react';

interface Props {
  onOpen: () => void;
}

const Envelope: React.FC<Props> = ({ onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    setIsOpening(true);
    setTimeout(onOpen, 1500);
  };

  return (
    <div className="relative cursor-pointer group" onClick={handleClick}>
      <div className={`relative w-64 h-48 md:w-80 md:h-60 bg-rose-200 shadow-2xl transition-transform duration-500 ${isOpening ? 'scale-110' : 'group-hover:scale-105'}`}>
        {/* Envelope Body */}
        <div className="absolute inset-0 border-2 border-rose-300 rounded-lg overflow-hidden">
          {/* Bottom Flap */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-rose-300 origin-bottom transform translate-y-2 rotate-180" style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }}></div>
          {/* Side Flaps */}
          <div className="absolute top-0 left-0 h-full w-1/2 bg-rose-100/50" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>
          <div className="absolute top-0 right-0 h-full w-1/2 bg-rose-100/50" style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}></div>
        </div>

        {/* Top Flap */}
        <div 
          className={`absolute top-0 left-0 w-full h-1/2 bg-rose-400 origin-top transition-transform duration-700 z-20 ${isOpening ? 'rotate-x-180 -translate-y-full' : ''}`}
          style={{ 
            clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
            transformStyle: 'preserve-3d',
            transform: isOpening ? 'rotateX(180deg)' : 'rotateX(0deg)'
          }}
        ></div>

        {/* Content (Letter peaking out) */}
        <div className={`absolute left-4 right-4 bg-white shadow-md p-4 transition-all duration-1000 ease-in-out ${isOpening ? 'bottom-20 z-10' : 'bottom-0 -z-10 opacity-0'}`}>
          <p className="font-romantic text-rose-600 text-center text-lg">For Sifat...</p>
        </div>

        {/* Heart Seal */}
        {!isOpening && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 animate-bounce">
            <div className="text-4xl text-rose-600 shadow-sm drop-shadow-lg">❤️</div>
          </div>
        )}
      </div>
      
      {!isOpening && (
        <p className="mt-8 text-rose-500 font-romantic text-2xl animate-pulse text-center">
          Click to open your surprise
        </p>
      )}
    </div>
  );
};

export default Envelope;
