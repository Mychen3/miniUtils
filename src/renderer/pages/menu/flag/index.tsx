import styles from './css/index.module.scss';
import { Input, Card, CardBody, Radio, RadioGroup, Tooltip, Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import useStore from '@src/renderer/store';
import Icons from '@src/renderer/components/Icons';
import { GatherStatus, GatherTime } from '@src/../common/const/index';
import ScreenTableModal from '../work/components/ScreenTableModal';
import { isTelegramLink } from '@src/utils/index';
import { toast, Bounce } from 'react-toastify';
import { useMount } from 'ahooks';
const Flag = () => {
  const {
    gatherCounts,
    gatherTime,
    setGatherTime,
    setGatherUrl,
    gatherUrl,
    gatherStatus,
    setGatherStatus,
    setGatherCounts,
  } = useStore();
  const [isScreenTableModal, setIsScreenTableModal] = useState(false);
  const [selectedUserList, setSelectedUserList] = useState<string[]>([]);
  const [count, setCount] = useState('');

  const handleToast = (message: string, type: 'error' | 'success') => {
    toast(message, {
      type,
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
    });
  };

  const isGather = useMemo(() => gatherStatus === GatherStatus.gather, [gatherStatus]);

  const isSuccess = () =>
    new Promise((resolve, reject) => {
      if (!isTelegramLink(gatherUrl)) reject('请输入正确的群链接');
      if (selectedUserList.length === 0) reject('请选择用户');
      if (count === '' || count === '0') reject('请输入采集数量');
      resolve(true);
    });

  useMount(() => {
    setCount(gatherCounts.total.toString());
  });

  const onClickGroupTell = () => {
    isSuccess()
      .then(() => {
        window.electronAPI.handleFlagMemberTell({
          groupId: gatherUrl,
          flagNumber: Number(count),
          flagTime: gatherTime,
          userId: Number(selectedUserList[0]),
        });
        setGatherCounts((prev) => ({ ...prev, total: Number(count) }));
        setGatherStatus(GatherStatus.gather);
      })
      .catch((error) => {
        handleToast(error, 'error');
      });
  };

  const exportFlagMember = () => {
    window.electronAPI.exportFlagMember();
  };

  const onClickGroupMemberFlag = () => {
    isSuccess()
      .then(() => {
        window.electronAPI.getGroupMemberList({
          groupId: gatherUrl,
          flagNumber: Number(count),
          userId: Number(selectedUserList[0]),
        });
        setGatherCounts((prev) => ({ ...prev, total: Number(count) }));
        setGatherStatus(GatherStatus.gather);
      })
      .catch((error) => {
        handleToast(error, 'error');
      });
  };

  const onhandleStop = () => {
    window.electronAPI.handleFlagMemberTellStop();
    handleToast('正在停止采集,请稍等！', 'success');
  };

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
                  <div className="mt-[20px]  text-[16px]">
                    选择用户
                    <Tooltip
                      classNames={{
                        base: 'w-[200px]',
                      }}
                      content="选择的用户必须在群内!"
                      placement="top"
                      color="foreground"
                    >
                      <button>
                        <Icons name="questionMarkCircle" className="text-primary size-[14px]" />
                      </button>
                    </Tooltip>
                  </div>
                  <Button
                    color="primary"
                    endContent={<Icons name="user" />}
                    className="mt-[10px]"
                    onPress={() => setIsScreenTableModal(true)}
                  >
                    筛选用户
                  </Button>
                  <Input
                    label="需采集数量"
                    labelPlacement="outside"
                    name="email"
                    placeholder="请输入要采集的数量"
                    className="w-[300px]"
                    classNames={{ label: 'text-[16px]', inputWrapper: 'mt-[20px]' }}
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                  />
                </div>

                <div
                  className={`mt-[20px] grid gap-5 pt-[10px] transition-all duration-300 ${isGather ? 'grid-cols-4' : 'grid-cols-3 '}`}
                >
                  <Button color="primary" isLoading={isGather} onClick={onClickGroupTell}>
                    群发言采集
                  </Button>
                  <Button isLoading={isGather} color="primary" onClick={onClickGroupMemberFlag}>
                    群成员采集
                  </Button>
                  <Button isDisabled={isGather} color="primary" onClick={exportFlagMember}>
                    导出
                  </Button>
                  {isGather && (
                    <Button color="danger" onClick={onhandleStop}>
                      停止
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </CardBody>
        </Card>
      </div>
      <ScreenTableModal
        isOpen={isScreenTableModal}
        onClose={() => setIsScreenTableModal(false)}
        selectedUserList={selectedUserList}
        onChangeSelection={setSelectedUserList}
        selectionMode="single"
      />
    </div>
  );
};

export default Flag;
