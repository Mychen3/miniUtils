import { Suspense } from 'react';
import IconSet, { IconSetType } from '@const/iconSet';

interface IProps {
  name: IconSetType;
}

const Icons = (props: IProps) => {
  const IconComponent = IconSet[props.name];
  return (
    <Suspense fallback={null}>
      <IconComponent {...props} />
    </Suspense>
  );
};

export default Icons;
