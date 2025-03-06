// src/components/core/FlowInterface/FlowLogo.tsx
import React from 'react';
import styles from './styles.module.css'; // Assuming styles.module.css is in the same directory

const FlowLogo: React.FC = () => {
  return (
    <div className={styles.flowLogo}>
      {/* Replace with actual logo or image */}
      <span role="img" aria-label="Flow Logo">🌊</span> FlowState
    </div>
  );
};

export default FlowLogo;