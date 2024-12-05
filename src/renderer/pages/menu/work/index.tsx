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
import { useState } from 'react';
import { applayUserStatus } from '@src/../common/const/index';
import { useMemoizedFn, useMount } from 'ahooks';
import { toast, Bounce, TypeOptions } from 'react-toastify';
const Work = () => {
  const [sliderValue, setSliderValue] = useState(80);
  const {
    isOpen: isImportModal,
    onOpen: onOpenImportModal,
    onOpenChange: onOpenChangeImportModal,
    onClose: onCloseImportModal,
  } = useDisclosure();
  const [userList, setUserList] = useState<string[]>([]);
  const [serveStatus, setServeStatus] = useState(applayUserStatus.pullWait);
  const [isGroupModal, setIsGroupModal] = useState(false);
  const [groupUrl, setGroupUrl] = useState('');
  const [msgList, setMsgList] = useState<string[]>([]);
  const [userCount, setUserCount] = useState({
    total: 0,
    success: 0,
    error: 0,
  });

  const onClickOpenImportModal = () => {
    onOpenImportModal();
  };

  const onClickImport = (userList: string[]) => {
    setUserList(userList);
    setUserCount({
      total: userList.length,
      success: 0,
      error: 0,
    });
  };

  const onPullHandleMessage = useMemoizedFn(() => {
    window.electronAPI.onPullHandleMessage((_event, params) => {
      console.log(params);

      if (params.type === 'stop') setServeStatus(applayUserStatus.pullWait);
      if (params.type === 'success') {
      }
      if (params.type === 'error') {
      }
      if (params.type === 'end') setServeStatus(applayUserStatus.pullWait);
    });
  });

  useMount(() => {
    onPullHandleMessage();
  });

  const isTelegramLink = (url: string) => {
    const prefix = 'https://t.me/';
    return url.startsWith(prefix);
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
        if (!isTelegramLink(groupUrl)) return onToastMessage('请输入正确的群组链接', 'error');
        if (userList.length === 0) return onToastMessage('请导入账户', 'error');
        if (!groupUrl) return;
        await window.electronAPI.inviteUser({ pullNames: userList.join(','), groupId: groupUrl });
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

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <Button
          color="primary"
          size="sm"
          endContent={<Icons name="databaseImportOutline" />}
          onClick={onClickOpenImportModal}
        >
          导入账户
        </Button>
        <Button
          isLoading={serveStatus === applayUserStatus.pull}
          color="danger"
          size="sm"
          onClick={onClickInviteUser}
          endContent={<Icons name="stopwatchStartOutline" />}
        >
          执行
        </Button>
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
                  <p key={index} className="text-default-600">
                    {item}
                  </p>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      <ImportModal
        isOpen={isImportModal}
        onClickImport={onClickImport}
        onOpenChange={onOpenChangeImportModal}
        onClose={onCloseImportModal}
      />
      <Modal isOpen={isGroupModal} size="xl" isDismissable={false} onClose={() => setIsGroupModal(false)}>
        <ModalContent>
          <ModalHeader>导入账户</ModalHeader>
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
