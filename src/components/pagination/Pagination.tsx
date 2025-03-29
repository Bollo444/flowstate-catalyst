export const Pagination: React.FC<PaginationProps> = ({
  total,
  current,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between">
      <PaginationInfo total={total} current={current} />
      <PaginationControls onChange={onChange} />
    </div>
  );
};
