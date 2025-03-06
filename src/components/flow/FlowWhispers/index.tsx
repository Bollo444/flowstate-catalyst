import React, { useState, useCallback, useEffect } from 'react';
import styles from './styles.module.css';
import FlowWhisperCard from './WhisperCard';
import { useFlowWhispers } from '../../../hooks/useFlowWhispers';

interface FlowWhisper {
  id: string;
  message: string;
  type: 'motivation' | 'insight' | 'achievement' | 'flow-check';
  emoji?: string[];
  interaction?: 'emoji' | 'quick-reply' | 'acknowledge';
}

interface FlowWhispersProviderProps {
  children: React.ReactNode;
}

const FlowWhispersProvider: React.FC<FlowWhispersProviderProps> = ({ children }) => {
  const [activeWhisper, setActiveWhisper] = useState<FlowWhisper | null>(null);
  const { triggerWhisper } = useFlowWhispers();
  const [flowStreak, setFlowStreak] = useState(0);

  const handleWhisperInteraction = (whisperId: string, emoji: string) => {
    console.log(`Whisper ${whisperId} interaction: ${emoji}`);
    setActiveWhisper(null); // Dismiss whisper after interaction
  };

  const showWhisper = useCallback((whisper: FlowWhisper) => {
    setActiveWhisper(whisper);
  }, []);

  // Example trigger - replace with actual triggers based on user flow/activity
  useEffect(() => {
    const intervalId = setInterval(() => {
      const whisper = triggerWhisper('exampleActivity'); // Replace with actual activity
      if (whisper) {
        showWhisper(whisper);
      }
    }, 5000); // Example: Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [triggerWhisper, showWhisper]);

  return (
    <div className={styles.flowContainer}>
      {activeWhisper && (
        <FlowWhisperCard
          whisper={activeWhisper}
          onInteraction={handleWhisperInteraction}
        />
      )}
      {children}
    </div>
  );
};

export default FlowWhispersProvider;