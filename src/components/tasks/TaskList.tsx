export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const sortedTasks = sortTasksByPriority(tasks);

  return (
    <div className="task-list">
      <TaskItems tasks={sortedTasks} />
      <TaskPagination />
      <TaskSorting />
    </div>
  );
};
