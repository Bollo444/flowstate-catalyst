export const TreeView: React.FC<TreeViewProps> = ({ nodes, expanded }) => {
  return (
    <div className="tree-container">
      <TreeNodes nodes={nodes} />
      <TreeExpander expanded={expanded} />
      <TreeControls />
    </div>
  );
};
