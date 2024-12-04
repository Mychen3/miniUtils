import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@nextui-org/react';
import { useState } from 'react';

type IImportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  onClickImport: (userList: string[]) => void;
};

const ImportModal = ({ isOpen, onOpenChange, onClose, onClickImport }: IImportModalProps) => {
  const [value, setValue] = useState('');

  const setUserList: React.ChangeEventHandler<HTMLInputElement> = (e) => setValue(e.target.value);
  const onClickImportUser = () => {
    onClickImport(value.split('\n'));
    onClearUserList();
  };

  const onClearUserList = () => {
    onClose();
    setValue('');
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl" isDismissable={false} onClose={onClearUserList}>
      <ModalContent>
        <ModalHeader>导入账户</ModalHeader>
        <ModalBody>
          <Textarea label="账号列表" value={value} onChange={setUserList} placeholder="请输入账号列表" />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClearUserList}>
            取消
          </Button>
          <Button color="primary" onPress={onClickImportUser}>
            导入
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default ImportModal;
