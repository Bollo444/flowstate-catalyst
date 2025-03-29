export const Toolbar: React.FC<ToolbarProps> = ({ tools, alignment }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50">
      <ToolbarGroup tools={tools} />
      <ToolbarActions alignment={alignment} />
    </div>
  );
};
