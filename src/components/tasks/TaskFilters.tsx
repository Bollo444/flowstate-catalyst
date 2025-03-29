export const TaskFilters: React.FC = () => {
  const { filters, updateFilters } = useTaskFilters();

  return (
    <div className="task-filters">
      <FilterOptions options={filters} />
      <FilterSearch />
      <FilterTags />
    </div>
  );
};
