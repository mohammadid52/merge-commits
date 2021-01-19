import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { GlobalContext } from '../../../contexts/GlobalContext';
import SignOutButton from '../../Auth/SignOut';

interface SideMenuProps {
  children: React.ReactNode;
  [key: string]: any;
  updateAuthState: Function;
}

const SideMenu: React.FC<SideMenuProps> = ({ children, ...props }: SideMenuProps) => {
  const { currentPage, setCurrentPage } = props;
  const { theme } = useContext(GlobalContext);

  const handleLink = (e: React.MouseEvent) => {
    const {id} = e.target as HTMLElement;

    setCurrentPage('classroom');
  };

  return (
    <div className={`z-50 min-h-screen w-32 md:flex flex-row md:flex-col  ${theme.sidemenu.bg}`}>
      <div
        className={`hidden w-full h-12 ${theme.sidemenu.bg} md:flex justify-center items-center text-2xl font-bold z-50`}>
        <NavLink id="dashboard" to="/dashboard" onClick={handleLink}>
          <img
            id="dashboard"
            className="p-2 h-full"
            src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-WHITE.svg"
            alt="Iconoclast Artists"
          />
        </NavLink>
      </div>
      <div className={`sidebar w-full h-1/2 text-gray-200 cursor-pointer`}>{children}</div>
      <div className={`mt-auto mb-2 text-gray-200`}>
        <SignOutButton updateAuthState={props.updateAuthState} />
      </div>
    </div>
  );
};

export default SideMenu;
