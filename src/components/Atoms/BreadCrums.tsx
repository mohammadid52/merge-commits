import {getAsset} from 'assets';
import Buttons from 'atoms/Buttons';
import {useGlobalContext} from 'contexts/GlobalContext';
import React from 'react';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import {useHistory} from 'react-router';

interface BreadCrumProps {
  items: {title: string; url?: string; last: boolean; goBack?: boolean}[];
  unsavedChanges?: boolean;
  separateGoBackButton?: string;
  toggleModal?: any;
}

const BreadCrums: React.FC<BreadCrumProps> = (brdPrps: BreadCrumProps) => {
  const {items, separateGoBackButton = '', unsavedChanges = false, toggleModal} = brdPrps;
  const {theme, clientKey} = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const history = useHistory();

  const goToUrl = (url: string) => {
    if (unsavedChanges) {
      toggleModal(url);
    } else {
      history.push(url);
    }
  };

  return (
    <div
      className={`${
        separateGoBackButton ? 'justify-between' : ''
      } flex flex-row my-0 py-0`}>
      <div
        className={`w-auto ${
          separateGoBackButton ? 'flex items-center' : ''
        } border-l-6 pl-4 ${theme.verticalBorder[themeColor]}`}>
        <nav className="w-full flex">
          <ol className="list-none flex items-center justify-start">
            {items.map((item, i) => (
              <li
                className="flex items-center w-auto mr-1 md:mr-2"
                style={{minWidth: 'fit-content'}}
                key={i}>
                {!item.goBack ? (
                  <div onClick={() => goToUrl(item.url)}>
                    <span
                      className={`mr-1 md:mr-2 cursor-pointer text-sm hover:iconoclast:bg-400 hover:curate:bg-400 rounded-xl px-2 md:text-base ${
                        item.last ? theme.text.secondary : theme.text.default
                      }`}>
                      {item.title}
                      {/* {i === 0 ? item.title.toUpperCase() : item.title} */}
                    </span>
                  </div>
                ) : (
                  <span
                    className={`mr-1 md:mr-2 cursor-pointer text-sm hover:iconoclast:bg-400 hover:curate:bg-400 rounded-xl px-2 md:text-base ${
                      item.last ? theme.text.secondary : theme.text.default
                    }`}
                    onClick={() => (unsavedChanges ? toggleModal() : history.goBack())}>
                    {item.title}
                    {/* {i === 0 ? item.title.toUpperCase() : item.title} */}
                  </span>
                )}
                {!item.last && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`${theme.text.default} stroke-current inline-block h-4 w-4`}>
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
      {separateGoBackButton && (
        <Buttons
          label={separateGoBackButton}
          btnClass="mr-4"
          onClick={history.goBack}
          Icon={IoArrowUndoCircleOutline}
        />
      )}
    </div>
  );
};
export default BreadCrums;
