import Popover from 'atoms/Popover';
import {GlobalContext} from 'contexts/GlobalContext';
import {getAsset} from 'assets';
import React, {useContext, useState} from 'react';
import {BiDotsVerticalRounded} from 'react-icons/bi';

interface IDotMenuProps {
  menuItems?: {label: string; action: Function}[];
  extraContent?: React.ReactNode;
}

const DotMenu = ({menuItems, extraContent}: IDotMenuProps) => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const theme = gContext.theme;
  const clientKey = gContext.clientKey;
  const themeColor = getAsset(clientKey, 'themeClassName');

  const [showMenu, setShowMenu] = useState<boolean>(false);

  const textClass = `text-center text-sm text-gray-600 p-2 px-4 hover:iconoclast:bg-400 hover:curate:bg-400 hover:text-white rounded-full transition-all duration-50`;

  const handleItemClick = (fn: Function, fn2: Function) => {
    fn();
    fn2();
  };

  return (
    <Popover
      show={showMenu}
      bottom={0.6}
      dir={'top'}
      minWidth={'---'}
      customStyle={{minWidth: '10rem'}}
      minHeight={0}
      padding={4}
      rounded="lg"
      setShow={setShowMenu}
      containerClass={`flex flex-col items-center bg-white`}
      content={
        <>
          {menuItems &&
            menuItems.length > 0 &&
            menuItems.map((item: {label: string; action: Function}, idx: number) => {
              return (
                <dl key={`menuItem_${idx}`} className="grid grid-cols-1 gap-y-3 rounded">
                  <div className="col-span-1">
                    <dt
                      onClick={() =>
                        handleItemClick(item.action, () => setShowMenu(false))
                      }
                      className={`${textClass} cursor-pointer`}>
                      {item.label}
                    </dt>
                  </div>
                </dl>
              );
            })}
          {extraContent ? extraContent : null}
        </>
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
