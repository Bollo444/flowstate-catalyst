export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  onSelect,
}) => {
  return (
    <div className="relative inline-block text-left">
      <DropdownTrigger selected={selected} />
      <DropdownMenu options={options} onSelect={onSelect} />
    </div>
  );
};
