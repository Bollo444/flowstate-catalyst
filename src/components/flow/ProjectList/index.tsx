import React from 'react';
import { useProjects } from '../../../hooks/useProjects';
import { useLoadingState } from '../../../hooks/useLoadingState';
import { ErrorDisplay } from '../../shared/ErrorDisplay';
import { LoadingContainer } from '../../shared/LoadingContainer';
import { ProjectForm } from '../ProjectForm';
import { ProjectCard } from '../ProjectCard';
import styles from './styles.module.css';
import { Project } from '../../../types/database';

export const ProjectList: React.FC<{ userId: string }> = ({ userId }) => {
  const { getProjects, createProject } = useProjects();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const { isLoading, error, setError, startLoading, stopLoading, resetState } = useLoadingState();

  const loadProjects = React.useCallback(async () => {
    startLoading();
    try {
      const data = await getProjects(userId);
      setProjects(data);
    } catch (err) {
      setError({
        code: 'PROJECTS_LOAD_ERROR',
        message: 'Failed to load projects',
        details: err
      });
    } finally {
      stopLoading();
    }
  }, [userId, getProjects, startLoading, stopLoading, setError]);

  React.useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreateProject = async (projectData: { title: string; description: string }) => {
    try {
      const newProject = await createProject({
        user_id: userId,
        title: projectData.title,
        description: projectData.description,
        status: 'active',
        flow_state_data: {
          current_flow_score: 0
        }
      });
      setProjects(prev => [newProject, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError({
        code: 'PROJECT_CREATE_ERROR',
        message: 'Failed to create project',
        details: err
      });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingContainer message="Loading your projects..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={() => {
          resetState();
          loadProjects();
        }}
        onDismiss={() => resetState()}
      />
    );
  }

  return (
    <div className={styles.projectListContainer}>
      <div className={styles.header}>
        <button 
          className={styles.createButton}
          onClick={() => setShowForm(true)}
        >
          Create New Project
        </button>
      </div>

      {showForm && (
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowForm(false)}
        />
      )}

      {projects.length === 0 && !showForm ? (
        <div className={styles.emptyState}>
          <h3>No projects yet</h3>
          <p>Create your first project to get started</p>
          <button 
            className={styles.createButton}
            onClick={() => setShowForm(true)}
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onUpdate={loadProjects}
            />
          ))}
        </div>
      )}
    </div>
  );
};