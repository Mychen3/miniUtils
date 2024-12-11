import styles from './css/index.module.scss';
import { Input, Card, CardBody, Radio, RadioGroup, Tooltip, Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import useStore from '@src/renderer/store';
import Icons from '@src/renderer/components/Icons';
import { GatherTime } from '@src/../common/const/index';

const Flag = () => {
  const { gatherCounts, gatherTime, setGatherTime, setGatherUrl, gatherUrl } = useStore();

  return (
    <div className={styles.container}>
      <div className={styles.tabsContainer}>
        <Card>
          <CardBody className="h-[calc(100vh-50px)]">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
              <div className="box-border">
                <div className="grid grid-cols-2 gap-2 pt-[10px] font-lxg box-border">
                  <Card>
                    <CardBody className="bg-primary">
                      <div className="flex justify-between">
                        <div className="font-[600] text-[26px] text-default-100">采集数</div>
                        <Icons name="accountGroupOutline" className="text-default-100 size-[28px]" />
                      </div>
                      <span className="mt-[20px] text-[18px] text-default-100">{gatherCounts.total}</span>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody className="bg-success">
                      <div className="flex justify-between">
                        <div className="font-[600] text-[26px] text-default-100">已采集</div>
                        <Icons name="accountGroupOutline" className="text-default-100 size-[28px]" />
                      </div>
                      <span className="mt-[20px] text-[18px] text-default-100">{gatherCounts.success}</span>
                    </CardBody>
                  </Card>
                </div>
                <Input
                  label="请输入被采集的群链接"
                  className="mt-[20px]"
                  value={gatherUrl}
                  onChange={(e) => setGatherUrl(e.target.value)}
                />
                <div className="mt-[20px] font-lxg">
                  <div className="text-[18px] font-[600] mb-[10px] text-red-500">筛选条件：</div>
                  <RadioGroup
                    value={gatherTime}
                    onValueChange={(value) => setGatherTime(value as keyof typeof GatherTime)}
                    label={
                      <div>
                        <span>采集时间（群组成员采集可以忽略！）</span>
                        <Tooltip
                          classNames={{
                            base: 'w-[200px]',
                          }}
                          content="采集距离根据当前时间往前推的时间，例如24小时，则采集距离为24小时"
                          placement="top"
                          color="foreground"
                        >
                          <button>
                            <Icons name="questionMarkCircle" className="text-primary size-[14px]" />
                          </button>
                        </Tooltip>
                      </div>
                    }
                    orientation="horizontal"
                  >
                    <Radio value={GatherTime.day}>24小时</Radio>
                    <Radio value={GatherTime.threeDay}>3天</Radio>
                    <Radio value={GatherTime.monday}>7天</Radio>
                  </RadioGroup>
                  <Input
                    label="采集数量"
                    labelPlacement="outside"
                    name="email"
                    placeholder="请输入要采集的数量"
                    className="w-[300px]"
                    classNames={{ label: 'text-[16px]', inputWrapper: 'mt-[20px]' }}
                    type="number"
                  />
                </div>
                <div className="mt-[80px] grid grid-cols-4 gap-5 pt-[10px]">
                  <Button color="primary">群发言采集</Button>
                  <Button color="primary">群成员采集</Button>
                  <Button color="primary">导出</Button>
                  <Button color="primary">复制</Button>
                </div>
              </div>
            </motion.div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Flag;
