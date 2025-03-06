// src/components/team/TeamMembers.tsx
import React from 'react';
import styles from './styles.module.css'; // Create TeamMembers.module.css

export const TeamMembers: React.FC = () => {
  return (
    <div className={styles.teamMembersContainer}>
      <h3>Team Members</h3>
      {/* List of team members will go here */}
      <p>Team members will be listed here.</p>
    </div>
  );
};