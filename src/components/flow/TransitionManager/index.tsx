import React, { useState, useCallback } from 'react';
import styles from './styles.module.css'; // Import the CSS module

interface FlowTransition {
  from: string;
  to: string;
  state: 'entering' | 'active' | 'exiting';
  context: any;
}

const useFlowTransition = () => {
  const [transition, setTransition] = useState<FlowTransition | null>(null);

  const smoothTransition = useCallback(async (from: string, to: string, context: any) => {
    // Preserve current state
    setTransition({
      from,
      to,
      state: 'entering',
      context
    });

    // Smooth fade transition
    // await animate('exiting');
    // await animate('entering');

    await new Promise(resolve => setTimeout(resolve, 300));


    setTransition({
      from: to,
      to: '',
      state: 'active',
      context
    });

    // Maintain flow context
    return {
      previousContext: context,
      flowMaintained: true
    };
  }, []);

  return { transition, smoothTransition };
};

export default useFlowTransition;


// // Example implementation in FileOrganizer - Commenting out for now to resolve errors
// const FileOrganizer: React.FC = () => {
//   const { transition, smoothTransition } = useFlowTransition();

//   const handleFileAnalysis = async (file: File) => {
//     // Instead of abrupt state changes:
//     await smoothTransition('fileUpload', 'analysis', {
//       currentFile: file,
//       currentProgress: 'analyzing'
//     });

//     // Analysis happens while maintaining visual flow
//     const results = await analyzeFile(file);

//     // Smooth transition to results
//     await smoothTransition('analysis', 'results', {
//       analysisResults: results,
//       suggestedActions: generateSuggestions(results)
//     });
//   };

//   return (
//     <div className={`${styles.container} ${styles[transition?.state || '']}`}>
//       {/* Content with smooth transitions */}
//     </div>
//   );
// };