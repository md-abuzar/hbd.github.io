
import React, { useEffect, useState } from 'react';
import { generateBirthdayMessage } from '../services/geminiService';

const BirthdayCard: React.FC = () => {
  const [message, setMessage] = useState<string>("Loading your special message...");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMessage = async () => {
    setIsRefreshing(true);
    const msg = await generateBirthdayMessage("Sifat");
    setMessage(msg);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <div className="max-w-2xl w-full mx-auto px-4 py-12 animate-in fade-in zoom-in duration-1000">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 relative">
        {/* Card Header Decoration */}
        <div className="h-48 md:h-64 relative">
          <img 
            src="https://picsum.photos/seed/bday/800/600" 
            alt="Celebration" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
            <h1 className="text-4xl md:text-6xl font-romantic font-bold text-rose-600 drop-shadow-sm">
              Happy Birthday Sifat!
            </h1>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-8 md:p-12 text-center space-y-6">
          <div className="inline-block relative">
            <span className="text-5xl">🎂</span>
            <div className="absolute -top-4 -right-4 animate-bounce">🎈</div>
          </div>
          
          <div className="space-y-4">
            <div className={`prose prose-rose italic text-rose-800 leading-relaxed font-elegant transition-opacity duration-500 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
              {message.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-rose-50 px-4">
            <p className="text-rose-400 font-romantic text-xl">With all my love ❤️</p>
          </div>

          <button 
            onClick={fetchMessage}
            disabled={isRefreshing}
            className="mt-4 text-xs text-rose-300 hover:text-rose-500 transition-colors uppercase tracking-widest disabled:opacity-50"
          >
            {isRefreshing ? "Whispering to the stars..." : "Ask the stars for another wish"}
          </button>
        </div>
        
        {/* Decorative Sprinkles */}
        <div className="absolute top-2 left-2 text-2xl rotate-12">✨</div>
        <div className="absolute top-2 right-2 text-2xl -rotate-12">✨</div>
        <div className="absolute bottom-2 left-2 text-2xl -rotate-45 opacity-50">🌹</div>
        <div className="absolute bottom-2 right-2 text-2xl rotate-45 opacity-50">🌹</div>
      </div>
      
      {/* Shareable Quote */}
      <div className="mt-12 text-center">
        <p className="text-rose-400/80 italic text-sm">
          "The best things in life are even better with you."
        </p>
      </div>
    </div>
  );
};

export default BirthdayCard;
