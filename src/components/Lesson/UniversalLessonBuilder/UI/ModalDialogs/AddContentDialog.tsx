import React from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {VscSymbolParameter} from 'react-icons/vsc';
import {
  AiOutlineFileImage,
  AiOutlineMore,
  AiOutlineQuestionCircle,
  AiOutlineYoutube,
} from 'react-icons/ai';
import {MdTitle} from 'react-icons/md';

interface AddContentDialog {
  addContentModal: {show: boolean; type: string};
  setAddContentModal: React.Dispatch<React.SetStateAction<{show: boolean; type: string}>>;
  hideAllModals?: () => void;
}
const AddContentDialog = ({setAddContentModal, hideAllModals}: AddContentDialog) => {
  const buttonClass =
    'w-full h-24 flex flex-col justify-center items-center bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer';
  const colHeaderTextClass = 'text-center text-xl text-dark font-semibold mb-2';
  return (
    <div className={` z-50 `}>
      <div className={`grid grid-cols-3 gap-2 p-2`}>
        {/* LEFT */}
        <div>
          <h2 className={`${colHeaderTextClass}`}>Text-Content</h2>
          <div className={`h-full w-full`}>
            <div className={`grid grid-cols-1 gap-2 h-auto w-full`}>
              <div
                onClick={() => {
                  hideAllModals();
                  setAddContentModal({show: true, type: 'header'});
                }}
                className={`${buttonClass}`}>
                <IconContext.Provider value={{size: '64px', className: 'text-gray-800'}}>
                  <MdTitle />
                </IconContext.Provider>
              </div>
              <p className={`text-center text-sm text-gray-600`}>Title</p>

              <div className={`${buttonClass}`}>
                <IconContext.Provider value={{size: '64px', className: 'text-gray-800'}}>
                  <VscSymbolParameter />
                </IconContext.Provider>
              </div>
              <p className={`text-center text-sm text-gray-600`}>Paragraph</p>
            </div>
          </div>
        </div>

        {/* MIDDLE */}
        <div>
          <h2 className={`${colHeaderTextClass}`}>Media</h2>
          <div className={`h-full w-full`}>
            <div
              className={`grid grid-cols-1 gap-2 h-auto w-full`}
              onClick={() => {
                hideAllModals();
                setAddContentModal({show: true, type: 'image'});
              }}>
              <div className={`${buttonClass}`}>
                <IconContext.Provider value={{size: '64px', className: 'text-gray-800'}}>
                  <AiOutlineFileImage />
                </IconContext.Provider>
              </div>
              <p className={`text-center text-sm text-gray-600`}>Image</p>

              <div
                className={`${buttonClass}`}
                onClick={() => {
                  hideAllModals();
                  setAddContentModal({show: true, type: 'video'});
                }}>
                <IconContext.Provider value={{size: '64px', className: 'text-gray-800'}}>
                  <AiOutlineYoutube />
                </IconContext.Provider>
              </div>
              <p className={`text-center text-sm text-gray-600`}>Youtube Video</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <h2 className={`${colHeaderTextClass}`}>User Interaction</h2>
          <div className={`h-full w-full`}>
            <div className={`grid grid-cols-1 gap-2 h-auto w-full`}>
              <div className={`${buttonClass}`}>
                <IconContext.Provider value={{size: '64px', className: 'text-gray-800'}}>
                  <AiOutlineQuestionCircle />
                </IconContext.Provider>
              </div>
              <p className={`text-center text-sm text-gray-600`}>Checkpoint</p>

              <div className={`${buttonClass}`}>
                <IconContext.Provider value={{size: '64px', className: 'text-gray-800'}}>
                  <AiOutlineMore />
                </IconContext.Provider>
              </div>
              <p className={`text-center text-sm text-gray-600`}>Other</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContentDialog;
