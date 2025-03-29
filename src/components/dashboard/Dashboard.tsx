export const Dashboard: React.FC<DashboardProps> = ({ widgets, layout }) => {
  return (
    <div className="dashboard-container">
      <WidgetGrid widgets={widgets} />
      <LayoutManager layout={layout} />
      <DashboardControls />
    </div>
  );
};
