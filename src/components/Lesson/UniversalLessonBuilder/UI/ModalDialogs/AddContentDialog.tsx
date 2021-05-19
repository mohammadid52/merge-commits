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

const AddContentDialog = () => {
  return (
    <div className={` z-50 `}>
      <div className="relative mx-2 flex items-center">
        <p className="w-auto bg-white text-lg font-medium text-gray-900">Add Content</p>
      </div>
      <div className={`grid grid-cols-3 gap-2`}>
        {/* LEFT */}
        <div>
          <h2 className={`my-2 text-center text-gray-600`}>Text-Content</h2>
          <div className={`h-full w-full`}>
            <div className={`grid grid-cols-1 gap-2 h-auto w-full`}>
              <div
                className={`w-full h-24 flex flex-col justify-center items-center bg-gray-200 rounded`}>
                <IconContext.Provider value={{size: '64px', className: 'text-gray-800'}}>
                  <MdTitle />
                </IconContext.Provider>
              </div>
              <p className={`text-center text-sm text-gray-600`}>Title</p>

              <div
                className={`w-full h-24 flex flex-col justify-center items-center bg-gray-200 rounded`}>
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
          <h2 className={`my-2 text-center text-gray-600`}>Media</h2>
          <div className={`h-full w-full`}>
            <div className={`grid grid-cols-1 gap-2 h-auto w-full`}>
              <div
                className={`w-full h-24 flex flex-col justify-center items-center bg-gray-200 rounded`}>
                <IconContext.Provider value={{size: '64px', className: 'text-gray-800'}}>
                  <AiOutlineFileImage />
                </IconContext.Provider>
              </div>
              <p className={`text-center text-sm text-gray-600`}>Image</p>

              <div
                className={`w-full h-24 flex flex-col justify-center items-center bg-gray-200 rounded`}>
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
          <h2 className={`my-2 text-center text-gray-600`}>User Interaction</h2>
          <div className={`h-full w-full`}>
            <div className={`grid grid-cols-1 gap-2 h-auto w-full`}>
              <div
                className={`w-full h-24 flex flex-col justify-center items-center bg-gray-200 rounded`}>
                <IconContext.Provider value={{size: '64px', className: 'text-gray-800'}}>
                  <AiOutlineQuestionCircle />
                </IconContext.Provider>
              </div>
              <p className={`text-center text-sm text-gray-600`}>Checkpoint</p>

              <div
                className={`w-full h-24 flex flex-col justify-center items-center bg-gray-200 rounded`}>
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
