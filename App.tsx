
import React, { useState, useEffect } from 'react';
import { AppState } from './types';
import FloatingHearts from './components/FloatingHearts';
import CountdownTimer from './components/CountdownTimer';
import Envelope from './components/Envelope';
import BirthdayCard from './components/BirthdayCard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.COUNTDOWN);
  
  // Set the target date: Jan 30th at 12:00 AM (Midnight)
  // Logic to determine if we should target this year or next
  const getTargetDate = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const target = new Date(currentYear, 0, 30, 0, 0, 0); // Month is 0-indexed (Jan = 0)
    
    // If Jan 30th has already passed this year, target next year
    if (now > target) {
      target.setFullYear(currentYear + 1);
    }
    return target;
  };

  const [targetDate] = useState(getTargetDate());

  useEffect(() => {
    // Initial check in case it's already past the time
    if (new Date() >= targetDate) {
      setAppState(AppState.ENVELOPE_READY);
    }
  }, [targetDate]);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-white to-pink-50 overflow-hidden">
      <FloatingHearts />

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        
        {appState === AppState.COUNTDOWN && (
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-elegant font-bold text-rose-700">
                A Special Surprise is Coming...
              </h1>
              <p className="text-rose-400 font-romantic text-2xl md:text-3xl italic">
                Wait for it, Sifat ❤️
              </p>
            </header>
            
            <CountdownTimer 
              targetDate={targetDate} 
              onFinished={() => setAppState(AppState.ENVELOPE_READY)} 
            />
            
            <div className="pt-8 opacity-60">
              <p className="text-rose-300 text-sm tracking-widest uppercase">Counting down to Jan 30th</p>
            </div>
          </div>
        )}

        {appState === AppState.ENVELOPE_READY && (
          <div className="animate-in zoom-in fade-in duration-1000 flex flex-col items-center">
            <h1 className="mb-12 text-3xl md:text-5xl font-elegant font-bold text-rose-700 text-center px-4">
              It's Time! 🎂
            </h1>
            <Envelope onOpen={() => setAppState(AppState.CARD_VIEW)} />
          </div>
        )}

        {appState === AppState.CARD_VIEW && (
          <BirthdayCard />
        )}
        
      </main>

      {/* Footer Footer */}
      <footer className="fixed bottom-4 text-center opacity-30 hover:opacity-100 transition-opacity">
        <p className="text-xs text-rose-400 font-medium">Made with ❤️ just for you</p>
      </footer>
    </div>
  );
};

export default App;
