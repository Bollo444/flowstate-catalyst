export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
}) => {
  return (
    <div className="multiselect-container">
      <OptionsList options={options} />
      <SelectedItems selected={selected} />
      <SelectControls />
    </div>
  );
};
