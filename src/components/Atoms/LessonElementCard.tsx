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
    <div key={keyProps} className={`p-4 rounded-xl bg-light-gray bg-opacity-50 mb-4`}>
        {children}
    </div>
  );
};

export default LessonElementCard;
