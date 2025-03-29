import React, { useState } from "react";
import styles from "./styles.module.css";
import { motion } from "framer-motion";
import { WhisperProps } from "../../features/flowWhispers/types";
import { whisperAnimations } from "../../features/flowWhispers/animations";

const FlowWhisperCard: React.FC<WhisperProps> = ({
  message,
  animation = "fadeFloat", // Default animation
  interaction,
}) => {
  const [interacted, setInteracted] = useState(false);

  const handleEmojiResponse = (emoji: string) => {
    setInteracted(true);
    console.log(`Emoji response: ${emoji}`);
    // Handle response logic here, e.g., update flow state, trigger reward
  };

  return (
    <motion.div
      className={`${styles.whisperCard} ${styles[animation]}`}
      variants={whisperAnimations}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={styles.whisperContent}>
        <p>{message}</p>

        {interaction === "emoji" && (
          <div className={styles.emojiInteraction}>
            {["🌊", "⚡", "🚀", "✨"].map((emoji) => (
              <motion.button
                key={emoji}
                className={styles.emojiButton}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleEmojiResponse(emoji)}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FlowWhisperCard;
