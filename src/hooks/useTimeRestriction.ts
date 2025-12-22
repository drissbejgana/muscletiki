import { useState, useEffect } from 'react';

export const useTimeRestriction = (
  shouldRestrict: boolean, 
  restrictionMinutes: number = 2
) => {
  const [isRestricted, setIsRestricted] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  useEffect(() => {
    if (!shouldRestrict) {
      setIsRestricted(false);
      setTimeExpired(false);
      setRemainingTime(null);
      return;
    }

    const STORAGE_KEY = 'fitness_app_restriction_time';
    const now = Date.now();
    
    // Check existing restriction time
    const storedTime = localStorage.getItem(STORAGE_KEY);
    
    let expiryTime: number;
    
    if (storedTime) {
      // Use existing expiry time
      expiryTime = parseInt(storedTime);
    } else {
      // Set new expiry time
      expiryTime = now + (restrictionMinutes * 60 * 1000);
      localStorage.setItem(STORAGE_KEY, expiryTime.toString());
    }

    // Calculate time left
    const timeLeft = expiryTime - now;
    
    if (timeLeft <= 0) {
      // Time already expired
      setTimeExpired(true);
      setIsRestricted(true);
      setRemainingTime(0);
      return;
    }

    // Set remaining time
    setRemainingTime(Math.ceil(timeLeft / 1000));

    // Update remaining time every second
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const remaining = expiryTime - currentTime;
      
      if (remaining <= 0) {
        setTimeExpired(true);
        setIsRestricted(true);
        setRemainingTime(0);
        clearInterval(intervalId);
      } else {
        setRemainingTime(Math.ceil(remaining / 1000));
      }
    }, 1000);

    // Set timeout for expiration
    const timer = setTimeout(() => {
      setTimeExpired(true);
      setIsRestricted(true);
      setRemainingTime(0);
    }, timeLeft);

    return () => {
      clearTimeout(timer);
      clearInterval(intervalId);
    };
  }, [shouldRestrict, restrictionMinutes]);

  const clearRestriction = () => {
    localStorage.removeItem('fitness_app_restriction_time');
    setIsRestricted(false);
    setTimeExpired(false);
    setRemainingTime(null);
  };

  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return { 
    isRestricted, 
    timeExpired, 
    remainingTime,
    formatTime,
    clearRestriction 
  };
};
