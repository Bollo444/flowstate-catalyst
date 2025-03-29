export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  onSort,
  onFilter,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <TableHeader columns={columns} onSort={onSort} />
        <TableBody data={data} columns={columns} />
        <TableFooter totals={calculateTotals(data)} />
      </table>
    </div>
  );
};
