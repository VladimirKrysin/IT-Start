import { ReactElement } from 'react';
import styles from './nodeItem.module.css';
import { NodeMetrics } from '../NodeMetrics/NodeMetrics';
import clsx from 'clsx';

interface NodeProps {
  nodeCaption: string;
  status: ReactElement;
  cpuUtilization: number;
  diskUtilization: number;
  memoryUtilization: number;
  isActive: boolean;
  onClick: () => void;
}
const NodeItem = ({
  nodeCaption,
  status,
  cpuUtilization,
  diskUtilization,
  memoryUtilization,
  isActive,
  onClick,
}: NodeProps) => {
  return (
    <div
      className={clsx(styles.nodesContainer, isActive && styles.activeGroup)}
      onClick={onClick}
    >
      <div className={styles.groupWrapper}>
        {status}
        <span className={styles.groupCaption}>{nodeCaption}</span>
      </div>
      <div>
        <NodeMetrics value={cpuUtilization} description='утилизация cpu' />
        <NodeMetrics
          value={memoryUtilization}
          description='утилизация memory'
        />
        <NodeMetrics value={diskUtilization} description='утилизация disk' />
      </div>
    </div>
  );
};

export { NodeItem };
