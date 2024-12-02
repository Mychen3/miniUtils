import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import { useState, useRef } from 'react';
import { useDisclosure } from '@nextui-org/react';
import Icons from '@src/renderer/components/Icons';
import { useMount } from 'ahooks';
type ILoginProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const Login = ({ isOpen, onOpenChange }: ILoginProps) => {
  const [inputParams, setInputParams] = useState({
    username: '',
    password: '',
  });
  const resolvePromise = useRef<((value: string) => void) | null>(null);
  const [phoneCode, setPhoneCode] = useState('');
  const { isOpen: isPhoneCodeOpen, onOpen: onPhoneCodeOpen, onOpenChange: onPhoneCodeOpenChange } = useDisclosure();

  const onLogin = () => window.electronAPI.loginTg(inputParams);
  const showModal = () =>
    new Promise((resolve) => {
      onPhoneCodeOpen();
      resolvePromise.current = resolve;
    });

  useMount(() => {
    window.electronAPI.onConfirmPhoneCodeSend(async () => {
      const phoneCode = await showModal();
      window.electronAPI.confirmPhoneCode(phoneCode as string);
    });
  });

  const onClickConfirm = () => {
    resolvePromise.current?.(phoneCode);
    resolvePromise.current = null;
    onPhoneCodeOpenChange();
  };

  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">登录TG</ModalHeader>
              <ModalBody>
                <Input
                  endContent={
                    <Icons name="user" className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  value={inputParams.username}
                  onChange={(e) => setInputParams({ ...inputParams, username: e.target.value })}
                  label="用户名"
                  variant="bordered"
                />
                <Input
                  endContent={
                    <Icons name="password" className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  value={inputParams.password}
                  onChange={(e) => setInputParams({ ...inputParams, password: e.target.value })}
                  label="密码"
                  type="password"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  关闭
                </Button>
                <Button color="primary" onPress={onLogin}>
                  登录
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isPhoneCodeOpen} onOpenChange={onPhoneCodeOpenChange} placement="top-center" backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">确认手机验证码</ModalHeader>
              <ModalBody>
                <Input
                  endContent={
                    <Icons
                      name="verifiedUser"
                      className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
                    />
                  }
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  label="App验证码"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  关闭
                </Button>
                <Button color="primary" onPress={onClickConfirm}>
                  确定
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Login;
