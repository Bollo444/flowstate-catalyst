import React, { useState, useEffect } from 'react';
import { Project } from '../../../types/database';
import styles from './styles.module.css';

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (project: { title: string; description: string }) => Promise<void>;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ 
  initialData,
  onSubmit,
  onCancel 
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ title, description });
      if (!initialData) {
        // Only clear form if creating new project
        setTitle('');
        setDescription('');
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="title">Project Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter project title"
          required
          className={styles.input}
        />
      </div>
      
      <div className={styles.field}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter project description"
          className={styles.textarea}
          rows={3}
        />
      </div>

      <div className={styles.buttons}>
        <button 
          type="submit" 
          disabled={isSubmitting || !title.trim()} 
          className={styles.submitButton}
        >
          {isSubmitting 
            ? (initialData ? 'Updating...' : 'Creating...') 
            : (initialData ? 'Update Project' : 'Create Project')
          }
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};