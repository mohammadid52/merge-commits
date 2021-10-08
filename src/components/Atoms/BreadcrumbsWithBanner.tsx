import React, {useContext, useState} from 'react';
import {BsFillInfoCircleFill} from 'react-icons/bs';
import {useHistory} from 'react-router';
import {GlobalContext} from '@contexts/GlobalContext';
import {getAsset} from '../../assets';
import InformationalWalkThrough from '@components/Dashboard/Admin/Institutons/InformationalWalkThrough/InformationalWalkThrough';

interface BreadCrumbProps {
  items: {title: string; url?: string; last: boolean; goBack?: boolean}[];
  unsavedChanges?: boolean;
  separateGoBackButton?: string;
  toggleModal?: any;
}

const BreadcrumbsWithBanner: React.FC<BreadCrumbProps> = (brdPrps: BreadCrumbProps) => {
  const {items, separateGoBackButton = '', unsavedChanges = false, toggleModal} = brdPrps;
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const history = useHistory();
  const [openWalkThroughModal, setOpenWalkThroughModal] = useState(false);

  const goToUrl = (url: string) => {
    if (unsavedChanges) {
      toggleModal(url);
    } else {
      history.push(url);
    }
  };

  return (
    <>
      <div
        className={`${
          separateGoBackButton ? 'justify-between' : ''
        } flex flex-row my-0 py-2`}>
        <div
          className={`w-auto ${separateGoBackButton ? 'flex items-center' : ''} pl-4 ${
            theme.verticalBorder[themeColor]
          }`}>
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
                        className={`mr-1 md:mr-2 cursor-pointer text-sm 2xl:text-base ${'text-white'}`}>
                        {item.title}
                        {/* {i === 0 ? item.title.toUpperCase() : item.title} */}
                      </span>
                    </div>
                  ) : (
                    <span
                      className={`mr-1 md:mr-2 cursor-pointer text-sm 2xl:text-base ${'text-white'}`}
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
                      className={`${'text-white'} stroke-current inline-block h-4 w-4`}>
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
        <div className="absolute z-100 w-6 right-1 top-0.5">
          <span
            className="w-auto cursor-pointer"
            onClick={() => setOpenWalkThroughModal(true)}>
            <BsFillInfoCircleFill className={`h-5 w-5 text-white`} />
          </span>
        </div>
      </div>
      <InformationalWalkThrough
        open={openWalkThroughModal}
        onCancel={() => setOpenWalkThroughModal(false)}
      />
    </>
  );
};
export default BreadcrumbsWithBanner;
