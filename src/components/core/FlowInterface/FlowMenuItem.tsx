// src/components/core/FlowInterface/FlowMenuItem.tsx
import React from "react";
import styles from "./styles.module.css"; // Assuming styles.module.css is in the same directory

interface FlowMenuItemProps {
  icon: React.ReactNode;
  label: string;
  to?: string;
}

const FlowMenuItem: React.FC<FlowMenuItemProps> = ({ icon, label, to }) => {
  return (
    <div className={styles.flowMenuItem}>
      <span className={styles.menuIcon}>{icon}</span>
      <span className={styles.menuLabel}>{label}</span>
    </div>
  );
};

export default FlowMenuItem;
