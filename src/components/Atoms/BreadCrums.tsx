import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import {useHistory} from 'react-router';
import {GlobalContext} from '../../contexts/GlobalContext';
import {getAsset} from '../../assets';
import Buttons from './Buttons';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';

interface BreadCrumProps {
  items: {title: string; url?: string; last: boolean; goBack?: boolean}[];
  unsavedChanges?: boolean;
  separateGoBackButton?: boolean;
  toggleModal?: any;
}

const BreadCrums: React.FC<BreadCrumProps> = (brdPrps: BreadCrumProps) => {
  const {
    items,
    separateGoBackButton = false,
    unsavedChanges = false,
    toggleModal,
  } = brdPrps;
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const history = useHistory();

  const goToUrl = (url: string) => {
    if (unsavedChanges) {
      toggleModal();
    } else {
      history.push(url);
    }
  };

  return (
    <div
      className={`${
        separateGoBackButton ? 'justify-between' : ''
      } flex flex-row my-0 py-0 mb-4`}>
      <div
        className={`w-auto ${
          separateGoBackButton ? 'flex items-center' : ''
        } border-l-6 pl-4 ${theme.verticalBorder[themeColor]}`}>
        <nav className="w-full flex">
          <ol className="list-none flex items-center justify-start">
            {items.map((item, i) => (
              <li
                className="flex items-center w-auto mr-2"
                style={{minWidth: 'fit-content'}}
                key={i}>
                {!item.goBack ? (
                  <div onClick={() => goToUrl(item.url)}>
                    <span
                      className={`mr-2 cursor-pointer  ${
                        item.last ? theme.text.secondary : theme.text.default
                      }`}>
                      {i === 0 ? item.title.toUpperCase() : item.title}
                    </span>
                  </div>
                ) : (
                  <span
                    className={`mr-2 cursor-pointer ${
                      item.last ? theme.text.secondary : theme.text.default
                    }`}
                    onClick={() => (unsavedChanges ? toggleModal() : history.goBack())}>
                    {i === 0 ? item.title.toUpperCase() : item.title}
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
          label="Go back"
          btnClass="mr-4"
          onClick={history.goBack}
          Icon={IoArrowUndoCircleOutline}
        />
      )}
    </div>
  );
};
export default BreadCrums;
