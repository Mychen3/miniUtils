import { Chip } from '@nextui-org/react';
import { passKey } from '@src/../common/const/index';
import Icons from '@components/Icons';
import { useMemo } from 'react';

const StatusTag = ({ status }: { status: string }) => {
  const isPass = useMemo(() => status === passKey.pass, [status]);

  return (
    <Chip
      size="sm"
      startContent={<Icons name={isPass ? 'checkCircle' : 'closeCircle'} />}
      color={isPass ? 'success' : 'danger'}
    >
      {isPass ? '正常' : '风险'}
    </Chip>
  );
};
export default StatusTag;
