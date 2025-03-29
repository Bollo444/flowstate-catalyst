export const SortableTable: React.FC<SortableProps> = ({ columns, data }) => {
  return (
    <div className="sortable-container">
      <SortableHeader columns={columns} />
      <SortableRows data={data} />
      <SortIndicators />
    </div>
  );
};
