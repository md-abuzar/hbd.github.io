
import React, { useState, useEffect } from 'react';
import { TimeLeft } from '../types';

interface Props {
  targetDate: Date;
  onFinished: () => void;
}

const CountdownTimer: React.FC<Props> = ({ targetDate, onFinished }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +targetDate - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, total: difference };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const current = calculateTimeLeft();
      setTimeLeft(current);
      if (current.total <= 0) {
        clearInterval(timer);
        onFinished();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onFinished]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-2 md:mx-4">
      <div className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl shadow-lg w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
        <span className="text-2xl md:text-4xl font-elegant font-bold text-rose-600">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs md:text-sm uppercase tracking-widest text-rose-400 mt-2 font-semibold">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center items-center">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <TimeUnit value={timeLeft.seconds} label="Sec" />
    </div>
  );
};

export default CountdownTimer;
