export const DataVisualizer: React.FC = () => {
  const { datasets, viewMode } = useDataVisualization();

  return (
    <div className="data-visualizer">
      <VisualizationCanvas datasets={datasets} />
      <ViewControls mode={viewMode} />
      <DataFilters />
    </div>
  );
};
