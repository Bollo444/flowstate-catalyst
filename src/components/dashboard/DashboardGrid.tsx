export const DashboardGrid: React.FC = () => {
  const { widgets, layout } = useDashboardLayout();

  return (
    <div className="dashboard-grid">
      <GridLayout layout={layout}>
        <WidgetRenderer widgets={widgets} />
        <GridControls />
      </GridLayout>
    </div>
  );
};
