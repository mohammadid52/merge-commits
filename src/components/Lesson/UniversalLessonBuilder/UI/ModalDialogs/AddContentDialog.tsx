import React from 'react';

import {VscSymbolParameter} from 'react-icons/vsc';
import {AiOutlineFileImage, AiOutlineMore, AiOutlineYoutube} from 'react-icons/ai';
import {MdTitle} from 'react-icons/md';
import {RiSurveyLine} from 'react-icons/ri';

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
                <MdTitle className="text-gray-800 text-6xl" />
              </div>
              <p className={`text-center text-sm text-gray-600`}>Title</p>

              <div
                onClick={() => {
                  hideAllModals();
                  setAddContentModal({show: true, type: 'paragraph'});
                }}
                className={`${buttonClass}`}>
                <VscSymbolParameter className="text-gray-800 text-6xl" />
              </div>
              <p className={`text-center text-sm text-gray-600`}>Paragraph</p>

              <div
                onClick={() => {
                  hideAllModals();
                  setAddContentModal({show: true, type: 'jumbotron'});
                }}
                className={`${buttonClass}`}>
                <AiOutlineFileImage className="text-gray-800 text-6xl" />
              </div>
              <p className={`text-center text-sm text-gray-600`}>Jumbotron</p>
            </div>
          </div>
        </div>

        {/* MIDDLE */}
        <div>
          <h2 className={`${colHeaderTextClass}`}>Media</h2>
          <div className={`h-full w-full`}>
            <div className={`grid grid-cols-1 gap-2 h-auto w-full`}>
              <div
                className={`${buttonClass}`}
                onClick={() => {
                  hideAllModals();
                  setAddContentModal({show: true, type: 'image'});
                }}>
                <AiOutlineFileImage className="text-gray-800 text-6xl" />
              </div>
              <p className={`text-center text-sm text-gray-600`}>Image</p>

              <div
                className={`${buttonClass}`}
                onClick={() => {
                  hideAllModals();
                  setAddContentModal({show: true, type: 'video'});
                }}>
                <AiOutlineYoutube className="text-gray-800 text-6xl" />
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
                <RiSurveyLine className="text-gray-800 text-6xl" />
              </div>
              <p className={`text-center text-sm text-gray-600`}>Checkpoint</p>

              <div
                onClick={() => {
                  hideAllModals();
                  setAddContentModal({show: true, type: 'highlighter'});
                }}
                className={`${buttonClass}`}>
                <AiOutlineMore className="text-gray-800 text-6xl" />
              </div>
              <p className={`text-center text-sm text-gray-600`}>Highlighter</p>

              <div
                onClick={() => {
                  hideAllModals();
                  setAddContentModal({show: true, type: 'poem'});
                }}
                className={`${buttonClass}`}>
                <AiOutlineMore className="text-gray-800 text-6xl" />
              </div>
              <p className={`text-center text-sm text-gray-600`}>Linestarter</p>

              <div
                onClick={() => {
                  hideAllModals();
                  setAddContentModal({show: true, type: 'input'});
                }}
                className={`${buttonClass}`}>
                <AiOutlineMore className="text-gray-800 text-6xl" />
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
