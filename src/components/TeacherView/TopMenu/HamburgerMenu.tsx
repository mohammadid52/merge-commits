import React, {useState} from 'react';

import {IconContext} from 'react-icons/lib/esm/iconContext';
import {FiMenu} from 'react-icons/fi';
import {AiOutlineHome} from 'react-icons/ai';

interface HamburgerMenuProps {
  theme?: any;
  themeColor?: string;
  handleLeavePopup: () => void;
  handleHomePopup: () => void;
  // setQuickRegister: React.Dispatch<React.SetStateAction<boolean>>;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = (props: HamburgerMenuProps) => {
  const {theme, themeColor, handleLeavePopup, handleHomePopup} = props;
  const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false);

  return (
    <div title="Leave lesson" className="w-8 flex flex-col content-between ">
      <div className="relative flex flex-col my-auto justify-around">
        <div
          className={`hover:iconoclast:text-500 hover:curate:text-500 text-gray-600 cursor-pointer`}
          onClick={handleHomePopup}>
          <IconContext.Provider value={{size: '1.5rem'}}>
            <AiOutlineHome />
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HamburgerMenu);
