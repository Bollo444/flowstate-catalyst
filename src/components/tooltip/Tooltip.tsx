export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position,
  children,
}) => {
  return (
    <div className="tooltip-container">
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent content={content} position={position} />
    </div>
  );
};
