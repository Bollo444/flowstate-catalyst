export const FilterBar: React.FC<FilterProps> = ({ filters, active }) => {
  return (
    <div className="filter-container">
      <FilterOptions filters={filters} />
      <ActiveFilters active={active} />
      <FilterActions />
    </div>
  );
};
