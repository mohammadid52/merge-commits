import React, {useState} from 'react';
import {Transition} from '@headlessui/react';
import SlideOutBuilderMenu from './BuilderMenu/SlideOutBuilderMenu';
import ClickAwayListener from 'react-click-away-listener';
import ModalPopUp from '../../../Molecules/ModalPopUp';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';

export interface BuilderMenuProps {
  galleryVisible?: boolean;
  setGalleryVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setBuilderMenuVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  builderMenuVisible?: boolean;
  onActionClick?: (action: string) => void;
}

export const BuilderMenu = (props: BuilderMenuProps) => {
  const {builderMenuVisible, setBuilderMenuVisible} = props;
  const [confirmationConfig, setConfirmationConfig] = useState<{
    show: boolean;
    message: string;
    saveAction?: () => void;
  }>({
    show: false,
    message: '',
  });
  const onActionClick = async (action: string) => {
    let message, actionCallback;
    switch (action) {
      case 'save':
        message = 'Are you sure you want to submit the changes?';
        break;
      case 'discard':
        message =
          'Are you sure you want to discard the changes? All of your data will be permanently removed. This action cannot be undone.';
        break;
      case 'delete':
        message =
          'Are you sure you want to delete the complete lesson? All of your data will be permanently removed. This action cannot be undone.';
        break;
      default:
        break;
    }
    setConfirmationConfig({
      message,
      show: true,
    });
  };
  const closeAction = () => {
    setConfirmationConfig({
      message: '',
      show: false,
    });
  };

  const {theme} = useULBContext();
  const {message = '', show = false} = confirmationConfig;
  return (
    <>
      <div
        className={`${
          builderMenuVisible ? 'relative w-56 h-0 mr-0 ml-auto bg-gray-400' : 'hidden'
        }`}
        style={{zIndex: 99999}}>
        <div className="absolute" style={{top: '0.5rem', right: '1.2rem'}}>
          <Transition
            show={builderMenuVisible}
            enter="transition duration-200"
            enterFrom="opacity-0 transform translate-x-8"
            enterTo="opacity-100 transform translate-x-0"
            leave="transition duration-200"
            leaveFrom="opacity-100 transform translate-x-0"
            leaveTo="opacity-0 transform translate-x-8">
            {/* Header */}
            <ClickAwayListener onClickAway={() => setBuilderMenuVisible(false)}>
              <>
                <div className={`${theme.bg} relative text-white py-2 rounded-t-lg `}>
                  <div className="absolute  flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-400"></div>
                  </div>
                  <div className="relative flex text-center">
                    <span className="text-md text-white font-semibold">Menu</span>
                  </div>
                </div>
                <SlideOutBuilderMenu onActionClick={onActionClick} />
              </>
            </ClickAwayListener>
          </Transition>
        </div>
      </div>
      {show && <ModalPopUp message={message} closeAction={closeAction} />}
    </>
  );
};
