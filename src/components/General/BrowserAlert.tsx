import React from 'react';
import {FaCopy} from 'react-icons/fa';
import {FiAlertCircle} from 'react-icons/fi';
import Tooltip from '../Atoms/Tooltip';
import {useOutsideAlerter} from './hooks/outsideAlerter';

const BrowserAlert = (props: any) => {
  const {closeTab, onContinue} = props;
  const {visible, setVisible, ref} = useOutsideAlerter(false);

  const handleClick = () => {
    setVisible((prevState: any) => !prevState);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(`${window.location}`);
  };

  return (
    <>
      <div
        className={`${
          !alert ? 'hidden' : 'display'
        } fixed z-100 w-full h-full flex justify-center items-center bg-black bg-opacity-50`}>
        <div
          className={`bg-gray-800 w-128 p-2 overflow-hidden shadow-xl rounded-lg`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline">
          <div className="px-2 pt-2">
            <div
              className="absolute w-auto cursor-pointer p-2 hover:text-gray-300"
              style={{top: 0, right: 0, color: '#828282'}}
              onClick={handleClick}>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div>
              <div className="mx-auto flex items-center justify-center rounded-full">
                <FiAlertCircle className="w-8 h-8 text-white" />
                <div className="ml-2 text-lg text-white w-auto">Safari Users</div>
              </div>
              {/* MAIN CONTENT */}
              <div className={`mt-3 text-center sm:mt-5 text-white`}>
                <h3 className="text-lg leading-6 font-medium" id="modal-headline">
                  For optimal experience, we suggest logging in Chrome, Firefox, or MS
                  Edge. Using Safari is not recommended at this time.
                </h3>
                <div>
                  <button
                    type="button"
                    className={`bg-sea-green hover:bg-green-500 focus:border-green-100 focus:ring-indigo inline-flex justify-center w-auto rounded-md border-0 border-transparent px-4 py-2 shadow-sm focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5 mt-3 sm:mt-5`}
                    onClick={onContinue}>
                    <div className="text-base text-white leading-6 font-medium">
                      I'll log in with different browser{' '}
                      <span className="w-auto mx-1 inline-flex items-center">
                        <Tooltip
                          text={'Copy link'}
                          placement="top"
                          additionalClass="w-auto">
                          <FaCopy onClick={copyToClipboard} className="w-4 h-4" />
                        </Tooltip>
                      </span>
                    </div>
                  </button>
                </div>
                <div className="my-4" onClick={onContinue}>
                  <u>Continue with Safari</u>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowserAlert;
