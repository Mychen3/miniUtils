import {
  Button,
  CardBody,
  Card,
  Slider,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from '@nextui-org/react';
import styles from './css/index.module.scss';
import Icons from '@src/renderer/components/Icons';
import Statistics from './components/Statistics';
import ImportModal from './components/ImportModal';
import { useMemo, useState, useRef } from 'react';
import { applayUserStatus } from '@src/../common/const/index';
import { useMemoizedFn } from 'ahooks';
import { toast, Bounce, TypeOptions } from 'react-toastify';
import useStore from '@src/renderer/store/index';
import ScreenTableModal from './components/ScreenTableModal';
import { isTelegramLink } from '@src/utils/index';
import { motion } from 'framer-motion';

const Work = () => {
  const {
    isOpen: isImportModal,
    onOpen: onOpenImportModal,
    onOpenChange: onOpenChangeImportModal,
    onClose: onCloseImportModal,
  } = useDisclosure();
  const { msgList, userCount, serveStatus, setUserCount, setServeStatus, clearMsgList } = useStore();
  const useListRef = useRef<string[]>([]);
  const [isGroupModal, setIsGroupModal] = useState(false);
  const [groupUrl, setGroupUrl] = useState('');
  const [isStopLoading, setIsStopLoading] = useState(false);
  const [isScreenTableModal, setIsScreenTableModal] = useState(false);
  const [selectedUserList, setSelectedUserList] = useState<string[]>([]);
  const sliderValue = useMemo(
    () => (userCount.total === 0 ? 0 : (userCount.success / userCount.total) * 100),
    [userCount],
  );

  const onClickOpenImportModal = () => {
    onOpenImportModal();
  };

  const onClickImport = (userList: string[]) => {
    useListRef.current = userList;
    setUserCount(() => ({
      total: userList.length,
      success: 0,
      error: 0,
    }));
    clearMsgList();
  };

  const onToastMessage = (message: string, type: TypeOptions) => {
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

  const onStartInvite = async () => {
    try {
      if (serveStatus === applayUserStatus.pullWait) {
        if (selectedUserList.length === 0) return onToastMessage('请先选择账户', 'error');
        if (!isTelegramLink(groupUrl)) return onToastMessage('请输入正确的群组链接', 'error');
        if (useListRef.current.length === 0) return onToastMessage('请导入账户', 'error');
        if (!groupUrl) return;
        await window.electronAPI.inviteUser({
          pullNames: useListRef.current.join(','),
          groupId: groupUrl,
          userIds: selectedUserList.join(','),
        });
        setServeStatus(applayUserStatus.pull);
        setIsGroupModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onClickInviteUser = () => {
    if (serveStatus === applayUserStatus.pull) return;
    if (serveStatus === applayUserStatus.pullWait) return setIsGroupModal(true);
  };

  const onClickHandlePause = async () => {
    setIsStopLoading(true);
    const isPause = serveStatus === applayUserStatus.pull;
    window.electronAPI.handleInviteMemberPause(isPause);
    setServeStatus(isPause ? applayUserStatus.pullPause : applayUserStatus.pull);
    onToastMessage(isPause ? '暂停拉取成功,请等待暂停！' : '继续拉取成功，请稍后！', 'success');
    setTimeout(() => {
      setIsStopLoading(false);
    }, 10000);
  };

  const getMsgColor = useMemoizedFn((type: string) => {
    if (type === 'info') return 'text-default-600';
    if (type === 'success') return 'text-success';
    if (type === 'error') return 'text-danger';
    if (type === 'end') return 'text-purple-500';
    if (type === 'stop') return 'text-yellow-500';
    return '';
  });
  const isInvite = [applayUserStatus.pull, applayUserStatus.pullPause].includes(serveStatus as applayUserStatus);
  return (
    <div className={styles.container}>
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
        <div className={styles.search}>
          <Button
            color="primary"
            size="sm"
            endContent={<Icons name="databaseImportOutline" />}
            onClick={onClickOpenImportModal}
          >
            导入账号
          </Button>
          <Button
            color="primary"
            size="sm"
            endContent={<Icons name="accountFilterOutline" />}
            onClick={() => setIsScreenTableModal(true)}
          >
            筛选用户
          </Button>
          <Button
            isLoading={isInvite}
            color="danger"
            size="sm"
            onClick={onClickInviteUser}
            endContent={<Icons name="stopwatchStartOutline" />}
          >
            执行
          </Button>
          {isInvite && (
            <Button color="danger" size="sm" isLoading={isStopLoading} onClick={onClickHandlePause}>
              {serveStatus === applayUserStatus.pullPause ? '继续' : '暂停'}
            </Button>
          )}
        </div>
        <div className={styles.content}>
          <Statistics userCount={userCount} />
          <Slider
            size="md"
            value={sliderValue}
            step={1}
            maxValue={100}
            minValue={0}
            aria-label="Temperature"
            defaultValue={80}
            hideThumb={true}
            classNames={{
              filler: 'bg-gradient-to-r from-[#006FEE] to-[#A300FF] ',
            }}
          />
          <div className="box-border">
            <div className="my-[5px] text-default-600 font-[600]">记录：</div>
            <Card>
              <CardBody>
                <div className="w-[calc(100%)] h-[calc(100vh-305px)] overflow-y-auto">
                  {msgList.map((item, index) => (
                    <p key={index} className={getMsgColor(item.type)}>
                      {item.message}
                    </p>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </motion.div>
      <ImportModal
        isOpen={isImportModal}
        onClickImport={onClickImport}
        onOpenChange={onOpenChangeImportModal}
        onClose={onCloseImportModal}
      />
      <ScreenTableModal
        isOpen={isScreenTableModal}
        onClose={() => setIsScreenTableModal(false)}
        selectedUserList={selectedUserList}
        onChangeSelection={setSelectedUserList}
        selectionMode="multiple"
      />
      <Modal isOpen={isGroupModal} size="xl" isDismissable={false} onClose={() => setIsGroupModal(false)}>
        <ModalContent>
          <ModalHeader>导入账户（感谢邱老板的KFC，拐哥的奶茶）</ModalHeader>
          <ModalBody>
            <Input
              label="群组链接"
              value={groupUrl}
              onChange={(e) => setGroupUrl(e.target.value)}
              placeholder="请输入群地址"
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={() => setIsGroupModal(false)}>
              取消
            </Button>
            <Button color="primary" onPress={onStartInvite}>
              开始执行
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
export default Work;
