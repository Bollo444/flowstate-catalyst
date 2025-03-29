// src/components/core/FlowInterface/NavItems.tsx
import React from "react";
import styles from "./styles.module.css"; // Assuming styles.module.css is in the same directory
import FlowMenuItem from "./FlowMenuItem"; // Import FlowMenuItem

const NavItems: React.FC = () => {
  return (
    <div className={styles.navItems}>
      <FlowMenuItem icon="🌊" label="Dashboard" />
      <FlowMenuItem icon="📊" label="Projects" />
      <FlowMenuItem icon="👥" label="Team" />
      <FlowMenuItem icon="⚡" label="Flow Stats" />
    </div>
  );
};

export default NavItems;
