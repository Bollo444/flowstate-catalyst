export const SelectionList: React.FC<SelectionProps> = ({ items, mode }) => {
  return (
    <div className="selection-container">
      <SelectableItems items={items} />
      <SelectionMode mode={mode} />
      <SelectionActions />
    </div>
  );
};
