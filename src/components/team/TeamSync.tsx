'use client';

import React from 'react';
import styles from './TeamSync.module.css';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: string;
}

interface TeamSyncProps {
  members: TeamMember[];
}

export const TeamSync: React.FC<TeamSyncProps> = ({ members }) => {
  return (
    <div className={styles.teamSync}>
      <h3>Team Status</h3>
      <div className={styles.memberList}>
        {members.map(member => (
          <div key={member.id} className={styles.memberCard}>
            <div className={styles.memberInfo}>
              <h4>{member.name}</h4>
              <span className={styles.role}>{member.role}</span>
            </div>
            <span className={`${styles.status} ${styles[member.status.toLowerCase()]}`}>
              {member.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSync;
