export const DragDropList: React.FC<DragDropProps> = ({ items, onReorder }) => {
  return (
    <div className="dragdrop-container">
      <DraggableItems items={items} />
      <DropZones />
      <ReorderControls onReorder={onReorder} />
    </div>
  );
};
