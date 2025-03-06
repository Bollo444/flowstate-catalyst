import React, { useState } from 'react';
import { Project } from '../../../types/database';
import { useProjects } from '../../../hooks/useProjects';
import { ProjectForm } from '../ProjectForm';
import { ConfirmDialog } from '../../shared/ConfirmDialog';
import styles from './styles.module.css';

interface ProjectCardProps {
  project: Project;
  onUpdate: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onUpdate }) => {
  const { updateProject, deleteProject } = useProjects();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async (updates: { title: string; description: string }) => {
    setIsLoading(true);
    try {
      await updateProject(project.id, {
        ...updates,
        flow_state_data: project.flow_state_data
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to update project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteProject(project.id);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isEditing) {
    return (
      <ProjectForm
        initialData={project}
        onSubmit={handleUpdate}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <div className={styles.projectCard}>
        <div className={styles.header}>
          <h3>{project.title}</h3>
          <div className={styles.headerActions}>
            <button
              onClick={handleEdit}
              className={styles.editButton}
              disabled={isLoading}
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className={styles.deleteButton}
              disabled={isLoading}
            >
              Delete
            </button>
          </div>
        </div>

        <p className={styles.description}>{project.description}</p>

        <div className={styles.meta}>
          <span className={styles.status}>
            Status: <span>{project.status}</span>
          </span>
          <span className={styles.flowScore}>
            Flow Score: {project.flow_state_data.current_flow_score}
          </span>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone and will delete all associated tasks."
        confirmLabel="Delete Project"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isDestructive
      />
    </>
  );
};