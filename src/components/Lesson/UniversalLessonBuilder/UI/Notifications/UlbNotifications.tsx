import {Transition} from '@headlessui/react';
import React from 'react';
import {AiOutlineCheck} from 'react-icons/ai';
import Loader from '@atoms/Loader';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';

const Notifications = () => {
  const {savingStatus} = useULBContext();
  return (
    <div className="fixed z-100 bottom-3 right-5  w-auto ">
      <Transition
        appear
        show={savingStatus !== 'initial'}
        enter="transform transition ease-in-out duration-300"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transform transition ease-in-out duration-300"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
        className=" rounded-md shadow bg-gray-800 border-gray-700 border-0">
        <div className="py-3 px-5">
          {savingStatus === 'loading' && (
            <div className={`flex items-center justify-center w-auto`}>
              <Loader className="text-gray-500 mr-2 w-auto" />
              <p className="text-white font-medium w-auto tracking-wide text-sm">
                Saving changes
              </p>
            </div>
          )}
          {savingStatus === 'loaded' && (
            <div className={`flex items-center justify-center`}>
              <p className="text-white font-medium tracking-wide text-sm">
                Changes saved
              </p>
              <AiOutlineCheck className="text-green-500 ml-2 w-auto" />
            </div>
          )}
          {savingStatus === 'failed' && (
            <div className={`flex items-center justify-center`}>
              <p className="text-red-500 font-medium tracking-wide text-sm">
                Something went wrong
              </p>
            </div>
          )}
        </div>
      </Transition>
    </div>
  );
};

export default Notifications;
