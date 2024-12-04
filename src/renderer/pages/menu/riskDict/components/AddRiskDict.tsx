import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { useState } from 'react';
import Icons from '@src/renderer/components/Icons';
import { passKey } from '@src/../common/const/index';
import { toast, Bounce } from 'react-toastify';

type ILoginProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  refreshList: () => void;
  onClose: () => void;
};

const selectList = [
  {
    label: '正常',
    value: passKey.pass,
  },
  {
    label: '风险',
    value: passKey.warn,
  },
];

const AddRiskDict = ({ isOpen, onOpenChange, refreshList, onClose }: ILoginProps) => {
  const [loading, setLoading] = useState(false);

  const [inputParams, setInputParams] = useState({
    riskStatus: '',
    riskValue: '',
  });

  const clearInput = () => {
    setInputParams({
      riskStatus: '',
      riskValue: '',
    });
  };

  const onAdd = async () => {
    setLoading(true);
    const res = await window.electronAPI.addRiskDict(inputParams);
    if (res) {
      setLoading(false);
      onClose();
      clearInput();
      refreshList();
      toast('添加成功', {
        type: 'success',
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
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">添加风控验证</ModalHeader>
            <ModalBody>
              <Input
                endContent={
                  <Icons name="bellOutline" className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                value={inputParams.riskValue}
                onChange={(e) => setInputParams({ ...inputParams, riskValue: e.target.value })}
                label="风控字段前缀"
                variant="bordered"
              />
              <Select
                label="风控状态"
                className="text-2xl"
                variant="bordered"
                value={inputParams.riskStatus}
                onChange={(value) => {
                  setInputParams({ ...inputParams, riskStatus: value.target.value });
                }}
              >
                {selectList.map((item) => (
                  <SelectItem key={item.value}>{item.label}</SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                关闭
              </Button>
              <Button color="primary" onPress={onAdd} isLoading={loading}>
                添加
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddRiskDict;
