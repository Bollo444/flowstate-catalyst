'use client';

import { FlowStateApp } from '@/components/FlowStateApp';
import { useSupabase } from '@/lib/supabaseClient';
import { redirect } from 'next/navigation';
import { TaskCreate } from '@/components/tasks/TaskCreate';
import { useState } from 'react';
import { Task } from '@/types/taskFlow'; // Import Task interface from src/types/taskFlow.ts

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
      <TaskCreate onCreated={handleTaskCreated} />
      <FlowStateApp />
    </main>
  );
}
