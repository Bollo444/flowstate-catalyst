export const MetricsChart: React.FC<ChartProps> = ({ data }) => {
  const chartConfig = generateChartConfig(data);

  return (
    <div className="metrics-chart">
      <Chart config={chartConfig} />
      <ChartLegend data={data.legend} />
      <ChartControls />
    </div>
  );
};
