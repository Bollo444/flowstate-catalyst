// src/components/core/FlowInterface/FlowContent.tsx
import React, { ReactNode } from 'react';
import styles from './styles.module.css'; // Assuming styles.module.css is in the same directory

interface FlowContentProps {
  children: ReactNode;
}

const FlowContent: React.FC<FlowContentProps> = ({ children }) => {
  return (
    <main className={styles.flowContent}>
      {children}
    </main>
  );
};

export default FlowContent;