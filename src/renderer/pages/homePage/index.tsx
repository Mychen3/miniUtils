import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  useDisclosure,
  Tooltip,
  Pagination,
  Spinner,
} from '@nextui-org/react';
import styles from './css/index.module.scss';
import { useState } from 'react';
import { SearchIcon } from '@nextui-org/shared-icons';
import Login from './components/Login';
import { useMemoizedFn, useMount } from 'ahooks';
import type { IUserItem } from 'electron/db/module/user';
import Icons from '@components/Icons';
import StatusTag from './components/StatusTag';
import { motion } from 'framer-motion';

type IParams = {
  page: number;
  pageSize: number;
  phone: string;
};

const HomePage = () => {
  const [nameSearch, setNameSearch] = useState('');
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 15,
    phone: '',
  });
  const [list, setList] = useState<IUserItem[]>([]);
  const [total, setTotal] = useState(1);

  const getList = useMemoizedFn(async (params: IParams) => {
    const res = await window.electronAPI.getPageUsers(params);
    setList(res.list);
    setTotal(res.total);
    setLoading(false);
  });

  const deleteUser = async (userItem: IUserItem) => {
    await window.electronAPI.deleteUser(userItem);
    await getList(params);
  };

  const refreshUserStatus = async (user_id: number) => {
    setLoading(true);
    await window.electronAPI.refreshUserStatus(user_id);
    await getList(params);
  };

  const onChangePage = (page: number) => {
    const pageParams = { ...params, page };
    setParams(pageParams);
    getList(pageParams);
  };

  useMount(async () => {
    await getList(params);
  });

  return (
    <div className={styles.container}>
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
        <div className="box-border">
          <div className={styles.search}>
            <Input
              isClearable
              classNames={{
                base: 'w-[200px]',
                inputWrapper: 'border-1',
              }}
              placeholder="搜索账号"
              size="sm"
              startContent={<SearchIcon className="text-default-300" />}
              value={nameSearch}
              variant="bordered"
              onClear={() => setNameSearch('')}
              onChange={(e) => setNameSearch(e.target.value)}
            />
            <Button size="sm" color="primary">
              搜索
            </Button>
            <Button size="sm" color="primary" onClick={onOpen} endContent={<Icons name="add" />}>
              添加账号
            </Button>
          </div>
          <Table
            isStriped
            isHeaderSticky
            aria-label="Example static collection table"
            classNames={{
              base: 'h-[calc(100vh-140px)] scrollbar-y-hidden',
              thead: 'top-[-16px]',
              wrapper: 'h-[calc(100vh-140px)]',
            }}
          >
            <TableHeader>
              <TableColumn align="center">用户名</TableColumn>
              <TableColumn align="center">手机号</TableColumn>
              <TableColumn align="center">TGId</TableColumn>
              <TableColumn align="center">状态</TableColumn>
              <TableColumn align="center">操作</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent="暂无数据"
              isLoading={loading}
              loadingContent={
                <Spinner
                  label="加载中..."
                  size="lg"
                  classNames={{
                    label: styles.someClass,
                  }}
                />
              }
            >
              {list.map((item) => (
                <TableRow key={item.user_id}>
                  <TableCell>{item.user_name}</TableCell>
                  <TableCell>
                    <span>+{item.user_phone}</span>
                  </TableCell>
                  <TableCell>
                    <span>@{item.user_tg_id}</span>
                  </TableCell>
                  <TableCell>
                    <StatusTag status={item.user_status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-center">
                      <Tooltip content="刷新">
                        <span
                          className="text-lg text-default-400 cursor-pointer active:opacity-50"
                          onClick={() => refreshUserStatus(item.user_id)}
                        >
                          <Icons name="refresh" />
                        </span>
                      </Tooltip>
                      <Tooltip color="danger" content="删除">
                        <span
                          className="text-lg text-danger cursor-pointer active:opacity-50"
                          onClick={() => deleteUser(item)}
                        >
                          <Icons name="delete" />
                        </span>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex w-full justify-center mt-[10px]">
            <Pagination
              showControls
              showShadow
              color="primary"
              page={params.page}
              total={Math.ceil(total / params.pageSize)}
              onChange={onChangePage}
            />
          </div>
        </div>
      </motion.div>
      <Login refreshList={() => getList(params)} onClose={onClose} isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default HomePage;
