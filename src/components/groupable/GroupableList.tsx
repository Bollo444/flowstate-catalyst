export const GroupableList: React.FC<GroupableProps> = ({ items, groupBy }) => {
  return (
    <div className="groupable-container">
      <GroupHeaders groupBy={groupBy} />
      <GroupedItems items={items} />
      <GroupControls />
    </div>
  );
};
