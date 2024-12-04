import { Button, CardBody, Card, Slider, ScrollShadow, useDisclosure } from '@nextui-org/react';
import styles from './css/index.module.scss';
import Icons from '@src/renderer/components/Icons';
import Statistics from './components/Statistics';
import ImportModal from './components/ImportModal';
import { useState } from 'react';

const Work = () => {
  const [sliderValue, setSliderValue] = useState(80);
  const {
    isOpen: isImportModal,
    onOpen: onOpenImportModal,
    onOpenChange: onOpenChangeImportModal,
    onClose: onCloseImportModal,
  } = useDisclosure();
  const [userList, setUserList] = useState<string[]>([]);
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
        <Button color="danger" size="sm" endContent={<Icons name="stopwatchStartOutline" />}>
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
              <ScrollShadow size={100} className="w-[calc(100%)] h-[calc(100vh-305px)]">
                123
              </ScrollShadow>
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
    </div>
  );
};
export default Work;
