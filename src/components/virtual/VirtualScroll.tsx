export const VirtualScroll: React.FC<VirtualProps> = ({ data, rowHeight }) => {
  return (
    <div className="virtual-container">
      <VirtualWindow rowHeight={rowHeight} />
      <VirtualItems data={data} />
      <ScrollControls />
    </div>
  );
};
