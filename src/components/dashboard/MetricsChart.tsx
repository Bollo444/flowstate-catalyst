import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Metric {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatter?: (value: any) => string;
  color?: string;
}

interface MetricsChartProps {
  metrics: Metric[];
  data: any[];
}

const formatYAxis = (tickItem: number) => {
  return tickItem.toFixed(2);
};

export const MetricsChart: React.FC<MetricsChartProps> = ({
  metrics,
  data,
}) => {
  const chartData = data.map((entry) => {
    const formattedEntry: { [key: string]: string | number } = {};
    metrics.forEach((metric) => {
      formattedEntry[metric.name] = metric.formatter
        ? metric.formatter(entry[metric.name])
        : entry[metric.name];
    });
    return formattedEntry;
  });

  const formatTooltip = (value: string | number, name: string, props: any) => {
    const metric = metrics.find((m) => m.name === name);
    return [metric?.formatter ? metric.formatter(value) : value, name];
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip formatter={formatTooltip} />
        <Legend />
        {metrics.map((entry, index) => (
          <Bar
            key={`bar-${index}`}
            dataKey={entry.name}
            fill={entry.color || "#8884d8"}
            name={entry.name}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
