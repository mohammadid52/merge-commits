import React, { useContext } from 'react';
import ButtonsRound from '../../../Atoms/ButtonsRound';
import { FloatingSideMenuProps } from '../FloatingSideMenu';
import { BsPencilSquare } from 'react-icons/bs';
import { LessonContext } from '../../../../contexts/LessonContext';

interface CallLinkLauncherProps extends FloatingSideMenuProps {
  callback?: any;
}

export const NotesLauncher = (props: CallLinkLauncherProps) => {
  const {menuState, focusSection, callback} = props;
  const LessonCTX = useContext(LessonContext);

  if (LessonCTX === null) {
    return null;
  } else {
    return (
      <div className={`flex-0 h-12 border-b-0 border-charcoal`}>
        <ButtonsRound
          Icon={BsPencilSquare}
          iconSizePX={16}
          buttonWHClass={`w-12 h-12`}
          onClick={callback ? () => callback('Notes') : undefined}
          containerBgClass={`${
            menuState > 0 && focusSection === 'Notes'
              ? 'bg-red-700 hover:bg-red-600'
              : 'bg-transparent hover:bg-gray-800'
          }`}
          buttonBgClass={`bg-transparent`}
          iconTxtColorClass={`text-white`}
        />
      </div>
    );
  }
};
