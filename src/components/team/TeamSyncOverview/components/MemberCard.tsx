import React from "react";
import { TeamMemberStatus } from "../../../../hooks/useTeamSync";
import styles from "../styles.module.css";

interface MemberCardProps {
  member: TeamMemberStatus;
  getStatusColor: (status: TeamMemberStatus["status"]) => string;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  getStatusColor,
}) => {
  // Extract member card logic here
  return <div className={styles.memberCard}>{/* Member card content */}</div>;
};
