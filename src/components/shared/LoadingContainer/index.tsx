import React from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import styles from "./styles.module.css";

interface LoadingContainerProps {
  message: string;
}

export const LoadingContainer: React.FC<LoadingContainerProps> = ({
  message,
}) => {
  return (
    <div className={styles.container}>
      <LoadingSpinner />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};
