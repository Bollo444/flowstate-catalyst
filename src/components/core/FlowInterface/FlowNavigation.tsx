// src/components/core/FlowInterface/FlowNavigation.tsx
import React from 'react';
import styles from './styles.module.css'; // Assuming styles.module.css is in the same directory
import FlowLogo from './FlowLogo'; // Import FlowLogo
import NavItems from './NavItems'; // Import NavItems

const FlowNavigation: React.FC = () => {
  return (
    <nav className={styles.flowNavigation}>
      <FlowLogo />
      <NavItems />
    </nav>
  );
};

export default FlowNavigation;