import { Card, CardBody } from '@nextui-org/react';
import styles from '../css/statistics.module.scss';
import Icons from '@src/renderer/components/Icons';

const Statistics = ({ userCount }: { userCount: { total: number; success: number; error: number } }) => (
  <div className={styles.container}>
    <Card>
      <CardBody className="bg-primary">
        <div className="flex justify-between">
          <div className="font-[600] text-[26px] text-default-100">总数</div>
          <Icons name="accountGroupOutline" className="text-default-100 size-[28px]" />
        </div>
        <span className="mt-[20px] text-[18px] text-default-100">{userCount.total}</span>
      </CardBody>
    </Card>
    <Card>
      <CardBody className="bg-success">
        <div className="flex justify-between">
          <div className="font-[600] text-[26px] text-default-100">成功</div>
          <Icons name="accountSuccessOutline" className="text-default-100 size-[28px]" />
        </div>
        <span className="mt-[20px] text-[18px] text-default-100">{userCount.success}</span>
      </CardBody>
    </Card>
    <Card>
      <CardBody className="bg-default-400">
        <div className="flex justify-between">
          <div className="font-[600] text-[26px] text-default-100">等待</div>
          <Icons name="weatherTime" className="text-default-100 size-[28px]" />
        </div>
        <span className="mt-[20px] text-[18px] text-default-100">{userCount.total - userCount.success}</span>
      </CardBody>
    </Card>
    <Card>
      <CardBody className="bg-danger">
        <div className="flex justify-between">
          <div className="font-[600] text-[26px] text-default-100">失败</div>
          <Icons name="errorOutline" className="text-default-100 size-[28px]" />
        </div>
        <span className="mt-[20px] text-[18px] text-default-100">{userCount.error}</span>
      </CardBody>
    </Card>
  </div>
);

export default Statistics;
