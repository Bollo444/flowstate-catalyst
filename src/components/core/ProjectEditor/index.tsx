// src/components/core/ProjectEditor/index.tsx
import React from 'react';
import styles from './styles.module.css'; // Create ProjectEditor.module.css
import { MarkdownEditor } from '../../shared/MarkdownEditor';
import TaskList from '../TaskList'; // Assuming TaskList component is in the same directory

export const ProjectEditor: React.FC = () => {
  const handleTitleChange = (value: string) => {
    // Handle project title change
    console.log('Project title changed to:', value);
  };

  const handleDescriptionChange = (value: string) => {
    // Handle project description change
    console.log('Project description changed to:', value);
  };

  return (
    <div className={styles.projectEditor}>
      <header className={styles.editorHeader}>
        <MarkdownEditor
          placeholder="Project Title"
          onChange={handleTitleChange}
        />
      </header>
      
      <div className={styles.editorContent}>
        <div className={styles.description}>
          <MarkdownEditor
            placeholder="Project Description..."
            onChange={handleDescriptionChange}
          />
        </div>
        
        <div className={styles.tasks}>
          <TaskList />
        </div>
      </div>
    </div>
  );
};