import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
} from '@nextui-org/react';
import StatusTag from '@src/renderer/pages/homePage/components/StatusTag';
import { IUserItem } from 'electron/db/module/user';
import { useRef, useState } from 'react';
import styles from '../css/screenTableModal.module.scss';
import { useMemoizedFn, useMount } from 'ahooks';

type IScreenTableModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ScreenTableModal = ({ isOpen, onClose }: IScreenTableModalProps) => {
  const [list, setList] = useState<IUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useRef({
    page: 1,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);

  const getList = useMemoizedFn(async (params) => {
    setLoading(true);
    const res = await window.electronAPI.getPageUsers(params);
    setList((prev) => [...prev, ...res.list]);
    setLoading(false);
    setTotal(res.total);
  });

  const onSelectUser = () => {
    console.log(list);
  };

  const onLoadMore = async () => {
    params.current.page++;
    await getList(params.current);
  };

  useMount(async () => {
    await getList(params.current);
  });

  return (
    <Modal isOpen={isOpen} size="xl" isDismissable={false} onClose={onClose}>
      <ModalContent>
        <ModalHeader>筛选账户</ModalHeader>
        <ModalBody>
          <Table
            selectionMode="multiple"
            isStriped
            isHeaderSticky
            aria-label="Example static collection table"
            classNames={{
              base: 'h-[calc(100vh-280px)] scrollbar-y-hidden',
              thead: 'top-[-16px]',
              wrapper: 'h-[calc(100vh-240px)]',
            }}
            bottomContent={
              total > list.length ? (
                <div className="flex w-full justify-center">
                  <Button isDisabled={loading} variant="flat" onPress={onLoadMore}>
                    加载更多
                  </Button>
                </div>
              ) : null
            }
          >
            <TableHeader>
              <TableColumn align="center">序号</TableColumn>
              <TableColumn align="center">用户名</TableColumn>
              <TableColumn align="center">手机号</TableColumn>
              <TableColumn align="center">状态</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent="暂无数据"
              isLoading={loading}
              loadingContent={
                <Spinner
                  classNames={{
                    label: styles.someClass,
                  }}
                  size="lg"
                />
              }
            >
              {list.map((item, index) => (
                <TableRow key={item.user_id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.user_name}</TableCell>
                  <TableCell>
                    <span>+{item.user_phone}</span>
                  </TableCell>
                  <TableCell>
                    <StatusTag status={item.user_status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            取消
          </Button>
          <Button color="primary" onPress={onSelectUser}>
            确定
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScreenTableModal;
