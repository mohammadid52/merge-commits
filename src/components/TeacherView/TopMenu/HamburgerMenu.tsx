import React, { useState } from 'react';

import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FiMenu } from 'react-icons/fi';

interface HamburgerMenuProps {
  handleClick: () => void;
  handleHomePopup: () => void;
  setQuickRegister: React.Dispatch<React.SetStateAction<boolean>>;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = (
  props: HamburgerMenuProps
) => {
  const { handleClick, setQuickRegister, handleHomePopup } = props;
  const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false);



  return (
    <div className="w-8 mr-4 flex flex-col content-between ">
      <div className="relative flex flex-col my-auto justify-around">
        <div
          className="hover:text-blueberry"
          onClick={() => setHamburgerOpen(!hamburgerOpen)}
        >
          <IconContext.Provider value={{ size: "1.5rem" }}>
            <FiMenu />
          </IconContext.Provider>
        </div>

        <div className="absolute w-full top-1">
          <div
            className={`${hamburgerOpen ? "visible" : "hidden"
              } relative arrow-up right-1`}
          />

          <div
            className={`${hamburgerOpen ? "visible" : "hidden"
              } absolute w-32 h-auto transform right-0 flex  flex-col bg-gray-200 p-1 rounded-lg  border-0 border-light-gray border-opacity-40 overflow-hidden z-100`}
            onPointerLeave={() => setHamburgerOpen(false)}
          >
            <div className="flex flex-col w-full h-full bg-gray-400 rounded-lg z-100">
              {/* HOME BUTTON */}
              <div
                className="h-8 w-full flex justify-center items-center bg-gray-200 hover:bg-white text-gray-600 text-xs rounded-t-lg border-b-0 border-light-gray border-opacity-20 active:shadow-none cursor-pointer"
                onClick={handleHomePopup}
              >

                <span className="w-full text-left pl-2">Home</span>
              </div>

              {/* QUICK REGISTER */}
               <div
                className="h-8 w-full flex justify-center items-center bg-gray-200 hover:bg-white text-gray-600 text-xs active:shadow-none cursor-pointer"
                onClick={() => setQuickRegister(true)}
              >

                <span className="w-full text-left pl-2">Quick Register</span>
              </div>

              {/* USER MANAGEMENT */}
              <div
                className="h-8 w-full flex justify-center items-center bg-gray-200 hover:bg-white text-gray-600 text-xs rounded-b-lg active:shadow-none cursor-pointer"
                onClick={handleClick}
              >

                <span className="w-full text-left pl-2">User Management</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
