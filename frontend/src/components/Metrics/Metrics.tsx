import { ReactElement } from 'react';
import styles from './metrics.module.css';
import { LineChart } from '../LineChart/LineChart';
import type { ChartData } from '../../App';

interface MetricsProps {
  chartData: ChartData;
  interfaceCaption: string;
  status: ReactElement;
  adminEmail: string;
  adminFirstname: string;
  adminLastname: string;
  applicationCaption: string;
}
const Metrics = ({
  chartData,
  status,
  interfaceCaption,
  adminEmail,
  adminFirstname,
  adminLastname,
  applicationCaption,
}: MetricsProps) => {
  return (
    <div className={styles.metricsContainer}>
      <LineChart chartData={chartData} />
      <div className={styles.groupWrapper}>
        {status}
        <span className={styles.fontMedium}>{interfaceCaption}</span>
        <div className={styles.additionalInfo}>
          <div>
            Администратор:{' '}
            <span className={styles.fontMedium}>
              {adminLastname} {adminFirstname}
            </span>
            ,<span className={styles.fontMedium}> {adminEmail}</span>
          </div>
          <div>
            Запущенные приложения:{' '}
            <span className={styles.fontMedium}>{applicationCaption}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Metrics };
