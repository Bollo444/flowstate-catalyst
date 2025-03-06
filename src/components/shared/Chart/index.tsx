import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Chart as ChartComponent } from 'react-chartjs-2';
import styles from './styles.module.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type ChartType = 'line' | 'bar';

interface ChartProps<T extends ChartType> {
  type: T;
  data: ChartData<T>;
  options?: ChartOptions<T>;
  height?: number;
  width?: number;
}

export const Chart = <T extends ChartType>({ 
  type, 
  data, 
  options, 
  height, 
  width 
}: ChartProps<T>): JSX.Element => {
  const chartRef = useRef<ChartJS>(null);

  return (
    <div className={styles.chartContainer} style={{ height, width }}>
      <ChartComponent
        ref={chartRef}
        type={type}
        data={data}
        options={options}
      />
    </div>
  );
};
