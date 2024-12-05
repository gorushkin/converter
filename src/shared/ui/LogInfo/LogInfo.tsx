import styles from './LogInfo.module.scss';

type LogInfoProps = {
  data: unknown;
};

export const LogInfo = ({ data }: LogInfoProps) => {
  return <pre className={styles.wrapper}>{JSON.stringify(data, null, 2)}</pre>;
};
