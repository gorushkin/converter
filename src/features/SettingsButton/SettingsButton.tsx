import { Button } from 'antd';
import { settings } from 'src/entities/settings/settings';

type SettingsButtonProps = {
  className?: string;
};

export const SettingsButton = (props: SettingsButtonProps) => {
  const { className } = props;
  const { toggle } = settings;

  return (
    <Button type="primary" className={className} onClick={toggle}>
      Settings
    </Button>
  );
};
