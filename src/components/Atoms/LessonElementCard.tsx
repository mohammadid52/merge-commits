import React, { useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';

interface LessonElementCard {
  keyProps?: string | number;
  children?: React.ReactNode;
}

const LessonElementCard = (props: LessonElementCard) => {
  const {keyProps, children} = props;
  const { theme } = useContext(GlobalContext);
  return (
    <div key={keyProps} className={`my-4`}>
        {children}
    </div>
  );
};

export default LessonElementCard;
