// src/components/core/FlowInterface/FlowSidebar.tsx
import React from 'react';
import styles from './FlowInterface.module.css'; // Correct path

const FlowSidebar: React.FC = () => {
  return (
    <aside className={styles.flowSidebar}>
      {/* Sidebar content will go here */}
      <h3>Flow Sidebar</h3>
      <p>Additional flow-related tools and widgets can be placed here.</p>
    </aside>
  );
};

export default FlowSidebar;