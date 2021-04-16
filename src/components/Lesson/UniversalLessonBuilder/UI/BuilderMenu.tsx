import React from 'react';
import { Transition } from '@headlessui/react';

interface BuilderMenuProps {
  galleryVisible?: boolean;
  setGalleryVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  builderMenuVisible?: boolean;
}

export const BuilderMenu = (props: BuilderMenuProps) => {
  const { galleryVisible, setGalleryVisible, builderMenuVisible } = props;
  const dropDownOptions = [
    {
      id: 'save_draft',
      value: 'Save Draft',
      option: 'Save Draft',
    },
    {
      id: 'publish_lesson',
      value: 'Publish Lesson',
      option: 'Publish Lesson',
    },
    {
      id: 'save_changes',
      value: 'Save Changes',
      option: 'Save Changes',
    },
    {
      id: 'discard_changes',
      value: 'Discard Changes',
      option: 'Discard Changes',
    },
    {
      id: 'delete_lesson',
      value: 'Delete Lesson',
      option: 'Delete Lesson',
    },
  ];

  const handleSetGalleryVisibility = () => {
    setGalleryVisible(!galleryVisible);
  };

  return (
    <>
      <div className={`w-auto`}>
        <Transition
          show={builderMenuVisible}
          enter="transition duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 transform">
          <div className={`absolute right-0 w-auto h-full bg-white z-50`}>
            <div className={`w-full flex flex-col justify-center`}>
              {dropDownOptions &&
                dropDownOptions.map((option: { id: string; value: string; option: string }, idx: number) => (
                  <button
                    id={option.id}
                    className="inline-flex items-center px-2.5 py-1.5 border-0 border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <div className="flex-1 flex flex-col p-2 text-center">{option.value}</div>
                  </button>
                ))}
            </div>
          </div>
        </Transition>
      </div>
    </>
  );
};
