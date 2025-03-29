import React from "react";
import styles from "@/components/shared/LoadingSpinner/styles.module.css"; // Correct filename

export const LoadingSpinner: React.FC = () => (
  <div className={styles.spinnerContainer}>
    <div className={styles.spinner}></div>
  </div>
);
