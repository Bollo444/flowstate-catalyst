// src/components/team/TeamMembers.tsx
import React from "react";
// Removed CSS module import
import { TeamMemberStatusWithDetails, TeamMemberStatus, Profile } from "@/types/database"; // Use TeamMemberStatusWithDetails for joined data // Import needed types, including Profile explicitly

// Define TeamProps using the imported types
interface TeamProps {
  teamId?: string;
  members: TeamMemberStatusWithDetails[];
}

// Correctly reference the 'profiles' table type using the exported type alias
type UserProfile = Profile;

// Placeholder sub-components with basic styling
// Assumes 'status' and 'user' now exist on TeamMemberStatus from database.ts
const calculateMemberStats = (members: TeamMemberStatusWithDetails[]) => ({ active: members.filter(m => m.status === 'active').length, total: members.length });

const MemberList: React.FC<{ members: TeamMemberStatusWithDetails[] }> = ({ members }) => (
  <ul className="space-y-2">
    {members.map(member => {
       // Access nested user profile directly
       const userProfile = member.user;
       return (
         <li key={member.user_id} className="flex items-center gap-2 text-sm">
           {/* Placeholder for Avatar component */}
           <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
           <span className="text-foreground-light dark:text-foreground-dark truncate">
             {userProfile?.full_name || userProfile?.username || member.user_id} {/* Corrected: Use username as fallback instead of email */}
           </span>
           {/* Display status if available */}
           {member.status && (
              <span className={`ml-auto px-2 py-0.5 rounded text-xs capitalize ${
                member.status === 'active'
                  ? 'bg-success-light-muted text-success-light dark:bg-success-dark-muted dark:text-success-dark'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {member.status}
              </span>
           )}
         </li>
       );
     })}
  </ul>
);

// Updated MemberStats to be slightly more informative
const MemberStats: React.FC<{ stats: { active: number, total: number } }> = ({ stats }) => (
  <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark text-sm text-foreground-light-secondary dark:text-foreground-dark-secondary">
    {stats.active} Active / {stats.total} Total
  </div>
);

// Updated MemberActions with a basic button style
const MemberActions: React.FC = () => (
  <div className="mt-4">
    <button className="w-full px-3 py-1.5 text-sm rounded bg-primary-light dark:bg-primary-dark text-white hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-colors">
      Manage Team
    </button>
  </div>
);


export const TeamMembers: React.FC<TeamProps> = ({ members }) => {
  // Handle cases where members might be null or undefined initially
  const validMembers = members || [];
  const memberStats = calculateMemberStats(validMembers);

  // Apply Tailwind styles to the main container div
  return (
     // Container div with themed background, padding, rounded corners, and shadow
     <div className="bg-background-light dark:bg-background-dark-secondary rounded-lg p-4 shadow-md">
        <h3 className="text-md font-semibold mb-3 text-foreground-light dark:text-foreground-dark">Team Members</h3>
       <MemberList members={validMembers} />
       {/* Optionally display stats and actions */}
        <MemberStats stats={memberStats} />
        <MemberActions />
     </div>
   );
 };
