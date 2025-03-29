import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useFlowContext } from "../../context/FlowContext";

const TimeUntilReset = () => {
  const { flowState } = useFlowContext();
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    if (flowState.status === "flowing" && flowState.sessionStart) {
      const sessionStart = new Date(flowState.sessionStart);
      const currentTime = new Date();
      const timeElapsed = (currentTime - sessionStart) / 1000; // in seconds
      const timeRemainingSeconds = 24 * 60 * 60 - timeElapsed; // 24 hours in seconds
      setTimeRemaining(timeRemainingSeconds);
    }
  }, [flowState]);

  if (!timeRemaining) return null;

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = Math.floor(timeRemaining % 60);

  return (
    <div className={styles.timeUntilResetContainer}>
      Time Remaining: {hours.toString().padStart(2, "0")}:
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
};

export default TimeUntilReset;
