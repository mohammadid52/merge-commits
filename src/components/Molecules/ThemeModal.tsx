import {Dialog, Transition} from '@headlessui/react';
import {XIcon} from '@heroicons/react/outline';
import React, {Fragment} from 'react';
import {children, setState} from '../../interfaces';

interface IModal {
  open: boolean;
  setOpen: setState['boolean'];
  children: children;
  header?: string;
  subHeader?: string;
  dark?: boolean;
  max?: {w?: number; h?: number};
  overflowClass?: string;
}

const ThemeModal = ({
  setOpen,
  subHeader,
  open,
  children,
  header,
  dark = true,
  overflowClass = 'overflow-y-auto overflow-x-hidden',
  max = {w: 256, h: 256},
}: IModal) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        style={{zIndex: 3000}}
        as="div"
        className={`fixed w-auto inset-0 overflow-y-auto`}
        onClose={setOpen}>
        <div className="w-auto flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden w-auto sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div
              className={`${
                dark ? 'bg-gray-800 ' : 'bg-white'
              } w-auto border-0 border-gray-${dark ? '600' : '200'} max-w-${
                max.w
              } inline-block align-bottom  rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6`}>
              <div className="w-auto hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className={`${
                    dark ? 'bg-gray-800' : 'bg-white'
                  } w-auto  rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  onClick={() => setOpen(false)}>
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              {header && (
                <div
                  className={`${
                    dark ? 'border-gray-700' : 'border-gray-200'
                  } modal-header border-b-0 pb-2  `}>
                  <h3 className="dark:text-white text-2xl font-semibold">{header}</h3>
                  {subHeader && (
                    <p className="text-sm truncate whitespace-pre text-gray-400">
                      {subHeader}
                    </p>
                  )}
                </div>
              )}
              <div
                className={`p-2 ${dark ? 'dark-scroll' : ''} max-h-${
                  max.h
                } ${overflowClass}`}>
                {children}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default ThemeModal;
