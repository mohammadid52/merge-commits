import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import { GlobalContext } from '../../contexts/GlobalContext';
import { getAsset } from '../../assets';

interface BreadCrumProps {
  items: { title: string; url: string; last: boolean; goBack?: boolean }[];
}

const BreadCrums: React.FC<BreadCrumProps> = (brdPrps: BreadCrumProps) => {
  const { items } = brdPrps;
  const { theme, clientKey } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const history = useHistory();

  return (
    <div className="flex flex-row my-0 py-0 mb-4">
      <div className={`w-auto border-l-6 pl-4 ${theme.verticalBorder[themeColor]}`}>
        <nav className="w-full flex">
          <ol className="list-none flex items-center justify-start">
            {items.map((item, i) => (
              <li className="flex items-center w-auto mr-2" style={{ minWidth: 'fit-content' }} key={i}>
                <NavLink to={item.url}>
                  <span
                    className={`mr-2 ${item.last ? theme.text.secondary : theme.text.default}`}
                    onClick={item?.goBack && history.goBack}>
                    {i === 0 ? item.title.toUpperCase() : item.title}
                  </span>
                </NavLink>
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
    </div>
  );
};
export default BreadCrums;
