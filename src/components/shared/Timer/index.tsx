"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Pause, Play } from "lucide-react";
import styles from "./Timer.module.css";

interface TimerProps {
  time: number;
  isActive: boolean;
  variant?: "normal" | "highlight";
  onPause?: () => void;
  onResume?: () => void;
}

export const Timer: React.FC<TimerProps> = ({
  time,
  isActive,
  variant = "normal",
  onPause,
  onResume,
}) => {
  const [displayTime, setDisplayTime] = useState(formatTime(time));

  useEffect(() => {
    setDisplayTime(formatTime(time));
  }, [time]);

  return (
    <motion.div
      className={`${styles.container} ${styles[variant]}`}
      animate={{ scale: isActive ? 1 : 0.98 }}
    >
      <Clock className={styles.icon} />

      <div className={styles.timeDisplay}>
        <motion.span
          key={displayTime}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={styles.time}
        >
          {displayTime}
        </motion.span>
        <span className={styles.label}>Active Time</span>
      </div>

      {(onPause || onResume) && (
        <button
          onClick={isActive ? onPause : onResume}
          className={styles.controlButton}
        >
          {isActive ? <Pause size={16} /> : <Play size={16} />}
        </button>
      )}
    </motion.div>
  );
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};
