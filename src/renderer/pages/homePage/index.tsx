import {
  Switch,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
} from '@nextui-org/react';
import styles from './css/index.module.scss';
import useTheme from '@hooks/useTheme.ts';
import { Theme } from '@const/publicConst.ts';
import { ChangeEvent, useMemo, useState } from 'react';
import { SearchIcon } from '@nextui-org/shared-icons';

const HomePage = () => {
  const [nameSearch, setNameSearch] = useState('');

  return (
    <div className={styles.container}>
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
          <Button size="sm" color="primary">
            添加账号
          </Button>
        </div>
        <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>用户名</TableColumn>
            <TableColumn>头像</TableColumn>
            <TableColumn>状态</TableColumn>
            <TableColumn>操作</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="1">
              <TableCell>Tony Reichert</TableCell>
              <TableCell>CEO</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HomePage;
