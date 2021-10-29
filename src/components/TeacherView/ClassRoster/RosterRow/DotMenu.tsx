import Popover from '@components/Atoms/Popover';
import {GlobalContext} from '@contexts/GlobalContext';
import {getAsset} from 'assets';
import React, {useContext, useState} from 'react';
import {BiDotsVerticalRounded} from 'react-icons/bi';

interface IDotMenuProps {
  menuItems?: [{label: string; action: Function}];
}

const DotMenu = ({menuItems}: IDotMenuProps) => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const theme = gContext.theme;
  const clientKey = gContext.clientKey;
  const themeColor = getAsset(clientKey, 'themeClassName');

  const [showMenu, setShowMenu] = useState<boolean>(false);

  const textClass = `text-sm text-gray-600 hover:${theme.textColor[themeColor]} transition-all duration-50`;

  // <dl className="grid grid-cols-1 gap-y-3 border-0 border-gray-400 border-opacity-20 rounded">
  //   <div className="col-span-1">
  //     <dt onClick={() => {}} className={`${textClass} cursor-pointer`}>
  //       Profile
  //     </dt>
  //   </div>
  // </dl>;

  return (
    <Popover
      show={showMenu}
      bottom={0.6}
      dir={'top'}
      minWidth={32}
      minHeight={0}
      padding={2}
      rounded="lg"
      setShow={setShowMenu}
      containerClass={`flex items-center`}
      content={
        menuItems &&
        menuItems.length > 0 &&
        menuItems.map((item: {label: string; action: Function}, idx: number) => {
          return (
            <dl
              key={`menuItem_${idx}`}
              className="grid grid-cols-1 gap-y-3 border-0 border-gray-400 border-opacity-20 rounded">
              <div className="col-span-1">
                <dt
                  onClick={() => item.action()}
                  className={`${textClass} cursor-pointer`}>
                  {item.label}
                </dt>
              </div>
            </dl>
          );
        })
      }>
      <span className="h-full w-auto flex items-center justify-center transition-all cursor-pointer">
        <BiDotsVerticalRounded
          title="show menu"
          className={`h-6 w-6 text-lg text-gray-600 hover:${theme.textColor[themeColor]}`}
        />
      </span>
    </Popover>
  );
};

export default DotMenu;
