type Status = {
  UNREACHABLE: string;
  SHUTDOWN: string;
  UP: string;
  WARNING: string;
  CRITICAL: string;
  DOWN: string;
};

const Statuses: Status = {
  UNREACHABLE: '#000000',
  SHUTDOWN: '#808080',
  UP: '#90EE90',
  WARNING: '#FFFF00',
  CRITICAL: '#FF0000',
  DOWN: '#8B0000',
};

const StatusValues = {
  UP: 1,
  WARNING: 2,
  CRITICAL: 3,
  SHUTDOWN: 4,
  DOWN: 5,
  UNREACHABLE: 6,
};

type StatusKey = keyof typeof Statuses;

const getStatusColor = (status: StatusKey) => {
  return Statuses[status];
};

export { getStatusColor, StatusValues };
export type { StatusKey };
