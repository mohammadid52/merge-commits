import React, { useContext, useEffect, useState } from 'react';
import ButtonsRound from '../../../Atoms/ButtonsRound';
import { ImPhone } from 'react-icons/im';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { Widget } from '../../../../interfaces/ClassroomComponentsInterfaces';
import { FloatingSideMenuProps } from '../FloatingSideMenu';

interface CallLinkLauncherProps extends FloatingSideMenuProps {
  callback?: any;
}

export const CallLinkLauncher = (props: CallLinkLauncherProps) => {
  const {callback} = props;
  const {state} = useContext(GlobalContext);
  const [callLink, setCallLink] = useState<any>({});
  useEffect(() => {
    const roomWidgets = state.roomData.widgets;
    if (roomWidgets.length > 0) {
      const callWidget = roomWidgets.find((widget: Widget) => widget.type === 'call');
      if (callWidget) {
        setCallLink(callWidget);
      }
    } else {
      setCallLink({});
    }
  }, [state.roomData]);
  const isCallLink = Object.keys(callLink).length > 0;
  const handleOpenCallLink = (link: string) => {
    console.log('window open - ', link);
    window.open(link);
  };

  return (
    <div className={`flex-0 h-12`}>
      <ButtonsRound
        Icon={ImPhone}
        iconSizePX={16}
        buttonWHClass={`w-12 h-12`}
        pointerEvents={isCallLink}
        onClick={
          isCallLink ? () => callback('Call', () => handleOpenCallLink(callLink.links[0]?.url)) : undefined
        }
        containerBgClass={`bg-transparent hover:bg-gray-800 rounded-bl-lg`}
        buttonBgClass={`bg-transparent`}
        iconTxtColorClass={`${isCallLink ? 'text-white' : 'text-gray-600'}`}
      />
    </div>
  );
};
