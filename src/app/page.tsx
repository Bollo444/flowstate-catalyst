"use client";

import { FlowStateApp } from "@/components/FlowStateApp";
import { useSupabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";
import { TaskCreate } from "@/components/tasks/TaskCreate";
// Removed useState and Task type import as local task state is no longer needed

export default function Home() {
  const { session } = useSupabase();
  // Removed unused local tasks state: const [tasks, setTasks] = useState<Task[]>([]);

  if (!session) {
    redirect("/auth/signin");
  }

  // Removed unused handleTaskCreated function as task updates are handled within useFlowTasks hook
  // const handleTaskCreated = (): void => { ... };

  return (
    <main>
      {/* Pass userId, but onCreated is removed as it's not needed */}
      {/* Task list updates should be consumed from useFlowTasks by display components */}
      <TaskCreate userId={session.user.id} /* onCreated={handleTaskCreated} */ /> 
      <FlowStateApp />
    </main>
  );
}
