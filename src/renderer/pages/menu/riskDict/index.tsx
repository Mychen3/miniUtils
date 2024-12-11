import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  useDisclosure,
  Tooltip,
  Spinner,
} from '@nextui-org/react';
import styles from './css/index.module.scss';
import { useState } from 'react';
import { useMemoizedFn, useMount } from 'ahooks';
import Icons from '@components/Icons';
import StatusTag from '@pages/homePage/components/StatusTag';
import AddRiskDict from './components/AddRiskDict';
import { motion } from 'framer-motion';
type RiskDictItem = {
  risk_value: string;
  risk_status: string;
  risk_id: number;
};

const RiskDict = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Array<RiskDictItem>>([]);

  const getList = useMemoizedFn(async () => {
    setLoading(true);
    const res = await window.electronAPI.getRiskDictList();
    setList(res);
    setLoading(false);
  });

  const deleteRiskDict = async (riskDictItem: RiskDictItem) => {
    setLoading(true);
    await window.electronAPI.deleteRiskDict(riskDictItem.risk_id);
    await getList();
  };

  useMount(async () => {
    await getList();
  });

  return (
    <div className={styles.container}>
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
        <div className="box-border">
          <div className={styles.search}>
            <Button size="sm" color="danger" onClick={onOpen} endContent={<Icons name="add" />}>
              添加风险字段
            </Button>
          </div>
          <Table
            isStriped
            isHeaderSticky
            aria-label="Example static collection table"
            classNames={{
              base: 'h-[calc(100vh-90px)] scrollbar-y-hidden',
              thead: 'top-[-16px]',
              wrapper: 'h-[calc(100vh-90px)]',
            }}
          >
            <TableHeader>
              <TableColumn align="center">风控字段前缀</TableColumn>
              <TableColumn align="center">前缀判断状态</TableColumn>
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
                <TableRow key={item.risk_id}>
                  <TableCell>{item.risk_value}</TableCell>
                  <TableCell>
                    <span>
                      <StatusTag status={item.risk_status} />
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-center">
                      <Tooltip color="danger" content="删除">
                        <span
                          className="text-lg text-danger cursor-pointer active:opacity-50"
                          onClick={() => deleteRiskDict(item)}
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
        </div>
      </motion.div>
      <AddRiskDict refreshList={getList} onClose={onClose} isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default RiskDict;
