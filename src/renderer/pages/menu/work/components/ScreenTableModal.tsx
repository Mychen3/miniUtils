import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  SelectionMode,
} from '@nextui-org/react';
import type { Selection } from '@react-types/shared';
import StatusTag from '@src/renderer/pages/homePage/components/StatusTag';
import { IUserItem } from 'electron/db/module/user';
import { useRef, useState } from 'react';
import { useMemoizedFn, useMount, useUpdateEffect } from 'ahooks';

type IScreenTableModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedUserList: string[];
  onChangeSelection: (keys: string[]) => void;
  selectionMode: SelectionMode;
};

const ScreenTableModal = ({
  isOpen,
  onClose,
  selectedUserList,
  onChangeSelection,
  selectionMode = 'multiple',
}: IScreenTableModalProps) => {
  const [list, setList] = useState<IUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useRef({
    page: 1,
    pageSize: 15,
  });
  const [total, setTotal] = useState(0);
  const oldSelectedList = useRef<string[]>([]);

  const getList = useMemoizedFn(async (params) => {
    setLoading(true);
    const res = await window.electronAPI.getPageUsers(params);
    setList((prev) => [...prev, ...res.list]);
    setLoading(false);
    setTotal(res.total);
  });

  const onChangeSelectedList = (row: Selection) => {
    if (row === 'all') return onChangeSelection(list.map((item) => item.user_id.toString()));
    onChangeSelection(Array.from(row) as string[]);
  };

  const onCloseModal = () => {
    onClose();
    onChangeSelection(oldSelectedList.current);
  };

  useUpdateEffect(() => {
    if (isOpen) oldSelectedList.current = [...selectedUserList];
  }, [isOpen]);

  const onLoadMore = async () => {
    params.current.page++;
    await getList(params.current);
  };

  useMount(async () => await getList(params.current));

  return (
    <Modal isOpen={isOpen} size="xl" isDismissable={false} onClose={onCloseModal}>
      <ModalContent>
        <ModalHeader>筛选账户</ModalHeader>
        <ModalBody>
          <Table
            color="primary"
            selectedKeys={selectedUserList}
            onSelectionChange={onChangeSelectedList}
            selectionMode={selectionMode}
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
                  <Button isLoading={loading} variant="flat" onPress={onLoadMore}>
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
            <TableBody emptyContent="暂无数据">
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
          <Button color="danger" variant="flat" onPress={onCloseModal}>
            取消
          </Button>
          <Button color="primary" onPress={onClose}>
            确定
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScreenTableModal;
