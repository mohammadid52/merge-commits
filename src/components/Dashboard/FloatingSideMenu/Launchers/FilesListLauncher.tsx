import React, { useContext, useEffect, useState } from 'react';
import ButtonsRound from '../../../Atoms/ButtonsRound';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { Widget } from '../../../../interfaces/ClassroomComponentsInterfaces';
import { FloatingSideMenuProps } from '../FloatingSideMenu';
import { IoDocument } from 'react-icons/io5';

interface FilesListLauncherProps extends FloatingSideMenuProps {
  chatroom?: any;
  callback?: any;
}

export const FilesListLauncher = (props: FilesListLauncherProps) => {
  const {menuState, focusSection, callback} = props;
  const {state} = useContext(GlobalContext);
  const [thereAreFiles, setThereAreFiles] = useState<boolean>(false);

  useEffect(() => {
    const widgets = state.roomData.widgets;
    if (widgets.length > 0) {
      const getFileWidgets = widgets.filter((widget: Widget) => widget.type === 'file');
      if (getFileWidgets.length > 0) {
        setThereAreFiles(true);
      } else {
        setThereAreFiles(false);
      }
    } else {
      setThereAreFiles(false);
    }
  }, [state.roomData]);

  return (
    <div className={`flex-0 h-12 border-b-0 border-charcoal`}>
      <ButtonsRound
        Icon={IoDocument}
        iconSizePX={16}
        buttonWHClass={`w-12 h-12`}
        pointerEvents={thereAreFiles}
        onClick={thereAreFiles ? () => callback('File') : undefined}
        containerBgClass={`${
          menuState > 0 && focusSection === 'File'
            ? 'bg-red-700 hover:bg-red-600'
            : 'bg-transparent hover:bg-gray-800'
        } `}
        buttonBgClass={`bg-transparent`}
        iconTxtColorClass={`${thereAreFiles ? 'text-white' : 'text-gray-600'}`}
      />
    </div>
  );
};
