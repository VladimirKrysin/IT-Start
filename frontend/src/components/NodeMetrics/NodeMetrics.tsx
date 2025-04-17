import styles from './nodeMetrics.module.css';

interface NodeMetricsProps {
  value: number;
  description: string;
}

const NodeMetrics = ({ value, description }: NodeMetricsProps) => {
  const METRICS_COLORS = {
    base: '#273240',
    warning: '#FFD900',
    error: '#FF0000',
  };

  const getValueColor = (value: number) => {
    if (value > 85 && value <= 95) {
      return METRICS_COLORS['warning'];
    }
    if (value > 95) {
      return METRICS_COLORS['error'];
    }
    return METRICS_COLORS['base'];
  };

  return (
    <div className={styles.nodeMetricsContainer}>
      {description}:
      <span style={{ color: getValueColor(value), fontWeight: 500 }}>
        {value}
      </span>
    </div>
  );
};

export { NodeMetrics };
