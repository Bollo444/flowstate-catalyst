// src/components/core/FlowInterface/ContentArea.tsx
import React from 'react';
import styles from './styles.module.css';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import FlowDashboard from '../dashboard/FlowDashboard';
import TeamView from '../team/TeamView';
import { useFlowStore } from '../../store/flowState';
import { flowAnimations } from '../../styles/animations'; // Import animations

interface ContentAreaProps {
  className?: string;
}

const flowAnimations: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const ContentArea: React.FC<ContentAreaProps> = ({ className }) => {
  const { activeView } = useFlowStore();
  
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {activeView === 'dashboard' && (
          <motion.div
            key="dashboard"
            variants={flowAnimations}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <FlowDashboard />
          </motion.div>
        )}
        
        {activeView === 'team' && (
          <motion.div
            key="team"
            {...flowAnimations.pageTransition}
          >
            <TeamView />
          </motion.div>
        )}
        
        {/* Add other views */}
      </AnimatePresence>
    </div>
  );
};

export default ContentArea;
