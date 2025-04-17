import { ReactElement } from 'react';
import styles from './groupItem.module.css';
import clsx from 'clsx';

interface GroupProps {
  status: ReactElement;
  groupCaption: string;
  isActive: boolean;
  onClick: () => void;
}
const GroupItem = ({ status, groupCaption, isActive, onClick }: GroupProps) => {
  return (
    <div
      className={clsx(styles.groupContainer, isActive && styles.activeGroup)}
      onClick={onClick}
    >
      <div className={styles.groupWrapper}>
        {status}
        <span
          className={clsx(
            styles.groupCaption,
            isActive && styles.groupCaptionActive,
          )}
        >
          {groupCaption}
        </span>
      </div>
    </div>
  );
};

export { GroupItem };
