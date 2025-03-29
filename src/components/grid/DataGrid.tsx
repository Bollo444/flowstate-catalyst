export const DataGrid: React.FC<DataGridProps> = ({
  columns,
  rows,
  sorting,
}) => {
  return (
    <div className="grid-container">
      <GridHeader columns={columns} />
      <GridBody rows={rows} />
      <GridSorting sorting={sorting} />
    </div>
  );
};
