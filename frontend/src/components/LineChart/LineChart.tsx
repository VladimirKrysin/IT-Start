import styles from './status.module.css';
import { useRef, useEffect, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { ChartData } from '../../App';

const getUniqueDatetimes = (data: ChartData): string[] => [
  ...new Set([
    ...data.cpu_utilization.map(({ datetime }) => datetime),
    ...data.disk_utilization.map(({ datetime }) => datetime),
    ...data.memory_utilization.map(({ datetime }) => datetime),
  ]),
];

const LineChart = ({ chartData }: { chartData: ChartData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: getUniqueDatetimes(chartData),
        datasets: [
          {
            label: 'cpu',
            data: chartData.cpu_utilization.map((item) => item.value),
          },
          {
            label: 'memory',
            data: chartData.memory_utilization.map((item) => item.value),
          },
          {
            label: 'disk',
            data: chartData.disk_utilization.map((item) => item.value),
          },
        ],
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div style={{ width: '800px' }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export { LineChart };
