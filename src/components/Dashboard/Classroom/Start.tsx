import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';

interface StartProps {
  lessonKey: any;
  open: boolean;
  accessible: boolean;
  type?: string
}

const Start: React.FC<StartProps> = (props: StartProps) => {
  const { lessonKey, open, accessible, type } = props;
  const history = useHistory();
  const { theme } = useContext(GlobalContext);

  const handleLink = () => {
    if (accessible && open) {
      history.push(`${`/lesson?id=${lessonKey}`}`);
    }
  };

  return (
    <div>
      <button
        type="submit"
        onClick={handleLink}
        className={`${
          accessible && open
            ? 'bg-ketchup hover:bg-red-300 focus:border-red-700 focus:shadow-outline-red active:bg-red-500 text-white'
            : 'bg-gray-500 text-gray-700 cursor-default'
        }
                              h-full w-full text-white rounded-br focus:outline-none transition duration-150 ease-in-out`}>
        <span className="w-auto h-auto">START {(type === 'survey' || type === 'assessment') ? type.toUpperCase() : 'LESSON'}</span>
      </button>
    </div>
  );
};

export default Start;
