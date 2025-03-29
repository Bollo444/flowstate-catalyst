export const ReportGenerator: React.FC = () => {
  const { templates, data } = useReportData();

  return (
    <div className="report-generator">
      <TemplateSelector templates={templates} />
      <DataVisualizer data={data} />
      <ExportOptions />
    </div>
  );
};
