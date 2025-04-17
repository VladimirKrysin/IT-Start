import { getStatusColor, StatusKey } from '../../utils/statusColor.tsx';
import styles from './status.module.css';

interface StatusProps {
  statusDescription: StatusKey;
}

const Status = ({ statusDescription }: StatusProps) => {
  const color = getStatusColor(statusDescription);
  return (
    <div className={styles.statusContainer}>
      <svg
        width='17'
        height='17'
        viewBox='0 0 17 17'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M8.5 16.4167C12.8723 16.4167 16.4167 12.8723 16.4167 8.5C16.4167 4.12775 12.8723 0.583336 8.5 0.583336C4.12775 0.583336 0.583336 4.12775 0.583336 8.5C0.583336 12.8723 4.12775 16.4167 8.5 16.4167Z'
          fill={color}
        />
      </svg>
      <span style={{ color }}>{statusDescription}</span>
    </div>
  );
};

export { Status };
