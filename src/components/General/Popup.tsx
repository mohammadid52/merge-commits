import Loader from 'components/Atoms/Loader';
import React from 'react';
import {useOutsideAlerter} from './hooks/outsideAlerter';

export interface WritingAlertProps {
  children?: any;
  identifier?: string | number;
  alert?: boolean;
  setAlert?: React.Dispatch<React.SetStateAction<boolean>>;
  handleButton1?: () => void;
  handleButton2?: () => void;
  header?: string;
  content?: string;
  button1?: string;
  button1Color?: string;
  button2?: string;
  button2Color?: string;
  id?: string;
  svg?: string;
  theme?: 'dark' | 'light';
  fill?: 'screen' | 'section';
  disableButton?: boolean;
}

const PosAlert = (props: WritingAlertProps) => {
  const {
    children,
    identifier,
    alert,
    setAlert,
    handleButton1,
    handleButton2,
    header,
    content,
    button1,
    button2,
    svg,
    button1Color,
    button2Color,
    theme,
    fill,
    disableButton,
    id
  } = props;
  const {visible, setVisible, ref} = useOutsideAlerter(false);

  const handleClick = () => {
    setVisible((prevState: any) => !prevState);
  };

  const switchTheme = (() => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-dark-gray',
          font: 'text-white',
          icon: '#fff'
        };
        break;
      case 'light':
        return {
          bg: 'bg-white',
          font: 'text-black',
          icon: '#32323e'
        };
      default:
        return {
          bg: 'bg-dark-gray',
          font: 'text-white',
          icon: '#fff'
        };
    }
  })();

  const switchSVG = () => {
    switch (svg) {
      case 'question':
        return (
          <svg
            className={`h-14 w-14 text-white`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill={switchTheme.icon}>
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'smile':
        return (
          <svg
            className="h-14 w-14 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            fill="#ffa500">
            <path
              fillRule="evenodd"
              d="M288 421a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm352 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0zM512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm263 711c-34.2 34.2-74 61-118.3 79.8C611 874.2 562.3 884 512 884c-50.3 0-99-9.8-144.8-29.2A370.4 370.4 0 0 1 248.9 775c-34.2-34.2-61-74-79.8-118.3C149.8 611 140 562.3 140 512s9.8-99 29.2-144.8A370.4 370.4 0 0 1 249 248.9c34.2-34.2 74-61 118.3-79.8C413 149.8 461.7 140 512 140c50.3 0 99 9.8 144.8 29.2A370.4 370.4 0 0 1 775.1 249c34.2 34.2 61 74 79.8 118.3C874.2 413 884 461.7 884 512s-9.8 99-29.2 144.8A368.89 368.89 0 0 1 775 775zM664 533h-48.1c-4.2 0-7.8 3.2-8.1 7.4C604 589.9 562.5 629 512 629s-92.1-39.1-95.8-88.6c-.3-4.2-3.9-7.4-8.1-7.4H360a8 8 0 0 0-8 8.4c4.4 84.3 74.5 151.6 160 151.6s155.6-67.3 160-151.6a8 8 0 0 0-8-8.4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'check':
        return (
          <svg
            className="h-14 w-14 text-green-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg
            className="h-14 w-14 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'x':
        return (
          <svg
            className="h-14 w-14 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'information':
        return (
          <svg
            className="h-14 w-14 text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="h-14 w-14 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            fill="#ffa500">
            <path
              fillRule="evenodd"
              d="M288 421a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm352 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0zM512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm263 711c-34.2 34.2-74 61-118.3 79.8C611 874.2 562.3 884 512 884c-50.3 0-99-9.8-144.8-29.2A370.4 370.4 0 0 1 248.9 775c-34.2-34.2-61-74-79.8-118.3C149.8 611 140 562.3 140 512s9.8-99 29.2-144.8A370.4 370.4 0 0 1 249 248.9c34.2-34.2 74-61 118.3-79.8C413 149.8 461.7 140 512 140c50.3 0 99 9.8 144.8 29.2A370.4 370.4 0 0 1 775.1 249c34.2 34.2 61 74 79.8 118.3C874.2 413 884 461.7 884 512s-9.8 99-29.2 144.8A368.89 368.89 0 0 1 775 775zM664 533h-48.1c-4.2 0-7.8 3.2-8.1 7.4C604 589.9 562.5 629 512 629s-92.1-39.1-95.8-88.6c-.3-4.2-3.9-7.4-8.1-7.4H360a8 8 0 0 0-8 8.4c4.4 84.3 74.5 151.6 160 151.6s155.6-67.3 160-151.6a8 8 0 0 0-8-8.4z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <>
      <div
        id={id}
        className={`${!alert ? 'hidden' : 'display'} ${
          fill === 'screen' ? 'fixed' : ''
        } z-100 w-full h-full flex justify-center items-center bg-black bg-opacity-50`}>
        <div
          className={`${switchTheme.bg} w-128 p-2 overflow-hidden shadow-xl rounded-lg`}
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
              <div className="mx-auto flex items-center justify-center h-14 w-20 rounded-full">
                {switchSVG()}
              </div>

              {/* MAIN CONTENT */}
              <div className={`mt-3 text-center sm:mt-5 ${switchTheme.font}`}>
                <h3 className="text-lg leading-6 font-medium" id="modal-headline">
                  {header}
                </h3>
                <div className="mt-2">
                  <p className="text-sm leading-5">{content}</p>
                </div>
              </div>
            </div>

            {/*BUTTON CONTROLS*/}
            <div className={`mt-5 sm:mt-6 flex flex-col`}>
              {/* YES */}
              <p className={`w-auto flex rounded-md shadow-sm text-white`}>
                <button
                  type="button"
                  disabled={disableButton}
                  className={`${
                    button1Color
                      ? {button1Color}
                      : 'bg-sea-green hover:bg-green-500 text-white focus:border-green-100 focus:ring-indigo'
                  } inline-flex justify-center w-full rounded-md  border-0 border-transparent px-4 py-2 text-base leading-6 font-medium shadow-sm focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
                  onClick={handleButton1}>
                  {disableButton ? <Loader color="#fff" /> : button1}
                </button>
              </p>

              {/* NO */}
              <p className={`w-auto flex rounded-md shadow-sm ${switchTheme.font}`}>
                <button
                  disabled={disableButton}
                  type="button"
                  className={`${
                    button2Color
                      ? {button1Color}
                      : `text-gray-500 hover:${switchTheme.font}`
                  } w-full inline-flex justify-center  rounded-md px-4 py-2 text-base leading-6 font-medium transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
                  onClick={handleButton2}>
                  {button2}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PosAlert;
