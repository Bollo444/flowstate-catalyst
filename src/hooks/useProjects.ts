import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Project } from '../types/database';
import { handleSupabaseError } from '../utils/errorHandling';
import { useLoadingState } from './useLoadingState';

export const useProjects = () => {
  const supabase = useSupabaseClient();
  const { setError, startLoading, stopLoading } = useLoadingState();

  const getProjects = async (userId: string) => {
    startLoading();
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        setError({
          code: 'PROJECTS_LOAD_FAILED',
          message: 'Failed to load projects.',
          details: handleSupabaseError(error)
        });
        return [];
      }
      stopLoading();
      return data as Project[];
    } catch (error) {
      stopLoading();
      setError({
        code: 'PROJECTS_LOAD_ERROR',
        message: 'Error loading projects.',
        details: error
      });
      return [];
    }
  };

  const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    startLoading();
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();

      if (error) throw handleSupabaseError(error);
      return data as Project;
    } finally {
      stopLoading();
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>) => {
    startLoading();
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw handleSupabaseError(error);
      return data as Project;
    } finally {
      stopLoading();
    }
  };

  const deleteProject = async (projectId: string) => {
    startLoading();
    try {
      // First, delete all tasks associated with the project
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('project_id', projectId);

      if (tasksError) throw handleSupabaseError(tasksError);

      // Then delete the project
      const { error: projectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (projectError) throw handleSupabaseError(projectError);
    } finally {
      stopLoading();
    }
  };

  return {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};