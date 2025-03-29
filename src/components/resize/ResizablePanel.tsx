export const ResizablePanel: React.FC<ResizeProps> = ({
  direction,
  minSize,
}) => {
  return (
    <div className="resize-container">
      <ResizeHandle direction={direction} />
      <PanelContent />
      <SizeConstraints minSize={minSize} />
    </div>
  );
};
