'use client';

import { FlowStateApp } from '@/components/FlowStateApp';
import { useSupabase } from '@/lib/supabaseClient';
import { redirect } from 'next/navigation';
import { TaskCreate } from '@/components/tasks/TaskCreate';
import { useState } from 'react';
<<<<<<< HEAD
import { Task } from '@/types/taskFlow'; // Import Task interface from src/types/taskFlow.ts
=======
import { Tables } from '@/types/database';

interface Task extends Tables<'tasks'> {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  created_at: string;
  user_id: string;
}
>>>>>>> 7d9ee070489d2151403e6b883b553afda5d85c0e

export default function Home() {
  const { session } = useSupabase();
  const [tasks, setTasks] = useState<Task[]>([]);

  if (!session) {
    redirect('/auth/signin');
  }

  const handleTaskCreated = (newTask: Task): void => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  return (
    <main>
<<<<<<< HEAD
      <TaskCreate onCreated={handleTaskCreated} />
=======
      <TaskCreate onTaskCreated={handleTaskCreated} />
>>>>>>> 7d9ee070489d2151403e6b883b553afda5d85c0e
      <FlowStateApp />
    </main>
  );
}
