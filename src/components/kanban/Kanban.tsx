export const Kanban: React.FC<KanbanProps> = ({ boards, cards, onDragEnd }) => {
  return (
    <div className="kanban-container">
      <KanbanBoards boards={boards} />
      <KanbanCards cards={cards} />
      <DragDropContext onDragEnd={onDragEnd} />
    </div>
  );
};
