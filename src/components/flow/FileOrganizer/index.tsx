import React, { useState } from 'react';
import { AnalysisResult } from '../../../services/fileAnalysis/types';
import { useProjects } from '../../../hooks/useProjects';
import { useTasks } from '../../../hooks/useTasks';
import styles from './styles.module.css';

interface FileOrganizerProps {
  suggestion: AnalysisResult;
  onApply: () => void;
}

export const FileOrganizerComponent: React.FC<FileOrganizerProps> = ({
  suggestion,
  onApply
}) => {
  const { createProject } = useProjects();
  const { createTask } = useTasks();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async () => {
    if (!suggestion.projectContext) return;
    
    setIsCreating(true);
    try {
      // Create new project
      const project = await createProject({
        user_id: '', // This will be filled by the backend using the authenticated user
        title: suggestion.projectContext.relatedProject,
        description: `Project created from file: ${suggestion.originalName}`,
        status: 'active',
        flow_state_data: {
          current_flow_score: 0,
        }
      });

      // Create suggested tasks
      if (suggestion.projectContext.suggestedTasks) {
        await Promise.all(
          suggestion.projectContext.suggestedTasks.map(taskTitle =>
            createTask({
              project_id: project.id,
              user_id: '', // This will be filled by the backend
              title: taskTitle,
              description: null,
              priority: suggestion.projectContext?.priority || 'medium',
              status: 'pending',
              due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              assignee_id: null,
              dependencies: null,
              progress: 0,
              flow_metrics: {}
            })
          )
        );
      }

      onApply();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={styles.organizer}>
      <div className={styles.section}>
        <h3>File Organization</h3>
        <div className={styles.detail}>
          <span>Original Name:</span>
          <span>{suggestion.originalName}</span>
        </div>
        <div className={styles.detail}>
          <span>Suggested Name:</span>
          <span>{suggestion.suggestedName}</span>
        </div>
        <button 
          className={styles.button}
          onClick={() => {/* Implement rename action */}}
        >
          Apply Suggested Name
        </button>
      </div>

      {suggestion.projectContext && (
        <div className={styles.section}>
          <h3>Project Creation</h3>
          <div className={styles.detail}>
            <span>Project Type:</span>
            <span>{suggestion.projectContext.relatedProject}</span>
          </div>
          {suggestion.projectContext.suggestedTasks && (
            <div className={styles.tasks}>
              <h4>Suggested Tasks</h4>
              <ul>
                {suggestion.projectContext.suggestedTasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
            </div>
          )}
          <button
            className={styles.button}
            onClick={handleCreateProject}
            disabled={isCreating}
          >
            {isCreating ? 'Creating Project...' : 'Create Project'}
          </button>
        </div>
      )}

      <div className={styles.section}>
        <h3>Tags</h3>
        <div className={styles.tags}>
          {suggestion.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};